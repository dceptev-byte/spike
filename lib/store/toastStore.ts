/**
 * Zustand store for ephemeral toast notifications.
 * Toasts auto-dismiss after 3.5 s unless removed manually.
 */

import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: Toast[];
  /** Display a toast and auto-dismiss it. Returns the generated id. */
  addToast: (message: string, variant?: ToastVariant) => string;
  /** Remove a specific toast immediately (e.g. on user dismiss). */
  removeToast: (id: string) => void;
}

const AUTO_DISMISS_MS = 3500;

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],

  addToast: (message, variant = 'success') => {
    const id = Math.random().toString(36).slice(2, 10);
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, AUTO_DISMISS_MS);

    return id;
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
