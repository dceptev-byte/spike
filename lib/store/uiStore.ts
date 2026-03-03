/**
 * Zustand store for transient UI state that needs to be shared across
 * components: panel visibility, sidebar collapse, onboarding progress.
 *
 * Intentionally NOT persisted — UI state resets on full page reload.
 * (Add zustand/middleware `persist` when persistence is needed.)
 */

import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Onboarding step definitions
// ---------------------------------------------------------------------------

export interface OnboardingStep {
  id: string;
  completed: boolean;
}

const INITIAL_STEPS: OnboardingStep[] = [
  { id: 'create-project', completed: true  },
  { id: 'add-task',       completed: true  },
  { id: 'invite-member',  completed: false },
  { id: 'ai-generator',   completed: false },
  { id: 'explore-board',  completed: false },
];

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface UIStore {
  // ── Help panel (slide-in triggered by "?" button) ─────────────────────────
  helpPanelOpen: boolean;
  openHelpPanel: () => void;
  closeHelpPanel: () => void;
  toggleHelpPanel: () => void;

  // ── Onboarding checklist ──────────────────────────────────────────────────
  /** True once the user dismisses the checklist with the X button. */
  onboardingDismissed: boolean;
  /** True once every step is marked complete. */
  onboardingComplete: boolean;
  onboardingSteps: OnboardingStep[];
  dismissOnboarding: () => void;
  toggleOnboardingStep: (id: string) => void;

  // ── Sidebar ───────────────────────────────────────────────────────────────
  /** Desktop collapsed state: icon-only (true) vs full-width (false). */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;

  // ── Active panel ──────────────────────────────────────────────────────────
  /**
   * Name of the currently-active overlay panel ('help' | 'chat' | null).
   * Can be extended to support future panels without adding more booleans.
   */
  activePanel: 'help' | 'chat' | null;
  setActivePanel: (panel: UIStore['activePanel']) => void;
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

export const useUIStore = create<UIStore>()((set) => ({
  // ── Help panel ────────────────────────────────────────────────────────────
  helpPanelOpen: false,
  openHelpPanel:  () => set({ helpPanelOpen: true,  activePanel: 'help' }),
  closeHelpPanel: () => set({ helpPanelOpen: false, activePanel: null   }),
  toggleHelpPanel: () =>
    set((s) => ({
      helpPanelOpen: !s.helpPanelOpen,
      activePanel: !s.helpPanelOpen ? 'help' : null,
    })),

  // ── Onboarding ────────────────────────────────────────────────────────────
  onboardingDismissed: false,
  onboardingComplete: INITIAL_STEPS.every((s) => s.completed),
  onboardingSteps: INITIAL_STEPS,

  dismissOnboarding: () => set({ onboardingDismissed: true }),

  toggleOnboardingStep: (id) =>
    set((state) => {
      const updated = state.onboardingSteps.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s,
      );
      return {
        onboardingSteps: updated,
        onboardingComplete: updated.every((s) => s.completed),
      };
    }),

  // ── Sidebar ───────────────────────────────────────────────────────────────
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebarCollapsed: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // ── Active panel ──────────────────────────────────────────────────────────
  activePanel: null,
  setActivePanel: (panel) => set({ activePanel: panel }),
}));
