import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TASKS } from '@/lib/mockData';
import type { Task } from '@/types';

type Params = { params: { id: string } };

// ---------------------------------------------------------------------------
// GET /api/tasks/:id
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   const { data, error } = await supabase
//     .from('tasks')
//     .select(`
//       *,
//       subtasks(*),
//       comments(*, author:users(id, name, avatar_url))
//     `)
//     .eq('id', params.id)
//     .single();
//   if (error || !data) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
//   return NextResponse.json({ data });
// ---------------------------------------------------------------------------

export async function GET(_req: NextRequest, { params }: Params) {
  const task = MOCK_TASKS.find((t) => t.id === params.id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  await new Promise((r) => setTimeout(r, 80));
  return NextResponse.json({ data: task });
}

// ---------------------------------------------------------------------------
// PATCH /api/tasks/:id
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   const { data, error } = await supabase
//     .from('tasks')
//     .update({ ...body, updated_at: new Date().toISOString() })
//     .eq('id', params.id)
//     .select()
//     .single();
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ data });
//
// For status-only updates (board drag-and-drop), prefer a lightweight RPC:
//   await supabase.rpc('move_task', { task_id: params.id, new_status: body.status, new_order: body.order });
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest, { params }: Params) {
  const task = MOCK_TASKS.find((t) => t.id === params.id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  let body: Partial<Task>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Disallow patching immutable fields
  const { id: _id, projectId: _pid, createdAt: _ca, ...updates } = body;
  void _id; void _pid; void _ca;

  const updated: Task = {
    ...task,
    ...updates,
    id:        task.id,
    projectId: task.projectId,
    createdAt: task.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await new Promise((r) => setTimeout(r, 80));
  return NextResponse.json({ data: updated });
}

// ---------------------------------------------------------------------------
// DELETE /api/tasks/:id
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   const { error } = await supabase
//     .from('tasks')
//     .delete()
//     .eq('id', params.id);
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return new NextResponse(null, { status: 204 });
// ---------------------------------------------------------------------------

export async function DELETE(_req: NextRequest, { params }: Params) {
  const exists = MOCK_TASKS.some((t) => t.id === params.id);
  if (!exists) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  await new Promise((r) => setTimeout(r, 80));
  return new NextResponse(null, { status: 204 });
}
