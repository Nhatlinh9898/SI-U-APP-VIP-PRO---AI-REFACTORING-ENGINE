export interface FileNode {
  id: string;
  name: string;
  language: string;
  content: string;
  path: string;
  isNew?: boolean;
}

export interface RefactoringConfig {
  targetGoal: string;
  targetLanguage: string;
  architectureStyle: string;
  namingConvention: string;
  documentationLevel: string;
  additionalPrompt: string;
}

export interface AnalysisResult {
  summary: string;
  files: FileNode[];
  diagramData?: any; // Placeholder for graph data
  logs: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
