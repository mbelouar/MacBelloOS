'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Search } from 'lucide-react';
import { APPS, APP_MAP } from '@/components/apps/registry';
import { profile } from '@/data/portfolio';
import { useIsMac, useNow } from '@/lib/hooks';
import { useOS } from './OSContext';
import { MENU_H } from './Window';

interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  checked?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

interface Menu {
  id: string;
  label: React.ReactNode;
  bold?: boolean;
  items: MenuItem[];
}

export default function MenuBar({ onShowShortcuts }: { onShowShortcuts: () => void }) {
  const os = useOS();
  const now = useNow(1000);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const mod = useIsMac() ? '⌘' : 'Ctrl+';
  const alt = mod === '⌘' ? '⌥' : 'Alt+';

  const focused = os.focusedId ? APP_MAP[os.focusedId] : null;

  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenMenu(null);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [openMenu]);

  const menus: Menu[] = [
    {
      id: 'brand',
      label: <span className="text-[13px] font-bold tracking-tight">MB</span>,
      items: [
        { label: 'About This Portfolio', action: () => os.open('about') },
        { divider: true, label: '' },
        { label: 'Search…', shortcut: `${mod}K`, action: () => os.setSpotlightOpen(true) },
        { label: 'Keyboard Shortcuts', shortcut: '?', action: onShowShortcuts },
        { divider: true, label: '' },
        { label: 'Résumé — English', action: () => window.open(profile.cv.en.file, '_blank', 'noopener') },
        { label: 'CV — Français', action: () => window.open(profile.cv.fr.file, '_blank', 'noopener') },
        { divider: true, label: '' },
        { label: 'Lock Screen', shortcut: `${alt}L`, action: os.lock },
      ],
    },
    {
      id: 'app',
      bold: true,
      label: focused?.name ?? 'Portfolio',
      items: focused
        ? [
            { label: `About ${focused.name}`, disabled: true },
            { divider: true, label: '' },
            { label: `Hide ${focused.name}`, shortcut: `${alt}M`, action: () => os.minimize(focused.id) },
            { label: `Quit ${focused.name}`, shortcut: `${alt}W`, action: () => os.close(focused.id) },
          ]
        : [{ label: 'Open About Me', action: () => os.open('about') }],
    },
    {
      id: 'go',
      label: 'Go',
      items: APPS.map((a, i) => ({ label: a.name, shortcut: `${alt}${i + 1}`, action: () => os.open(a.id) })),
    },
    {
      id: 'window',
      label: 'Window',
      items: [
        { label: 'Minimize', shortcut: `${alt}M`, disabled: !focused, action: () => focused && os.minimize(focused.id) },
        { label: 'Zoom', disabled: !focused, action: () => focused && os.toggleMaximize(focused.id) },
        { label: 'Close', shortcut: `${alt}W`, disabled: !focused, action: () => focused && os.close(focused.id) },
        { divider: true, label: '' },
        { label: 'Minimize All', disabled: !os.windows.length, action: os.minimizeAll },
        { label: 'Close All', disabled: !os.windows.length, action: os.closeAll },
        ...(os.windows.length ? [{ divider: true, label: '' } as MenuItem] : []),
        ...os.windows.map((w) => ({
          label: APP_MAP[w.id].name,
          checked: w.id === os.focusedId,
          action: () => os.open(w.id),
        })),
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { label: 'Keyboard Shortcuts', shortcut: '?', action: onShowShortcuts },
        { label: 'Open Terminal', action: () => os.open('terminal') },
        { divider: true, label: '' },
        { label: 'Contact Mohammed', action: () => os.open('contact') },
      ],
    },
  ];

  return (
    <header
      ref={barRef}
      className="material-glass fixed inset-x-0 top-0 z-[9500] flex items-center justify-between px-2 text-[13px] text-ink/90"
      style={{ height: MENU_H, boxShadow: 'inset 0 -0.5px 0 rgb(255 255 255 / 0.1)' }}
    >
      <nav className="flex items-center" aria-label="Menu bar">
        {menus.map((m, i) => (
          <div key={m.id} className={`relative ${i > 1 ? 'hidden sm:block' : ''}`}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openMenu === m.id}
              onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
              onPointerEnter={() => openMenu && openMenu !== m.id && setOpenMenu(m.id)}
              className={`flex h-[22px] items-center rounded-[5px] px-2.5 transition-colors duration-75 ${
                openMenu === m.id ? 'bg-white/20' : 'hover:bg-white/10'
              } ${m.bold ? 'font-semibold' : ''}`}
            >
              {m.label}
            </button>
            <AnimatePresence>
              {openMenu === m.id && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.14 }}
                  className="material-thick absolute left-0 top-[26px] min-w-[230px] rounded-[10px] p-[5px] shadow-popover"
                >
                  {m.items.map((it, j) =>
                    it.divider ? (
                      <div key={j} className="mx-2 my-[5px] h-px bg-white/10" />
                    ) : (
                      <button
                        key={j}
                        role="menuitem"
                        disabled={it.disabled}
                        onClick={() => {
                          setOpenMenu(null);
                          it.action?.();
                        }}
                        className="flex w-full items-center gap-2 rounded-[5px] px-2 py-[3px] text-left text-[13px] text-ink/90 hover:bg-[#2f64d6] hover:text-white disabled:pointer-events-none disabled:text-ink/30"
                      >
                        <span className="flex w-3 justify-center">{it.checked && <Check className="h-3 w-3" strokeWidth={3} />}</span>
                        <span className="flex-1">{it.label}</span>
                        {it.shortcut && <span className="text-xs text-ink/40">{it.shortcut}</span>}
                      </button>
                    ),
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-1 text-ink/85">
        <button
          type="button"
          onClick={() => os.setSpotlightOpen(true)}
          aria-label="Search"
          className="flex h-[22px] items-center rounded-[5px] px-2 transition-colors hover:bg-white/10"
        >
          <Search className="h-[15px] w-[15px]" strokeWidth={2.25} />
        </button>
        <StatusIcons />
        <span className="px-2 tabular-nums" suppressHydrationWarning>
          {now
            ? (
                <>
                  <span className="hidden sm:inline">
                    {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}&nbsp;&nbsp;
                  </span>
                  {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </>
              )
            : null}
        </span>
      </div>
    </header>
  );
}

function StatusIcons() {
  return (
    <div className="hidden items-center gap-3 px-2 sm:flex" aria-hidden>
      <svg width="23" height="11" viewBox="0 0 23 11" fill="none">
        <rect x="0.5" y="0.5" width="19" height="10" rx="3" stroke="currentColor" strokeOpacity="0.5" />
        <rect x="2" y="2" width="15" height="7" rx="1.6" fill="currentColor" />
        <path d="M21 3.8v3.4c.7-.3 1.2-1 1.2-1.7s-.5-1.4-1.2-1.7Z" fill="currentColor" fillOpacity="0.5" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
        <path d="M8 2.3c2.2 0 4.2.9 5.7 2.3l1.1-1.1A9.6 9.6 0 0 0 8 .7 9.6 9.6 0 0 0 1.2 3.5l1.1 1.1A8 8 0 0 1 8 2.3Z" />
        <path d="M8 5.5c1.3 0 2.5.5 3.4 1.3l1.1-1.1A6.4 6.4 0 0 0 8 3.9c-1.7 0-3.3.7-4.5 1.8l1.1 1.1c.9-.8 2.1-1.3 3.4-1.3Z" />
        <path d="M8 8.7c.5 0 .9.2 1.2.5L8 10.9 6.8 9.2c.3-.3.7-.5 1.2-.5Z" />
      </svg>
    </div>
  );
}
