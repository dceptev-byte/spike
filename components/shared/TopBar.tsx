'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';
import SearchBar from './SearchBar';
import { useToastStore } from '@/lib/store/toastStore';

/** Placeholder — swap for real auth session data when auth is added. */
const MOCK_USER = { name: 'Alex Morgan', email: 'alex@spike.app' };

interface TopBarProps {
  /** Called when the hamburger is pressed on mobile to open the sidebar. */
  onMobileMenuToggle: () => void;
}

export default function TopBar({ onMobileMenuToggle }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);

  /** Close the dropdown whenever the user clicks outside it. */
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  function closeDropdown() {
    setDropdownOpen(false);
  }

  function handleSignOut() {
    // TODO: wire up Supabase auth signOut() in Phase 2
    closeDropdown();
    addToast('You have been signed out', 'info');
    setTimeout(() => router.push('/'), 1500);
  }

  return (
    <header className="h-14 flex-shrink-0 flex items-center gap-3 px-4 bg-white border-b border-gray-200">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuToggle}
        className="md:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Search bar */}
      <SearchBar />

      {/* Right-side actions */}
      <div className="flex items-center gap-1 ml-auto">
        <NotificationBell />

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <UserAvatar name={MOCK_USER.name} size="sm" />
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {MOCK_USER.name}
            </span>
            <ChevronDown
              size={13}
              className={`text-gray-400 transition-transform duration-150 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
              {/* User info header */}
              <div className="px-3 py-2.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {MOCK_USER.name}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {MOCK_USER.email}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <DropdownItem
                  icon={<User size={14} />}
                  label="Profile"
                  href="/profile"
                  onClick={closeDropdown}
                />
                <DropdownItem
                  icon={<Settings size={14} />}
                  label="Settings"
                  href="/settings"
                  onClick={closeDropdown}
                />
              </div>

              <div className="border-t border-gray-100 py-1">
                <DropdownItem
                  icon={<LogOut size={14} />}
                  label="Sign out"
                  danger
                  onClick={handleSignOut}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// DropdownItem — renders as <Link> when href is provided, <button> otherwise
// ---------------------------------------------------------------------------

function DropdownItem({
  icon,
  label,
  danger = false,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const cls = [
    'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors',
    danger
      ? 'text-red-600 hover:bg-red-50'
      : 'text-gray-700 hover:bg-gray-50',
  ].join(' ');

  const inner = (
    <>
      <span className={danger ? 'text-red-500' : 'text-gray-400'}>{icon}</span>
      {label}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
