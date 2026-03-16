import AuthGuard from '@/components/AuthGuard';
import AppNav from '@/components/AppNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <AppNav />
        <main className="pb-24 md:pb-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
