'use client';

import { Calendar, CheckSquare } from 'lucide-react';
import UserAvatar from '@/components/shared/UserAvatar';
import type { Project, User } from '@/types';

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const ACCENT: Record<string, string> = {
  active:    'bg-indigo-500',
  planning:  'bg-sky-400',
  on_hold:   'bg-amber-400',
  completed: 'bg-emerald-500',
  archived:  'bg-gray-400',
};

const STATUS_BADGE: Record<string, string> = {
  active:    'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  planning:  'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20',
  on_hold:   'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  completed: 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-600/20',
  archived:  'bg-gray-50 text-gray-500 ring-1 ring-inset ring-gray-500/20',
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ProjectCardProps {
  project: Project;
  /** The user who owns the project. */
  owner: User;
  /** All members of the project (used for avatar stack). */
  members: User[];
  /** Total number of tasks in the project. */
  taskCount: number;
  /** Number of tasks with status === 'done'. */
  doneCount: number;
  onClick?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProjectCard({
  project,
  owner,
  members,
  taskCount,
  doneCount,
  onClick,
}: ProjectCardProps) {
  const progress     = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;
  const accentColor  = ACCENT[project.status]      ?? ACCENT.planning;
  const badgeColor   = STATUS_BADGE[project.status] ?? STATUS_BADGE.planning;
  const statusLabel  = project.status.replace('_', ' ');

  // Show up to 4 avatars then "+N"
  const visibleMembers = members.slice(0, 4);
  const extraCount     = Math.max(0, members.length - visibleMembers.length);

  return (
    <article
      onClick={onClick}
      className={[
        'bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col',
        'transition-all duration-150 hover:shadow-md hover:border-gray-300',
        onClick ? 'cursor-pointer' : '',
      ].join(' ')}
    >
      {/* ── Colour accent bar ── */}
      <div className={`h-1 w-full flex-shrink-0 ${accentColor}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* ── Status badge + name + description ── */}
        <div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize mb-2 ${badgeColor}`}>
            {statusLabel}
          </span>

          <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">
            {project.name}
          </h3>

          {project.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-snug">
              {project.description}
            </p>
          )}
        </div>

        {/* ── Team avatar stack + task count ── */}
        <div className="flex items-center justify-between">
          {/* Overlapping avatars */}
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1.5">
              {visibleMembers.map((m) => (
                <div key={m.id} className="ring-2 ring-white rounded-full">
                  <UserAvatar name={m.name} size="xs" />
                </div>
              ))}
            </div>
            {extraCount > 0 && (
              <span className="text-xs text-gray-400 font-medium ml-0.5">
                +{extraCount}
              </span>
            )}
          </div>

          {/* Task progress count */}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <CheckSquare size={13} />
            {doneCount}/{taskCount}
          </span>
        </div>

        {/* ── Progress bar ── */}
        <div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${accentColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">{progress}%</p>
        </div>

        {/* ── Owner + due date ── */}
        <div className="flex items-center justify-between mt-auto pt-1 border-t border-gray-50">
          <div className="flex items-center gap-1.5 min-w-0">
            <UserAvatar name={owner.name} size="xs" />
            <span className="text-xs text-gray-500 truncate max-w-[110px]">
              {owner.name}
            </span>
          </div>

          {project.dueDate ? (
            <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
              <Calendar size={11} />
              {new Date(project.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          ) : (
            <span className="text-xs text-gray-300">No due date</span>
          )}
        </div>
      </div>
    </article>
  );
}
