'use client';

import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  FolderPlus,
  CheckSquare,
  Users,
  Wand2,
  LayoutGrid,
  X,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import { useUIStore } from '@/lib/store/uiStore';

// ---------------------------------------------------------------------------
// Step metadata — ids must match INITIAL_STEPS in uiStore
// ---------------------------------------------------------------------------

interface StepMeta {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  actionLabel: string;
}

const STEP_META: StepMeta[] = [
  {
    id: 'create-project',
    label: 'Create your first project',
    description: 'Use the AI generator to build a full project plan in seconds.',
    icon: FolderPlus,
    href: '/projects',
    actionLabel: 'Go to Projects',
  },
  {
    id: 'add-task',
    label: 'Add a task',
    description: 'Open any project board and click + to add your first task.',
    icon: CheckSquare,
    href: '/projects/proj-1',
    actionLabel: 'Open Board',
  },
  {
    id: 'invite-member',
    label: 'Invite a team member',
    description: 'Collaborate with your team by adding members to a project.',
    icon: Users,
    href: '/team',
    actionLabel: 'Go to Team',
  },
  {
    id: 'ai-generator',
    label: 'Try AI task generation',
    description: 'Describe a goal and let Spike AI create a full task breakdown.',
    icon: Wand2,
    href: '/projects',
    actionLabel: 'Try it Now',
  },
  {
    id: 'explore-board',
    label: 'Explore the Kanban board',
    description: 'Drag cards between columns to update task status instantly.',
    icon: LayoutGrid,
    href: '/projects/proj-1',
    actionLabel: 'Open Board',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OnboardingChecklist() {
  const {
    onboardingDismissed,
    onboardingComplete,
    onboardingSteps,
    dismissOnboarding,
    toggleOnboardingStep,
  } = useUIStore();

  if (onboardingDismissed || onboardingComplete) return null;

  const completedCount = onboardingSteps.filter((s) => s.completed).length;
  const total = onboardingSteps.length;
  const progress = Math.round((completedCount / total) * 100);

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="font-semibold text-indigo-900 text-[15px]">
            Get started with Spike
          </h2>
          <p className="text-sm text-indigo-600 mt-0.5">
            {completedCount} of {total} steps completed
          </p>
        </div>
        <button
          onClick={dismissOnboarding}
          className="p-1 rounded-lg text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100 transition-colors"
          aria-label="Dismiss onboarding checklist"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Progress bar ── */}
      <div
        className="h-1.5 bg-indigo-200 rounded-full overflow-hidden mb-5"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Steps ── */}
      <ul className="space-y-1.5">
        {STEP_META.map((meta) => {
          const storeStep = onboardingSteps.find((s) => s.id === meta.id);
          const done = storeStep?.completed ?? false;
          const StepIcon = meta.icon;

          return (
            <li
              key={meta.id}
              className={clsx(
                'flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors',
                done ? 'opacity-55' : 'hover:bg-indigo-100/60',
              )}
            >
              {/* Check toggle */}
              <button
                onClick={() => toggleOnboardingStep(meta.id)}
                className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
                aria-label={
                  done
                    ? `Mark "${meta.label}" incomplete`
                    : `Mark "${meta.label}" complete`
                }
              >
                {done ? (
                  <CheckCircle2 size={18} className="text-indigo-500" />
                ) : (
                  <Circle size={18} className="text-indigo-300" />
                )}
              </button>

              {/* Step icon */}
              <div
                className={clsx(
                  'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                  done ? 'bg-indigo-100' : 'bg-white shadow-sm border border-indigo-200',
                )}
              >
                <StepIcon size={14} className="text-indigo-600" />
              </div>

              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <p
                  className={clsx(
                    'text-sm font-semibold leading-tight',
                    done ? 'line-through text-indigo-400' : 'text-indigo-900',
                  )}
                >
                  {meta.label}
                </p>
                <p className="text-xs text-indigo-600/75 mt-0.5 leading-snug">
                  {meta.description}
                </p>
              </div>

              {/* "Do it" link */}
              {!done && (
                <Link
                  href={meta.href}
                  className="flex items-center gap-0.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex-shrink-0 mt-1 whitespace-nowrap transition-colors"
                >
                  {meta.actionLabel}
                  <ChevronRight size={12} />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
