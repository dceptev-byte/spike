/**
 * POST /api/ai/generate-tasks
 *
 * Accepts a project description and returns an array of AITaskSuggestion.
 *
 * Request body:  { project_description: string }
 * Response body: AITaskSuggestion[] (JSON)
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TODO: Replace the mock logic with a real Anthropic SDK call:
 *
 *   import { generateTaskSuggestions } from '@/lib/ai/client';
 *
 *   const tasks = await generateTaskSuggestions(project_description);
 *   return NextResponse.json(tasks);
 *
 * See lib/ai/client.ts for the full integration guide.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AITaskSuggestion } from '@/types';

// ---------------------------------------------------------------------------
// Mock generation
// Replace this entire function with `generateTaskSuggestions` from
// lib/ai/client.ts once the Anthropic SDK is connected.
// ---------------------------------------------------------------------------

function mockTasksFor(description: string): AITaskSuggestion[] {
  const lower = description.toLowerCase();

  // Mobile / app
  if (lower.match(/mobile|ios|android|react native|flutter|app/)) {
    return [
      {
        title: 'Set up project repository and CI pipeline',
        description:
          'Initialise the React Native project, configure ESLint/Prettier, and set up GitHub Actions for automated tests and builds on every PR.',
        status: 'backlog',
        priority: 'high',
        subtasks: ['Create GitHub repo', 'Configure ESLint & Prettier', 'Add GitHub Actions workflow'],
        estimatedPoints: 3,
      },
      {
        title: 'Design core screens in Figma',
        description:
          'Produce high-fidelity mockups for: onboarding, home feed, detail view, settings, and navigation patterns. Obtain stakeholder sign-off before implementation.',
        status: 'backlog',
        priority: 'high',
        subtasks: ['Wireframe all screens', 'Design system tokens', 'High-fidelity mockups', 'Stakeholder review'],
        estimatedPoints: 5,
      },
      {
        title: 'Implement user authentication',
        description:
          'Support email/password sign-up plus OAuth via Google and Apple. Persist session tokens securely in the device keychain.',
        status: 'backlog',
        priority: 'urgent',
        subtasks: ['Email/password flow', 'Google OAuth', 'Apple Sign-In', 'Session persistence'],
        estimatedPoints: 5,
      },
      {
        title: 'Build home feed and navigation',
        description:
          'Implement the main tab navigator and render a paginated, pull-to-refresh feed. Add skeleton loaders for perceived performance.',
        status: 'backlog',
        priority: 'high',
        subtasks: ['Tab navigator', 'Feed component', 'Pagination', 'Skeleton loaders'],
        estimatedPoints: 5,
      },
      {
        title: 'Integrate push notifications',
        description:
          'Register APNs (iOS) and FCM (Android) tokens; surface in-app notification centre; handle background and foreground delivery.',
        status: 'backlog',
        priority: 'medium',
        subtasks: ['APNs setup', 'FCM setup', 'Notification centre UI', 'Background handling'],
        estimatedPoints: 5,
      },
      {
        title: 'Submit to App Store and Google Play',
        description:
          'Prepare app metadata, screenshots, and privacy policy. Complete Apple review checklist and Google Play pre-launch report. Target release to 100% of users.',
        status: 'backlog',
        priority: 'medium',
        subtasks: ['App Store assets', 'Google Play listing', 'Privacy policy', 'Release checklist'],
        estimatedPoints: 3,
      },
    ];
  }

  // Web / frontend
  if (lower.match(/website|web app|landing|redesign|frontend|next|react/)) {
    return [
      {
        title: 'Audit current site and define success metrics',
        description:
          'Run Lighthouse, analyse GA4 funnels, and document pain points. Define measurable targets for performance (LCP < 2 s), conversion rate, and accessibility score.',
        status: 'backlog',
        priority: 'high',
        subtasks: ['Lighthouse audit', 'Analytics funnel review', 'Document findings', 'Set KPI targets'],
        estimatedPoints: 2,
      },
      {
        title: 'Create design system and component library',
        description:
          'Define colour tokens, typography scale, spacing, and motion. Build core components (Button, Input, Card, Modal) in Storybook with all variants documented.',
        status: 'backlog',
        priority: 'high',
        subtasks: ['Token definitions', 'Core component set', 'Storybook stories', 'Dark mode support'],
        estimatedPoints: 8,
      },
      {
        title: 'Build homepage and hero section',
        description:
          'Implement the new homepage based on approved Figma designs. Ensure hero loads within LCP budget; use next/image for all assets.',
        status: 'backlog',
        priority: 'high',
        subtasks: ['Hero section', 'Feature section', 'Social proof section', 'CTA and footer'],
        estimatedPoints: 5,
      },
      {
        title: 'Implement SEO and performance optimisation',
        description:
          'Add dynamic meta tags (Open Graph, Twitter Card), sitemap.xml, robots.txt. Enable ISR for content pages. Target Lighthouse score ≥ 95.',
        status: 'backlog',
        priority: 'medium',
        subtasks: ['Meta tags', 'Sitemap + robots.txt', 'ISR setup', 'Image optimisation'],
        estimatedPoints: 3,
      },
      {
        title: 'Conduct accessibility audit and remediation',
        description:
          'Run axe-core and manual keyboard/screen-reader testing against WCAG 2.1 AA. Fix all critical and serious issues before launch.',
        status: 'backlog',
        priority: 'medium',
        subtasks: ['axe-core scan', 'Keyboard navigation', 'Screen-reader testing', 'Fix critical issues'],
        estimatedPoints: 3,
      },
    ];
  }

  // API / backend
  if (lower.match(/api|backend|server|integration|microservice|database/)) {
    return [
      {
        title: 'Define API contracts with OpenAPI spec',
        description:
          'Write the full OpenAPI 3.1 specification before any implementation. Use this as the source of truth for client SDK generation and contract testing.',
        status: 'backlog',
        priority: 'urgent',
        subtasks: ['Endpoint inventory', 'Request/response schemas', 'Error codes', 'OpenAPI YAML'],
        estimatedPoints: 3,
      },
      {
        title: 'Set up infrastructure and CI/CD pipeline',
        description:
          'Provision cloud resources (compute, managed DB, secrets manager) via IaC. Configure GitHub Actions for lint → test → build → deploy on each merge to main.',
        status: 'backlog',
        priority: 'high',
        subtasks: ['Cloud provisioning', 'IaC modules', 'CI/CD workflow', 'Staging environment'],
        estimatedPoints: 5,
      },
      {
        title: 'Implement core API endpoints',
        description:
          'Build CRUD endpoints per the OpenAPI spec. Enforce input validation with Zod. Write unit and integration tests targeting 80%+ coverage.',
        status: 'backlog',
        priority: 'high',
        subtasks: ['Route handlers', 'Zod validation', 'Unit tests', 'Integration tests'],
        estimatedPoints: 8,
      },
      {
        title: 'Add authentication, rate limiting, and logging',
        description:
          'Implement JWT-based auth with refresh tokens. Add per-IP and per-user rate limiting. Structured logs with correlation IDs shipped to your observability platform.',
        status: 'backlog',
        priority: 'high',
        subtasks: ['JWT auth middleware', 'Refresh token flow', 'Rate limiting', 'Structured logging'],
        estimatedPoints: 5,
      },
      {
        title: 'Write API documentation and developer guide',
        description:
          'Generate interactive docs from the OpenAPI spec (Redoc or Scalar). Add a quick-start guide, authentication walkthrough, and code examples in 3 languages.',
        status: 'backlog',
        priority: 'medium',
        subtasks: ['Interactive docs setup', 'Quick-start guide', 'Auth walkthrough', 'Code examples'],
        estimatedPoints: 3,
      },
    ];
  }

  // Generic fallback
  return [
    {
      title: 'Define scope, goals, and success criteria',
      description:
        'Align the team on what done looks like. Document SMART goals, out-of-scope items, dependencies, and how success will be measured.',
      status: 'backlog',
      priority: 'urgent',
      subtasks: ['Stakeholder interviews', 'Write scope document', 'Define success metrics', 'Get sign-off'],
      estimatedPoints: 2,
    },
    {
      title: 'Research and gather requirements',
      description:
        'Collect user stories, technical constraints, and compliance requirements. Prioritise using MoSCoW (Must/Should/Could/Won\'t).',
      status: 'backlog',
      priority: 'high',
      subtasks: ['User research', 'Technical spike', 'MoSCoW prioritisation', 'Requirements doc'],
      estimatedPoints: 3,
    },
    {
      title: 'Create project plan and assign milestones',
      description:
        'Build a milestone-based roadmap with time estimates and resource allocation. Identify the critical path and potential blockers early.',
      status: 'backlog',
      priority: 'high',
      subtasks: ['Milestone breakdown', 'Resource mapping', 'Risk register', 'Share with team'],
      estimatedPoints: 2,
    },
    {
      title: 'Execute first delivery milestone',
      description:
        'Ship the first meaningful working increment to gather real feedback. Prefer an end-to-end vertical slice over a horizontal layer.',
      status: 'backlog',
      priority: 'medium',
      subtasks: ['Implement core feature', 'Internal review', 'Stakeholder demo', 'Collect feedback'],
      estimatedPoints: 8,
    },
    {
      title: 'Review, test, and refine deliverables',
      description:
        'Run QA, user acceptance testing, and performance benchmarks. Address all blocking issues before the final handover.',
      status: 'backlog',
      priority: 'medium',
      subtasks: ['QA pass', 'UAT with stakeholders', 'Performance testing', 'Bug fixes'],
      estimatedPoints: 3,
    },
    {
      title: 'Deliver, document, and hand off',
      description:
        'Prepare runbooks, technical documentation, and a hand-off package. Conduct a retrospective to capture lessons learned.',
      status: 'backlog',
      priority: 'low',
      subtasks: ['Write runbooks', 'Technical docs', 'Hand-off meeting', 'Retrospective'],
      estimatedPoints: 2,
    },
  ];
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  let projectDescription: string;

  try {
    const body = await req.json();
    projectDescription =
      typeof body?.project_description === 'string'
        ? body.project_description
        : '';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!projectDescription.trim()) {
    return NextResponse.json(
      {
        error:
          '`project_description` is required and must be a non-empty string',
      },
      { status: 400 },
    );
  }

  // Simulate network latency (remove once Anthropic SDK is wired up)
  await new Promise((r) => setTimeout(r, 1000));

  const tasks = mockTasksFor(projectDescription);
  return NextResponse.json(tasks);
}
