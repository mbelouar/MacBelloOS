import React from 'react';

export function AppHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h1 className="text-gradient text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px]">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}

export function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-center justify-between">
      <h2 className="eyebrow">{children}</h2>
      {aside}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" className="inline-flex rounded-xl bg-black/25 p-1 shadow-card">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
            value === o.value ? 'bg-white/[0.12] text-ink shadow-card' : 'text-ink-faint hover:text-ink-muted'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
