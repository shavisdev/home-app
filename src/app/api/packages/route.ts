import { createServerClient } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get('state');
  const supabase = createServerClient();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  if (state === 'recently_picked_up') {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .gt('picked_up_at', cutoff)
      .order('created_at', { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ packages: data });
  }

  if (state === 'archived') {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .not('picked_up_at', 'is', null)
      .lte('picked_up_at', cutoff)
      .order('created_at', { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ packages: data });
  }

  return Response.json({ error: 'Unknown state' }, { status: 400 });
}
