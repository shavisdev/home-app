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
      {/* Greeting */}
      <div className="mb-10 animate-fade-in">
        <Greeting />
      </div>

      {/* Section label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4 animate-slide-up">
        Your Home
      </p>

      {/* Navigation cards */}
      <div className="grid gap-4 animate-slide-up-1">
        <Link
          href="/packages"
          className="group flex items-center gap-5 p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/12 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
            <Package className="w-6 h-6 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-[var(--foreground)]">Packages</h2>
              {activeCount > 0 && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/12 text-amber-600 dark:text-amber-400">
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
          <ChevronRight className="w-5 h-5 text-[var(--muted)] group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </Link>

        {/* Placeholder card for future sections */}
        <div className="flex items-center gap-5 p-5 rounded-2xl border border-dashed border-[var(--card-border)] opacity-50 cursor-default">
          <div className="w-12 h-12 rounded-xl bg-[var(--muted-bg)] flex items-center justify-center flex-shrink-0">
            <Boxes className="w-6 h-6 text-[var(--muted)]" />
          </div>
          <div>
            <h2 className="font-medium text-[var(--foreground)]">More coming soon</h2>
            <p className="text-sm text-[var(--muted)] mt-0.5">New sections are on the way</p>
          </div>
        </div>
      </div>
    </div>
  );
}
