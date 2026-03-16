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
      {/* Hero greeting section */}
      <div className="relative mb-12 animate-fade-in">
        {/* Warm ambient glow behind greeting */}
        <div className="absolute -inset-x-4 -inset-y-4 md:-inset-x-6 rounded-3xl bg-gradient-to-br from-amber-500/[0.07] via-amber-500/[0.02] to-transparent dark:from-amber-500/[0.09] dark:via-amber-500/[0.03] pointer-events-none" />
        <div className="relative flex items-start justify-between">
          <Greeting />
          {/* V·S monogram — bespoke personal accent */}
          <div className="flex-shrink-0 ml-4 mt-1 flex flex-col items-center gap-1 opacity-40 dark:opacity-30 select-none">
            <div className="w-9 h-9 rounded-full border border-amber-500/50 dark:border-amber-400/40 flex items-center justify-center">
              <span className="text-[11px] font-bold tracking-tight text-amber-600 dark:text-amber-400">V·S</span>
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
    </div>
  );
}
