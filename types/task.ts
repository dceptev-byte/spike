/**
 * Task-related TypeScript types.
 */

/** The column / stage a task currently lives in. */
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';

/** Importance / urgency level for a task. */
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

/** A single comment left on a task by a user. */
export interface Comment {
  /** Unique identifier (UUID). */
  id: string;

  /** The task this comment belongs to. */
  taskId: string;

  /** ID of the user who authored the comment. */
  authorId: string;

  /** Markdown-supported comment body. */
  body: string;

  /** ISO 8601 creation timestamp. */
  createdAt: string;

  /** ISO 8601 last-edited timestamp (undefined if never edited). */
  updatedAt?: string;
}

/** A bite-sized checklist item nested inside a Task. */
export interface Subtask {
  /** Unique identifier (UUID). */
  id: string;

  /** Short description of the work to be done. */
  title: string;

  /** Whether this subtask has been completed. */
  completed: boolean;
}

/** A unit of work tracked on the Spike board. */
export interface Task {
  /** Unique identifier (UUID). */
  id: string;

  /** ID of the project this task belongs to. */
  projectId: string;

  /** Short summary shown on the board card. */
  title: string;

  /** Optional markdown-supported detailed description. */
  description?: string;

  /** Current board column. */
  status: TaskStatus;

  /** Importance level. */
  priority: Priority;

  /** ID of the user assigned to this task (undefined if unassigned). */
  assigneeId?: string;

  /** Optional due date as an ISO 8601 date string (YYYY-MM-DD). */
  dueDate?: string;

  /** Ordered list of checklist items. */
  subtasks: Subtask[];

  /** All comments on this task, ordered oldest-first. */
  comments: Comment[];

  /** Free-form labels / tags (e.g. "bug", "feature"). */
  labels: string[];

  /** Sort order within its column (lower = higher on the board). */
  order: number;

  /** ISO 8601 creation timestamp. */
  createdAt: string;

  /** ISO 8601 last-updated timestamp. */
  updatedAt: string;
}
