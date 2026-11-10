'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, HeartHandshake, MonitorSmartphone, Trophy, type LucideIcon } from 'lucide-react';
import { useOS } from '@/components/os/OSContext';
import { AppHeader, SectionTitle } from '@/components/ui/Section';
import { communityContext, volunteering, type Volunteering } from '@/data/portfolio';
import { trackPointer } from '@/lib/hooks';

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Per-role visual identity keyed by volunteering id, taken from each organization's logo:
 * banner = card header, bar = timeline ribbon (kept bright enough to read on the dark UI).
 */
interface RoleStyle {
  icon: LucideIcon;
  banner: [string, string];
  bar: [string, string];
  barText: string;
  short: string;
}
const STYLE: Record<string, RoleStyle> = {
  'sports-club': {
    icon: Trophy,
    banner: ['#2e2e34', '#050506'],
    bar: ['#ffffff', '#9b9ba5'],
    barText: 'text-black/75',
    short: '1337 MED Sports Club',
  },
  ecdh: {
    icon: MonitorSmartphone,
    banner: ['#a5cd5a', '#21351f'],
    bar: ['#c4e483', '#5f9a3c'],
    barText: 'text-[#13240f]/80',
    short: 'ECDH',
  },
};
const FALLBACK: RoleStyle = {
  icon: HeartHandshake,
  banner: ['#ff9f6b', '#f0503c'],
  bar: ['#ff9f6b', '#f0503c'],
  barText: 'text-black/70',
  short: '',
};

