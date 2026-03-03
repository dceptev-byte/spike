'use client';

import { useParams } from 'next/navigation';
import { useProjectStore } from '@/lib/store/projectStore';
import { useTaskStore } from '@/lib/store/taskStore';
import { MOCK_USERS } from '@/lib/mockData';
import KanbanBoard from '@/components/board/KanbanBoard';
import UserAvatar from '@/components/shared/UserAvatar';

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  planning: 'bg-blue-50 text-blue-700 border border-blue-200',
  on_hold: 'bg-amber-50 text-amber-700 border border-amber-200',
  completed: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  planning: 'Planning',
  on_hold: 'On hold',
  completed: 'Completed',
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const projects = useProjectStore((s) => s.projects);
  const tasks = useTaskStore((s) => s.tasks);

  const project =
    projects.find((p) => p.id === projectId) ?? projects[0];

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Project not found.
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const totalTasks = projectTasks.length;
  const doneTasks = projectTasks.filter((t) => t.status === 'done').length;

  const members = project.memberIds
    .map((id) => MOCK_USERS.find((u) => u.id === id))
    .filter(Boolean) as (typeof MOCK_USERS)[number][];

  return (
    <div className="h-full flex flex-col gap-5 min-h-0">
      {/* ── Project header ── */}
      <div className="flex items-start justify-between flex-shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {project.name}
            </h1>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                STATUS_STYLES[project.status] ?? STATUS_STYLES.active
              }`}
            >
              {STATUS_LABELS[project.status] ?? project.status}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1 truncate max-w-xl">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          {/* Member avatars */}
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((user) => (
              <div
                key={user.id}
                className="ring-2 ring-white rounded-full"
                title={user.name}
              >
                <UserAvatar name={user.name} size="sm" />
              </div>
            ))}
            {members.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-[10px] font-semibold text-gray-500">
                +{members.length - 4}
              </div>
            )}
          </div>

          {/* Progress */}
          {totalTasks > 0 && (
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">
                {doneTasks}/{totalTasks} done
              </div>
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(doneTasks / totalTasks) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Kanban board ── */}
      <div className="flex-1 min-h-0">
        <KanbanBoard project={project} />
      </div>
    </div>
  );
}
