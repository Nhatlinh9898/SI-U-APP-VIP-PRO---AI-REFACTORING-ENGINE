import React from 'react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange, readOnly = false }) => {
  const lines = code.split('\n');

  return (
    <div className="flex h-full w-full font-mono text-sm bg-cyber-black border border-gray-800 rounded-md overflow-hidden">
      {/* Line Numbers */}
      <div className="flex flex-col items-end px-2 py-3 bg-cyber-dark text-gray-600 select-none border-r border-gray-800 min-w-[3rem]">
        {lines.map((_, i) => (
          <div key={i} className="leading-6">{i + 1}</div>
        ))}
      </div>
      
      {/* Editor Area */}
      <textarea
        className="flex-1 w-full h-full bg-transparent text-gray-300 p-3 outline-none resize-none leading-6 whitespace-pre"
        value={code}
        onChange={(e) => onChange && onChange(e.target.value)}
        spellCheck={false}
        readOnly={readOnly}
        style={{ tabSize: 4 }}
      />
    </div>
  );
};

export default CodeEditor;