const monthIndex = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};
const monthsBetween = (start: string, end: string) => monthIndex(end) - monthIndex(start) + 1;
const fmtDuration = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y}y`, m && `${m}m`].filter(Boolean).join(' ') || '1m';
};
const fmtMonth = (ym: string) =>
  new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

export default function CommunityApp() {
  const totalMonths = volunteering.reduce((n, v) => n + monthsBetween(v.start, v.end), 0);

  const stats = [
    { value: volunteering.length, label: 'Organizations' },
    { value: totalMonths, label: 'Months volunteered' },
    { value: 1, label: 'Club founded' },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <AppHeader
        eyebrow="Beyond the code"
        title="Community"
        subtitle="Volunteering and student life — where I learned to lead people, organize events and keep things running for others."
      />

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
            className="card p-4"
          >
            <p className="text-3xl font-semibold tabular-nums tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-ink-faint">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <SectionTitle>Timeline</SectionTitle>
      <Ribbon />

      <SectionTitle>Roles</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        {volunteering.map((v, i) => (
          <RoleCard key={v.id} v={v} index={i} />
        ))}
      </div>
    </div>
  );
}

/** Gantt-style ribbon showing how commitments overlapped over the years. */
function Ribbon() {
  const { open } = useOS();
  const rows = [
    ...volunteering.map((v) => ({ id: v.id, label: STYLE[v.id]?.short || v.org, start: v.start, end: v.end, context: false, logo: v.logo, logoBg: v.logoBg })),
    ...communityContext.map((c) => ({ ...c, context: true })),
  ];
  const first = Math.min(...rows.map((r) => monthIndex(r.start)));
  const last = Math.max(...rows.map((r) => monthIndex(r.end)));
  const startYear = Math.floor(first / 12);
  const endYear = Math.floor(last / 12) + 1;
  const span = (endYear - startYear) * 12;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <div className="card overflow-hidden p-4 sm:p-5">
      <div className="relative">
        {/* Year gridlines */}
        <div className="pointer-events-none absolute inset-0 ml-[38%] sm:ml-[30%]">
          {years.map((y, i) => (
            <div
              key={y}
              className="absolute bottom-0 top-0 border-l border-dashed border-white/[0.07]"
              style={{ left: `${(i / (years.length - 1)) * 100}%` }}
            />
          ))}
        </div>

        <div className="relative space-y-3">
          {rows.map((r, i) => {
            const s = STYLE[r.id] ?? FALLBACK;
            const left = ((monthIndex(r.start) - startYear * 12) / span) * 100;
            const width = ((monthIndex(r.end) - monthIndex(r.start) + 1) / span) * 100;
            return (
              <div key={r.id} className="flex items-center gap-3">
                <div className="w-[38%] shrink-0 sm:w-[30%]">
                  {r.context ? (
                    <button
                      onClick={() => open('experience')}
                      className="group flex max-w-full items-center gap-2 text-left text-xs text-ink-muted hover:text-ink"
                    >
                      {r.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.logo} alt="" className="h-5 w-5 shrink-0 rounded-md object-contain ring-1 ring-white/10" style={{ background: r.logoBg }} />
                      )}
                      <span className="truncate">{r.label}</span>
                      <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ) : (
                    <p className="flex items-center gap-2 text-xs font-medium text-ink">
                      {r.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.logo} alt="" className="h-5 w-5 shrink-0 rounded-md object-contain ring-1 ring-white/10" style={{ background: r.logoBg }} />
                      )}
                      <span className="truncate">{r.label}</span>
                    </p>
                  )}
                </div>
                <div className="relative h-6 flex-1">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE }}
                    title={`${fmtMonth(r.start)} — ${fmtMonth(r.end)}`}
                    className={`absolute inset-y-0 origin-left rounded-full ${r.context ? 'border border-dashed border-white/20 bg-white/[0.04]' : ''}`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      background: r.context ? undefined : `linear-gradient(90deg, ${s.bar[0]}, ${s.bar[1]})`,
                      boxShadow: r.context ? undefined : `0 6px 18px -6px ${s.bar[1]}99`,
                    }}
                  />
                  <span
                    className={`absolute inset-y-0 flex items-center px-2.5 text-[10px] font-semibold ${
                      r.context ? 'text-ink-faint' : s.barText
                    }`}
                    style={{ left: `${left}%` }}
                  >
                    {fmtDuration(monthsBetween(r.start, r.end))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Year axis */}
        <div className="relative ml-[38%] mt-3 h-4 sm:ml-[30%]">
          {years.map((y, i) => (
            <span
              key={y}
              className="absolute -translate-x-1/2 font-mono text-[10px] text-ink-faint first:translate-x-0 last:-translate-x-full"
              style={{ left: `${(i / (years.length - 1)) * 100}%` }}
            >
              {y}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoleCard({ v, index }: { v: Volunteering; index: number }) {
  const s = STYLE[v.id] ?? FALLBACK;
  const Icon = s.icon;
  const months = monthsBetween(v.start, v.end);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.08, ease: EASE }}
      onPointerMove={trackPointer}
      className="card spotlight group flex flex-col overflow-hidden"
    >
      {/* Gradient banner with the duration as a big numeral */}
      <div
        className="relative flex h-28 items-end justify-between overflow-hidden p-4"
        style={{ background: `linear-gradient(135deg, ${s.banner[0]}, ${s.banner[1]})` }}
      >
        <Icon
          aria-hidden
          className="absolute -right-4 -top-4 h-32 w-32 text-white/15 transition-transform duration-700 ease-mac group-hover:rotate-6 group-hover:scale-110"
          strokeWidth={1.25}
        />
        <span
          className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl p-1.5 shadow-[0_10px_24px_-8px_rgb(0_0_0/0.7)] ring-1 ring-white/20 transition-transform duration-500 ease-mac group-hover:-rotate-3 group-hover:scale-105"
          style={{ background: v.logoBg }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.logo} alt={`${v.org} logo`} className="h-full w-full object-contain" />
        </span>
        <span className="relative text-right text-white">
          <span className="block text-3xl font-semibold leading-none tracking-tight drop-shadow-sm">{fmtDuration(months)}</span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-white/80">{v.cause}</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[17px] font-semibold tracking-tight">{v.role}</h3>
        <p className="text-sm text-ink-muted">{v.org}</p>
        <p className="mt-1 font-mono text-[11px] text-accent/90">
          {fmtMonth(v.start)} — {fmtMonth(v.end)}
        </p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">{v.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {v.highlights.map((h) => (
            <span key={h} className="chip">
              {h}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
