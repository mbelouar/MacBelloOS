'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/** Full-screen photo viewer, portalled to <body> so no card or window can clip or cover it. */
export default function Lightbox({ open, onClose, src, alt, caption }: { open: boolean; onClose: () => void; src: string; alt: string; caption: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-label={alt}
          className="fixed inset-0 z-[9850] flex cursor-zoom-out flex-col items-center justify-center gap-3 bg-black/85 p-6 backdrop-blur-md"
        >
          <motion.img
            src={src}
            alt={alt}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="max-h-[82vh] max-w-[92vw] rounded-xl object-contain shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9)]"
          />
          <p className="text-xs text-white/70">{caption}</p>
          <button
            type="button"
            aria-label="Close photo"
            onClick={onClose}
            className="absolute right-5 top-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
