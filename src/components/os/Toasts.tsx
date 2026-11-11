'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useOS } from './OSContext';
import { Logo } from '@/components/ui/BrandIcons';

export default function Toasts() {
  const { toasts, dismissToast } = useOS();
  return (
    <div aria-live="polite" className="pointer-events-none fixed right-3 top-10 z-[9700] flex w-[min(360px,calc(100vw-24px))] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="material-thick group pointer-events-auto relative flex items-start gap-3 rounded-2xl p-3.5 shadow-popover"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b from-[#2a2a30] to-[#0c0c0e] text-[11px] font-bold ring-1 ring-white/10">
              {t.icon ?? <Logo className="h-5 w-auto" />}
            </span>
            <div className="min-w-0 flex-1 pr-4">
              <p className="text-[13px] font-semibold">{t.title}</p>
              {t.body && <p className="mt-0.5 text-[12.5px] leading-snug text-ink-muted">{t.body}</p>}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#3a3a40] text-ink-muted opacity-0 shadow ring-1 ring-white/10 transition-opacity group-hover:opacity-100 focus:opacity-100"
            >
              <X className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
