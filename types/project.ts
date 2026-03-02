/**
 * Project-related TypeScript types.
 */

/** The lifecycle stages a project can be in. */
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

/** A Spike project — the top-level container for tasks and members. */
export interface Project {
  /** Unique identifier (UUID). */
  id: string;

  /** Display name of the project. */
  name: string;

  /** Optional long-form description. */
  description?: string;

  /** Current lifecycle status. */
  status: ProjectStatus;

  /** ID of the user who owns / created the project. */
  ownerId: string;

  /** IDs of users who are members of this project. */
  memberIds: string[];

  /** ISO 8601 creation timestamp. */
  createdAt: string;

  /** ISO 8601 last-updated timestamp. */
  updatedAt: string;
}
