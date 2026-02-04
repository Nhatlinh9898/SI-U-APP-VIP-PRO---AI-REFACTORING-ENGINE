import React from 'react';
import { AnalysisResult } from '../types';
import { Terminal, CheckCircle, ArrowRight } from 'lucide-react';

interface AnalysisResultPanelProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const AnalysisResultPanel: React.FC<AnalysisResultPanelProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-cyber-dark rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyber-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-cyber-primary/20 rounded-full animate-pulse blur-md"></div>
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-white mb-2 animate-pulse">NEURAL ENGINE ĐANG CHẠY</h3>
          <p className="text-gray-400 font-mono text-sm">Đang phân tích cú pháp AST...</p>
          <p className="text-gray-400 font-mono text-sm mt-1">Đang tối ưu hóa Dependency Graph...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
        <Terminal size={64} className="text-gray-600 mb-4" />
        <p className="text-gray-400 font-display">CHƯA CÓ DỮ LIỆU ĐẦU RA</p>
        <p className="text-xs text-gray-500 mt-2">Vui lòng cấu hình và nhấn Kích Hoạt để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-cyber-black overflow-hidden">
      {/* Summary Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-cyber-black border-b border-emerald-500/20">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-emerald-400 shrink-0 mt-1" size={20} />
          <div>
            <h3 className="text-lg font-bold text-emerald-400 mb-1">XỬ LÝ HOÀN TẤT</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Logs / Steps */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2">
        <div className="text-gray-500 uppercase font-bold tracking-wider mb-2 border-b border-gray-800 pb-1">System Logs</div>
        {result.logs.map((log, idx) => (
          <div key={idx} className="flex gap-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-cyber-primary">[{new Date().toLocaleTimeString()}]</span>
            <span className="text-cyber-accent">➜</span>
            <span>{log}</span>
          </div>
        ))}
        
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="text-gray-500 uppercase font-bold tracking-wider mb-2">Thống kê thay đổi</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyber-dark p-3 rounded border border-gray-800">
               <span className="block text-2xl font-display font-bold text-white">{result.files.length}</span>
               <span className="text-[10px] text-gray-500 uppercase">Files Generated</span>
            </div>
            <div className="bg-cyber-dark p-3 rounded border border-gray-800">
               <span className="block text-2xl font-display font-bold text-cyber-secondary">100%</span>
               <span className="text-[10px] text-gray-500 uppercase">Refactor Score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultPanel;
