import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TASKS } from '@/lib/mockData';
import type { Task, TaskStatus, Priority } from '@/types';

// ---------------------------------------------------------------------------
// GET /api/tasks
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   const query = supabase
//     .from('tasks')
//     .select('*, subtasks(*), comments(*, author:users(id, name, avatar_url))')
//     .order('order', { ascending: true });
//
//   if (projectId)  query.eq('project_id', projectId);
//   if (status)     query.eq('status', status);
//   if (assigneeId) query.eq('assignee_id', assigneeId);
//
//   const { data, error } = await query;
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ data });
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId  = searchParams.get('projectId');
  const status     = searchParams.get('status') as TaskStatus | null;
  const assigneeId = searchParams.get('assigneeId');

  let tasks = MOCK_TASKS;
  if (projectId)  tasks = tasks.filter((t) => t.projectId  === projectId);
  if (status)     tasks = tasks.filter((t) => t.status     === status);
  if (assigneeId) tasks = tasks.filter((t) => t.assigneeId === assigneeId);

  await new Promise((r) => setTimeout(r, 120));
  return NextResponse.json({ data: tasks });
}

// ---------------------------------------------------------------------------
// POST /api/tasks
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   const { data, error } = await supabase
//     .from('tasks')
//     .insert({
//       project_id:  body.projectId,
//       title:       body.title,
//       description: body.description,
//       status:      body.status ?? 'backlog',
//       priority:    body.priority ?? 'medium',
//       assignee_id: body.assigneeId,
//       due_date:    body.dueDate,
//       labels:      body.labels ?? [],
//       order:       body.order ?? 0,
//     })
//     .select()
//     .single();
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ data }, { status: 201 });
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  let body: Partial<Task>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { projectId, title, status, priority, assigneeId, dueDate, labels } = body;

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }
  if (!title?.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  const colTasks = MOCK_TASKS.filter(
    (t) => t.projectId === projectId && t.status === (status ?? 'backlog'),
  );

  const newTask: Task = {
    id:          `task-${Date.now()}`,
    projectId,
    title:       title.trim(),
    status:      (status   ?? 'backlog') as TaskStatus,
    priority:    (priority ?? 'medium')  as Priority,
    assigneeId:  assigneeId ?? undefined,
    dueDate:     dueDate ?? undefined,
    subtasks:    [],
    comments:    [],
    labels:      labels ?? [],
    order:       colTasks.length,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };

  await new Promise((r) => setTimeout(r, 120));
  return NextResponse.json({ data: newTask }, { status: 201 });
}
