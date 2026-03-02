'use client';

import { Bell } from 'lucide-react';

interface NotificationBellProps {
  /** Number of unread notifications. Badge hidden when 0. */
  unreadCount?: number;
  onClick?: () => void;
}

export default function NotificationBell({
  unreadCount = 0,
  onClick,
}: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      aria-label={
        unreadCount > 0
          ? `Notifications — ${unreadCount} unread`
          : 'Notifications'
      }
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
  );
}
