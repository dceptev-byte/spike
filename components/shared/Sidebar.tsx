'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Users,
  X,
  Zap,
} from 'lucide-react';
import UserAvatar from './UserAvatar';
import HelpButton from './HelpButton';
import { useUIStore } from '@/lib/store/uiStore';

// ---------------------------------------------------------------------------
// Navigation config
// ---------------------------------------------------------------------------

const PRIMARY_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'My Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Team', href: '/team', icon: Users },
] as const;

/** Placeholder — swap for real auth session data when auth is added. */
const MOCK_USER = { name: 'Alex Morgan', plan: 'Free plan' };

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SidebarProps {
  /** Whether the mobile overlay drawer is visible. */
  mobileSidebarOpen: boolean;
  /** Called when the user taps the backdrop or the close button on mobile. */
  onMobileClose: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Sidebar({
  mobileSidebarOpen,
  onMobileClose,
}: SidebarProps) {
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useUIStore();
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <>
      {/* ── Mobile backdrop ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={[
          // Base
          'flex flex-col bg-[#0f172a] transition-[width] duration-300 ease-in-out z-50 flex-shrink-0',
          // Desktop width — collapsed or expanded
          collapsed ? 'md:w-16' : 'md:w-60',
          // Mobile — fixed overlay when open, otherwise hidden
          mobileSidebarOpen
            ? 'fixed inset-y-0 left-0 w-72 flex'
            : 'hidden md:flex',
        ].join(' ')}
      >
        {/* ── Logo row ── */}
        <div
          className={`h-14 flex items-center flex-shrink-0 px-3 ${
            collapsed ? 'justify-center' : 'gap-2.5'
          }`}
        >
          {/* Logo mark */}
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>

          {/* Wordmark — hidden when collapsed */}
          {!collapsed && (
            <span className="text-white font-semibold text-[15px] tracking-tight">
              Spike
            </span>
          )}

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="ml-auto md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          {/* Primary nav items */}
          <ul className="space-y-0.5">
            {PRIMARY_NAV.map(({ label, href, icon: Icon }) => (
              <NavItem
                key={href}
                label={label}
                href={href}
                icon={<Icon size={17} className="flex-shrink-0" />}
                active={isActive(href)}
                collapsed={collapsed}
                onClick={onMobileClose}
              />
            ))}
          </ul>

          {/* Divider + Help button */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <ul className="space-y-0.5">
              <HelpButton collapsed={collapsed} />
            </ul>
          </div>
        </nav>

        {/* ── User footer + collapse toggle ── */}
        <div className="border-t border-white/10 p-2 flex-shrink-0">
          {collapsed ? (
            /* Collapsed: stack avatar + expand button */
            <div className="flex flex-col items-center gap-2 py-1">
              <UserAvatar name={MOCK_USER.name} size="sm" />
              <button
                onClick={() => setCollapsed(false)}
                className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Expand sidebar"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          ) : (
            /* Expanded: avatar + name + collapse button */
            <div className="flex items-center gap-2.5 px-1 py-1">
              <UserAvatar name={MOCK_USER.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate leading-tight">
                  {MOCK_USER.name}
                </p>
                <p className="text-xs text-slate-400 truncate leading-tight">
                  {MOCK_USER.plan}
                </p>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ---------------------------------------------------------------------------
// Nav item sub-component
// ---------------------------------------------------------------------------

interface NavItemProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function NavItem({ label, href, icon, active, collapsed, onClick }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={[
          'flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors',
          collapsed ? 'justify-center px-2' : 'px-3',
          active
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
        ].join(' ')}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </Link>
    </li>
  );
}
