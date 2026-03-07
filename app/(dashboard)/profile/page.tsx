import type { Metadata } from 'next';
import { Mail, Shield, Calendar } from 'lucide-react';
import { CURRENT_USER } from '@/lib/mockData';
import UserAvatar from '@/components/shared/UserAvatar';

export const metadata: Metadata = { title: 'Profile' };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ROLE_BADGE: Record<string, string> = {
  owner:  'bg-violet-100 text-violet-700',
  admin:  'bg-indigo-100 text-indigo-700',
  member: 'bg-gray-100   text-gray-600',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day:   'numeric',
    year:  'numeric',
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-900 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const user = CURRENT_USER;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your personal information and account details.
        </p>
      </div>

      {/* ── Avatar card ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-5">
          {/* Avatar — scaled up with a wrapper */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            <UserAvatar name={user.name} size="lg" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5 truncate">{user.email}</p>
            <span
              className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${ROLE_BADGE[user.role] ?? ROLE_BADGE.member}`}
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* Edit Profile placeholder */}
        <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-3">
          <button
            disabled
            className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white opacity-40 cursor-not-allowed"
          >
            Edit Profile
          </button>
          <p className="text-xs text-gray-400">Profile editing coming soon.</p>
        </div>
      </div>

      {/* ── Info fields ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        <InfoRow
          icon={<Mail size={15} />}
          label="Email Address"
          value={user.email}
        />
        <InfoRow
          icon={<Shield size={15} />}
          label="Role"
          value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        />
        <InfoRow
          icon={<Calendar size={15} />}
          label="Member Since"
          value={formatDate(user.createdAt)}
        />
      </div>
    </div>
  );
}
