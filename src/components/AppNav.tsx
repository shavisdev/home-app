'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/packages', label: 'Packages', icon: Package },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top header */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-[var(--card-border)] sticky top-0 z-40 bg-[var(--background)]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-sm">
            <Home className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <span className="font-bold text-[var(--foreground)] text-sm tracking-tight">V &amp; S</span>
            <span className="text-[10px] text-[var(--muted)] tracking-widest uppercase">Home Hub</span>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                pathname === href
                  ? 'bg-amber-500/12 text-amber-600 dark:text-amber-400'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--card)]/95 backdrop-blur-xl border-t border-[var(--card-border)]">
        <div className="flex safe-area-inset-bottom">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center gap-1 py-3 min-h-[56px] transition-all duration-150 ${
                  isActive ? 'text-amber-500' : 'text-[var(--muted)]'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {isActive && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-amber-500" />
                  )}
                  <div className={`p-1.5 rounded-xl transition-all duration-150 ${isActive ? 'bg-amber-500/15' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <span className={`text-[11px] font-medium leading-none ${isActive ? 'font-semibold' : ''}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
