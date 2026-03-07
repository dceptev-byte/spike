/**
 * Mock data for Spike — used across the dashboard until the API is wired up.
 *
 * Today's reference date used when authoring this data: 2026-03-03 (Tuesday).
 * Week starts: 2026-03-02 (Monday).
 */

import type { User, Project, Task, Notification } from '@/types';

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const CURRENT_USER: User = {
  id: 'user-1',
  name: 'Alex Morgan',
  email: 'alex@spike.app',
  role: 'owner',
  createdAt: '2026-02-28T10:00:00Z', // recent sign-up → new user
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'user-2',
    name: 'Jordan Lee',
    email: 'jordan@spike.app',
    role: 'admin',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-3',
    name: 'Sam Chen',
    email: 'sam@spike.app',
    role: 'member',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'user-4',
    name: 'Riley Park',
    email: 'riley@spike.app',
    role: 'member',
    createdAt: '2026-02-01T10:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the marketing site with new brand guidelines.',
    status: 'active',
    ownerId: 'user-1',
    memberIds: ['user-1', 'user-2', 'user-3'],
    dueDate: '2026-03-28',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-02T14:30:00Z',
  },
  {
    id: 'proj-2',
    name: 'Mobile App MVP',
    description: 'First public release of the iOS and Android application.',
    status: 'active',
    ownerId: 'user-2',
    memberIds: ['user-1', 'user-2', 'user-4'],
    dueDate: '2026-04-15',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'proj-3',
    name: 'Marketing Campaign',
    description: 'Q2 product launch campaign across email, social, and paid channels.',
    status: 'planning',
    ownerId: 'user-1',
    memberIds: ['user-1', 'user-3'],
    dueDate: '2026-04-01',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-28T16:00:00Z',
  },
  {
    id: 'proj-4',
    name: 'API Integration',
    description: 'Integrate third-party payment and analytics APIs.',
    status: 'on_hold',
    ownerId: 'user-3',
    memberIds: ['user-1', 'user-2', 'user-3', 'user-4'],
    dueDate: '2026-03-15',
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-02-20T11:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export const MOCK_TASKS: Task[] = [
  // ── Website Redesign ──────────────────────────────────────────────────────

  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Design new homepage hero section',
    description: 'Create Figma mockups for the new hero with animated gradient.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user-1',         // Alex (current user)
    dueDate: '2026-03-03',        // due TODAY
    subtasks: [],
    comments: [],
    labels: ['design'],
    order: 1,
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Fix mobile navigation menu',
    description: 'Hamburger menu fails to close on iOS Safari.',
    status: 'backlog',
    priority: 'urgent',
    assigneeId: 'user-1',         // Alex (current user)
    dueDate: '2026-02-28',        // OVERDUE
    subtasks: [],
    comments: [],
    labels: ['bug'],
    order: 2,
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    title: 'Write copy for About page',
    status: 'backlog',
    priority: 'medium',
    assigneeId: 'user-1',         // Alex (current user)
    dueDate: '2026-03-05',
    subtasks: [],
    comments: [],
    labels: ['content'],
    order: 3,
    createdAt: '2026-02-22T10:00:00Z',
    updatedAt: '2026-02-22T10:00:00Z',
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    title: 'Update color scheme to new brand tokens',
    status: 'done',
    priority: 'low',
    assigneeId: 'user-1',         // Alex — completed this week
    dueDate: '2026-03-02',
    subtasks: [],
    comments: [],
    labels: ['design'],
    order: 4,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-02T11:00:00Z', // updated this week → counts as done this week
  },
  {
    id: 'task-5',
    projectId: 'proj-1',
    title: 'Set up analytics tracking',
    status: 'review',
    priority: 'medium',
    assigneeId: 'user-2',         // Jordan
    dueDate: '2026-03-06',
    subtasks: [],
    comments: [],
    labels: ['analytics'],
    order: 5,
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-03-01T15:00:00Z',
  },
  {
    id: 'task-6',
    projectId: 'proj-1',
    title: 'Accessibility audit',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-3',         // Sam
    subtasks: [],
    comments: [],
    labels: ['a11y'],
    order: 6,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-25T14:00:00Z',
  },

  // ── Mobile App MVP ────────────────────────────────────────────────────────

  {
    id: 'task-7',
    projectId: 'proj-2',
    title: 'Implement user authentication',
    description: 'Email/password + OAuth via Google and Apple.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user-1',         // Alex — due TODAY
    dueDate: '2026-03-03',        // due TODAY
    subtasks: [],
    comments: [],
    labels: ['auth'],
    order: 1,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'task-8',
    projectId: 'proj-2',
    title: 'Set up push notifications',
    status: 'backlog',
    priority: 'high',
    assigneeId: 'user-1',         // Alex — OVERDUE
    dueDate: '2026-02-25',        // OVERDUE
    subtasks: [],
    comments: [],
    labels: ['notifications'],
    order: 2,
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-02-12T10:00:00Z',
  },
  {
    id: 'task-9',
    projectId: 'proj-2',
    title: 'Create onboarding flow screens',
    status: 'backlog',
    priority: 'medium',
    assigneeId: 'user-1',         // Alex
    dueDate: '2026-03-07',
    subtasks: [],
    comments: [],
    labels: ['design'],
    order: 3,
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'task-10',
    projectId: 'proj-2',
    title: 'Write API documentation',
    status: 'done',
    priority: 'low',
    assigneeId: 'user-1',         // Alex — completed this week
    subtasks: [],
    comments: [],
    labels: ['docs'],
    order: 4,
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-03-02T16:00:00Z', // done this week
  },
  {
    id: 'task-11',
    projectId: 'proj-2',
    title: 'Design app icon and splash screen',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user-4',         // Riley
    subtasks: [],
    comments: [],
    labels: ['design'],
    order: 5,
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'task-12',
    projectId: 'proj-2',
    title: 'Beta testing with 10 users',
    status: 'backlog',
    priority: 'high',
    assigneeId: 'user-2',         // Jordan
    dueDate: '2026-03-20',
    subtasks: [],
    comments: [],
    labels: ['qa'],
    order: 6,
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z',
  },

  // ── Marketing Campaign ────────────────────────────────────────────────────

  {
    id: 'task-13',
    projectId: 'proj-3',
    title: 'Create social media content calendar',
    status: 'backlog',
    priority: 'medium',
    assigneeId: 'user-1',         // Alex
    dueDate: '2026-03-15',
    subtasks: [],
    comments: [],
    labels: ['content'],
    order: 1,
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'task-14',
    projectId: 'proj-3',
    title: 'Design email newsletter template',
    status: 'done',
    priority: 'low',
    assigneeId: 'user-1',         // Alex — completed before this week
    subtasks: [],
    comments: [],
    labels: ['design', 'email'],
    order: 2,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-28T10:00:00Z', // done last week — does NOT count this week
  },
  {
    id: 'task-15',
    projectId: 'proj-3',
    title: 'Identify influencer partnerships',
    status: 'backlog',
    priority: 'medium',
    assigneeId: 'user-3',         // Sam
    dueDate: '2026-03-20',
    subtasks: [],
    comments: [],
    labels: ['partnerships'],
    order: 3,
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z',
  },

  // ── API Integration ───────────────────────────────────────────────────────

  {
    id: 'task-16',
    projectId: 'proj-4',
    title: 'Stripe payment integration',
    status: 'done',
    priority: 'urgent',
    assigneeId: 'user-2',         // Jordan
    subtasks: [],
    comments: [],
    labels: ['payments'],
    order: 1,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'task-17',
    projectId: 'proj-4',
    title: 'Segment analytics events',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-3',         // Sam
    subtasks: [],
    comments: [],
    labels: ['analytics'],
    order: 2,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'task-18',
    projectId: 'proj-4',
    title: 'Webhook error handling',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user-1',         // Alex
    dueDate: '2026-03-15',
    subtasks: [],
    comments: [],
    labels: ['backend'],
    order: 3,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-20T11:00:00Z',
  },
  {
    id: 'task-19',
    projectId: 'proj-4',
    title: 'Rate limiting and retry logic',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user-4',         // Riley
    subtasks: [],
    comments: [],
    labels: ['backend'],
    order: 4,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

/**
 * Mock notifications for Alex Morgan (user-1).
 * 3 unread, 2 read — authored relative to 2026-03-07.
 */
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'task_assigned',
    text: 'Jordan assigned you "Fix mobile navigation menu" in Website Redesign',
    timestamp: '2026-03-07T06:15:00Z',
    read: false,
    link: '/projects/proj-1',
  },
  {
    id: 'notif-2',
    type: 'comment',
    text: 'Sam commented on "Design new homepage hero section"',
    timestamp: '2026-03-07T04:00:00Z',
    read: false,
    link: '/projects/proj-1',
  },
  {
    id: 'notif-3',
    type: 'due_soon',
    text: '"Implement user authentication" is due today',
    timestamp: '2026-03-07T00:01:00Z',
    read: false,
    link: '/tasks',
  },
  {
    id: 'notif-4',
    type: 'task_assigned',
    text: 'Riley assigned you "Create onboarding flow screens" in Mobile App MVP',
    timestamp: '2026-03-06T16:45:00Z',
    read: true,
    link: '/projects/proj-2',
  },
  {
    id: 'notif-5',
    type: 'comment',
    text: 'Jordan left a comment on "Webhook error handling"',
    timestamp: '2026-03-05T10:20:00Z',
    read: true,
    link: '/projects/proj-4',
  },
];

// ---------------------------------------------------------------------------
// Feature flags / user state
// ---------------------------------------------------------------------------

/**
 * Whether to show the onboarding checklist.
 * Toggle to `false` to simulate a returning user.
 */
export const IS_NEW_USER = true;
