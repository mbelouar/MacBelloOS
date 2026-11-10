'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { useNow } from '@/lib/hooks';

const EASE = [0.32, 0.72, 0, 1] as const;

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const now = useNow(1000);
  const [unlocking, setUnlocking] = useState(false);

  const unlock = useCallback(() => {
    if (unlocking) return;
    setUnlocking(true);
    window.setTimeout(onUnlock, 550);
  }, [unlocking, onUnlock]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key) || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      unlock();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [unlock]);

  return (
    <motion.div
      key="lock"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(14px)', transition: { duration: 0.6, ease: EASE } }}
      transition={{ duration: 0.5 }}
      onClick={unlock}
      className="fixed inset-0 z-[10000] cursor-pointer select-none overflow-hidden bg-[#0a0a0c] bg-cover bg-center"
      style={{ backgroundImage: 'url(/wallpaper.jpg)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />

      {/* Clock */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        className="absolute inset-x-0 top-[9vh] text-center text-white"
      >
        <p className="text-lg font-medium text-white/85 sm:text-[22px]" suppressHydrationWarning>
          {now?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) ?? ' '}
        </p>
        <p
          className="mt-1 text-[88px] font-semibold leading-none tracking-[-0.04em] text-white/90 sm:text-[128px]"
          style={{ textShadow: '0 4px 40px rgb(0 0 0 / 0.35)' }}
          suppressHydrationWarning
        >
          {now ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }) : ' '}
        </p>
      </motion.div>

      {/* User */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        className="absolute inset-x-0 bottom-[10vh] flex flex-col items-center text-center"
      >
        <div className="relative">
          <motion.div
            animate={unlocking ? { scale: 0.92 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="h-20 w-20 overflow-hidden rounded-full ring-1 ring-white/30 shadow-[0_20px_50px_-10px_rgb(0_0_0/0.8)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.photo} alt="" className="h-full w-full object-cover" />
          </motion.div>
          {unlocking && (
            <svg className="absolute -inset-1.5 h-[calc(100%+12px)] w-[calc(100%+12px)] animate-spin" viewBox="0 0 100 100" aria-hidden>
              <circle cx="50" cy="50" r="47" fill="none" stroke="white" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="70 300" />
            </svg>
          )}
        </div>
        <p className="mt-4 text-[17px] font-semibold text-white">{profile.name}</p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            unlock();
          }}
          className="material-thin group mt-4 flex items-center gap-2 rounded-full py-2 pl-5 pr-2 text-[13px] text-white/80 ring-1 ring-white/15 transition-colors hover:text-white"
        >
          {unlocking ? 'Welcome' : 'Enter portfolio'}
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </button>
        <p className="mt-3 text-[11px] text-white/45">Click anywhere or press any key</p>
      </motion.div>
    </motion.div>
  );
}
