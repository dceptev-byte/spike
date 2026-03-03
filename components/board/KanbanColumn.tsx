'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import type { Task, TaskStatus } from '@/types';
import { STATUS_COLUMNS } from '@/constants';
import TaskCard from './TaskCard';

// ---------------------------------------------------------------------------
// Column accent colours keyed by status
// ---------------------------------------------------------------------------

const ACCENT_DOT: Record<TaskStatus, string> = {
  backlog: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  review: 'bg-amber-400',
  done: 'bg-emerald-500',
};

const HEADER_BG: Record<TaskStatus, string> = {
  backlog: 'bg-gray-50',
  in_progress: 'bg-blue-50',
  review: 'bg-amber-50',
  done: 'bg-emerald-50',
};

const COUNT_BADGE: Record<TaskStatus, string> = {
  backlog: 'bg-gray-200 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  review: 'bg-amber-100 text-amber-700',
  done: 'bg-emerald-100 text-emerald-700',
};

// ---------------------------------------------------------------------------
// KanbanColumn
// ---------------------------------------------------------------------------

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export default function KanbanColumn({
  status,
  tasks,
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const { label } = STATUS_COLUMNS[status];
  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="flex flex-col w-72 flex-shrink-0 max-h-full">
      {/* ── Column header ── */}
      <div
        className={clsx(
          'flex items-center justify-between px-3 py-2.5 rounded-t-xl',
          HEADER_BG[status],
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'w-2 h-2 rounded-full flex-shrink-0',
              ACCENT_DOT[status],
            )}
          />
          <span className="text-sm font-semibold text-gray-700">{label}</span>
          <span
            className={clsx(
              'text-[11px] font-medium rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-tight',
              COUNT_BADGE[status],
            )}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(status)}
          className="p-1 rounded-md hover:bg-white/60 text-gray-400 hover:text-gray-600 transition-colors"
          title={`Add task to ${label}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Drop zone + task list ── */}
      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 min-h-[120px] rounded-b-xl p-2 flex flex-col gap-2',
          'overflow-y-auto transition-colors duration-150',
          isOver ? 'bg-blue-50/70' : 'bg-gray-100/60',
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-8">
            <span className="text-xs text-gray-300">No tasks yet</span>
          </div>
        )}
      </div>
    </div>
  );
}
