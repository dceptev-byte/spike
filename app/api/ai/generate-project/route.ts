/**
 * POST /api/ai/generate-project
 *
 * Accepts a natural-language project description and returns an AIProjectDraft.
 *
 * Request body:  { prompt: string }
 * Response body: AIProjectDraft (JSON)
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TODO: Replace the mock logic with a real Anthropic SDK call:
 *
 *   import { generateProjectDraft } from '@/lib/ai/client';
 *
 *   const draft = await generateProjectDraft(prompt);
 *   return NextResponse.json(draft);
 *
 * See lib/ai/client.ts for the full integration guide.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AIProjectDraft } from '@/types';

// ---------------------------------------------------------------------------
// Mock generation (mirrors the logic in components/projects/NewProjectModal.tsx)
// Replace this entire function with `generateProjectDraft` from lib/ai/client.ts
// once the Anthropic SDK is connected.
// ---------------------------------------------------------------------------

function mockGenerate(prompt: string): AIProjectDraft {
  const lower = prompt.toLowerCase();

  if (lower.match(/mobile|ios|android|react native|flutter/)) {
    return {
      name: 'Mobile App',
      description:
        'A cross-platform mobile application with native UX patterns, offline support, and real-time sync.',
      status: 'planning',
      suggestedTasks: [
        'Set up React Native project & CI',
        'Design core screens in Figma',
        'Implement authentication flow',
        'Build home feed & navigation',
        'Integrate backend APIs',
        'Conduct user testing & iteration',
        'Submit to App Store & Play Store',
      ],
      rationale:
        'Structured from discovery through delivery based on typical mobile app lifecycle.',
    };
  }

  if (lower.match(/website|web app|landing page|redesign|frontend/)) {
    return {
      name: 'Website Project',
      description:
        'A modern, responsive web presence optimised for performance, SEO, and conversion.',
      status: 'planning',
      suggestedTasks: [
        'Audit existing site & analytics',
        'Create component design system',
        'Build homepage & hero section',
        'Develop inner pages & blog',
        'SEO & performance optimisation',
        'Accessibility (WCAG 2.1 AA) review',
        'QA, launch, and monitor',
      ],
      rationale:
        'Covers the full web project lifecycle from audit to post-launch monitoring.',
    };
  }

  if (lower.match(/market|campaign|launch|brand|social|email/)) {
    return {
      name: 'Marketing Campaign',
      description:
        'A coordinated multi-channel campaign to grow brand awareness and generate qualified leads.',
      status: 'planning',
      suggestedTasks: [
        'Define target audience & personas',
        'Develop messaging framework',
        'Build content calendar',
        'Design visual assets & creatives',
        'Set up email automation sequences',
        'Launch paid media campaigns',
        'Track KPIs and report results',
      ],
      rationale:
        'Multi-channel approach covering content, design, email, paid media, and analytics.',
    };
  }

  if (lower.match(/api|backend|server|integration|webhook|database/)) {
    return {
      name: 'Backend & API',
      description:
        'Scalable server-side services with robust third-party integrations and full observability.',
      status: 'planning',
      suggestedTasks: [
        'Define API contracts (OpenAPI spec)',
        'Set up infrastructure & CI/CD',
        'Implement core endpoints',
        'Add auth, rate limiting & logging',
        'Integrate third-party services',
        'Write API documentation',
        'Load test & deploy to production',
      ],
      rationale:
        'Follows API-first development: contract → implementation → integration → documentation.',
    };
  }

  if (lower.match(/design|ui|ux|figma|component|design system/)) {
    return {
      name: 'Design System',
      description:
        'A cohesive visual language and component library that ensures product consistency at scale.',
      status: 'planning',
      suggestedTasks: [
        'Audit existing UI components',
        'Define token system (colour, type, spacing)',
        'Build component library in Figma',
        'Implement components in code',
        'Write usage guidelines & docs',
        'Set up Storybook',
        'Team review & adoption rollout',
      ],
      rationale:
        'Covers audit, token design, implementation, documentation, and team adoption.',
    };
  }

  // Generic fallback — derive a name from meaningful words in the prompt
  const stopwords = new Set([
    'a', 'an', 'the', 'and', 'or', 'for', 'to', 'of', 'in',
    'i', 'want', 'need', 'build', 'create', 'make', 'help', 'me', 'us',
  ]);
  const words = prompt
    .trim()
    .split(/\s+/)
    .filter((w) => !stopwords.has(w.toLowerCase()))
    .slice(0, 4)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  return {
    name: words.join(' ') || 'New Project',
    description: `A focused initiative to achieve: "${prompt.slice(0, 120)}${
      prompt.length > 120 ? '…' : ''
    }". Broken into clear milestones for smooth execution.`,
    status: 'planning',
    suggestedTasks: [
      'Define scope, goals, and success criteria',
      'Research and gather requirements',
      'Create initial plan and timeline',
      'Execute and iterate on deliverables',
      'Review, test, and refine',
      'Deliver and document outcomes',
    ],
    rationale:
      'Generic milestone structure — edit to match your specific workflow.',
  };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  let prompt: string;

  try {
    const body = await req.json();
    prompt = typeof body?.prompt === 'string' ? body.prompt : '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!prompt.trim()) {
    return NextResponse.json(
      { error: '`prompt` is required and must be a non-empty string' },
      { status: 400 },
    );
  }

  // Simulate network latency (remove once Anthropic SDK is wired up)
  await new Promise((r) => setTimeout(r, 1200));

  const draft = mockGenerate(prompt);
  return NextResponse.json(draft);
}
