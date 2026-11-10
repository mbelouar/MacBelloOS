import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AppIconProps {
  icon: LucideIcon;
  gradient: string;
  glyph?: string;
  size?: number;
  className?: string;
}

/**
 * A macOS Big Sur–style squircle icon: gradient body, top sheen, soft inner rim and a centered glyph.
 * Pure CSS, so it stays crisp at every dock magnification level.
 */
export default function AppIcon({ icon: Icon, gradient, glyph = 'text-white', size = 56, className = '' }: AppIconProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.235,
        background: gradient,
        boxShadow:
          'inset 0 1px 0 rgb(255 255 255 / 0.35), inset 0 -1px 0 rgb(0 0 0 / 0.25), inset 0 0 0 0.5px rgb(255 255 255 / 0.12), 0 4px 12px -2px rgb(0 0 0 / 0.45)',
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{ background: 'linear-gradient(180deg, rgb(255 255 255 / 0.28), rgb(255 255 255 / 0))' }}
      />
      <Icon className={`relative ${glyph}`} style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={1.75} />
    </span>
  );
}
