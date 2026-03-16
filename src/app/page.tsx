'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Delete, Home } from 'lucide-react';

const CORRECT_PIN = '743362';
const SESSION_KEY = 'home_app_session';
const PIN_LENGTH = 6;

export default function PinPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem(SESSION_KEY);
    if (session === 'authenticated') {
      router.replace('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleWrongPin = useCallback(() => {
    setIsShaking(true);
    setIsError(true);
    setTimeout(() => {
      setIsShaking(false);
      setIsError(false);
      setPin('');
    }, 620);
  }, []);

  const handleDigit = useCallback(
    (digit: string) => {
      if (isError || isSuccess || pin.length >= PIN_LENGTH) return;
      const newPin = pin + digit;
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        if (newPin === CORRECT_PIN) {
          setIsSuccess(true);
          localStorage.setItem(SESSION_KEY, 'authenticated');
          setTimeout(() => router.replace('/dashboard'), 300);
        } else {
          setTimeout(handleWrongPin, 80);
        }
      }
    },
    [pin, isError, isSuccess, router, handleWrongPin]
  );

  const handleDelete = useCallback(() => {
    if (isError || isSuccess) return;
    setPin((p) => p.slice(0, -1));
  }, [isError, isSuccess]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      else if (e.key === 'Backspace') handleDelete();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleDigit, handleDelete]);

  if (!mounted || isChecking) {
    return <div className="min-h-screen bg-stone-950" />;
  }

  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center relative overflow-hidden px-4">
      {/* Ambient glow layers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[600px] h-[600px] rounded-full bg-amber-500/18 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[300px] h-[300px] rounded-full bg-amber-400/12 blur-[55px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-orange-600/6 blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-xs animate-fade-in">
        {/* Icon + heading */}
        <div className="flex flex-col items-center gap-4 text-center animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/35 flex items-center justify-center shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/10 ring-offset-2 ring-offset-stone-950">
            <Home className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome Home
            </h1>
            <p className="text-sm text-stone-400 mt-1">Enter your PIN to continue</p>
          </div>
        </div>

        {/* PIN dots */}
        <div className={`flex gap-3.5 animate-slide-up-1 ${isShaking ? 'animate-shake' : ''}`}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => {
            const filled = i < pin.length;
            return (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  filled
                    ? isError
                      ? 'bg-red-400 scale-110 shadow-lg shadow-red-400/50'
                      : isSuccess
                      ? 'bg-emerald-400 scale-110 shadow-lg shadow-emerald-400/50'
                      : 'bg-amber-400 scale-110 shadow-lg shadow-amber-400/40'
                    : 'bg-stone-600'
                }`}
              />
            );
          })}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full animate-slide-up-2">
          {buttons.map((btn, i) => {
            if (btn === '') {
              return <div key={i} />;
            }

            if (btn === 'del') {
              return (
                <button
                  key={i}
                  onClick={handleDelete}
                  disabled={pin.length === 0 || isError || isSuccess}
                  aria-label="Delete"
                  className="h-16 rounded-2xl bg-stone-800/80 border border-stone-700/60 text-stone-300 flex items-center justify-center active:scale-95 transition-all duration-100 hover:bg-stone-700/80 hover:text-stone-100 disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  <Delete className="w-5 h-5" />
                </button>
              );
            }

            return (
              <button
                key={i}
                onClick={() => handleDigit(btn)}
                disabled={isError || isSuccess}
                className="h-16 rounded-2xl bg-stone-800/80 border border-stone-700/60 text-white text-xl font-semibold active:scale-95 transition-all duration-100 hover:bg-stone-700/80 hover:border-amber-500/40 hover:text-amber-200 disabled:cursor-not-allowed select-none shadow-sm"
              >
                {btn}
              </button>
            );
          })}
        </div>

        <p className="text-stone-500 text-xs animate-slide-up-3 tracking-[0.2em] uppercase font-medium">
          V · S · Home
        </p>
      </div>
    </div>
  );
}
