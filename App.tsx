import React, { useState, useEffect } from 'react';
import { Layout, Play, Code, Database, Globe, Zap, Volume2, Download, Package } from 'lucide-react';
import { FileNode, RefactoringConfig, AppState, AnalysisResult } from './types';
import { DEMO_FILES } from './constants';
import CodeEditor from './components/CodeEditor';
import FileExplorer from './components/FileExplorer';
import ConfigurationPanel from './components/ConfigurationPanel';
import AnalysisResultPanel from './components/AnalysisResult.tsx';
import { refactorCode } from './services/geminiService';
import JSZip from 'jszip';

const App: React.FC = () => {
  // State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [inputFiles, setInputFiles] = useState<FileNode[]>(DEMO_FILES);
  const [outputFiles, setOutputFiles] = useState<FileNode[]>([]);
  const [selectedInputId, setSelectedInputId] = useState<string | null>(DEMO_FILES[0].id);
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);
  
  const [config, setConfig] = useState<RefactoringConfig>({
    targetGoal: 'modernize',
    targetLanguage: 'keep',
    architectureStyle: 'clean_arch',
    namingConvention: 'standard',
    documentationLevel: 'detailed',
    additionalPrompt: ''
  });

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  // Audio feature for "Voice Studio Pro" vibe (Text-to-Speech explanation)
  const speakResult = () => {
    if (!analysisResult?.summary) return;
    const utterance = new SpeechSynthesisUtterance(analysisResult.summary);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleConfigChange = (key: keyof RefactoringConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleInputFileChange = (content: string) => {
    if (!selectedInputId) return;
    setInputFiles(prev => prev.map(f => f.id === selectedInputId ? { ...f, content } : f));
  };

  const handleAddFile = () => {
    const newFile: FileNode = {
      id: Date.now().toString(),
      name: 'new_file.py',
      language: 'python',
      content: '# New file content here',
      path: '/src/new_file.py'
    };
    setInputFiles([...inputFiles, newFile]);
    setSelectedInputId(newFile.id);
  };

  const handleDownloadPackage = async () => {
    if (outputFiles.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      
      // Create root folder
      const projectFolder = zip.folder("refactored_project");

      outputFiles.forEach(file => {
        // Clean path (remove leading slash if exists to avoid issues)
        const cleanPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
        projectFolder?.file(cleanPath, file.content);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `refactored_project_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error("Zipping error:", error);
      setErrorMessage("Lỗi khi đóng gói file.");
    } finally {
      setIsZipping(false);
    }
  };

  const runRefactoring = async () => {
    setAppState(AppState.ANALYZING);
    setErrorMessage(null);
    setActiveTab('output'); // Switch to output view to show loading state
    
    try {
      const resultRaw = await refactorCode(inputFiles, config);
      
      const newFiles: FileNode[] = resultRaw.files.map((f: any, idx: number) => ({
        id: `out_${idx}`,
        name: f.name || `file_${idx}`,
        path: f.path || `src/file_${idx}`, // Default path if missing
        language: f.language || config.targetLanguage,
        content: f.content,
        isNew: true
      }));

      const result: AnalysisResult = {
        summary: resultRaw.summary || "Đã hoàn thành tái cấu trúc và tạo file cấu hình.",
        logs: resultRaw.logs || ["Hoàn tất xử lý."],
        files: newFiles
      };

      setAnalysisResult(result);
      setOutputFiles(newFiles);
      if (newFiles.length > 0) {
        setSelectedOutputId(newFiles[0].id);
      }
      setAppState(AppState.COMPLETED);
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setErrorMessage(err.message || "Đã xảy ra lỗi không xác định.");
      setActiveTab('input');
    }
  };

  // Derived state for editor
  const currentInputFile = inputFiles.find(f => f.id === selectedInputId);
  const currentOutputFile = outputFiles.find(f => f.id === selectedOutputId);
  const editorContent = activeTab === 'input' ? currentInputFile?.content : currentOutputFile?.content;
  const editorLang = activeTab === 'input' ? currentInputFile?.language : currentOutputFile?.language;

  return (
    <div className="flex h-screen w-screen bg-cyber-black text-gray-200 font-sans selection:bg-cyber-secondary selection:text-white overflow-hidden">
      
      {/* LEFT SIDEBAR: CONFIGURATION */}
      <div className="w-80 flex-shrink-0 border-r border-white/5 bg-cyber-panel/30 backdrop-blur-sm z-20 shadow-2xl">
        <ConfigurationPanel 
          config={config} 
          onChange={handleConfigChange} 
          isProcessing={appState === AppState.ANALYZING}
          onRun={runRefactoring}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative">
        
        {/* HEADER */}
        <header className="h-20 flex items-center justify-center border-b border-white/5 bg-cyber-black/80 backdrop-blur relative z-10">
          <div className="absolute left-6 flex items-center gap-2 opacity-50">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-display font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyber-primary via-purple-400 to-cyber-secondary drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              SIÊU APP VIP PRO
            </h1>
            <p className="text-[10px] text-cyber-accent font-mono tracking-[0.3em] uppercase opacity-80 mt-1">
              AI Refactoring Engine • Neural Core v9.0
            </p>
          </div>

          <div className="absolute right-6 flex items-center gap-4">
             {/* Fake User Status */}
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-xs font-mono text-gray-400">ONLINE</span>
             </div>
          </div>
        </header>

        {/* WORKSPACE */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* MIDDLE: EDITOR & FILES */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs & Toolbar */}
            <div className="h-12 border-b border-white/5 bg-cyber-black flex items-center justify-between px-4">
              <div className="flex items-center gap-4 h-full">
                <button 
                  onClick={() => setActiveTab('input')}
                  className={`h-full px-4 flex items-center gap-2 border-b-2 transition-all font-display text-sm uppercase tracking-wide ${
                    activeTab === 'input' 
                      ? 'border-cyber-primary text-white' 
                      : 'border-transparent text-gray-600 hover:text-gray-400'
                  }`}
                >
                  <Database size={14} />
                  Input Code
                </button>
                <button 
                  onClick={() => outputFiles.length > 0 && setActiveTab('output')}
                  disabled={outputFiles.length === 0}
                  className={`h-full px-4 flex items-center gap-2 border-b-2 transition-all font-display text-sm uppercase tracking-wide ${
                    activeTab === 'output' 
                      ? 'border-cyber-secondary text-white' 
                      : outputFiles.length === 0 ? 'border-transparent text-gray-800 cursor-not-allowed' : 'border-transparent text-gray-600 hover:text-gray-400'
                  }`}
                >
                  <Zap size={14} />
                  Result
                  {appState === AppState.COMPLETED && <span className="ml-1 flex h-2 w-2 rounded-full bg-cyber-secondary"></span>}
                </button>
              </div>

              {/* DOWNLOAD BUTTON */}
              {activeTab === 'output' && outputFiles.length > 0 && (
                <button 
                  onClick={handleDownloadPackage}
                  disabled={isZipping}
                  className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-lg hover:shadow-emerald-500/30"
                >
                  {isZipping ? (
                    <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <Package size={14} />
                  )}
                  {isZipping ? "Đang nén..." : "TẢI GÓI DEPLOY (.ZIP)"}
                </button>
              )}
            </div>

            <div className="flex-1 flex overflow-hidden p-4 gap-4 bg-gradient-to-b from-cyber-black to-cyber-dark">
               {/* Inner File Tree */}
               <div className="w-64 flex-shrink-0 flex flex-col gap-4">
                  <FileExplorer 
                    title={activeTab === 'input' ? 'SOURCE FILES' : 'GENERATED PACKAGE'}
                    files={activeTab === 'input' ? inputFiles : outputFiles} 
                    selectedFileId={activeTab === 'input' ? selectedInputId : selectedOutputId}
                    onSelectFile={(id) => activeTab === 'input' ? setSelectedInputId(id) : setSelectedOutputId(id)}
                    onAddFile={handleAddFile}
                  />
                  
                  {/* Result Panel (Bottom Left in Main View) */}
                  <div className="flex-1 bg-cyber-panel/30 rounded-lg border border-white/10 overflow-hidden">
                    <AnalysisResultPanel result={analysisResult} isLoading={appState === AppState.ANALYZING} />
                    {appState === AppState.COMPLETED && (
                      <div className="p-2 bg-cyber-black border-t border-white/10">
                         <button 
                           onClick={speakResult}
                           className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-cyber-accent hover:bg-white/5 rounded transition-colors"
                         >
                           <Volume2 size={14} />
                           NGHE TƯỜNG THUẬT
                         </button>
                      </div>
                    )}
                  </div>
               </div>

               {/* Editor */}
               <div className="flex-1 flex flex-col gap-2 relative group">
                  {errorMessage && (
                    <div className="absolute top-4 left-4 right-4 z-50 bg-red-900/90 text-white p-3 rounded border border-red-500 shadow-lg backdrop-blur">
                      <strong className="block font-bold">LỖI HỆ THỐNG:</strong>
                      {errorMessage}
                    </div>
                  )}
                  
                  {editorContent ? (
                    <>
                      <div className="flex items-center justify-between text-xs text-gray-500 px-2 font-mono">
                         <span>{(activeTab === 'input' ? currentInputFile : currentOutputFile)?.path}</span>
                         <span className="uppercase text-cyber-primary">{editorLang}</span>
                      </div>
                      <CodeEditor 
                        code={editorContent} 
                        language={editorLang || 'text'} 
                        onChange={activeTab === 'input' ? handleInputFileChange : undefined}
                        readOnly={activeTab === 'output'}
                      />
                    </>
                  ) : (
                     <div className="flex-1 flex items-center justify-center border border-white/5 rounded-lg bg-cyber-black/50 text-gray-600">
                        <div className="text-center">
                          <Code size={48} className="mx-auto mb-2 opacity-50" />
                          <p>Chưa chọn file</p>
                        </div>
                     </div>
                  )}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;