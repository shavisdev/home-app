import type { Metadata } from 'next';
import PackagesClient from '@/components/PackagesClient';
import { Package, getPackageState } from '@/lib/types';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Packages · V&S' };

export default async function PackagesPage() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });

  const packages: Package[] = error || !data ? [] : data;

  const pending: Package[] = [];
  const recentlyPickedUp: Package[] = [];
  const archived: Package[] = [];

  for (const pkg of packages) {
    const state = getPackageState(pkg);
    if (state === 'pending') pending.push(pkg);
    else if (state === 'recently_picked_up') recentlyPickedUp.push(pkg);
    else archived.push(pkg);
  }

  return <PackagesClient pending={pending} recentlyPickedUp={recentlyPickedUp} archived={archived} />;
}
