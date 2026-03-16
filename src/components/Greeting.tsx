'use client';

import { useState, useEffect } from 'react';

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

function getGreetingEmoji(hour: number): string {
  if (hour >= 5 && hour < 12) return '☀️';
  if (hour >= 12 && hour < 17) return '👋';
  if (hour >= 17 && hour < 21) return '🌆';
  return '🌙';
}

export default function Greeting() {
  const [greeting, setGreeting] = useState('');
  const [emoji, setEmoji] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hour = now.getHours();
      setGreeting(getGreeting(hour));
      setEmoji(getGreetingEmoji(hour));
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p className="text-sm font-medium text-[var(--muted)] mb-1">{dateStr}</p>
      <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight leading-tight">
        {greeting},{' '}
        <br className="sm:hidden" />
        <span className="text-amber-500 dark:text-amber-400">Vishal & Shreya</span>
        {emoji && <span className="ml-2">{emoji}</span>}
      </h1>
    </div>
  );
}
