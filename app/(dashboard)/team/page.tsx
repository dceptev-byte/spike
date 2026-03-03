import { Users } from 'lucide-react';
import { MOCK_USERS, MOCK_TASKS, MOCK_PROJECTS } from '@/lib/mockData';
import UserAvatar from '@/components/shared/UserAvatar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROLE_BADGE: Record<string, string> = {
  owner:  'bg-indigo-50 text-indigo-700 border border-indigo-200',
  admin:  'bg-violet-50 text-violet-700 border border-violet-200',
  member: 'bg-gray-100  text-gray-600   border border-gray-200',
  viewer: 'bg-slate-50  text-slate-600  border border-slate-200',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Empty state (shown if MOCK_USERS is ever empty)
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Users size={24} className="text-gray-400" />
      </div>
      <p className="font-medium text-gray-900">No team members yet</p>
      <p className="text-sm text-gray-400 mt-1">
        Invite collaborators to get started.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page — server component (no client state needed)
// ---------------------------------------------------------------------------

export default function TeamPage() {
  if (MOCK_USERS.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-gray-400 mt-0.5">0 members</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {MOCK_USERS.length} member{MOCK_USERS.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* TODO: wire to invite flow */}
        <button
          disabled
          title="Coming soon"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
        >
          Invite member
        </button>
      </div>

      {/* ── Member list ── */}
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_120px_80px_80px_80px] gap-4 px-5 py-3 bg-gray-50">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Projects</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Open tasks</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Joined</span>
        </div>

        {MOCK_USERS.map((user) => {
          const projectCount = MOCK_PROJECTS.filter((p) =>
            p.memberIds.includes(user.id),
          ).length;
          const openTasks = MOCK_TASKS.filter(
            (t) => t.assigneeId === user.id && t.status !== 'done',
          ).length;

          return (
            <div
              key={user.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_120px_80px_80px_80px] gap-3 sm:gap-4 px-5 py-4 hover:bg-gray-50 transition-colors items-center"
            >
              {/* Avatar + name + email */}
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar name={user.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              {/* Role badge */}
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    ROLE_BADGE[user.role] ?? ROLE_BADGE.member
                  }`}
                >
                  {user.role}
                </span>
              </div>

              {/* Stats */}
              <p className="text-sm text-gray-600 sm:text-right">{projectCount}</p>
              <p className="text-sm text-gray-600 sm:text-right">{openTasks}</p>
              <p className="text-xs text-gray-400 sm:text-right">{fmtDate(user.createdAt)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
