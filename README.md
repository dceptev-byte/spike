# Spike

> **AI-powered project management for modern teams.**
> Kanban boards, smart task insights, and a conversational AI assistant — all in one place.

![Status](https://img.shields.io/badge/status-MVP%20scaffold-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

| Area | What's built |
|------|-------------|
| **Dashboard** | Overview cards: open tasks, projects, team members, today's due |
| **Projects** | Create / browse projects with status badges and progress bars |
| **Kanban Board** | Drag-and-drop columns (Backlog → In Progress → Review → Done) |
| **Task Detail Panel** | Slide-in panel with assignee, status, priority, due date, description |
| **My Tasks** | Personal task list filtered by assignee; grouped by project; overdue highlighting |
| **Team Page** | Member roster with role badges and per-member task stats |
| **Loading Skeletons** | Pulse skeletons on ProjectList and KanbanBoard while data loads |
| **Toast Notifications** | Project created · Task assigned · Status changed (auto-dismiss 3.5 s) |
| **Help Center** | Searchable FAQ accordion + contextual help panel |
| **Onboarding Checklist** | Step-by-step checklist for new users (persisted in Zustand) |
| **AI Chat Widget** | Floating FAB → slide-up chat panel (Anthropic integration placeholder) |
| **API Routes** | REST endpoints for projects, tasks, and users (mock data + Supabase TODOs) |
| **Accessibility** | Global `:focus-visible` ring, `aria-live` toast region, keyboard-navigable modals |
| **Page Metadata** | Per-route `<title>` via Next.js metadata API (`%s \| Spike` template) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS v3](https://tailwindcss.com) |
| State | [Zustand v5](https://zustand-demo.pmnd.rs) |
| Drag & Drop | [dnd-kit](https://dndkit.com) |
| UI Primitives | [Radix UI](https://radix-ui.com) (Dialog, Select, …) |
| Icons | [Lucide React](https://lucide.dev) |
| Database *(planned)* | [Supabase](https://supabase.com) (Postgres + Auth + Realtime) |
| AI *(planned)* | [Anthropic Claude API](https://docs.anthropic.com) |

---

## Folder Structure

```
spike/
├── app/
│   ├── (dashboard)/              # Route group — shared dashboard shell
│   │   ├── layout.tsx            # Sidebar + TopBar + ToastProvider wrapper
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── projects/
│   │   │   ├── layout.tsx        # Metadata: "Projects"
│   │   │   ├── page.tsx          # Project grid with skeleton loader
│   │   │   └── [id]/
│   │   │       ├── layout.tsx    # Metadata: "Board"
│   │   │       └── page.tsx      # Project detail + KanbanBoard
│   │   ├── tasks/
│   │   │   ├── layout.tsx        # Metadata: "My Tasks"
│   │   │   └── page.tsx          # Personal task list
│   │   ├── team/
│   │   │   ├── layout.tsx        # Metadata: "Team"
│   │   │   └── page.tsx          # Team member roster
│   │   └── help/
│   │       ├── layout.tsx        # Metadata: "Help Center"
│   │       └── page.tsx          # FAQ + help panel
│   ├── api/
│   │   ├── projects/
│   │   │   ├── route.ts          # GET /api/projects, POST /api/projects
│   │   │   └── [id]/route.ts     # GET · PATCH · DELETE /api/projects/:id
│   │   ├── tasks/
│   │   │   ├── route.ts          # GET /api/tasks, POST /api/tasks
│   │   │   └── [id]/route.ts     # GET · PATCH · DELETE /api/tasks/:id
│   │   ├── users/route.ts        # GET /api/users
│   │   └── ai/
│   │       ├── chat/route.ts     # POST /api/ai/chat  (Anthropic placeholder)
│   │       └── summarise/route.ts
│   ├── globals.css               # Tailwind base + :focus-visible ring + animations
│   └── layout.tsx                # Root layout — metadata template, fonts
├── components/
│   ├── board/
│   │   ├── KanbanBoard.tsx       # dnd-kit sortable board
│   │   ├── KanbanBoardSkeleton.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskDetailPanel.tsx
│   │   └── index.ts
│   ├── projects/
│   │   ├── NewProjectModal.tsx   # Radix Dialog — create project form
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectListSkeleton.tsx
│   │   └── index.ts
│   ├── shared/
│   │   ├── HelpButton.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ToastProvider.tsx     # aria-live toast stack (bottom-left)
│   │   ├── TopBar.tsx
│   │   ├── UserAvatar.tsx
│   │   └── index.ts
│   └── ui/                       # Headless / Radix wrappers (Button, Modal, …)
├── lib/
│   ├── mockData.ts               # MOCK_PROJECTS · MOCK_TASKS · MOCK_USERS
│   ├── store/
│   │   ├── projectStore.ts
│   │   ├── taskStore.ts
│   │   ├── toastStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   └── types.ts                  # Shared TypeScript interfaces
├── public/                       # Static assets
├── .env.local.example            # Environment variable template
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9 (or pnpm / yarn)

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/your-org/spike.git
cd spike

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys (see below)

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in the project root (use `.env.local.example` as a template):

```env
# ── Supabase ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ── Anthropic ─────────────────────────────────────────────────────────────────
# Keep this server-side only — never prefix with NEXT_PUBLIC_
ANTHROPIC_API_KEY=sk-ant-...

# ── App ───────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Security note:** `ANTHROPIC_API_KEY` must remain server-side only. It is only referenced inside `app/api/ai/` route handlers.

---

## Connecting Supabase

The API routes contain `// TODO (Supabase):` comments showing the exact query to swap in. Steps:

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Run the migration SQL from `supabase/migrations/` (once authored).
3. Add your project URL and anon key to `.env.local`.
4. Install the Supabase client:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```
5. Replace the `MOCK_*` data returns in each API route with the Supabase snippets in the TODO comments.

---

## Enabling AI Features

The AI chat widget and task-summarisation endpoint are wired to `app/api/ai/`. To activate:

1. Add your `ANTHROPIC_API_KEY` to `.env.local`.
2. Install the SDK:
   ```bash
   npm install @anthropic-ai/sdk
   ```
3. Uncomment the Anthropic client calls inside `app/api/ai/chat/route.ts` and `app/api/ai/summarise/route.ts`.
4. Adjust the system prompt in the chat route to reflect your team's Spike configuration.

---

## Contributing

1. **Fork** this repo and create a feature branch: `git checkout -b feat/my-feature`
2. **Code conventions**
   - Components: PascalCase files, named default export
   - Hooks / utilities: camelCase files
   - Tailwind only — no inline `style` props except for dynamic values
   - All new interactive elements must be keyboard-accessible
3. **Commit format** (Conventional Commits):
   ```
   feat: add X
   fix: correct Y
   chore: update Z
   ```
4. **Pull request** — fill in the PR template; link any related issues.
5. All PRs run `npm run build` + `npm run lint` in CI — ensure both pass locally first.

---

## License

MIT © Spike Contributors
