'use client';

import { useState } from 'react';
import { PRIORITY_LEVELS } from '@/constants';
import type { Priority, Project, Task } from '@/types';

const PRIORITY_BADGE: Record<string, string> = {
  gray:   'bg-gray-100 text-gray-600',
  blue:   'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  red:    'bg-red-100 text-red-700',
};

function formatShortDate(isoDate: string): string {
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

interface Props {
  taskGroups: { project: Project; tasks: Task[] }[];
  totalCount: number;
  today: string;
}

export function MyTasksList({ taskGroups, totalCount, today }: Props) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const openCount = totalCount - checkedIds.size;

  return (
    <>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">My Tasks</h2>
        <span className="text-xs text-gray-400">{openCount} open</span>
      </div>

      {taskGroups.length === 0 ? (
        <p className="px-6 py-12 text-sm text-gray-400 text-center">
          No active tasks — you&apos;re all caught up!
        </p>
      ) : (
        <div>
          {taskGroups.map(({ project, tasks }) => (
            <div key={project.id}>
              <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {project.name}
                </span>
              </div>
              <ul className="divide-y divide-gray-50">
                {tasks.map((task) => {
                  const isChecked  = checkedIds.has(task.id);
                  const isOverdue  = !!task.dueDate && task.dueDate < today && !isChecked;
                  const isDueToday = task.dueDate === today && !isChecked;
                  const { label, color } = PRIORITY_LEVELS[task.priority as Priority];

                  return (
                    <li
                      key={task.id}
                      className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-all duration-200${isChecked ? ' opacity-50' : ''}`}
                    >
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

                      <span
                        className={`flex-1 text-sm truncate transition-all duration-200${
                          isChecked ? ' line-through text-gray-400' : ' text-gray-800'
                        }`}
                      >
                        {task.title}
                      </span>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_BADGE[color]}`}
                      >
                        {label}
                      </span>

                      {task.dueDate && (
                        <span
                          className={`text-xs flex-shrink-0 ${
                            isOverdue
                              ? 'text-red-500 font-medium'
                              : isDueToday
                              ? 'text-amber-600 font-medium'
                              : 'text-gray-400'
                          }`}
                        >
                          {isOverdue && '⚠ '}
                          {formatShortDate(task.dueDate)}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
