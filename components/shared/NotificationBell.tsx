'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  ClipboardList,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';
import type { Notification, NotificationType } from '@/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Type → icon / colour mapping
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; bg: string }
> = {
  task_assigned: {
    icon: <ClipboardList size={14} className="text-indigo-500" />,
    bg: 'bg-indigo-50',
  },
  comment: {
    icon: <MessageCircle size={14} className="text-emerald-500" />,
    bg: 'bg-emerald-50',
  },
  due_soon: {
    icon: <Clock size={14} className="text-amber-500" />,
    bg: 'bg-amber-50',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click or Escape — only wire up listeners while open
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label={
          unreadCount > 0
            ? `Notifications — ${unreadCount} unread`
            : 'Notifications'
        }
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell size={18} strokeWidth={1.75} />

        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-[3px] leading-none"
            aria-hidden="true"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <CheckCheck size={13} />
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Bell size={18} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                No notifications
              </p>
              <p className="text-xs text-gray-400 mt-1">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
              {notifications.map((n) => {
                const { icon, bg } = TYPE_CONFIG[n.type];
                return (
                  <li key={n.id}>
                    <Link
                      href={n.link}
                      onClick={() => {
                        markRead(n.id);
                        setIsOpen(false);
                      }}
                      className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {/* Unread dot — always reserve the space so text stays aligned */}
                      <div className="flex-shrink-0 mt-2">
                        <div
                          className={`w-2 h-2 rounded-full transition-colors ${
                            n.read ? 'bg-transparent' : 'bg-blue-500'
                          }`}
                        />
                      </div>

                      {/* Type icon */}
                      <div
                        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${bg}`}
                      >
                        {icon}
                      </div>

                      {/* Text + timestamp */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs leading-snug ${
                            n.read
                              ? 'text-gray-500'
                              : 'text-gray-800 font-medium'
                          }`}
                        >
                          {n.text}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {timeAgo(n.timestamp)}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5">
            <Link
              href="/tasks"
              onClick={() => setIsOpen(false)}
              className="block w-full text-xs text-center font-medium text-indigo-600 hover:text-indigo-700 transition-colors py-0.5"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
