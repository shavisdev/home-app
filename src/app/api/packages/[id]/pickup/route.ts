import { createServerClient } from '@/lib/supabase';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();

  // Check package exists and isn't already picked up
  const { data: existing, error: fetchError } = await supabase
    .from('packages')
    .select('id, picked_up_at')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return Response.json({ error: 'Package not found' }, { status: 404 });
  }

  if (existing.picked_up_at != null) {
    return Response.json({ error: 'Package already picked up' }, { status: 404 });
  }

  const { error } = await supabase
    .from('packages')
    .update({ picked_up_at: new Date().toISOString(), status: 'picked_up' })
    .eq('id', id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, id });
}
