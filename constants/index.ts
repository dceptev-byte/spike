/**
 * App-wide constants for Spike.
 */

import type { TaskStatus, Priority, UserRole } from '@/types';

// ---------------------------------------------------------------------------
// Board columns
// ---------------------------------------------------------------------------

/**
 * The default ordered set of board columns.
 * Used to initialise a new project and as the authoritative column order.
 */
export const DEFAULT_COLUMNS: TaskStatus[] = [
  'backlog',
  'in_progress',
  'review',
  'done',
];

/**
 * Human-readable labels and metadata for each board column.
 * Keyed by TaskStatus so components can look up display info cheaply.
 */
export const STATUS_COLUMNS: Record<
  TaskStatus,
  { label: string; description: string }
> = {
  backlog: {
    label: 'Backlog',
    description: 'Tasks that have not been started yet.',
  },
  in_progress: {
    label: 'In Progress',
    description: 'Tasks actively being worked on.',
  },
  review: {
    label: 'Review',
    description: 'Tasks awaiting code review or approval.',
  },
  done: {
    label: 'Done',
    description: 'Completed tasks.',
  },
};

// ---------------------------------------------------------------------------
// Priority levels
// ---------------------------------------------------------------------------

/**
 * Ordered priority levels from lowest to highest urgency.
 * The order reflects visual sorting on the board (urgent tasks rise to top).
 */
export const PRIORITY_LEVELS: Record<
  Priority,
  { label: string; color: string; order: number }
> = {
  low: {
    label: 'Low',
    color: 'gray',
    order: 1,
  },
  medium: {
    label: 'Medium',
    color: 'blue',
    order: 2,
  },
  high: {
    label: 'High',
    color: 'orange',
    order: 3,
  },
  urgent: {
    label: 'Urgent',
    color: 'red',
    order: 4,
  },
};

// ---------------------------------------------------------------------------
// User roles
// ---------------------------------------------------------------------------

/**
 * Metadata for each user role, including display label and a short
 * description of what the role can do.
 */
export const USER_ROLES: Record<
  UserRole,
  { label: string; description: string }
> = {
  owner: {
    label: 'Owner',
    description: 'Full control — can manage billing, members, and delete the project.',
  },
  admin: {
    label: 'Admin',
    description: 'Can manage members and all project settings.',
  },
  member: {
    label: 'Member',
    description: 'Can create, edit, and move tasks.',
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access to the project board.',
  },
};
