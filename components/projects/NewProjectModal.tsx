'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Check,
  FileText,
  Loader2,
  Plus,
  RotateCcw,
  Wand2,
  X,
} from 'lucide-react';
import { useProjectStore } from '@/lib/store/projectStore';
import { useToastStore } from '@/lib/store/toastStore';
import { CURRENT_USER } from '@/lib/mockData';
import type { AIProjectDraft, ProjectStatus } from '@/types';

// ---------------------------------------------------------------------------
// Mock AI generation
// ---------------------------------------------------------------------------

async function generateProjectDraft(prompt: string): Promise<AIProjectDraft> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1600));

  const lower = prompt.toLowerCase();

  if (lower.match(/mobile|ios|android|react native|flutter/)) {
    return {
      name: 'Mobile App',
      description:
        'A cross-platform mobile application with native UX patterns, offline support, and real-time sync.',
      status: 'planning',
      suggestedTasks: [
        'Set up React Native project & CI',
        'Design core screens in Figma',
        'Implement authentication flow',
        'Build home feed & navigation',
        'Integrate backend APIs',
        'Conduct user testing & iteration',
        'Submit to App Store & Play Store',
      ],
    };
  }

  if (lower.match(/website|web app|landing page|redesign|frontend/)) {
    return {
      name: 'Website Project',
      description:
        'A modern, responsive web presence optimised for performance, SEO, and conversion.',
      status: 'planning',
      suggestedTasks: [
        'Audit existing site & analytics',
        'Create component design system',
        'Build homepage & hero section',
        'Develop inner pages & blog',
        'SEO & performance optimisation',
        'Accessibility (WCAG 2.1 AA) review',
        'QA, launch, and monitor',
      ],
    };
  }

  if (lower.match(/market|campaign|launch|brand|social|email/)) {
    return {
      name: 'Marketing Campaign',
      description:
        'A coordinated multi-channel campaign to grow brand awareness and generate qualified leads.',
      status: 'planning',
      suggestedTasks: [
        'Define target audience & personas',
        'Develop messaging framework',
        'Build content calendar',
        'Design visual assets & creatives',
        'Set up email automation sequences',
        'Launch paid media campaigns',
        'Track KPIs and report results',
      ],
    };
  }

  if (lower.match(/api|backend|server|integration|webhook|database/)) {
    return {
      name: 'Backend & API',
      description:
        'Scalable server-side services with robust third-party integrations and full observability.',
      status: 'planning',
      suggestedTasks: [
        'Define API contracts (OpenAPI spec)',
        'Set up infrastructure & CI/CD',
        'Implement core endpoints',
        'Add auth, rate limiting & logging',
        'Integrate third-party services',
        'Write API documentation',
        'Load test & deploy to production',
      ],
    };
  }

  if (lower.match(/design|ui|ux|figma|component|design system/)) {
    return {
      name: 'Design System',
      description:
        'A cohesive visual language and component library that ensures product consistency at scale.',
      status: 'planning',
      suggestedTasks: [
        'Audit existing UI components',
        'Define token system (colour, type, spacing)',
        'Build component library in Figma',
        'Implement components in code',
        'Write usage guidelines & docs',
        'Set up Storybook',
        'Team review & adoption rollout',
      ],
    };
  }

  // Generic fallback — derive a name from the prompt
  const stopwords = new Set([
    'a', 'an', 'the', 'and', 'or', 'for', 'to', 'of', 'in',
    'i', 'want', 'need', 'build', 'create', 'make', 'help', 'me', 'us',
  ]);
  const words = prompt
    .trim()
    .split(/\s+/)
    .filter((w) => !stopwords.has(w.toLowerCase()))
    .slice(0, 4)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  return {
    name: words.join(' ') || 'New Project',
    description: `A focused initiative to achieve: "${prompt.slice(0, 100)}${
      prompt.length > 100 ? '…' : ''
    }". Broken into clear milestones for smooth execution.`,
    status: 'planning',
    suggestedTasks: [
      'Define scope, goals, and success criteria',
      'Research and gather requirements',
      'Create initial plan and timeline',
      'Execute and iterate on deliverables',
      'Review, test, and refine',
      'Deliver and document outcomes',
    ],
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ModalTab   = 'ai' | 'manual';
type AIPhase    = 'prompt' | 'generating' | 'preview';

interface DraftState {
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
  tasks: string[];
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className ?? ''}`}
      style={style}
    />
  );
}

function GeneratingSkeleton() {
  return (
    <div className="space-y-5 py-2">
      {/* Name */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-8 w-3/4" />
      </div>
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      {/* Task pills */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <div className="flex flex-wrap gap-2">
          {[140, 100, 120, 160, 90, 130].map((w, i) => (
            <Skeleton key={i} className="h-7 rounded-full" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form field helpers
// ---------------------------------------------------------------------------

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition';

// ---------------------------------------------------------------------------
// Shared preview / manual form — defined at module level to prevent remounting
// ---------------------------------------------------------------------------

interface PreviewFormProps {
  draft: DraftState;
  setDraftField: <K extends keyof DraftState>(key: K, value: DraftState[K]) => void;
}

function PreviewForm({ draft, setDraftField }: PreviewFormProps) {
  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <Label>Project name *</Label>
        <input
          className={inputCls}
          value={draft.name}
          onChange={(e) => setDraftField('name', e.target.value)}
          placeholder="e.g. Mobile App MVP"
        />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          value={draft.description}
          onChange={(e) => setDraftField('description', e.target.value)}
          placeholder="What is this project about?"
        />
      </div>

      {/* Status + Due date row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Status</Label>
          <select
            className={inputCls}
            value={draft.status}
            onChange={(e) => setDraftField('status', e.target.value as ProjectStatus)}
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
        <div>
          <Label>Due date</Label>
          <input
            type="date"
            className={inputCls}
            value={draft.dueDate}
            onChange={(e) => setDraftField('dueDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NewProjectModal() {
  const addProject = useProjectStore((s) => s.addProject);
  const addToast   = useToastStore((s) => s.addToast);

  const [open, setOpen]       = useState(false);
  const [tab, setTab]         = useState<ModalTab>('ai');
  const [aiPhase, setAiPhase] = useState<AIPhase>('prompt');
  const [prompt, setPrompt]   = useState('');

  // Draft state (AI preview + editable manual form share the same shape)
  const [draft, setDraft] = useState<DraftState>({
    name: '',
    description: '',
    status: 'planning',
    dueDate: '',
    tasks: [],
  });

  // ── Helpers ──────────────────────────────────────────────────────────────

  function resetModal() {
    setTab('ai');
    setAiPhase('prompt');
    setPrompt('');
    setDraft({ name: '', description: '', status: 'planning', dueDate: '', tasks: [] });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetModal();
  }

  function setDraftField<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  // ── AI flow ──────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setAiPhase('generating');

    const result = await generateProjectDraft(prompt);

    setDraft({
      name: result.name,
      description: result.description,
      status: result.status,
      dueDate: '',
      tasks: result.suggestedTasks,
    });
    setAiPhase('preview');
  }

  function removeTask(index: number) {
    setDraft((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (!draft.name.trim()) return;

    addProject({
      id: crypto.randomUUID(),
      name: draft.name.trim(),
      description: draft.description.trim() || undefined,
      status: draft.status,
      ownerId: CURRENT_USER.id,
      memberIds: [CURRENT_USER.id],
      dueDate: draft.dueDate || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    addToast(`Project "${draft.name.trim()}" created`, 'success');
    setOpen(false);
    resetModal();
  }

  const canSubmit = draft.name.trim().length > 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {/* Trigger button — rendered in the page header */}
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-[0.98] transition-all">
          <Plus size={16} />
          New Project
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 animate-overlay-show" />

        {/* Panel */}
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl animate-content-show focus:outline-none"
          aria-describedby={undefined}
        >
          {/* ── Header ── */}
          <div className="flex-none flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <Dialog.Title className="text-base font-semibold text-gray-900">
              New Project
            </Dialog.Title>
            <Dialog.Close className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <X size={16} />
            </Dialog.Close>
          </div>

          {/* ── Tab bar ── */}
          <div className="flex-none flex gap-1 px-6 pt-4">
            <TabButton
              active={tab === 'ai'}
              icon={<Wand2 size={14} />}
              label="AI Generate"
              onClick={() => setTab('ai')}
            />
            <TabButton
              active={tab === 'manual'}
              icon={<FileText size={14} />}
              label="Manual"
              onClick={() => setTab('manual')}
            />
          </div>

          {/* ── Body (scrollable) ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* ── AI tab ── */}
            {tab === 'ai' && (
              <div className="space-y-5">
                {/* Prompt phase */}
                {aiPhase === 'prompt' && (
                  <>
                    <div>
                      <Label>Describe your project</Label>
                      <textarea
                        className={`${inputCls} resize-none`}
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. Build a mobile app for tracking daily habits with reminders and weekly stats…"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            handleGenerate();
                          }
                        }}
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        The more detail you give, the better the suggestions. ⌘↵ to generate.
                      </p>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim()}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Wand2 size={15} />
                      Generate with AI
                    </button>
                  </>
                )}

                {/* Generating phase */}
                {aiPhase === 'generating' && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium mb-4">
                      <Loader2 size={15} className="animate-spin" />
                      Generating your project…
                    </div>
                    <GeneratingSkeleton />
                  </div>
                )}

                {/* Preview phase */}
                {aiPhase === 'preview' && (
                  <>
                    {/* AI rationale banner */}
                    <div className="flex items-start gap-2 rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2.5 text-xs text-indigo-700">
                      <Wand2 size={13} className="flex-shrink-0 mt-0.5" />
                      <span>
                        AI suggestion based on your prompt. Review and edit before creating.
                      </span>
                    </div>

                    <PreviewForm draft={draft} setDraftField={setDraftField} />

                    {/* Suggested tasks */}
                    {draft.tasks.length > 0 && (
                      <div>
                        <Label>Suggested tasks ({draft.tasks.length})</Label>
                        <div className="flex flex-wrap gap-2">
                          {draft.tasks.map((task, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 group"
                            >
                              {task}
                              <button
                                onClick={() => removeTask(i)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                aria-label={`Remove task: ${task}`}
                              >
                                <X size={11} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          These tasks will be added to the backlog. Remove any you don&apos;t need.
                        </p>
                      </div>
                    )}

                    {/* Start over */}
                    <button
                      onClick={() => {
                        setAiPhase('prompt');
                        setDraft({ name: '', description: '', status: 'planning', dueDate: '', tasks: [] });
                      }}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <RotateCcw size={12} />
                      Start over
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ── Manual tab ── */}
            {tab === 'manual' && <PreviewForm draft={draft} setDraftField={setDraftField} />}
          </div>

          {/* ── Footer (pinned) ── */}
          {(tab === 'manual' || aiPhase === 'preview') && (
            <div className="flex-none flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <Dialog.Close className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </Dialog.Close>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Check size={15} />
                {tab === 'ai' ? 'Create Project' : 'Create Project'}
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ---------------------------------------------------------------------------
// Tab button
// ---------------------------------------------------------------------------

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
}
