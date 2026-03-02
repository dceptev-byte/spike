/**
 * AI-generated content types used when Spike creates drafts or suggestions
 * via the Claude API.
 */

import type { Priority, TaskStatus } from './task';
import type { ProjectStatus } from './project';

/**
 * An AI-generated draft for a new project, returned before the user
 * confirms and persists it to the database.
 */
export interface AIProjectDraft {
  /** Suggested project name. */
  name: string;

  /** Suggested project description in markdown. */
  description: string;

  /** Suggested initial status for the project. */
  status: ProjectStatus;

  /** Ordered list of AI-suggested task titles to seed the backlog. */
  suggestedTasks: string[];

  /** Brief rationale explaining why the AI made these suggestions. */
  rationale?: string;
}

/**
 * A single AI-suggested task, returned as part of an array when the
 * user asks Spike to break down a project goal or feature.
 */
export interface AITaskSuggestion {
  /** Suggested task title. */
  title: string;

  /** Suggested detailed description in markdown. */
  description: string;

  /** Recommended column to place the task in. */
  status: TaskStatus;

  /** Recommended priority level. */
  priority: Priority;

  /** Ordered list of subtask titles the AI recommends for this task. */
  subtasks: string[];

  /** Estimated effort in story points (undefined if AI cannot estimate). */
  estimatedPoints?: number;
}
