import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PROJECTS } from '@/lib/mockData';
import type { Project } from '@/types';

type Params = { params: { id: string } };

// ---------------------------------------------------------------------------
// GET /api/projects/:id
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   const { data, error } = await supabase
//     .from('projects')
//     .select(`
//       *,
//       tasks(*),
//       members:project_members(
//         role,
//         user:users(id, name, email, avatar_url)
//       )
//     `)
//     .eq('id', params.id)
//     .single();
//   if (error || !data) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
//   return NextResponse.json({ data });
// ---------------------------------------------------------------------------

export async function GET(_req: NextRequest, { params }: Params) {
  const project = MOCK_PROJECTS.find((p) => p.id === params.id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  await new Promise((r) => setTimeout(r, 80));
  return NextResponse.json({ data: project });
}

// ---------------------------------------------------------------------------
// PATCH /api/projects/:id
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   const { data, error } = await supabase
//     .from('projects')
//     .update({ ...body, updated_at: new Date().toISOString() })
//     .eq('id', params.id)
//     .select()
//     .single();
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ data });
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest, { params }: Params) {
  const project = MOCK_PROJECTS.find((p) => p.id === params.id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  let body: Partial<Project>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Disallow patching immutable fields
  const { id: _id, createdAt: _ca, ownerId: _oid, ...updates } = body;
  void _id; void _ca; void _oid;

  const updated: Project = {
    ...project,
    ...updates,
    id: project.id,
    ownerId: project.ownerId,
    createdAt: project.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await new Promise((r) => setTimeout(r, 80));
  return NextResponse.json({ data: updated });
}

// ---------------------------------------------------------------------------
// DELETE /api/projects/:id
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   const { error } = await supabase
//     .from('projects')
//     .delete()
//     .eq('id', params.id);
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return new NextResponse(null, { status: 204 });
// ---------------------------------------------------------------------------

export async function DELETE(_req: NextRequest, { params }: Params) {
  const exists = MOCK_PROJECTS.some((p) => p.id === params.id);
  if (!exists) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  await new Promise((r) => setTimeout(r, 80));
  return new NextResponse(null, { status: 204 });
}
