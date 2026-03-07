# Spike — Claude Code Context

## What is Spike?

An internal AI-native project management tool for 10-15 users. Inspired by Wrike but lighter and AI-first. Built for Project Managers, Team Leads, Customer Success, and Team Members.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- @dnd-kit (drag and drop)
- shadcn/ui (components)
- Lucide React (icons)
- Vercel (deployment)
- Supabase (Phase 2 - not yet integrated)
- Anthropic Claude API (Phase 3 - not yet integrated)

## Project Structure

- `app/(dashboard)/` — all main pages
- `components/shared/` — Sidebar, TopBar, UserAvatar, NotificationBell
- `components/board/` — KanbanBoard, KanbanColumn, TaskCard, TaskDetailPanel
- `components/projects/` — ProjectCard, ProjectList, NewProjectModal
- `components/ai/` — AIChatWidget, AIProjectPrompt, AITaskSuggest
- `components/onboarding/` — OnboardingChecklist, HelpPanel
- `lib/store/` — Zustand stores (projectStore, taskStore, uiStore)
- `lib/mockData.ts` — all mock data
- `lib/ai/` — AI client, prompts, parsers
- `types/` — TypeScript types for Project, Task, User, AI
- `constants/` — status columns, priority levels

## Current State

- MVP scaffold complete
- Deployed on Vercel
- All pages use mock data from `lib/mockData.ts`
- Supabase NOT yet integrated
- AI features are placeholders only
- No authentication yet

## Coding Conventions

- Always use TypeScript — no `any` types
- Tailwind only for styling — no custom CSS files
- Use Zustand stores for shared state
- Use Next.js `<Link>` for all navigation
- All new pages go in `app/(dashboard)/`
- All new components go in appropriate `components/` subfolder
- Always run `npm run build` before committing
- Commit messages follow Conventional Commits format
- Always push to GitHub after committing

## GitHub

- Repo: github.com/dceptev-byte/spike
- Main branch is always deployable
- Vercel auto-deploys on push to main

## Phase Roadmap

- Phase 1 (complete): MVP scaffold + UI
- Phase 2 (next): Supabase integration — auth, real DB, realtime
- Phase 3: Live AI features — Anthropic API
- Phase 4: Advanced features — Gantt, reporting, Slack integration
