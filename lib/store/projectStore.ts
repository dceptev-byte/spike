/**
 * Zustand store for project CRUD.
 * Seeded with MOCK_PROJECTS so the UI has data on first load.
 */

import { create } from 'zustand';
import type { Project } from '@/types';
import { MOCK_PROJECTS } from '@/lib/mockData';

interface ProjectStore {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>()((set) => ({
  projects: MOCK_PROJECTS,

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      ),
    })),

  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
}));
