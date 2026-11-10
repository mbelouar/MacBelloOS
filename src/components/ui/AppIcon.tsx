import type { ComponentType, CSSProperties } from 'react';

type Glyph = ComponentType<{ className?: string; style?: CSSProperties; strokeWidth?: number; color?: string; fill?: string }>;

interface AppIconProps {
  icon: Glyph;
  /** Two-stop vertical gradient: [top, bottom]. */
  tint: readonly [string, string];
  /** Symbol color (white by default). */
  glyph?: string;
  size?: number;
  /** Set for filled brand marks (GitHub, LinkedIn) instead of stroked Lucide icons. */
  filled?: boolean;
  className?: string;
}

/**
 * iOS-style app icon: a soft squircle with a light-to-rich vertical gradient, a crisp top
 * highlight, a gentle darker base and a bold, generously sized symbol.
 */
export default function AppIcon({ icon: Icon, tint, glyph = '#ffffff', size = 56, filled = false, className = '' }: AppIconProps) {
  const glyphSize = Math.round(size * 0.52);
  // Keep strokes visually consistent: slightly heavier on small icons.
  const stroke = size <= 20 ? 2.4 : size <= 32 ? 2.2 : 2;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: `linear-gradient(180deg, ${tint[0]} 0%, ${tint[1]} 100%)`,
        boxShadow: [
          'inset 0 1px 0 rgb(255 255 255 / 0.45)',
          'inset 0 0 0 0.5px rgb(255 255 255 / 0.18)',
          'inset 0 -2px 5px rgb(0 0 0 / 0.14)',
          '0 1px 2px rgb(0 0 0 / 0.30)',
          `0 ${size * 0.12}px ${size * 0.26}px -${size * 0.08}px rgb(0 0 0 / 0.50)`,
        ].join(', '),
      }}
    >
      {/* Soft top sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{ background: 'linear-gradient(180deg, rgb(255 255 255 / 0.18), rgb(255 255 255 / 0))' }}
      />
      <Icon
        className="relative"
        style={{
          width: glyphSize,
          height: glyphSize,
          filter: size > 24 ? 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.18))' : undefined,
        }}
        {...(filled ? { fill: glyph } : { color: glyph, strokeWidth: stroke })}
      />
    </span>
  );
}
