'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckSquare, FolderKanban, Search, X } from 'lucide-react';
import { useProjectStore } from '@/lib/store/projectStore';
import { MOCK_TASKS } from '@/lib/mockData';
import type { ProjectStatus } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ResultKind = 'project' | 'task';

interface SearchResult {
  id: string;
  kind: ResultKind;
  title: string;
  subtitle: string;
  href: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_LABELS: Record<ProjectStatus, string> = {
  planning:  'Planning',
  active:    'Active',
  on_hold:   'On Hold',
  completed: 'Completed',
  archived:  'Archived',
};

// ---------------------------------------------------------------------------
// SearchBar
// ---------------------------------------------------------------------------

export default function SearchBar() {
  const router   = useRouter();
  const projects = useProjectStore((s) => s.projects);

  const [query,       setQuery]       = useState('');
  const [open,        setOpen]        = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef    = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Compute filtered results ──────────────────────────────────────────────

  const q = query.trim().toLowerCase();

  const projectResults: SearchResult[] = q
    ? projects
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.description ?? '').toLowerCase().includes(q),
        )
        .map((p) => ({
          id:       p.id,
          kind:     'project' as const,
          title:    p.name,
          subtitle: STATUS_LABELS[p.status] ?? p.status,
          href:     `/projects/${p.id}`,
        }))
    : [];

  const taskResults: SearchResult[] = q
    ? MOCK_TASKS.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? '').toLowerCase().includes(q),
      ).map((t) => ({
        id:       t.id,
        kind:     'task' as const,
        title:    t.title,
        subtitle: projects.find((p) => p.id === t.projectId)?.name ?? 'Unknown project',
        href:     `/projects/${t.projectId}`,
      }))
    : [];

  // Flat list used for keyboard index tracking (projects first, then tasks)
  const flatResults = [...projectResults, ...taskResults];

  const showDropdown = open && q.length > 0;

  // ── Side-effects ──────────────────────────────────────────────────────────

  // Reset keyboard selection whenever query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  // Close when clicking outside the container
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setOpen(true);
  }

  function handleClear() {
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  }

  function navigate(href: string) {
    router.push(href);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
      return;
    }

    if (e.key === 'Enter' && activeIndex >= 0 && flatResults[activeIndex]) {
      e.preventDefault();
      navigate(flatResults[activeIndex].href);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      {/* ── Input ── */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => { if (q) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search tasks, projects…"
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="search-results-listbox"
          className="w-full h-9 pl-9 pr-8 rounded-lg bg-gray-100 border border-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-indigo-300 transition-colors"
        />
        {query && (
          <button
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* ── Dropdown ── */}
      {showDropdown && (
        <div
          id="search-results-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {flatResults.length === 0 ? (
            /* ── Empty state ── */
            <p className="px-4 py-6 text-center text-sm text-gray-400">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <>
              {/* ── Projects group ── */}
              {projectResults.length > 0 && (
                <section>
                  <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Projects
                  </p>
                  {projectResults.map((result) => (
                    <ResultRow
                      key={result.id}
                      result={result}
                      active={flatResults.indexOf(result) === activeIndex}
                      onMouseEnter={() => setActiveIndex(flatResults.indexOf(result))}
                      onClick={() => navigate(result.href)}
                    />
                  ))}
                </section>
              )}

              {/* ── Tasks group ── */}
              {taskResults.length > 0 && (
                <section className={projectResults.length > 0 ? 'border-t border-gray-100' : ''}>
                  <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Tasks
                  </p>
                  {taskResults.map((result) => (
                    <ResultRow
                      key={result.id}
                      result={result}
                      active={flatResults.indexOf(result) === activeIndex}
                      onMouseEnter={() => setActiveIndex(flatResults.indexOf(result))}
                      onClick={() => navigate(result.href)}
                    />
                  ))}
                </section>
              )}

              {/* Bottom breathing room */}
              <div className="h-1.5" aria-hidden />
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResultRow
// ---------------------------------------------------------------------------

function ResultRow({
  result,
  active,
  onMouseEnter,
  onClick,
}: {
  result:       SearchResult;
  active:       boolean;
  onMouseEnter: () => void;
  onClick:      () => void;
}) {
  const Icon = result.kind === 'project' ? FolderKanban : CheckSquare;

  return (
    <button
      role="option"
      aria-selected={active}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
        active ? 'bg-indigo-50' : 'hover:bg-gray-50'
      }`}
    >
      <Icon
        size={15}
        className={`flex-shrink-0 ${active ? 'text-indigo-500' : 'text-gray-400'}`}
      />
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-gray-900 truncate">
          {result.title}
        </span>
        <span className="block text-xs text-gray-400 truncate">
          {result.subtitle}
        </span>
      </span>
    </button>
  );
}
