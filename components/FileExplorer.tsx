import React from 'react';
import { FileCode, Folder, Plus } from 'lucide-react';
import { FileNode } from '../types';

interface FileExplorerProps {
  files: FileNode[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
  onAddFile: () => void;
  title: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, selectedFileId, onSelectFile, onAddFile, title }) => {
  return (
    <div className="flex flex-col h-full bg-cyber-panel/50 rounded-lg border border-white/10 overflow-hidden">
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h3 className="text-sm font-display font-bold text-cyber-accent uppercase tracking-wider">{title}</h3>
        <button 
          onClick={onAddFile}
          className="p-1 hover:bg-white/10 rounded transition-colors text-emerald-400"
          title="Thêm file mới"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.length === 0 && (
          <div className="text-gray-500 text-xs text-center mt-4 italic">Chưa có file nào</div>
        )}
        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => onSelectFile(file.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-all duration-200 group ${
              selectedFileId === file.id
                ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/30'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <FileCode size={16} className={selectedFileId === file.id ? 'text-cyber-primary' : 'text-gray-500 group-hover:text-gray-300'} />
            <div className="flex flex-col overflow-hidden">
               <span className="truncate text-sm font-medium">{file.name}</span>
               <span className="text-[10px] text-gray-600 truncate">{file.path}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
