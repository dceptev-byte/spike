'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, MessageSquare, CheckSquare2 } from 'lucide-react';
import clsx from 'clsx';
import type { Task } from '@/types';
import { PRIORITY_LEVELS } from '@/constants';
import { MOCK_USERS } from '@/lib/mockData';
import UserAvatar from '@/components/shared/UserAvatar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PRIORITY_BADGE: Record<string, string> = {
  low: 'bg-gray-100 text-gray-500',
  medium: 'bg-blue-50 text-blue-600',
  high: 'bg-orange-50 text-orange-600',
  urgent: 'bg-red-50 text-red-600',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function isOverdue(iso: string) {
  const due = new Date(iso);
  const today = new Date(new Date().toDateString());
  return due < today;
}

// ---------------------------------------------------------------------------
// TaskCardContent — pure presentational card (also used in DragOverlay)
// ---------------------------------------------------------------------------

interface CardContentProps {
  task: Task;
  onClick: () => void;
  isDragOverlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function TaskCardContent({
  task,
  onClick,
  isDragOverlay,
  className,
  style,
}: CardContentProps) {
  const assignee = MOCK_USERS.find((u) => u.id === task.assigneeId);
  const doneSubtasks = task.subtasks.filter((s) => s.completed).length;
  const overdue =
    task.dueDate && isOverdue(task.dueDate) && task.status !== 'done';

  return (
    <div
      style={style}
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg border border-gray-200 p-3 cursor-pointer select-none',
        'hover:border-blue-300 hover:shadow-sm transition-all duration-150',
        isDragOverlay && 'shadow-2xl rotate-1 scale-105 opacity-95 border-blue-300',
        className,
      )}
    >
      {/* Priority + label row */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span
          className={clsx(
            'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
            PRIORITY_BADGE[task.priority],
          )}
        >
          {PRIORITY_LEVELS[task.priority].label}
        </span>
        {task.labels.length > 0 && (
          <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded truncate max-w-[90px]">
            {task.labels[0]}
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-800 leading-snug mb-3 line-clamp-2">
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-1">
        {/* Left: assignee + due date */}
        <div className="flex items-center gap-1.5">
          {assignee && <UserAvatar name={assignee.name} size="xs" />}
          {task.dueDate && (
            <span
              className={clsx(
                'flex items-center gap-0.5 text-[11px]',
                overdue ? 'text-red-500 font-medium' : 'text-gray-400',
              )}
            >
              <Calendar className="w-3 h-3 flex-shrink-0" />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Right: subtask count + comment count */}
        <div className="flex items-center gap-2 text-gray-400">
          {task.subtasks.length > 0 && (
            <span
              className={clsx(
                'flex items-center gap-0.5 text-[11px]',
                doneSubtasks === task.subtasks.length
                  ? 'text-emerald-500'
                  : 'text-gray-400',
              )}
            >
              <CheckSquare2 className="w-3 h-3" />
              {doneSubtasks}/{task.subtasks.length}
            </span>
          )}
          {task.comments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[11px]">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TaskCard — wraps CardContent with useSortable
// ---------------------------------------------------------------------------

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      className={clsx('touch-none', isDragging && 'opacity-40')}
    >
      <TaskCardContent task={task} onClick={onClick} />
    </div>
  );
}
