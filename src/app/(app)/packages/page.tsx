import type { Metadata } from 'next';
import PackagesClient from '@/components/PackagesClient';
import { Package } from '@/lib/types';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Packages · V&S' };

export default async function PackagesPage() {
  const supabase = createServerClient();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [pendingResult, recentCountResult, archivedCountResult] = await Promise.all([
    supabase
      .from('packages')
      .select('*')
      .is('picked_up_at', null)
      .order('created_at', { ascending: false }),
    supabase
      .from('packages')
      .select('*', { count: 'exact', head: true })
      .gt('picked_up_at', cutoff),
    supabase
      .from('packages')
      .select('*', { count: 'exact', head: true })
      .not('picked_up_at', 'is', null)
      .lte('picked_up_at', cutoff),
  ]);

  const pending: Package[] = pendingResult.data ?? [];
  const recentlyPickedUpCount = recentCountResult.count ?? 0;
  const archivedCount = archivedCountResult.count ?? 0;

  return (
    <PackagesClient
      pending={pending}
      recentlyPickedUpCount={recentlyPickedUpCount}
      archivedCount={archivedCount}
    />
  );
}
