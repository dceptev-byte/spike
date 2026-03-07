'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  X,
  BookOpen,
  Keyboard,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  PlayCircle,
  MessageCircle,
  Zap,
} from 'lucide-react';
import clsx from 'clsx';
import { useUIStore } from '@/lib/store/uiStore';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const QUICK_LINKS = [
  {
    icon: BookOpen,
    label: 'Getting Started Guide',
    description: 'New to Spike? Start here.',
    href: '/help',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Keyboard,
    label: 'Keyboard Shortcuts',
    description: 'Move faster with shortcuts.',
    href: '/help#shortcuts',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: PlayCircle,
    label: 'Video Tutorials',
    description: 'Watch walkthroughs.',
    href: '/help#videos',
    color: 'text-rose-600 bg-rose-50',
  },
  {
    icon: MessageCircle,
    label: 'Contact Support',
    description: 'We reply in under 4 hours.',
    href: '/help#support',
    color: 'text-emerald-600 bg-emerald-50',
  },
] as const;

const PANEL_SHORTCUT_GROUPS = [
  {
    category: 'Navigation',
    shortcuts: [
      { action: 'Go to Dashboard', keys: ['G', 'D'], separator: 'then' as const },
      { action: 'Go to Projects', keys: ['G', 'P'], separator: 'then' as const },
      { action: 'Go to My Tasks', keys: ['G', 'T'], separator: 'then' as const },
      { action: 'Go to Help', keys: ['G', 'H'], separator: 'then' as const },
    ],
  },
  {
    category: 'Tasks',
    shortcuts: [
      { action: 'New Task', keys: ['C'] },
      { action: 'Search', keys: ['/', '⌘K'], separator: 'or' as const },
      { action: 'Close panel', keys: ['Esc'] },
    ],
  },
  {
    category: 'Projects',
    shortcuts: [
      { action: 'New Project', keys: ['⌘N'] },
      { action: 'Filter tasks', keys: ['F'] },
    ],
  },
  {
    category: 'General',
    shortcuts: [
      { action: 'Open Help', keys: ['Shift+?'] },
      { action: 'Mark complete', keys: ['↵'] },
    ],
  },
];

