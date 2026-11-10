'use client';

import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { X } from 'lucide-react';
import { useIsMac } from '@/lib/hooks';

export default function ShortcutsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const mac = useIsMac();
  const mod = mac ? '⌘' : 'Ctrl';
  const alt = mac ? '⌥' : 'Alt';

  const groups: { title: string; items: [string[], string][] }[] = [
    {
      title: 'Navigation',
      items: [
        [[mod, 'K'], 'Spotlight search'],
        [[alt, '1–8'], 'Open an app'],
        [['?'], 'Show this sheet'],
        [['esc'], 'Close menus & overlays'],
      ],
    },
    {
      title: 'Windows',
      items: [
        [[alt, 'W'], 'Close focused window'],
        [[alt, 'M'], 'Minimize focused window'],
        [['Double-click title'], 'Zoom / restore'],
        [[alt, 'L'], 'Lock screen'],
      ],
    },
    {
      title: 'Terminal',
      items: [
        [['Tab'], 'Autocomplete'],
        [['↑', '↓'], 'Command history'],
        [['Ctrl', 'L'], 'Clear screen'],
      ],
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <Overlay onClose={onClose}>
          <motion.div
            role="dialog"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 460, damping: 34 }}
            className="material-thick relative w-full max-w-[560px] rounded-2xl p-6 shadow-popover"
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full p-1.5 text-ink-faint hover:bg-white/10 hover:text-ink">
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-semibold">Keyboard shortcuts</h2>
            <p className="mt-1 text-sm text-ink-faint">Get around without lifting your hands.</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {groups.map((g) => (
                <div key={g.title} className={g.title === 'Terminal' ? 'sm:col-span-2' : ''}>
                  <p className="eyebrow mb-2">{g.title}</p>
                  <ul className="space-y-2">
                    {g.items.map(([keys, label]) => (
                      <li key={label} className="flex items-center justify-between gap-3 text-[13px]">
                        <span className="text-ink-muted">{label}</span>
                        <span className="flex gap-1">
                          {keys.map((k) => (
                            <kbd key={k} className="min-w-[22px] rounded-md bg-white/[0.08] px-1.5 py-0.5 text-center font-sans text-[11px] text-ink ring-1 ring-white/10">
                              {k}
                            </kbd>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

function Overlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const present = useIsPresent();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9800] flex items-center justify-center bg-black/40 p-4"
      style={{ pointerEvents: present ? 'auto' : 'none' }}
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </motion.div>
  );
}
