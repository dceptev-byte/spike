'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  FolderPlus,
  CheckSquare,
  Users,
  Wand2,
  X,
} from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
  completed: boolean;
}

const INITIAL_STEPS: Step[] = [
  { id: 'create-project', label: 'Create first project', icon: FolderPlus, completed: true },
  { id: 'add-task',       label: 'Add a task',           icon: CheckSquare, completed: true },
  { id: 'invite-member', label: 'Invite a team member', icon: Users,       completed: false },
  { id: 'ai-generator',  label: 'Try AI generator',     icon: Wand2,       completed: false },
];

export default function OnboardingChecklist() {
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  function toggle(id: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="font-semibold text-indigo-900 text-[15px]">
            Get started with Spike
          </h2>
          <p className="text-sm text-indigo-600 mt-0.5">
            {completedCount} of {steps.length} steps completed
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100 transition-colors"
          aria-label="Dismiss onboarding checklist"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-indigo-200 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Steps */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {steps.map((step) => {
          const StepIcon = step.icon;
          return (
            <li key={step.id}>
              <button
                onClick={() => toggle(step.id)}
                className={[
                  'flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left',
                  step.completed
                    ? 'text-indigo-400'
                    : 'text-indigo-900 hover:bg-indigo-100',
                ].join(' ')}
              >
                {step.completed ? (
                  <CheckCircle2 size={17} className="text-indigo-500 flex-shrink-0" />
                ) : (
                  <Circle size={17} className="text-indigo-300 flex-shrink-0" />
                )}
                <StepIcon size={15} className="flex-shrink-0 opacity-70" />
                <span className={step.completed ? 'line-through' : ''}>{step.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
