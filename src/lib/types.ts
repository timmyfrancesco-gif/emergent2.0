export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  credits: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  slug: string | null;
  code: ProjectCode | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectCode {
  files: CodeFile[];
  lastUpdated: string;
}

export interface CodeFile {
  path: string;
  content: string;
  language?: string;
}

export interface Message {
  id: string;
  project_id: string;
  role: 'user' | 'assistant';
  content: string;
  file_changes: FileChange[] | null;
  created_at: string;
}

export interface FileChange {
  path: string;
  action: 'created' | 'edited' | 'deleted';
  description?: string;
}

export interface GenerateResponse {
  files: CodeFile[];
  summary: string;
  fileChanges: FileChange[];
}

export interface AdvancedSettings {
  model: string;
  budget: number;
  maxxEnabled: boolean;
  template: string;
}
