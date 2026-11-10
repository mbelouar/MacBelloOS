'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useAnimate, useDragControls, useIsPresent, useMotionValue } from 'framer-motion';
import { Maximize2, Minimize2, Minus, X } from 'lucide-react';
import AppIcon from '@/components/ui/AppIcon';
import type { AppDef } from '@/components/apps/registry';
import { useOS, type WinState } from './OSContext';

export const MENU_H = 28;
const DOCK_SPACE = 96;
const MOBILE_DOCK_SPACE = 84;
const MIN_W = 380;
const MIN_H = 280;
const SPRING = { type: 'spring', stiffness: 420, damping: 40, mass: 0.9 } as const;
const EASE = [0.32, 0.72, 0, 1] as const;

interface Geometry {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface WindowProps {
  win: WinState;
  def: AppDef;
  focused: boolean;
  viewport: { w: number; h: number };
  mobile: boolean;
}

function initialGeometry(def: AppDef, slot: number, vp: { w: number; h: number }): Geometry {
  const w = Math.min(def.size.w, vp.w - 32);
  const h = Math.min(def.size.h, vp.h - MENU_H - DOCK_SPACE - 20);
  const cascade = (slot % 6) * 28;
  const x = Math.round(Math.min(Math.max(16, (vp.w - w) / 2 - 70 + cascade), vp.w - w - 16));
  const y = Math.round(Math.max(MENU_H + 14, MENU_H + (vp.h - MENU_H - DOCK_SPACE - h) / 2 - 20 + cascade));
  return { x, y, w, h };
}

function clampGeometry(g: Geometry, vp: { w: number; h: number }): Geometry {
  const w = Math.min(Math.max(g.w, MIN_W), vp.w - 16);
  const h = Math.min(Math.max(g.h, MIN_H), vp.h - MENU_H - 16);
  const x = Math.min(Math.max(g.x, -w + 120), vp.w - 120);
  const y = Math.min(Math.max(g.y, MENU_H), vp.h - 60);
  return { x, y, w, h };
}

export default function Window({ win, def, focused, viewport, mobile }: WindowProps) {
  const { close, focus, minimize, toggleMaximize } = useOS();
  const dragControls = useDragControls();
  const present = useIsPresent();
  const [scope, animateInner] = useAnimate<HTMLDivElement>();

  const [initial] = useState(() => initialGeometry(def, win.slot, viewport));
  const saved = useRef<Geometry>(initial);
  const x = useMotionValue(initial.x);
  const y = useMotionValue(initial.y);
  const w = useMotionValue(initial.w);
  const h = useMotionValue(initial.h);
  const zoomed = win.maximized || mobile;
  const wasZoomed = useRef(zoomed);

  // Zoom / restore / viewport changes: spring the frame to its target geometry.
  useEffect(() => {
    if (zoomed && !wasZoomed.current && !mobile) {
      saved.current = { x: x.get(), y: y.get(), w: w.get(), h: h.get() };
    }
    wasZoomed.current = zoomed;
    const target: Geometry = zoomed
      ? { x: 0, y: MENU_H, w: viewport.w, h: viewport.h - MENU_H - (mobile ? MOBILE_DOCK_SPACE : 0) }
      : clampGeometry(saved.current, viewport);
    const controls = [animate(x, target.x, SPRING), animate(y, target.y, SPRING), animate(w, target.w, SPRING), animate(h, target.h, SPRING)];
    return () => controls.forEach((c) => c.stop());
  }, [zoomed, mobile, viewport, x, y, w, h]);

  // Minimize: shrink the window into its dock icon (and back out on restore).
  const firstRun = useRef(true);
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    if (firstRun.current) {
      firstRun.current = false;
      animateInner(el, { opacity: [0, 1], scale: [0.92, 1], y: [14, 0] }, { duration: 0.38, ease: EASE });
      return;
    }
    if (win.minimized) {
      const icon = document.querySelector(`[data-dock-id="${win.id}"]`)?.getBoundingClientRect();
      const frame = el.getBoundingClientRect();
      const dx = icon ? icon.left + icon.width / 2 - (frame.left + frame.width / 2) : 0;
      const dy = icon ? icon.top + icon.height / 2 - (frame.top + frame.height / 2) : viewport.h;
      animateInner(el, { x: dx, y: dy, scale: 0.08, opacity: 0 }, { duration: 0.45, ease: [0.6, 0, 0.4, 1] });
    } else {
      animateInner(el, { x: 0, y: 0, scale: 1, opacity: 1 }, { duration: 0.45, ease: EASE });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.minimized]);

