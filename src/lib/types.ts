export interface Package {
  id: string;
  retailer: string;
  title: string;
  order_number?: string;
  order_date?: string | null;
  email_account?: string | null;
  carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  status: string;
  pickup_location?: string | null;
  pickup_code?: string | null;
  concierge_ref?: string;
  picked_up_at?: string | null;
  live_status?: string;
  live_status_checked_at?: string;
  flags?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type PackageState = 'pending' | 'recently_picked_up' | 'archived';

export function getPackageState(pkg: Package): PackageState {
  if (pkg.picked_up_at == null) return 'pending';
  const pickedUpAt = new Date(pkg.picked_up_at).getTime();
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return pickedUpAt > cutoff ? 'recently_picked_up' : 'archived';
}
