import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, Calendar, CheckCircle2, FolderKanban } from 'lucide-react';
import { MyTasksList } from './_components/MyTasksList';

export const metadata: Metadata = { title: 'Dashboard' };
import { OnboardingChecklist } from '@/components/onboarding';
import {
  CURRENT_USER,
  IS_NEW_USER,
  MOCK_PROJECTS,
  MOCK_TASKS,
  MOCK_USERS,
} from '@/lib/mockData';
import type { Project, Task } from '@/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatShortDate(isoDate: string): string {
  // Append midnight UTC so the date isn't shifted by local offset
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function weekStartStr(): string {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(d);
  monday.setDate(diff);
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

type StatColor = 'blue' | 'amber' | 'red' | 'green';

const STAT_COLORS: Record<StatColor, { icon: string; value: string; label: string }> = {
  blue:  { icon: 'bg-blue-50 text-blue-600',   value: 'text-blue-700',  label: 'text-gray-500' },
  amber: { icon: 'bg-amber-50 text-amber-600',  value: 'text-amber-700', label: 'text-gray-500' },
  red:   { icon: 'bg-red-50 text-red-600',      value: 'text-red-700',   label: 'text-gray-500' },
  green: { icon: 'bg-green-50 text-green-600',  value: 'text-green-700', label: 'text-gray-500' },
};

function StatCard({
  label,
  value,
  icon,
  color,
  href,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: StatColor;
  href: string;
}) {
  const c = STAT_COLORS[color];
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-gray-200 p-5 block hover:shadow-md hover:border-gray-300 transition-all duration-150"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${c.icon}`}>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${c.value}`}>{value}</p>
      <p className={`text-sm mt-0.5 ${c.label}`}>{label}</p>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Project card
// ---------------------------------------------------------------------------

const STATUS_BADGE: Record<string, string> = {
  active:    'bg-green-100 text-green-700',
  planning:  'bg-blue-100 text-blue-700',
  on_hold:   'bg-amber-100 text-amber-700',
  completed: 'bg-gray-100 text-gray-600',
  archived:  'bg-gray-100 text-gray-500',
};

function ProjectCard({
  project,
  progress,
  ownerName,
}: {
  project: Project;
  progress: number;
  ownerName: string;
}) {
  const statusLabel = project.status.replace('_', ' ');

  return (
    <Link
      href={`/projects/${project.id}`}
      className="bg-white rounded-xl border border-gray-200 p-5 block hover:shadow-md hover:border-gray-300 transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{project.name}</h3>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0 ${STATUS_BADGE[project.status]}`}
        >
          {statusLabel}
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-4">by {ownerName}</p>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400">Progress</span>
          <span className="text-xs font-medium text-gray-600">{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {project.dueDate && (
        <p className="text-xs text-gray-400 mt-3">
          Due {formatShortDate(project.dueDate)}
        </p>
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const today = todayStr();
  const weekStart = weekStartStr();

  // Tasks belonging to the current user
  const myTasks = MOCK_TASKS.filter((t) => t.assigneeId === CURRENT_USER.id);

  // Quick stats
  const activeProjects     = MOCK_PROJECTS.filter((p) => p.status === 'active').length;
  const tasksDueToday      = myTasks.filter((t) => t.dueDate === today && t.status !== 'done').length;
  const overdueTasks       = myTasks.filter((t) => !!t.dueDate && t.dueDate < today && t.status !== 'done').length;
  const completedThisWeek  = myTasks.filter((t) => t.status === 'done' && t.updatedAt >= weekStart).length;

  // My Tasks — active (not done), grouped by project
  const activeTasks = myTasks.filter((t) => t.status !== 'done');
  const taskGroups: { project: Project; tasks: Task[] }[] = MOCK_PROJECTS.reduce<
    { project: Project; tasks: Task[] }[]
  >((acc, project) => {
    const tasks = activeTasks.filter((t) => t.projectId === project.id);
    if (tasks.length > 0) acc.push({ project, tasks });
    return acc;
  }, []);

  // Recent Projects — top 4 by last-updated
  const recentProjects = [...MOCK_PROJECTS]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ── Onboarding checklist (new users only) ── */}
      {IS_NEW_USER && <OnboardingChecklist />}

      {/* ── Welcome banner ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()},{' '}
          <span className="text-indigo-600">{CURRENT_USER.name.split(' ')[0]}</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">{formatFullDate(new Date())}</p>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Projects"
          value={activeProjects}
          icon={<FolderKanban size={18} />}
          color="blue"
          href="/projects?filter=active"
        />
        <StatCard
          label="Due Today"
          value={tasksDueToday}
          icon={<Calendar size={18} />}
          color="amber"
          href="/tasks?filter=due-today"
        />
        <StatCard
          label="Overdue Tasks"
          value={overdueTasks}
          icon={<AlertCircle size={18} />}
          color="red"
          href="/tasks?filter=overdue"
        />
        <StatCard
          label="Done This Week"
          value={completedThisWeek}
          icon={<CheckCircle2 size={18} />}
          color="green"
          href="/tasks?filter=done"
        />
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* My Tasks */}
        <section className="xl:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <MyTasksList
            taskGroups={taskGroups}
            totalCount={activeTasks.length}
            today={today}
          />
        </section>

        {/* Recent Projects */}
        <section className="space-y-4">
          <h2 className="font-semibold text-gray-900">Recent Projects</h2>

          {recentProjects.map((project) => {
            const projectTasks = MOCK_TASKS.filter((t) => t.projectId === project.id);
            const doneTasks    = projectTasks.filter((t) => t.status === 'done').length;
            const progress     = projectTasks.length > 0
              ? Math.round((doneTasks / projectTasks.length) * 100)
              : 0;
            const owner = MOCK_USERS.find((u) => u.id === project.ownerId);

            return (
              <ProjectCard
                key={project.id}
                project={project}
                progress={progress}
                ownerName={owner?.name ?? 'Unknown'}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
}