  const onTitlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (!zoomed) dragControls.start(e);
  };

  const onDragEnd = () => {
    saved.current = { x: x.get(), y: y.get(), w: w.get(), h: h.get() };
  };

  // Edge / corner resizing.
  const startResize = (e: React.PointerEvent, dir: 'r' | 'b' | 'rb') => {
    e.preventDefault();
    e.stopPropagation();
    const start = { px: e.clientX, py: e.clientY, w: w.get(), h: h.get() };
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = dir === 'r' ? 'ew-resize' : dir === 'b' ? 'ns-resize' : 'nwse-resize';
    const move = (ev: PointerEvent) => {
      if (dir !== 'b') w.set(Math.min(Math.max(MIN_W, start.w + ev.clientX - start.px), viewport.w - x.get() - 4));
      if (dir !== 'r') h.set(Math.min(Math.max(MIN_H, start.h + ev.clientY - start.py), viewport.h - y.get() - 4));
    };
    const up = () => {
      document.body.style.cursor = prevCursor;
      saved.current = { x: x.get(), y: y.get(), w: w.get(), h: h.get() };
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const Content = def.component;

  return (
    <motion.section
      role="dialog"
      aria-label={def.name}
      aria-hidden={win.minimized || undefined}
      drag={!zoomed}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={{ left: -w.get() + 120, right: viewport.w - 120, top: MENU_H, bottom: viewport.h - 60 }}
      onDragEnd={onDragEnd}
      onPointerDownCapture={() => focus(win.id)}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2, ease: EASE } }}
      className="fixed left-0 top-0 will-change-transform"
      style={{ x, y, width: w, height: h, zIndex: win.z, pointerEvents: win.minimized || !present ? 'none' : 'auto' }}
    >
      <div
        ref={scope}
        className={`material-thick relative flex h-full flex-col overflow-hidden transition-[border-radius,box-shadow] duration-300 ${
          zoomed ? 'rounded-none' : 'rounded-[14px]'
        } ${focused ? 'shadow-window' : 'shadow-window-inactive'}`}
        style={{ transformOrigin: '50% 50%' }}
      >
        {/* Title bar */}
        <div
          onPointerDown={onTitlePointerDown}
          onDoubleClick={(e) => {
            if (!mobile && !(e.target as HTMLElement).closest('button')) toggleMaximize(win.id);
          }}
          className={`relative flex h-11 shrink-0 select-none items-center border-b border-white/[0.06] px-4 ${
            zoomed ? '' : 'cursor-grab active:cursor-grabbing'
          } ${focused ? 'bg-white/[0.035]' : 'bg-transparent'}`}
        >
          <div className="group/lights relative z-10 flex items-center gap-2">
            <Light color="#ff5f57" active={focused} label={`Close ${def.name}`} onClick={() => close(win.id)}>
              <X strokeWidth={3} />
            </Light>
            <Light color="#febc2e" active={focused} label={`Minimize ${def.name}`} onClick={() => minimize(win.id)}>
              <Minus strokeWidth={3} />
            </Light>
            {!mobile && (
              <Light
                color="#28c840"
                active={focused}
                label={win.maximized ? `Restore ${def.name}` : `Zoom ${def.name}`}
                onClick={() => toggleMaximize(win.id)}
              >
                {win.maximized ? <Minimize2 strokeWidth={3} /> : <Maximize2 strokeWidth={3} />}
              </Light>
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 px-24">
            <AppIcon icon={def.icon} gradient={def.gradient} glyph={def.glyph} size={16} />
            <span className={`truncate text-[13px] font-medium transition-colors ${focused ? 'text-ink/85' : 'text-ink/40'}`}>
              {def.title}
            </span>
          </div>
        </div>

        {/* Content */}
        {def.bare ? (
          <div className="min-h-0 flex-1">
            <Content params={win.params} paramsKey={win.paramsKey} />
          </div>
        ) : (
          <div className="scrollbar-mac min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-6 sm:px-8 sm:pt-8">
            <Content params={win.params} paramsKey={win.paramsKey} />
          </div>
        )}
      </div>

      {/* Resize handles live outside the rounded clip so the corner stays grabbable. */}
      {!zoomed && (
        <>
          <div onPointerDown={(e) => startResize(e, 'r')} className="absolute -right-1 bottom-4 top-11 w-2 cursor-ew-resize" />
          <div onPointerDown={(e) => startResize(e, 'b')} className="absolute -bottom-1 left-4 right-4 h-2 cursor-ns-resize" />
          <div onPointerDown={(e) => startResize(e, 'rb')} className="absolute -bottom-1.5 -right-1.5 h-5 w-5 cursor-nwse-resize" />
        </>
      )}
    </motion.section>
  );
}

function Light({
  color,
  active,
  label,
  onClick,
  children,
}: {
  color: string;
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex h-3 w-3 items-center justify-center rounded-full text-black/60 transition-[background-color,transform] duration-150 active:scale-90 group-hover/lights:!bg-[var(--c)] [&>svg]:h-2 [&>svg]:w-2 [&>svg]:opacity-0 group-hover/lights:[&>svg]:opacity-100"
      style={{
        ['--c' as string]: color,
        backgroundColor: active ? color : 'rgb(255 255 255 / 0.16)',
        boxShadow: 'inset 0 0 0 0.5px rgb(0 0 0 / 0.25)',
      }}
    >
      {children}
    </button>
  );
}
