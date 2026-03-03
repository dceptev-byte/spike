'use client';

import { useMemo, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { useProjectStore } from '@/lib/store/projectStore';
import { MOCK_TASKS, MOCK_USERS } from '@/lib/mockData';
import ProjectCard from '@/components/projects/ProjectCard';
import NewProjectModal from '@/components/projects/NewProjectModal';
import type { ProjectStatus } from '@/types';

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------

type FilterKey = 'all' | ProjectStatus;

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'active',    label: 'Active'    },
  { key: 'on_hold',   label: 'On Hold'   },
  { key: 'completed', label: 'Completed' },
  { key: 'archived',  label: 'Archived'  },
];

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <FolderOpen size={24} className="text-gray-400" />
      </div>
      <p className="text-gray-900 font-medium">
        {filtered ? 'No projects match this filter' : 'No projects yet'}
      </p>
      <p className="text-sm text-gray-400 mt-1">
        {filtered
          ? 'Try a different filter or create a new project.'
          : 'Click "New Project" to get started.'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProjectsPage() {
  const projects = useProjectStore((s) => s.projects);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // Derive filtered list
  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? projects
        : projects.filter((p) => p.status === activeFilter),
    [projects, activeFilter]
  );

  // Count badge per tab
  const countByStatus = useMemo(() => {
    const map: Partial<Record<FilterKey, number>> = { all: projects.length };
    for (const p of projects) {
      map[p.status] = (map[p.status] ?? 0) + 1;
    }
    return map;
  }, [projects]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* NewProjectModal includes the trigger button */}
        <NewProjectModal />
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-px">
        {FILTER_TABS.map(({ key, label }) => {
          const count = countByStatus[key] ?? 0;
          const isActive = activeFilter === key;

          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={[
                'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
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
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-500',
                  ].join(' ')}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Project grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <EmptyState filtered={activeFilter !== 'all'} />
        ) : (
          filtered.map((project) => {
            const projectTasks = MOCK_TASKS.filter((t) => t.projectId === project.id);
            const doneCount    = projectTasks.filter((t) => t.status === 'done').length;
            const owner        = MOCK_USERS.find((u) => u.id === project.ownerId);
            const members      = MOCK_USERS.filter((u) => project.memberIds.includes(u.id));

            return (
              <ProjectCard
                key={project.id}
                project={project}
                owner={owner ?? MOCK_USERS[0]}
                members={members}
                taskCount={projectTasks.length}
                doneCount={doneCount}
                // onClick would navigate to /projects/[id] once that page exists
              />
            );
          })
        )}
      </div>
    </div>
  );
}
