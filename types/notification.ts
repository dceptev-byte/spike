export type NotificationType = 'task_assigned' | 'comment' | 'due_soon';

export interface Notification {
  id: string;
  type: NotificationType;
  /** Human-readable description shown in the dropdown. */
  text: string;
  /** ISO 8601 timestamp — used to compute relative "X ago" label. */
  timestamp: string;
  read: boolean;
  /** Internal route to navigate to when the notification is clicked. */
  link: string;
}
