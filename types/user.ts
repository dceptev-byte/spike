/**
 * User-related TypeScript types.
 */

/** Permission tier for a user within the application. */
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

/** A Spike user account. */
export interface User {
  /** Unique identifier (UUID). */
  id: string;

  /** Display name shown across the UI. */
  name: string;

  /** Unique email address used for login and notifications. */
  email: string;

  /** URL to the user's avatar image (undefined if using default). */
  avatarUrl?: string;

  /** Platform-level role governing what the user can do. */
  role: UserRole;

  /** ISO 8601 timestamp of when the account was created. */
  createdAt: string;
}
