'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { APPS, type AppDef } from '@/components/apps/registry';
import AppIcon from '@/components/ui/AppIcon';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { profile } from '@/data/portfolio';
import { useCoarsePointer } from '@/lib/hooks';
import { useOS } from './OSContext';

const BASE = 50;
const MAX = 78;
const RANGE = 160;

export default function Dock({ hidden, mobile }: { hidden: boolean; mobile: boolean }) {
  const { windows, open, focus, focusedId, launchTick } = useOS();
  const coarse = useCoarsePointer();
  const mouseX = useMotionValue(Infinity);
  const magnify = !coarse && !mobile;
  const size = mobile ? 38 : BASE;

  const dockApps = APPS.filter((a) => a.id !== 'resume');
  const docApps = APPS.filter((a) => a.id === 'resume');

  const onActivate = (app: AppDef) => {
    const w = windows.find((x) => x.id === app.id);
    if (w && !w.minimized && focusedId !== app.id) focus(app.id);
    else open(app.id);
  };

  return (
    <motion.nav
      aria-label="Dock"
      initial={false}
      animate={{ y: hidden ? 110 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 36 }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[9000] flex justify-center pb-[max(8px,env(safe-area-inset-bottom))]"
    >
      <div
        onMouseMove={(e) => magnify && mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`material-glass pointer-events-auto flex max-w-[calc(100vw-16px)] items-end gap-1.5 rounded-[22px] px-2 pb-1 pt-1.5 shadow-popover sm:gap-2 ${
          magnify ? '' : 'scrollbar-none overflow-x-auto'
        }`}
        style={{ height: size + 17 }}
      >
        {dockApps.map((app) => (
          <DockItem
            key={app.id}
            id={app.id}
            label={app.name}
            mouseX={mouseX}
            base={size}
            magnify={magnify}
            running={windows.some((w) => w.id === app.id)}
            bounceKey={launchTick?.id === app.id ? launchTick.n : 0}
            onClick={() => onActivate(app)}
          >
            {(s) => <AppIcon icon={app.icon} gradient={app.gradient} glyph={app.glyph} size={s} />}
          </DockItem>
        ))}

        {!mobile && (
          <>
        <span aria-hidden className="mx-1 mb-1.5 w-px self-stretch bg-white/15" />

        {docApps.map((app) => (
          <DockItem
            key={app.id}
            id={app.id}
            label={app.name}
            mouseX={mouseX}
            base={size}
            magnify={magnify}
            running={windows.some((w) => w.id === app.id)}
            bounceKey={launchTick?.id === app.id ? launchTick.n : 0}
            onClick={() => onActivate(app)}
          >
            {(s) => <AppIcon icon={app.icon} gradient={app.gradient} glyph={app.glyph} size={s} />}
          </DockItem>
        ))}
        <DockItem id="github" label="GitHub ↗" mouseX={mouseX} base={size} magnify={magnify} href={profile.github}>
          {(s) => <LinkTile size={s} className="bg-gradient-to-b from-[#2b2f36] to-[#0d1117]"><GithubIcon style={{ width: s * 0.52, height: s * 0.52 }} /></LinkTile>}
        </DockItem>
        <DockItem id="linkedin" label="LinkedIn ↗" mouseX={mouseX} base={size} magnify={magnify} href={profile.linkedin}>
          {(s) => <LinkTile size={s} className="bg-gradient-to-b from-[#2f8cff] to-[#0a5fc2]"><LinkedinIcon style={{ width: s * 0.48, height: s * 0.48 }} /></LinkTile>}
        </DockItem>
          </>
        )}
      </div>
    </motion.nav>
  );
}

function LinkTile({ size, className, children }: { size: number; className: string; children: React.ReactNode }) {
  return (
    <span
      className={`relative flex items-center justify-center overflow-hidden text-white ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.235,
        boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.3), inset 0 0 0 0.5px rgb(255 255 255 / 0.12), 0 4px 12px -2px rgb(0 0 0 / 0.45)',
      }}
    >
      {children}
    </span>
  );
}

interface DockItemProps {
  id: string;
  label: string;
  mouseX: MotionValue<number>;
  base: number;
  magnify: boolean;
  running?: boolean;
  bounceKey?: number;
  href?: string;
  onClick?: () => void;
  children: (size: number) => React.ReactNode;
}

function DockItem({ id, label, mouseX, base, magnify, running, bounceKey = 0, href, onClick, children }: DockItemProps) {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);
  const bounce = useAnimationControls();

  const distance = useTransform(mouseX, (mx) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? mx - (r.left + r.width / 2) : Infinity;
  });
  const target = useTransform(distance, [-RANGE, 0, RANGE], [base, magnify ? MAX : base, base]);
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });
  // Render the icon once at full size and scale it on the GPU — no React re-renders while magnifying.
  const full = magnify ? MAX : base;
  const scale = useTransform(size, (s) => s / full);

  useEffect(() => {
    if (bounceKey > 0) {
      bounce.start({ y: [0, -22, 0, -10, 0], transition: { duration: 0.9, times: [0, 0.3, 0.55, 0.75, 1], ease: 'easeOut' } });
    }
  }, [bounceKey, bounce]);

  const Tag = href ? motion.a : motion.button;
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { type: 'button' as const, onClick };

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="material-thick pointer-events-none absolute -top-11 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium text-ink shadow-popover"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        data-dock-id={id}
        aria-label={label}
        {...linkProps}
        animate={bounce}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        whileTap={{ scale: 0.9 }}
        style={{ width: size, height: size }}
        className="relative flex justify-center rounded-[22%] outline-offset-4"
      >
        <motion.span className="absolute bottom-0 block origin-bottom" style={{ scale, width: full, height: full }}>
          {children(full)}
        </motion.span>
      </Tag>
      <span
        aria-hidden
        className={`mt-[3px] h-1 w-1 rounded-full bg-white/80 transition-opacity duration-300 ${running ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
