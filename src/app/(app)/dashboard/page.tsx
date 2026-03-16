import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Package, ChevronRight, Boxes } from 'lucide-react';
import Greeting from '@/components/Greeting';
import { Package as PackageType } from '@/lib/types';

export const dynamic = 'force-dynamic';

function getPackageCount(): number {
  try {
    const filePath = path.join(process.cwd(), 'data', 'packages.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return (data.packages as PackageType[])?.length ?? 0;
  } catch {
    return 0;
  }
}

export default function DashboardPage() {
  const activeCount = getPackageCount();

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Hero greeting section — warm card */}
      <div className="relative mb-7 animate-fade-in">
        <div className="relative rounded-3xl border border-amber-500/20 dark:border-amber-500/15 overflow-hidden shadow-sm">
          {/* Sunrise warmth gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/70 via-orange-50/40 to-amber-50/20 dark:from-amber-950/50 dark:via-amber-900/20 dark:to-stone-900/10" />
          {/* Radial warm glow from top-left */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(251,191,36,0.18),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(251,191,36,0.10),transparent)]" />
          <div className="relative px-6 pt-7 pb-6 flex items-start justify-between">
            <Greeting />
            {/* V·S monogram — bespoke personal accent */}
            <div className="flex-shrink-0 ml-4 mt-1 flex flex-col items-center gap-1 opacity-60 dark:opacity-45 select-none">
              <div className="w-9 h-9 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center">
                <span className="text-[11px] font-bold tracking-tight text-amber-600 dark:text-amber-400">V·S</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4 animate-slide-up">
        Your Home
      </p>

      {/* Navigation cards */}
      <div className="grid gap-3 animate-slide-up-1">
        <Link
          href="/packages"
          className="group relative flex items-center gap-5 p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all duration-200 overflow-hidden"
        >
          {/* Subtle warm card tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] to-transparent group-hover:from-amber-500/[0.08] transition-all duration-300 pointer-events-none rounded-2xl" />
          <div className="relative w-12 h-12 rounded-xl bg-amber-500/14 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/22 transition-colors shadow-sm shadow-amber-500/10">
            <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-[var(--foreground)]">Packages</h2>
              {activeCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/14 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {activeCount} active
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--muted)] mt-0.5 truncate">
              {activeCount === 0
                ? 'No packages in transit'
                : activeCount === 1
                ? '1 package on the way'
                : `${activeCount} packages on the way`}
            </p>
          </div>
          <ChevronRight className="relative w-5 h-5 text-[var(--muted)] group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </Link>

        {/* Future sections placeholder */}
        <div className="flex items-center gap-5 p-5 rounded-2xl border border-dashed border-[var(--card-border)] opacity-40 cursor-default">
          <div className="w-12 h-12 rounded-xl bg-[var(--muted-bg)] flex items-center justify-center flex-shrink-0">
            <Boxes className="w-6 h-6 text-[var(--muted)]" />
          </div>
          <div>
            <h2 className="font-medium text-[var(--foreground)] text-sm">More sections coming</h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">Groceries, calendar, and more</p>
          </div>
        </div>
      </div>

      {/* Status strip — visually closes empty space */}
      <div className="mt-8 flex items-center gap-3 px-4 py-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] opacity-50 select-none">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
        <span className="text-xs text-[var(--muted)] flex-1">All systems green</span>
        <span className="text-[11px] text-[var(--muted)] tabular-nums">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Footer — subtle attribution */}
      <div className="mt-6 flex items-center justify-center gap-1.5 opacity-25 select-none">
        <div className="w-1 h-1 rounded-full bg-amber-500" />
        <span className="text-[11px] text-[var(--muted)] tracking-wide">Powered by Gandalf</span>
        <div className="w-1 h-1 rounded-full bg-amber-500" />
      </div>
    </div>
  );
}
