'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Keyboard,
  MessageSquare,
} from 'lucide-react';
import clsx from 'clsx';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const GETTING_STARTED = [
  {
    title: 'How to create your first project',
    content:
      'Navigate to the Projects page and click New Project. Choose a blank project or use a template to get started quickly. Add tasks, set priorities, and invite teammates to collaborate — your project appears in the sidebar right away.',
  },
  {
    title: 'Using the AI project generator',
    content:
      'Click New Project and switch to the AI Generate tab. Describe your goal in plain English and Spike AI will scaffold a full project plan with tasks and priorities in seconds. Review the generated suggestions and accept, edit, or discard any of them.',
  },
  {
    title: 'Managing tasks on the Kanban board',
    content:
      'Drag task cards between columns to update their status instantly. Click any card to open the detail panel where you can add subtasks, set due dates, and leave comments. Use the filter bar to focus on specific assignees or priority levels.',
  },
  {
    title: 'Inviting and managing team members',
    content:
      'Go to Settings and open the Team tab. Enter a teammate\'s email and select their role — Admin, Member, or Viewer. They\'ll receive an invite link and can join your workspace immediately. Remove or change roles at any time from the same page.',
  },
  {
    title: 'Using the AI chat assistant',
    content:
      'Click the chat bubble in the bottom-right corner to open the AI assistant. Ask questions about your projects, request task generation, or get help with any Spike feature. The assistant has context about your workspace and provides tailored suggestions.',
  },
] as const;

const VIDEOS = [
  {
    title: 'Spike in 2 minutes',
    duration: '2:14',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    title: 'AI project generation walkthrough',
    duration: '4:32',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    title: 'Kanban board deep dive',
    duration: '6:08',
    gradient: 'from-emerald-500 to-teal-600',
  },
] as const;

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: FaqItem[] = [
  {
    question: 'How do I create a new project?',
    answer:
      'Go to the Projects page and click New Project. You can create a blank project or switch to the AI Generate tab — describe your goal in plain English and Spike will scaffold a full project plan with suggested tasks.',
    category: 'Projects',
  },
  {
    question: 'Can I drag tasks between columns?',
    answer:
      'Yes. On any project\'s Kanban board, grab a task card and drop it into a different column to update its status instantly. You can also reorder cards within a column by dragging them up or down.',
    category: 'Kanban',
  },
  {
    question: 'How does AI task generation work?',
    answer:
      'Open a project and click Generate Tasks. Describe a feature or milestone, and Spike AI will return a list of suggested tasks complete with priority levels and subtask breakdowns. You can accept, edit, or discard any suggestion.',
    category: 'AI Features',
  },
  {
    question: 'What do the priority levels mean?',
    answer:
      'Spike uses four levels: Urgent (blocks other work), High (current sprint focus), Medium (next sprint), and Low (nice-to-have backlog). Set priority in the task detail panel or change it inline on the board.',
    category: 'Tasks',
  },
  {
    question: 'How do I add subtasks?',
    answer:
      'Open any task card and scroll to the Subtasks section. Click Add, type a title, and press Enter. Subtasks show a progress indicator on the card, e.g. 2/4, so your whole board stays glanceable.',
    category: 'Tasks',
  },
  {
    question: 'Is there a free plan?',
    answer:
      'Yes — the Free plan includes unlimited projects, up to 5 team members, and 50 AI task generations per month. Upgrade to Pro for unlimited members, AI generations, and priority support.',
    category: 'Billing',
  },
];

interface ShortcutRow {
  action: string;
  mac: string;
  windows: string;
}

