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
  BadgeCheck,
  MapPin,
} from 'lucide-react';
import { Package as PackageType } from '@/lib/types';

interface Props {
  active: PackageType[];
  archived: PackageType[];
}

type Tab = 'active' | 'archived';

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

function PackageCard({ pkg }: { pkg: PackageType }) {
  const statusCfg = getStatusConfig(pkg.status);
  const StatusIcon = statusCfg.icon;

  return (
    <div className="relative bg-[var(--card)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Status accent stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${statusCfg.dot}`} />

      <div className="pl-5 pr-5 py-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {pkg.retailer}
              </span>
              {pkg.picked_up && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck className="w-3 h-3" />
                  Picked Up
                </span>
              )}
            </div>
            <p className="font-semibold text-[var(--foreground)] leading-snug">{pkg.description}</p>
          </div>

          {/* Status badge */}
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
    </div>
  );
}

function EmptyState({ type }: { type: Tab }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-[var(--muted-bg)] border border-[var(--card-border)] flex items-center justify-center mb-4 shadow-sm">
        {type === 'active' ? (
          <Inbox className="w-7 h-7 text-[var(--muted)]" />
        ) : (
          <Archive className="w-7 h-7 text-[var(--muted)]" />
        )}
      </div>
      <h3 className="font-semibold text-[var(--foreground)] mb-1.5">
        {type === 'active' ? 'Nothing in transit' : 'No archived packages'}
      </h3>
      <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
        {type === 'active'
          ? "All clear — nothing on its way right now."
          : 'Picked up and delivered packages will appear here.'}
      </p>
    </div>
  );
}

export default function PackagesClient({ active, archived }: Props) {
  const [tab, setTab] = useState<Tab>('active');

  const packages = tab === 'active' ? active : archived;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Packages</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {active.length === 0
            ? 'Nothing in transit'
            : active.length === 1
            ? '1 package on the way'
            : `${active.length} packages on the way`}
        </p>
      </div>

      {/* Tabs — pill style */}
      <div className="flex gap-2 mb-6 animate-slide-up">
        {(['active', 'archived'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              tab === t
                ? 'bg-[var(--foreground)] text-[var(--card)] shadow-sm'
                : 'bg-[var(--muted-bg)] text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            {t === 'active' ? (
              <Truck className="w-3.5 h-3.5" />
            ) : (
              <Archive className="w-3.5 h-3.5" />
            )}
            {t === 'active' ? 'Active' : 'Archived'}
            {t === 'active' && active.length > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                tab === 'active'
                  ? 'bg-amber-400/25 text-amber-200'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              }`}>
                {active.length}
              </span>
            )}
            {t === 'archived' && archived.length > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                tab === 'archived'
                  ? 'bg-white/15 text-white/80'
                  : 'bg-[var(--card-border)] text-[var(--muted)]'
              }`}>
                {archived.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Package list */}
      <div className="animate-slide-up-1">
        {packages.length === 0 ? (
          <EmptyState type={tab} />
        ) : (
          <div className="flex flex-col gap-3">
            {packages.map((pkg, i) => (
              <div
                key={pkg.id}
                style={{ animationDelay: `${i * 0.06}s` }}
                className="animate-slide-up"
              >
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
