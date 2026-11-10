'use client';

import { useId, type ComponentType, type CSSProperties } from 'react';

type Glyph = ComponentType<{ className?: string; style?: CSSProperties; strokeWidth?: number; color?: string; fill?: string }>;

interface AppIconProps {
  icon: Glyph;
  /** Signature color: tints the inner glow and the glyph gradient. */
  accent: string;
  size?: number;
  /** Set for filled brand marks (GitHub, LinkedIn) instead of stroked Lucide icons. */
  filled?: boolean;
  className?: string;
}

/**
 * "Graphite glass" app icon: a dark glass squircle with a fine rim, a glossy top sheen and
 * an accent glow rising from the bottom. The glyph is painted with a white → accent gradient
 * plus a faint halo, so every app shares one material and differs only by its accent.
 */
export default function AppIcon({ icon: Icon, accent, size = 56, filled = false, className = '' }: AppIconProps) {
  const id = `ai${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const paint = `url(#${id})`;
  const glyph = Math.round(size * 0.48);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.235,
        background: [
          `radial-gradient(110% 75% at 50% 118%, ${accent}66 0%, ${accent}1f 45%, transparent 70%)`,
          'radial-gradient(90% 55% at 50% -12%, rgb(255 255 255 / 0.20) 0%, transparent 70%)',
          'linear-gradient(180deg, #3a3a43 0%, #202026 48%, #131317 100%)',
        ].join(', '),
        boxShadow: [
          'inset 0 0.75px 0 rgb(255 255 255 / 0.38)',
          'inset 0 0 0 0.75px rgb(255 255 255 / 0.09)',
          'inset 0 -1.5px 3px rgb(0 0 0 / 0.55)',
          '0 1px 1.5px rgb(0 0 0 / 0.45)',
          `0 ${size * 0.16}px ${size * 0.34}px -${size * 0.12}px rgb(0 0 0 / 0.75)`,
        ].join(', '),
      }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="2" x2="0" y2="22">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor={accent} />
          </linearGradient>
        </defs>
      </svg>
      <Icon
        className="relative"
        style={{
          width: glyph,
          height: glyph,
          filter: `drop-shadow(0 0 ${Math.max(1, size * 0.07)}px ${accent}99)`,
        }}
        {...(filled ? { fill: paint } : { color: paint, strokeWidth: 1.75 })}
      />
    </span>
  );
}
