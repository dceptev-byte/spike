import { NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/mockData';

// ---------------------------------------------------------------------------
// GET /api/users
// ---------------------------------------------------------------------------
// TODO (Supabase): Replace the mock return with:
//
//   import { createClient } from '@/lib/supabase/server';
//   const supabase = createClient();
//   const { data: { session } } = await supabase.auth.getSession();
//   if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//
// Option A — query the users table directly (if RLS allows):
//   const { data, error } = await supabase
//     .from('users')
//     .select('id, name, email, avatar_url, role, created_at')
//     .order('name', { ascending: true });
//
// Option B — workspace-scoped members (recommended for multi-tenant):
//   const { data, error } = await supabase
//     .from('workspace_members')
//     .select('role, user:users(id, name, email, avatar_url, created_at)')
//     .eq('workspace_id', session.user.user_metadata.workspace_id)
//     .order('user(name)', { ascending: true });
//
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json({ data });
// ---------------------------------------------------------------------------

export async function GET() {
  await new Promise((r) => setTimeout(r, 80));
  return NextResponse.json({ data: MOCK_USERS });
}
