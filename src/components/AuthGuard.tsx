'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_KEY = 'home_app_session';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session !== 'authenticated') {
      router.replace('/');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)' }} />
    );
  }

  return <>{children}</>;
}
