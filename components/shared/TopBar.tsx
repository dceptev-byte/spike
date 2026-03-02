'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';

/** Placeholder — swap for real auth session data when auth is added. */
const MOCK_USER = { name: 'Alex Morgan', email: 'alex@spike.app' };

interface TopBarProps {
  /** Called when the hamburger is pressed on mobile to open the sidebar. */
  onMobileMenuToggle: () => void;
}

export default function TopBar({ onMobileMenuToggle }: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, projects…"
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-gray-100 border border-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-indigo-300 transition-colors"
          />
        </div>
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-1 ml-auto">
        <NotificationBell unreadCount={3} />

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
                <DropdownItem icon={<User size={14} />} label="Profile" />
                <DropdownItem icon={<Settings size={14} />} label="Settings" />
              </div>

              <div className="border-t border-gray-100 py-1">
                <DropdownItem
                  icon={<LogOut size={14} />}
                  label="Sign out"
                  danger
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/** A single row inside the user dropdown menu. */
function DropdownItem({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className={danger ? 'text-red-500' : 'text-gray-400'}>{icon}</span>
      {label}
    </button>
  );
}