const PANEL_VIDEOS = [
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

const GETTING_STARTED_ARTICLES = [
  {
    title: 'How to create your first project',
    content:
      'Navigate to the Projects page and click New Project. Choose a blank project or use a template to get started quickly. Add tasks, set priorities, and invite teammates to collaborate.',
  },
  {
    title: 'Using the AI project generator',
    content:
      'Click New Project and switch to the AI Generate tab. Describe your goal in plain English and Spike AI will scaffold a full project plan with tasks and priorities in seconds.',
  },
  {
    title: 'Managing tasks on the Kanban board',
    content:
      'Drag task cards between columns to update their status instantly. Click any card to open the detail panel and add subtasks, set due dates, or leave comments.',
  },
  {
    title: 'Inviting and managing team members',
    content:
      "Go to Settings and open the Team tab, enter a teammate's email, and select their role. They'll receive an invite link and can join your workspace immediately.",
  },
  {
    title: 'Using the AI chat assistant',
    content:
      'Click the chat bubble in the bottom-right corner to open the AI assistant. Ask questions, request task generation, or get help with any Spike feature.',
  },
] as const;

// ---------------------------------------------------------------------------
// HelpPanel
// ---------------------------------------------------------------------------

export default function HelpPanel() {
  const { helpPanelOpen, closeHelpPanel, setChatOpen } =
    useUIStore();
  const [openArticle, setOpenArticle] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<typeof PANEL_VIDEOS[number] | null>(null);

  function handleOpenAI() {
    closeHelpPanel();
    setChatOpen(true);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/20 z-40 transition-opacity duration-300',
          helpPanelOpen
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none',
        )}
        onClick={closeHelpPanel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Help & Resources"
        className={clsx(
          'fixed top-0 right-0 h-full w-[360px] bg-white shadow-2xl z-50',
          'flex flex-col transform transition-transform duration-300 ease-out',
          helpPanelOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Help & Resources</p>
              <p className="text-[11px] text-gray-400">Spike documentation</p>
            </div>
          </div>
          <button
            onClick={closeHelpPanel}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close help panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          {/* AI assistant shortcut */}
          <div className="px-5 pt-5 pb-4">
            <button
              onClick={handleOpenAI}
              className="w-full flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl px-4 py-3 hover:from-indigo-700 hover:to-violet-700 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold leading-tight">Ask Spike AI</p>
                <p className="text-[11px] text-indigo-200 mt-0.5">
                  Get instant answers in the chat widget
                </p>
              </div>
              <ChevronRight size={16} className="text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Quick links */}
          <section className="px-5 pb-5">
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeHelpPanel}
                    className="flex flex-col gap-2 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center', link.color)}>
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 leading-tight">
                        {link.label}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-5" />

          {/* Getting Started accordion */}
          <section className="px-5 py-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Getting Started
              </h3>
              <Link
                href="/help"
                onClick={closeHelpPanel}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5"
              >
                View all <ExternalLink size={10} />
              </Link>
            </div>
            <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              {GETTING_STARTED_ARTICLES.map((article, i) => {
                const isOpen = openArticle === i;
                return (
                  <div key={article.title} className="bg-white">
                    <button
                      onClick={() => setOpenArticle(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-medium text-gray-700 leading-snug">
                        {article.title}
                      </span>
                      <ChevronDown
                        size={13}
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
                      <p className="px-3 pb-3 text-[11px] text-gray-500 leading-relaxed">
                        {article.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-5" />

          {/* Video Tutorials */}
          <section className="px-5 py-5">
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Video Tutorials
            </h3>
            <div className="space-y-2">
              {PANEL_VIDEOS.map((video) => (
                <button
                  key={video.title}
                  onClick={() => setSelectedVideo(video)}
                  className="w-full flex items-center gap-3 rounded-xl overflow-hidden border border-gray-100 hover:shadow-sm hover:scale-[1.02] transition-all cursor-pointer group text-left"
                >
                  <div
                    className={clsx(
                      'w-16 h-12 bg-gradient-to-br flex items-center justify-center relative flex-shrink-0',
                      video.gradient,
                    )}
                  >
                    <span className="absolute top-1 left-1 text-[8px] font-bold uppercase tracking-wide text-white bg-black/40 px-1 py-0.5 rounded leading-none">
                      Soon
                    </span>
                    <PlayCircle size={16} className="text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0 pr-3 py-2">
                    <p className="text-xs font-medium text-gray-800 truncate leading-snug">{video.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{video.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-5" />

          {/* Keyboard Shortcuts */}
          <section className="px-5 py-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Keyboard Shortcuts
              </h3>
              <Link
                href="/help#shortcuts"
                onClick={closeHelpPanel}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5"
              >
                View all <ExternalLink size={10} />
              </Link>
            </div>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-gray-100">
                  {PANEL_SHORTCUT_GROUPS.flatMap((group) => [
                    <tr key={`cat-${group.category}`} className="bg-gray-50">
                      <td colSpan={2} className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        {group.category}
                      </td>
                    </tr>,
                    ...group.shortcuts.map((shortcut) => (
                      <tr key={shortcut.action} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2 text-[11px] text-gray-700">{shortcut.action}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1 flex-wrap justify-end">
                            {shortcut.keys.flatMap((key, i) => [
                              ...(i > 0
                                ? [<span key={`sep-${i}`} className="text-[10px] text-gray-400">{shortcut.separator ?? 'then'}</span>]
                                : []),
                              <kbd
                                key={`key-${i}`}
                                className="inline-flex items-center px-1 py-0.5 rounded border border-gray-300 border-b-2 bg-gray-100 text-[10px] font-mono text-gray-700"
                              >
                                {key}
                              </kbd>,
                            ])}
                          </div>
                        </td>
                      </tr>
                    )),
                  ])}
                </tbody>
              </table>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-5" />

          {/* What's new */}
          <section className="px-5 py-5">
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              What&apos;s New
            </h3>
            <div className="space-y-3">
              {[
                { label: 'AI project generation', date: 'Mar 3, 2026', badge: 'New' },
                { label: 'Drag-and-drop Kanban board', date: 'Mar 1, 2026', badge: 'New' },
                { label: 'Task detail panel', date: 'Feb 28, 2026', badge: 'Improved' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <span
                    className={clsx(
                      'text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5',
                      item.badge === 'New'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-emerald-100 text-emerald-700',
                    )}
                  >
                    {item.badge}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">{item.label}</p>
                    <p className="text-[11px] text-gray-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom padding */}
          <div className="h-6" />
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-gray-100 px-5 py-3 flex-shrink-0 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">Spike v0.1.0-beta</p>
          <Link
            href="/help"
            onClick={closeHelpPanel}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            Open Help Center <ExternalLink size={10} />
          </Link>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close video"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              <div
                className={clsx(
                  'rounded-xl h-44 bg-gradient-to-br flex flex-col items-center justify-center gap-3',
                  selectedVideo.gradient,
                )}
              >
                <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center">
                  <PlayCircle size={26} className="text-white" />
                </div>
                <p className="text-sm font-medium text-white/90">Video coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
