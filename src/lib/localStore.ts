import type { Message, ProjectCode } from './types';

export interface LocalProject {
  id: string;
  name: string;
  slug: string | null;
  code: ProjectCode | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface ProjectState {
  messages: Message[];
  code: ProjectCode | null;
}

const PROJECTS_KEY = 'emergent_projects';
const state = (id: string) => `emergent_state_${id}`;

function safe<T>(fn: () => T, fallback: T): T {
  try { return fn(); } catch { return fallback; }
}

export const localStore = {
  getProjects(): LocalProject[] {
    if (typeof window === 'undefined') return [];
    return safe(() => JSON.parse(localStorage.getItem(PROJECTS_KEY) ?? '[]'), []);
  },

  saveProject(project: LocalProject): void {
    const list = this.getProjects();
    const idx = list.findIndex(p => p.id === project.id);
    if (idx >= 0) list[idx] = project;
    else list.unshift(project);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list.slice(0, 50)));
  },

  getProject(id: string): LocalProject | null {
    return this.getProjects().find(p => p.id === id) ?? null;
  },

  deleteProject(id: string): void {
    const list = this.getProjects().filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
    localStorage.removeItem(state(id));
  },

  getState(id: string): ProjectState {
    if (typeof window === 'undefined') return { messages: [], code: null };
    return safe(
      () => JSON.parse(localStorage.getItem(state(id)) ?? 'null') ?? { messages: [], code: null },
      { messages: [], code: null }
    );
  },

  saveState(id: string, data: ProjectState): void {
    localStorage.setItem(state(id), JSON.stringify(data));
  },

  updateCode(id: string, code: ProjectCode): void {
    const data = this.getState(id);
    this.saveState(id, { ...data, code });
    const proj = this.getProject(id);
    if (proj) this.saveProject({ ...proj, code, updated_at: new Date().toISOString() });
  },

  addMessage(projectId: string, msg: Message): void {
    const data = this.getState(projectId);
    data.messages.push(msg);
    this.saveState(projectId, data);
  },
};
