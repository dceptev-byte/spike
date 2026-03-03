/**
 * POST /api/ai/chat
 *
 * Conversational assistant endpoint.
 *
 * Request body:
 *   {
 *     messages: Array<{ role: 'user' | 'assistant'; content: string }>
 *   }
 *
 * Response body:
 *   { role: 'assistant'; content: string }
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TODO: Replace the mock logic with a real Anthropic SDK call:
 *
 *   import { sendChatMessage } from '@/lib/ai/client';
 *
 *   const reply = await sendChatMessage(messages);
 *   return NextResponse.json(reply);
 *
 * See lib/ai/client.ts for the full integration guide.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ---------------------------------------------------------------------------
// Mock reply logic
// Replace this entire function once the Anthropic SDK is connected.
// ---------------------------------------------------------------------------

interface MatchRule {
  patterns: RegExp[];
  replies: string[];
}

const RULES: MatchRule[] = [
  {
    patterns: [/new project|create.{0,10}project|start.{0,10}project|add.{0,10}project/],
    replies: [
      'To create a new project, click **New Project** on the Projects page. Switch to the **AI Generate** tab, describe your goal in plain English, and Spike AI will generate a structured project plan with suggested backlog tasks. You can edit everything before saving.',
    ],
  },
  {
    patterns: [/new task|add.{0,10}task|create.{0,10}task/],
    replies: [
      'You can add a task by clicking the **+** button at the top of any Kanban column. The task opens immediately in the detail panel — set the title, priority, assignee, due date, and subtasks from there.',
    ],
  },
  {
    patterns: [/drag|move.{0,15}task|kanban|board|column/],
    replies: [
      'The Kanban board supports full drag-and-drop:\n- **Between columns** — drag a card left or right to update its status instantly.\n- **Within a column** — drag up or down to reorder.\n\nJust grab any card and drop it where you need it. The board auto-saves.',
    ],
  },
  {
    patterns: [/priority|urgent|high.{0,10}priority/],
    replies: [
      'Spike uses four priority levels:\n- 🔴 **Urgent** — blocks other work, needs immediate attention\n- 🟠 **High** — current sprint\n- 🔵 **Medium** — next sprint\n- ⚪ **Low** — nice to have\n\nSet priority in the task detail panel or change it inline from the board.',
    ],
  },
  {
    patterns: [/subtask|checklist|sub-task/],
    replies: [
      'Open any task card to access subtasks. Click **Add** in the Subtasks section, type a title, and press Enter. Check subtasks off as you complete them — the card shows a progress counter like `2/4`.',
    ],
  },
  {
    patterns: [/comment|activity|discuss/],
    replies: [
      'Comments live in the task detail panel under the **Comments** section. Type your message and press **Comment** (or ⌘↵). Comments are ordered oldest-first so the conversation is easy to follow.',
    ],
  },
  {
    patterns: [/assign|assignee|who.{0,10}(is|on)/],
    replies: [
      'You can assign a task to any team member from the task detail panel — use the **Assignee** dropdown. The assignee\'s avatar appears on the board card so it\'s always visible at a glance.',
    ],
  },
  {
    patterns: [/due date|deadline|when.{0,10}due/],
    replies: [
      'Set a due date in the task detail panel using the **Due** date picker. Cards with overdue dates show the date in red on the board so nothing slips through the cracks.',
    ],
  },
  {
    patterns: [/what.{0,10}(can|do) you|help|feature|how (does|do)/],
    replies: [
      'Here\'s what Spike AI can help with:\n\n- **Generate projects** — describe a goal, get a full project plan\n- **Break down features** — get AI-suggested tasks for any description\n- **Answer questions** — ask about any Spike feature\n- **Project management tips** — prioritisation, estimation, sprint planning\n\nJust ask! What would you like to do first?',
    ],
  },
  {
    patterns: [/sprint|planning|velocity|story point|estimate/],
    replies: [
      'For sprint planning in Spike:\n1. Move tasks from **Backlog** → **In Progress** to kick off a sprint.\n2. Use **High** / **Urgent** priority to surface the most important work.\n3. Story points (if set) appear in the task detail panel — sum them to size your sprint.\n4. Use the **Review** column as a staging area before marking tasks **Done**.',
    ],
  },
  {
    patterns: [/project.{0,10}status|overview|progress|how.{0,5}going/],
    replies: [
      'You can see project progress at a glance on the **Projects** page — each card shows a completion bar and task counts.\n\nFor detailed status, open a project\'s Kanban board. The column headers show how many tasks are in each stage.',
    ],
  },
  {
    patterns: [/thank|thanks|great|awesome|nice|perfect|good/],
    replies: [
      'You\'re welcome! Let me know if there\'s anything else I can help with.',
      'Happy to help! Anything else you\'d like to know?',
      'Glad that helped! Feel free to ask anytime.',
    ],
  },
  {
    patterns: [/hello|hi|hey|good (morning|afternoon|evening)/],
    replies: [
      'Hey there! 👋 I\'m Spike AI. I can help you manage projects, break down tasks, or answer any questions about Spike. What are you working on today?',
    ],
  },
];

function getMockReply(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) return 'How can I help you today?';

  const text = lastUser.content.toLowerCase();

  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(text))) {
      // Pick a random reply if there are multiple options
      return rule.replies[Math.floor(Math.random() * rule.replies.length)];
    }
  }

  // Context-aware fallback: reference the user's message
  const snippet =
    lastUser.content.length > 60
      ? lastUser.content.slice(0, 60) + '…'
      : lastUser.content;

  return (
    `That's a great question about "${snippet}". ` +
    `Here's what I'd suggest:\n\n` +
    `- Open the relevant project on the **Projects** page\n` +
    `- Use the Kanban board to visualise and update task status\n` +
    `- Click any card to edit details, add subtasks, or leave comments\n\n` +
    `Need more specific help? Describe what you're trying to accomplish and I'll walk you through it.`
  );
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  let messages: ChatMessage[];

  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (messages.length === 0) {
    return NextResponse.json(
      { error: '`messages` must be a non-empty array' },
      { status: 400 },
    );
  }

  // Simulate thinking time (remove once Anthropic SDK is wired up)
  const delay = 600 + Math.random() * 600; // 600–1200 ms
  await new Promise((r) => setTimeout(r, delay));

  const content = getMockReply(messages);
  return NextResponse.json({ role: 'assistant', content } satisfies ChatMessage);
}
