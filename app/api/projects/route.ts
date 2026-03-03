import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PROJECTS } from '@/lib/mockData';
import type { Project, ProjectStatus } from '@/types';

// ---------------------------------------------------------------------------
// GET /api/projects
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   import { createClient } from '@/lib/supabase/server';
//   const supabase = createClient();
//   const { data: { session } } = await supabase.auth.getSession();
//   if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//
//   const query = supabase
//     .from('projects')
//     .select('*, members:project_members(user_id)')
//     .eq('workspace_id', session.user.user_metadata.workspace_id)
//     .order('updated_at', { ascending: false });
//
//   if (status) query.eq('status', status);
//
//   const { data, error } = await query;
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ data });
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as ProjectStatus | null;

  let projects = MOCK_PROJECTS;
  if (status) {
    projects = projects.filter((p) => p.status === status);
  }

  // Simulate network latency — remove once real DB is wired
  await new Promise((r) => setTimeout(r, 120));

  return NextResponse.json({ data: projects });
}

// ---------------------------------------------------------------------------
// POST /api/projects
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   const { data, error } = await supabase
//     .from('projects')
//     .insert({
//       name:         body.name,
//       description:  body.description,
//       status:       body.status ?? 'planning',
//       owner_id:     session.user.id,
//       workspace_id: session.user.user_metadata.workspace_id,
//       due_date:     body.dueDate,
//     })
//     .select()
//     .single();
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ data }, { status: 201 });
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  let body: Partial<Project>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, description, status, ownerId, memberIds, dueDate } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (!ownerId) {
    return NextResponse.json({ error: 'ownerId is required' }, { status: 400 });
  }

  const newProject: Project = {
    id: `proj-${Date.now()}`,
    name: name.trim(),
    description: description?.trim() || undefined,
    status: status ?? 'planning',
    ownerId,
    memberIds: memberIds ?? [ownerId],
    dueDate: dueDate || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await new Promise((r) => setTimeout(r, 120));

  return NextResponse.json({ data: newProject }, { status: 201 });
}
