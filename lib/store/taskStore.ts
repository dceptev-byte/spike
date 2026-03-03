/**
 * Zustand store for task CRUD, drag-and-drop status updates, and detail edits.
 * Seeded with MOCK_TASKS (enriched with demo subtasks + comments for two tasks).
 */

import { create } from 'zustand';
import type { Task, TaskStatus, Subtask, Comment } from '@/types';
import { MOCK_TASKS } from '@/lib/mockData';

// ---------------------------------------------------------------------------
// Seed enrichment — give two tasks real subtasks/comments for the demo
// ---------------------------------------------------------------------------

const SEEDED_TASKS: Task[] = MOCK_TASKS.map((t) => {
  if (t.id === 'task-1') {
    return {
      ...t,
      subtasks: [
        { id: 'sub-1', title: 'Sketch wireframes', completed: true },
        { id: 'sub-2', title: 'Design in Figma', completed: false },
        { id: 'sub-3', title: 'Stakeholder sign-off', completed: false },
      ],
      comments: [
        {
          id: 'cmt-1',
          taskId: 'task-1',
          authorId: 'user-2',
          body: 'Looking great! Can we add a subtle parallax effect to the gradient?',
          createdAt: '2026-03-01T10:00:00Z',
        },
      ],
    };
  }

  if (t.id === 'task-7') {
    return {
      ...t,
      subtasks: [
        { id: 'sub-4', title: 'Set up Supabase auth', completed: true },
        { id: 'sub-5', title: 'Add Google OAuth', completed: true },
        { id: 'sub-6', title: 'Add Apple Sign-In', completed: false },
        { id: 'sub-7', title: 'Write auth integration tests', completed: false },
      ],
      comments: [
        {
          id: 'cmt-2',
          taskId: 'task-7',
          authorId: 'user-4',
          body: 'Reminder: Apple requires a real device for testing Sign-In.',
          createdAt: '2026-03-02T09:00:00Z',
        },
        {
          id: 'cmt-3',
          taskId: 'task-7',
          authorId: 'user-1',
          body: 'I have a test device ready. Will ping you once set up.',
          createdAt: '2026-03-02T10:30:00Z',
        },
      ],
    };
  }

  if (t.id === 'task-18') {
    return {
      ...t,
      subtasks: [
        { id: 'sub-8', title: 'Identify failure scenarios', completed: true },
        { id: 'sub-9', title: 'Implement retry with back-off', completed: false },
        { id: 'sub-10', title: 'Add dead-letter queue', completed: false },
      ],
    };
  }

  return t;
});

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface TaskStore {
  tasks: Task[];

  /** Bulk-replace all tasks — used to restore from a drag-cancel snapshot. */
  setTasks: (tasks: Task[]) => void;

  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;

  /** Move a task to a different column (appends to the end of that column). */
  moveTask: (taskId: string, newStatus: TaskStatus) => void;

  /** Re-apply order values in a column from a sorted array of IDs. */
  reorderTasks: (projectId: string, status: TaskStatus, orderedIds: string[]) => void;

  addSubtask: (taskId: string, subtask: Subtask) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  addComment: (taskId: string, comment: Comment) => void;
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

export const useTaskStore = create<TaskStore>()((set) => ({
  tasks: SEEDED_TASKS,

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      ),
    })),

  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  moveTask: (taskId, newStatus) =>
    set((state) => {
      const maxOrder = state.tasks
        .filter((t) => t.status === newStatus)
        .reduce((m, t) => Math.max(m, t.order), -1);

      return {
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: newStatus,
                order: maxOrder + 1,
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      };
    }),

  reorderTasks: (projectId, status, orderedIds) =>
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.projectId !== projectId || t.status !== status) return t;
        const idx = orderedIds.indexOf(t.id);
        return idx === -1 ? t : { ...t, order: idx };
      }),
    })),

  addSubtask: (taskId, subtask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: [...t.subtasks, subtask],
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    })),

  toggleSubtask: (taskId, subtaskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s
              ),
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    })),

  addComment: (taskId, comment) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [...t.comments, comment],
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    })),
}));
