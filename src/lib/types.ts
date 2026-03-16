export interface Package {
  id: string;
  retailer: string;
  description: string;
  order_number?: string;
  email_account?: string | null;
  carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  status: string;
  pickup_location?: string | null;
  pickup_code?: string | null;
  concierge_ref?: string;
  link_confidence?: string;
  retailer_delivered_at?: string | null;
  concierge_notified_at?: string | null;
  picked_up?: boolean;
  picked_up_at?: string | null;
  live_status?: string;
  live_status_checked_at?: string;
  flags?: string[];
  notes?: string;
  archived_reason?: string;
  delivered_at?: string;
}

export interface PackagesData {
  packages: Package[];
  last_updated?: string;
  archived_at?: string;
}
