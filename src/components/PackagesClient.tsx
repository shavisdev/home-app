'use client';

import { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Inbox,
  Archive,
  MapPin,
} from 'lucide-react';
import { Package as PackageType } from '@/lib/types';

interface Props {
  pending: PackageType[];
  recentlyPickedUpCount: number;
  archivedCount: number;
}

type Tab = 'pending' | 'recently_picked_up' | 'archived';

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; bg: string; text: string; dot: string }
> = {
  shipped: {
    label: 'Shipped',
    icon: Truck,
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    icon: Truck,
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  picked_up: {
    label: 'Picked Up',
    icon: CheckCircle2,
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    bg: 'bg-stone-500/10 dark:bg-stone-500/15',
    text: 'text-stone-500 dark:text-stone-400',
    dot: 'bg-stone-400',
  },
  delayed: {
    label: 'Delayed',
    icon: AlertCircle,
    bg: 'bg-red-500/10 dark:bg-red-500/15',
    text: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

function getStatusConfig(status: string) {
  return (
    STATUS_CONFIG[status] ?? {
      label: status.replace(/_/g, ' '),
      icon: Package,
      bg: 'bg-stone-500/10',
      text: 'text-stone-500',
      dot: 'bg-stone-400',
    }
  );
}

function PackageCard({
  pkg,
  archived = false,
  onPickup,
  isPickingUp = false,
}: {
  pkg: PackageType;
  archived?: boolean;
  onPickup?: () => void;
  isPickingUp?: boolean;
}) {
  const statusCfg = pkg.picked_up_at != null
    ? STATUS_CONFIG['picked_up']
    : getStatusConfig(pkg.status);
  const StatusIcon = statusCfg.icon;

  return (
    <div className={`relative border rounded-2xl overflow-hidden transition-shadow duration-200 ${archived ? 'bg-[var(--card)]/60 border-[var(--card-border)]/70 opacity-80 shadow-none' : 'bg-[var(--card)] border-[var(--card-border)] shadow-sm hover:shadow-md'}`}>
      {/* Status accent stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${statusCfg.dot}`} />

      <div className="pl-5 pr-5 py-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {pkg.retailer && pkg.retailer.toLowerCase() !== 'unknown' && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  {pkg.retailer}
                </span>
              )}
            </div>
            <p className="font-semibold text-[var(--foreground)] leading-snug">{pkg.title}</p>
          </div>

          {/* Status badge — driven by picked_up_at first, then status field */}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusCfg.bg} ${statusCfg.text}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {statusCfg.label}
          </span>
        </div>

        {/* Tracking */}
        {(pkg.carrier || pkg.tracking_number) && (
          <div className="flex items-center gap-2 mb-3 text-sm text-[var(--muted)]">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {pkg.carrier}
              {pkg.tracking_number && (
                <>
                  {' · '}
                  {pkg.tracking_url ? (
                    <a
                      href={pkg.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                    >
                      {pkg.tracking_number}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-mono text-xs">{pkg.tracking_number}</span>
                  )}
                </>
              )}
            </span>
          </div>
        )}

        {/* Tracking URL without number */}
        {!pkg.tracking_number && pkg.tracking_url && (
          <div className="mb-3">
            <a
              href={pkg.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Track order
            </a>
          </div>
        )}

        {/* Live status */}
        {pkg.live_status && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--muted-bg)] mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--foreground)] leading-snug">{pkg.live_status}</p>
          </div>
        )}

        {/* Pickup code — highlighted if available */}
        {pkg.pickup_code && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/8 dark:bg-amber-500/12 border border-amber-500/20 mb-3">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Pickup Code</span>
            <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300 tracking-wider">{pkg.pickup_code}</span>
          </div>
        )}

        {/* Concierge ref */}
        {pkg.concierge_ref && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted)]">Concierge ref <span className="font-mono">#{pkg.concierge_ref}</span></span>
          </div>
        )}
      </div>

      {/* Mark as Picked Up button — only on pending tab */}
      {onPickup && (
        <>
          <div className="mx-5 h-px bg-[var(--card-border)]/60" />
          <div className="px-5 py-3">
            <button
              onClick={onPickup}
              disabled={isPickingUp}
              className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 border border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/15 rounded-xl px-3 py-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isPickingUp ? 'Marking…' : 'Mark as Picked Up'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ type }: { type: Tab }) {
  const isPending = type === 'pending';
  const isRecent = type === 'recently_picked_up';
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center px-4 rounded-2xl ${isPending ? 'bg-amber-500/5 border border-amber-500/12 dark:bg-amber-500/8' : ''}`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${isPending ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-[var(--muted-bg)] border border-[var(--card-border)]'}`}>
        {isPending ? (
          <Package className="w-7 h-7 text-amber-500" />
        ) : isRecent ? (
          <Inbox className="w-7 h-7 text-[var(--muted)]" />
        ) : (
          <Archive className="w-7 h-7 text-[var(--muted)]" />
        )}
      </div>
      <h3 className="font-semibold text-[var(--foreground)] mb-1.5">
        {isPending ? 'No packages in transit' : isRecent ? 'Nothing picked up recently' : 'No archived packages'}
      </h3>
      <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
        {isPending
          ? "When something ships, it'll appear here."
          : isRecent
          ? 'Packages picked up in the last 24h appear here before moving to archived.'
          : 'Packages move here after 24h.'}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="relative border rounded-2xl overflow-hidden bg-[var(--card)] border-[var(--card-border)] shadow-sm"
        >
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--card-border)] animate-pulse" />
          <div className="pl-5 pr-5 py-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 rounded bg-[var(--muted-bg)] animate-pulse" />
                <div className="h-4 w-48 rounded bg-[var(--muted-bg)] animate-pulse" />
              </div>
              <div className="h-6 w-20 rounded-full bg-[var(--muted-bg)] animate-pulse" />
            </div>
            <div className="h-3 w-32 rounded bg-[var(--muted-bg)] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PackagesClient({ pending, recentlyPickedUpCount, archivedCount }: Props) {
  const [tab, setTab] = useState<Tab>('pending');
  const [pendingList, setPendingList] = useState<PackageType[]>(pending);
  const [recentCount, setRecentCount] = useState(recentlyPickedUpCount);
  const [recentlyPickedUp, setRecentlyPickedUp] = useState<PackageType[] | null>(null);
  const [archived, setArchived] = useState<PackageType[] | null>(null);
  const [loadingTab, setLoadingTab] = useState<Tab | null>(null);
  const [pickingUp, setPickingUp] = useState<string | null>(null);

  async function handlePickup(id: string) {
    const pkg = pendingList.find((p) => p.id === id);
    setPickingUp(id);
    try {
      const res = await fetch(`/api/packages/${id}/pickup`, { method: 'POST' });
      if (!res.ok) {
        console.error('Pickup failed', await res.json());
        return;
      }
      setPendingList((prev) => prev.filter((p) => p.id !== id));
      setRecentCount((c) => c + 1);
      if (recentlyPickedUp !== null && pkg) {
        setRecentlyPickedUp((prev) => [
          { ...pkg, picked_up_at: new Date().toISOString(), status: 'picked_up' },
          ...(prev ?? []),
        ]);
      }
    } finally {
      setPickingUp(null);
    }
  }

  async function handleTabClick(newTab: Tab) {
    if (newTab === 'pending') {
      setTab(newTab);
      return;
    }

    if (newTab === 'recently_picked_up') {
      if (recentlyPickedUp !== null) {
        setTab(newTab);
        return;
      }
      setLoadingTab(newTab);
      setTab(newTab);
      try {
        const res = await fetch('/api/packages?state=recently_picked_up');
        const json = await res.json();
        setRecentlyPickedUp(json.packages ?? []);
      } finally {
        setLoadingTab(null);
      }
      return;
    }

    if (newTab === 'archived') {
      if (archived !== null) {
        setTab(newTab);
        return;
      }
      setLoadingTab(newTab);
      setTab(newTab);
      try {
        const res = await fetch('/api/packages?state=archived');
        const json = await res.json();
        setArchived(json.packages ?? []);
      } finally {
        setLoadingTab(null);
      }
    }
  }

  const currentList =
    tab === 'pending'
      ? pendingList
      : tab === 'recently_picked_up'
      ? recentlyPickedUp
      : archived;

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: 'pending', label: 'Pending', icon: Truck, count: pendingList.length },
    { id: 'recently_picked_up', label: 'Recently Picked Up', icon: Inbox, count: recentCount },
    { id: 'archived', label: 'Archived', icon: Archive, count: archivedCount },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Packages</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {pendingList.length === 0
            ? 'Nothing in transit'
            : pendingList.length === 1
            ? '1 package on the way'
            : `${pendingList.length} packages on the way`}
        </p>
      </div>

      {/* Tabs — pill style */}
      <div className="flex gap-2 mb-6 animate-slide-up flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabClick(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              tab === t.id
                ? 'bg-[var(--foreground)] text-[var(--card)] shadow-sm'
                : 'bg-[var(--muted-bg)] text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.count > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                tab === t.id
                  ? t.id === 'pending'
                    ? 'bg-amber-400/25 text-amber-200'
                    : 'bg-white/15 text-white/80'
                  : t.id === 'pending'
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  : 'bg-[var(--card-border)] text-[var(--muted)]'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Package list */}
      <div className="animate-slide-up-1">
        {loadingTab === tab ? (
          <LoadingState />
        ) : currentList === null || currentList.length === 0 ? (
          <EmptyState type={tab} />
        ) : (
          <div className="flex flex-col gap-3">
            {currentList.map((pkg, i) => (
              <div
                key={pkg.id}
                style={{ animationDelay: `${i * 0.06}s` }}
                className="animate-slide-up"
              >
                <PackageCard
                  pkg={pkg}
                  archived={tab === 'archived'}
                  onPickup={tab === 'pending' ? () => handlePickup(pkg.id) : undefined}
                  isPickingUp={pickingUp === pkg.id}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pending tab footer */}
        {tab === 'pending' && pendingList.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-2 select-none">
            <div className="w-full h-px bg-[var(--card-border)]/60" />
            <p className="text-xs text-[var(--muted)] opacity-50 pt-1">
              All caught up · Powered by Gandalf 🧙
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
