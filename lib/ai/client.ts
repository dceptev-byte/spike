/**
 * Spike AI client — placeholder SDK wrapper.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * INTEGRATION GUIDE (when you're ready to go live):
 *
 * 1. Install the Anthropic SDK:
 *      npm install @anthropic-ai/sdk
 *
 * 2. Add your API key to .env.local:
 *      ANTHROPIC_API_KEY=sk-ant-...
 *
 * 3. In each function below, uncomment the Anthropic block and delete the
 *    "throw new Error" stub.
 *
 * 4. Update the Next.js API routes to call these functions instead of the
 *    inline mock logic.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * All functions are server-only (they run in API Route Handlers / Server
 * Actions, never in client components).
 */

// TODO: Uncomment once @anthropic-ai/sdk is installed
// import Anthropic from '@anthropic-ai/sdk';
// import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

import type { AIProjectDraft, AITaskSuggestion } from '@/types';
import {
  PROJECT_GENERATION_PROMPT,
  TASK_SUGGESTION_PROMPT,
  ASSISTANT_SYSTEM_PROMPT,
  buildProjectPrompt,
  buildTasksPrompt,
} from './prompts';

/** The Claude model to use for all Spike AI features. */
const MODEL = 'claude-sonnet-4-6';

/** Maximum tokens for structured-output calls (project/task generation). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MAX_TOKENS_STRUCTURED = 2048;

/** Maximum tokens for conversational replies. */
const MAX_TOKENS_CHAT = 1024;

// ---------------------------------------------------------------------------
// SDK client factory
// ---------------------------------------------------------------------------

/**
 * TODO: Replace stub with real client initialisation.
 *
 * ```ts
 * function getClient(): Anthropic {
 *   const apiKey = process.env.ANTHROPIC_API_KEY;
 *   if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set in .env.local');
 *   return new Anthropic({ apiKey });
 * }
 * ```
 */

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Generate a structured project draft from a natural-language description.
 *
 * TODO: Replace throw with real SDK call:
 * ```ts
 * const client = getClient();
 * const response = await client.messages.create({
 *   model: MODEL,
 *   max_tokens: MAX_TOKENS_STRUCTURED,
 *   system: PROJECT_GENERATION_PROMPT,
 *   messages: [{ role: 'user', content: buildProjectPrompt(prompt) }],
 * });
 * const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
 * return JSON.parse(text) as AIProjectDraft;
 * ```
 */
export async function generateProjectDraft(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prompt: string,
): Promise<AIProjectDraft> {
  // TODO: Connect Anthropic SDK — see instructions at top of file
  void PROJECT_GENERATION_PROMPT; // referenced so tree-shaking keeps the import
  void buildProjectPrompt;
  throw new Error(
    'generateProjectDraft: Anthropic SDK not connected. ' +
      'See lib/ai/client.ts for integration instructions.',
  );
}

/**
 * Generate an array of suggested tasks from a project description.
 *
 * TODO: Replace throw with real SDK call:
 * ```ts
 * const client = getClient();
 * const response = await client.messages.create({
 *   model: MODEL,
 *   max_tokens: MAX_TOKENS_STRUCTURED,
 *   system: TASK_SUGGESTION_PROMPT,
 *   messages: [{ role: 'user', content: buildTasksPrompt(projectDescription) }],
 * });
 * const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
 * return JSON.parse(text) as AITaskSuggestion[];
 * ```
 */
export async function generateTaskSuggestions(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  projectDescription: string,
): Promise<AITaskSuggestion[]> {
  // TODO: Connect Anthropic SDK — see instructions at top of file
  void TASK_SUGGESTION_PROMPT;
  void buildTasksPrompt;
  throw new Error(
    'generateTaskSuggestions: Anthropic SDK not connected. ' +
      'See lib/ai/client.ts for integration instructions.',
  );
}

/**
 * Send a conversational message and receive an assistant reply.
 *
 * TODO: Replace throw with real SDK call:
 * ```ts
 * const client = getClient();
 * const response = await client.messages.create({
 *   model: MODEL,
 *   max_tokens: MAX_TOKENS_CHAT,
 *   system: ASSISTANT_SYSTEM_PROMPT,
 *   messages: messages as MessageParam[],
 * });
 * const text = response.content[0].type === 'text' ? response.content[0].text : '';
 * return { role: 'assistant', content: text };
 * ```
 */
export async function sendChatMessage(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  messages: ChatMessage[],
): Promise<ChatMessage> {
  // TODO: Connect Anthropic SDK — see instructions at top of file
  void ASSISTANT_SYSTEM_PROMPT;
  void MODEL;
  void MAX_TOKENS_CHAT;
  throw new Error(
    'sendChatMessage: Anthropic SDK not connected. ' +
      'See lib/ai/client.ts for integration instructions.',
  );
}
