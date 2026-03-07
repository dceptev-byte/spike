'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { CURRENT_USER } from '@/lib/mockData';

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------

function Toggle({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
        checked ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({
  title,
  description,
  children,
  danger,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden ${
        danger ? 'border-red-200' : 'border-gray-200'
      }`}
    >
      <div
        className={`px-5 py-4 border-b ${
          danger ? 'border-red-100 bg-red-50/40' : 'border-gray-100'
        }`}
      >
        <h2
          className={`text-sm font-semibold ${
            danger ? 'text-red-700' : 'text-gray-900'
          }`}
        >
          {title}
        </h2>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}

// A read-only field row inside a section
function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 gap-4">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900 truncate max-w-[260px]">
        {value}
      </span>
    </div>
  );
}

// A toggle row inside a section
function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-3.5">
      <label htmlFor={id} className="flex-1 cursor-pointer">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </label>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

// Appearance option button (Light / Dark / System)
function AppearanceOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type Theme = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  // Notification toggles (visual only — no persistence)
  const [emailNotifs,  setEmailNotifs]  = useState(true);
  const [inAppNotifs,  setInAppNotifs]  = useState(true);
  const [dueSoonNotifs, setDueSoonNotifs] = useState(true);

  // Appearance (visual only)
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* ── Account Settings ── */}
      <Section
        title="Account Settings"
        description="Your account information — contact support to make changes."
      >
        <FieldRow label="Full Name"      value={CURRENT_USER.name} />
        <FieldRow label="Email Address"  value={CURRENT_USER.email} />
        <FieldRow label="Role"           value={CURRENT_USER.role.charAt(0).toUpperCase() + CURRENT_USER.role.slice(1)} />
      </Section>

      {/* ── Notification Settings ── */}
      <Section
        title="Notification Settings"
        description="Choose how and when you want to be notified."
      >
        <ToggleRow
          id="email-notifs"
          label="Email notifications"
          description="Receive task updates and mentions via email"
          checked={emailNotifs}
          onChange={setEmailNotifs}
        />
        <ToggleRow
          id="inapp-notifs"
          label="In-app notifications"
          description="Show notifications in the bell dropdown"
          checked={inAppNotifs}
          onChange={setInAppNotifs}
        />
        <ToggleRow
          id="due-soon-notifs"
          label="Due-soon reminders"
          description="Get notified 24 hours before task due dates"
          checked={dueSoonNotifs}
          onChange={setDueSoonNotifs}
        />
      </Section>

      {/* ── Appearance ── */}
      <Section
        title="Appearance"
        description="Customise how Spike looks on your device."
      >
        <div className="px-5 py-4">
          <p className="text-sm font-medium text-gray-900 mb-3">Theme</p>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <AppearanceOption
              label="Light"
              active={theme === 'light'}
              onClick={() => setTheme('light')}
            />
            <AppearanceOption
              label="Dark"
              active={theme === 'dark'}
              onClick={() => setTheme('dark')}
            />
            <AppearanceOption
              label="System"
              active={theme === 'system'}
              onClick={() => setTheme('system')}
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Dark mode and system theme are visual previews only — full theming
            coming in a future release.
          </p>
        </div>
      </Section>

      {/* ── Danger Zone ── */}
      <Section title="Danger Zone" danger>
        <div className="px-5 py-4 flex items-start justify-between gap-6">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <AlertTriangle
              size={16}
              className="text-red-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Delete account</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
          </div>
          <button
            disabled
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-200 text-red-400 bg-red-50 cursor-not-allowed opacity-60"
          >
            Delete Account
          </button>
        </div>
      </Section>
    </div>
  );
}
