'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckSquare2, ArrowRight } from 'lucide-react';
import { useTaskStore } from '@/lib/store/taskStore';
import { CURRENT_USER, MOCK_PROJECTS } from '@/lib/mockData';
import { PRIORITY_LEVELS } from '@/constants';
import type { Priority, TaskStatus } from '@/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type Filter = 'open' | 'done' | 'all';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'done', label: 'Completed' },
  { key: 'all',  label: 'All' },
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog:     'Backlog',
  in_progress: 'In Progress',
  review:      'Review',
  done:        'Done',
};

const PRIORITY_BADGE: Record<string, string> = {
  gray:   'bg-gray-100 text-gray-600',
  blue:   'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  red:    'bg-red-100 text-red-700',
};

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <CheckSquare2 size={24} className="text-gray-400" />
      </div>
      <p className="font-medium text-gray-900">
        {filter === 'done' ? 'No completed tasks yet' : 'No tasks assigned to you'}
      </p>
      <p className="text-sm text-gray-400 mt-1">
        {filter === 'done'
          ? 'Complete a task and it will appear here.'
          : 'Tasks assigned to you across all projects will appear here.'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MyTasksPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const today = todayStr();
  const [filter, setFilter] = useState<Filter>('open');

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeId === CURRENT_USER.id),
    [tasks],
  );

  // Initialize checked IDs with tasks already marked done in the store
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    () => new Set(
      tasks
        .filter((t) => t.assigneeId === CURRENT_USER.id && t.status === 'done')
        .map((t) => t.id),
    ),
  );

  function toggle(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const openCount = myTasks.filter((t) => !checkedIds.has(t.id)).length;
  const doneCount = myTasks.filter((t) => checkedIds.has(t.id)).length;

  const filtered = useMemo(() => {
    if (filter === 'open') return myTasks.filter((t) => !checkedIds.has(t.id));
    if (filter === 'done') return myTasks.filter((t) => checkedIds.has(t.id));
    return myTasks;
  }, [myTasks, filter, checkedIds]);

  // Group by project
  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const t of filtered) {
      const arr = map.get(t.projectId) ?? [];
      arr.push(t);
      map.set(t.projectId, arr);
    }
    return Array.from(map.entries()).map(([projectId, items]) => ({
      project: MOCK_PROJECTS.find((p) => p.id === projectId),
      tasks: items.sort((a, b) => {
        // Overdue first, then by due date, then by priority
        const aOver = a.dueDate && a.dueDate < today ? -1 : 0;
        const bOver = b.dueDate && b.dueDate < today ? -1 : 0;
        return aOver - bOver || (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
      }),
    }));
  }, [filtered, today]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {openCount} open · {doneCount} completed
        </p>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 pb-px">
        {FILTERS.map(({ key, label }) => {
          const isActive = filter === key;
          const count =
            key === 'open' ? openCount : key === 'done' ? doneCount : myTasks.length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={[
                'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-t',
                isActive
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ].join(' ')}
            >
              {label}
              {count > 0 && (
                <span
                  className={[
                    'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[20px]',
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500',
                  ].join(' ')}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="space-y-6">
          {groups.map(({ project, tasks: groupTasks }) => (
            <section
              key={project?.id ?? 'no-project'}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              {/* Group header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {project?.name ?? 'Unknown Project'}
                </span>
                {project && (
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  >
                    Open board
                    <ArrowRight size={11} />
                  </Link>
                )}
              </div>

              {/* Task rows */}
              <ul className="divide-y divide-gray-50">
                {groupTasks.map((task) => {
                  const isChecked  = checkedIds.has(task.id);
                  const isOverdue  = !!task.dueDate && task.dueDate < today && !isChecked;
                  const isDueToday = task.dueDate === today && !isChecked;
                  const { label: priLabel, color: priColor } = PRIORITY_LEVELS[task.priority as Priority];

                  return (
                    <li
                      key={task.id}
                      className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-all duration-200${isChecked ? ' opacity-50' : ''}`}
                    >
                      {/* Interactive checkbox */}
                      <button
                        type="button"
                        onClick={() => toggle(task.id)}
                        aria-label={isChecked ? 'Mark incomplete' : 'Mark complete'}
                        className={`w-4 h-4 rounded border-2 flex-shrink-0 cursor-pointer transition-all duration-150 flex items-center justify-center${
                          isChecked
                            ? ' bg-violet-600 border-violet-600'
                            : ' border-gray-300 hover:border-violet-400'
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                            <path
                              d="M2 5l2.5 2.5L8 3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>

                      {/* Title */}
                      <span
                        className={`flex-1 text-sm truncate transition-all duration-200${
                          isChecked ? ' line-through text-gray-400' : ' text-gray-800'
                        }`}
                      >
                        {task.title}
                      </span>

                      {/* Status chip */}
                      <span className="hidden sm:inline-flex text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        {STATUS_LABELS[task.status as TaskStatus]}
                      </span>

                      {/* Priority badge */}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${PRIORITY_BADGE[priColor]}`}
                      >
                        {priLabel}
                      </span>

                      {/* Due date */}
                      {task.dueDate && (
                        <span
                          className={`text-xs flex-shrink-0 font-medium ${
                            isOverdue
                              ? 'text-red-500'
                              : isDueToday
                              ? 'text-amber-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {isOverdue && '⚠ '}
                          {fmtDate(task.dueDate)}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