const SHORTCUTS: ShortcutRow[] = [
  { action: 'Open command palette', mac: '⌘ K', windows: 'Ctrl K' },
  { action: 'New task', mac: '⌘ T', windows: 'Ctrl T' },
  { action: 'New project', mac: '⌘ Shift P', windows: 'Ctrl Shift P' },
  { action: 'Search', mac: '⌘ /', windows: 'Ctrl /' },
  { action: 'Open AI chat', mac: '⌘ Shift A', windows: 'Ctrl Shift A' },
  { action: 'Navigate to Dashboard', mac: '⌘ 1', windows: 'Ctrl 1' },
  { action: 'Navigate to Projects', mac: '⌘ 2', windows: 'Ctrl 2' },
  { action: 'Navigate to My Tasks', mac: '⌘ 3', windows: 'Ctrl 3' },
  { action: 'Close panel / modal', mac: 'Esc', windows: 'Esc' },
  { action: 'Submit comment', mac: '⌘ ↵', windows: 'Ctrl ↵' },
  { action: 'Edit task title', mac: 'E', windows: 'E' },
  { action: 'Toggle sidebar', mac: '⌘ \\', windows: 'Ctrl \\' },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const [openArticle, setOpenArticle] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const q = query.trim().toLowerCase();

  const filteredArticles = useMemo(
    () =>
      q
        ? GETTING_STARTED.filter(
            (a) =>
              a.title.toLowerCase().includes(q) ||
              a.content.toLowerCase().includes(q),
          )
        : GETTING_STARTED,
    [q],
  );

  const filteredFaq = useMemo(
    () =>
      q
        ? FAQ.filter(
            (f) =>
              f.question.toLowerCase().includes(q) ||
              f.answer.toLowerCase().includes(q) ||
              f.category.toLowerCase().includes(q),
          )
        : FAQ,
    [q],
  );

  const filteredShortcuts = useMemo(
    () =>
      q
        ? SHORTCUTS.filter((s) => s.action.toLowerCase().includes(q))
        : SHORTCUTS,
    [q],
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
        <p className="mt-1 text-sm text-gray-500">
          Guides, tutorials, and answers to common questions.
        </p>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search articles, shortcuts, FAQ…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* ── Getting Started ── */}
      {filteredArticles.length > 0 && (
        <section id="getting-started">
          <SectionHeader icon={BookOpen} title="Getting Started" />
          <div className="mt-4 rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {filteredArticles.map((article, i) => {
              const isOpen = openArticle === i;
              return (
                <div key={article.title} className="bg-white">
                  <button
                    onClick={() => setOpenArticle(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-medium text-gray-900">{article.title}</span>
                    <ChevronDown
                      size={15}
                      className={clsx(
                        'text-gray-400 flex-shrink-0 transition-transform duration-300',
                        isOpen && 'rotate-180',
                      )}
                    />
                  </button>
                  <div
                    className={clsx(
                      'overflow-hidden transition-all duration-300',
                      isOpen ? 'max-h-40' : 'max-h-0',
                    )}
                  >
                    <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Video Tutorials ── */}
      {!q && (
        <section id="videos">
          <SectionHeader icon={PlayCircle} title="Video Tutorials" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {VIDEOS.map((video) => (
              <div
                key={video.title}
                className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
              >
                {/* Placeholder thumbnail */}
                <div
                  className={clsx(
                    'h-36 bg-gradient-to-br flex items-center justify-center relative',
                    video.gradient,
                  )}
                >
                  <div className="w-11 h-11 rounded-full bg-white/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle size={22} className="text-white" />
                  </div>
                  <span className="absolute bottom-2 right-2.5 text-[11px] font-semibold text-white bg-black/40 px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="bg-white px-3 py-2.5">
                  <p className="text-sm font-medium text-gray-800 leading-snug">
                    {video.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {filteredFaq.length > 0 && (
        <section id="faq">
          <SectionHeader icon={MessageSquare} title="Frequently Asked Questions" />
          <div className="mt-4 rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {filteredFaq.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.question} className="bg-white">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">{item.question}</span>
                    {isOpen ? (
                      <ChevronUp size={15} className="text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Keyboard Shortcuts ── */}
      {filteredShortcuts.length > 0 && (
        <section id="shortcuts">
          <SectionHeader icon={Keyboard} title="Keyboard Shortcuts" />
          <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Action
                  </th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Mac
                  </th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Windows / Linux
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredShortcuts.map((row) => (
                  <tr key={row.action} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-700">{row.action}</td>
                    <td className="px-5 py-3 text-center">
                      <kbd className="inline-flex items-center px-2 py-0.5 rounded border border-gray-300 bg-gray-50 text-xs font-mono text-gray-700">
                        {row.mac}
                      </kbd>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <kbd className="inline-flex items-center px-2 py-0.5 rounded border border-gray-300 bg-gray-50 text-xs font-mono text-gray-700">
                        {row.windows}
                      </kbd>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* No results */}
      {q && filteredArticles.length === 0 && filteredFaq.length === 0 && filteredShortcuts.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Search size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-sm mt-1">Try a different search term.</p>
        </div>
      )}

      {/* Bottom padding */}
      <div className="h-4" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section header helper
// ---------------------------------------------------------------------------

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
        <Icon size={14} className="text-white" />
      </div>
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
    </div>
  );
}
