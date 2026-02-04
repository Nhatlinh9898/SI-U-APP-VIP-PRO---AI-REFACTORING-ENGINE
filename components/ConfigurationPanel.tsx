import React from 'react';
import { Settings, Cpu, Code2, Layers, FileText, Sparkles } from 'lucide-react';
import { RefactoringConfig } from '../types';
import { 
  GOAL_OPTIONS, 
  LANGUAGE_OPTIONS, 
  ARCHITECTURE_OPTIONS, 
  NAMING_OPTIONS, 
  DOCS_OPTIONS 
} from '../constants';

interface ConfigurationPanelProps {
  config: RefactoringConfig;
  onChange: (key: keyof RefactoringConfig, value: string) => void;
  isProcessing: boolean;
  onRun: () => void;
}

const ConfigSelect = ({ 
  label, 
  icon: Icon, 
  options, 
  value, 
  onChange 
}: { 
  label: string, 
  icon: any, 
  options: {value: string, label: string}[], 
  value: string, 
  onChange: (val: string) => void 
}) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-2 text-cyber-accent text-xs font-bold uppercase tracking-wider">
      <Icon size={14} />
      {label}
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-cyber-dark text-gray-300 text-sm rounded border border-gray-700 focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary p-2.5 outline-none transition-all"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ config, onChange, isProcessing, onRun }) => {
  return (
    <div className="h-full flex flex-col p-5 overflow-y-auto custom-scrollbar">
      <div className="mb-6 pb-4 border-b border-white/10">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Settings className="text-cyber-secondary" />
          CẤU HÌNH CORE
        </h2>
        <p className="text-xs text-gray-500 mt-1">Thiết lập thông số cho AI Engine</p>
      </div>

      <div className="flex-1 space-y-1">
        <ConfigSelect 
          label="Mục tiêu Tái cấu trúc" 
          icon={Sparkles} 
          options={GOAL_OPTIONS} 
          value={config.targetGoal} 
          onChange={(v) => onChange('targetGoal', v)} 
        />
        
        <ConfigSelect 
          label="Ngôn ngữ Đích" 
          icon={Code2} 
          options={LANGUAGE_OPTIONS} 
          value={config.targetLanguage} 
          onChange={(v) => onChange('targetLanguage', v)} 
        />

        <ConfigSelect 
          label="Kiến trúc Hệ thống" 
          icon={Layers} 
          options={ARCHITECTURE_OPTIONS} 
          value={config.architectureStyle} 
          onChange={(v) => onChange('architectureStyle', v)} 
        />

        <ConfigSelect 
          label="Quy tắc Đặt tên" 
          icon={Cpu} 
          options={NAMING_OPTIONS} 
          value={config.namingConvention} 
          onChange={(v) => onChange('namingConvention', v)} 
        />

        <ConfigSelect 
          label="Mức độ Tài liệu hóa" 
          icon={FileText} 
          options={DOCS_OPTIONS} 
          value={config.documentationLevel} 
          onChange={(v) => onChange('documentationLevel', v)} 
        />

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2 text-cyber-accent text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            Yêu cầu bổ sung (Prompt)
          </div>
          <textarea
            value={config.additionalPrompt}
            onChange={(e) => onChange('additionalPrompt', e.target.value)}
            placeholder="Ví dụ: Đừng dùng thư viện abc, tối ưu hàm xyz..."
            className="w-full h-24 bg-cyber-dark text-gray-300 text-sm rounded border border-gray-700 focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary p-3 outline-none resize-none"
          />
        </div>
      </div>

      <button
        onClick={onRun}
        disabled={isProcessing}
        className={`mt-4 w-full py-4 rounded-lg font-display font-bold text-white tracking-widest uppercase transition-all duration-300 shadow-lg group relative overflow-hidden ${
          isProcessing 
            ? 'bg-gray-700 cursor-not-allowed' 
            : 'bg-gradient-to-r from-cyber-primary to-cyber-secondary hover:shadow-cyber-primary/50'
        }`}
      >
        <span className={`relative z-10 flex items-center justify-center gap-2 ${isProcessing ? 'animate-pulse' : ''}`}>
          {isProcessing ? 'ĐANG XỬ LÝ...' : 'KÍCH HOẠT ENGINE'}
          {!isProcessing && <Cpu size={18} className="group-hover:rotate-180 transition-transform duration-500" />}
        </span>
        {!isProcessing && (
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        )}
      </button>
    </div>
  );
};

export default ConfigurationPanel;
