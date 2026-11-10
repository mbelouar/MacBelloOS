'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { AppHeader, SectionTitle } from '@/components/ui/Section';
import { skillCategories, skillLevelLabel, spokenLanguages, type Skill } from '@/data/portfolio';
import { trackPointer } from '@/lib/hooks';
import type { AppProps } from './registry';

export default function SkillsApp({ params }: AppProps) {
  const [query, setQuery] = useState(params?.q ?? '');
  const q = query.trim().toLowerCase();

  const groups = useMemo(
    () =>
      skillCategories
        .map((c) => ({ ...c, skills: c.skills.filter((s) => !q || s.name.toLowerCase().includes(q)) }))
        .filter((c) => c.skills.length),
    [q],
  );
  const total = skillCategories.reduce((n, c) => n + c.skills.length, 0);

  return (
    <div className="mx-auto max-w-4xl">
      <AppHeader eyebrow={`${total} technologies`} title="Skills" subtitle="The tools I reach for to build, ship and operate systems.">
        <label className="relative block w-full sm:w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter skills"
            aria-label="Filter skills"
            className="input !py-2 pl-9 pr-8"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear filter"
              className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-ink-muted hover:bg-white/20"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </label>
      </AppHeader>

      <div className="-mt-2 flex flex-wrap items-center gap-4 text-[11px] text-ink-faint">
        {['Expert', 'Advanced', 'Proficient'].map((l, i) => (
          <span key={l} className="flex items-center gap-1.5">
            <Meter level={[95, 85, 75][i]} compact />
            {l}
          </span>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="card flex flex-col items-center gap-2 p-10 text-center">
          <p className="text-sm text-ink-muted">No skills match “{query}”.</p>
          <button className="text-xs text-accent hover:underline" onClick={() => setQuery('')}>
            Clear filter
          </button>
        </div>
      )}

      {groups.map((c, ci) => (
        <section key={c.id}>
          <SectionTitle aside={<span className="font-mono text-[11px] text-ink-faint">{c.skills.length}</span>}>
            {c.title}
          </SectionTitle>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {c.skills.map((s, i) => (
              <SkillTile key={s.name} skill={s} delay={ci * 0.05 + i * 0.025} />
            ))}
          </div>
        </section>
      ))}

      {!q && (
        <section className="pb-2">
          <SectionTitle>Languages</SectionTitle>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {spokenLanguages.map((l) => (
              <div key={l.code} className="card flex items-center gap-3 p-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] font-mono text-xs font-semibold text-ink-muted">
                  {l.code}
                </span>
                <div>
                  <p className="text-sm font-medium">{l.name}</p>
                  <p className="text-xs text-ink-faint">{l.level}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SkillTile({ skill, delay }: { skill: Skill; delay: number }) {
  const [broken, setBroken] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.32, 0.72, 0, 1] }}
      onPointerMove={trackPointer}
      className="card spotlight card-hover group p-3.5"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-white/[0.92] p-2 shadow-[0_4px_12px_-4px_rgb(0_0_0/0.6)] transition-transform duration-300 ease-mac group-hover:scale-105">
          {broken ? (
            <span className="text-sm font-bold text-neutral-700">{skill.name[0]}</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={skill.icon}
              alt=""
              width={24}
              height={24}
             
              decoding="async"
              className="h-full w-full object-contain"
              onError={() => setBroken(true)}
            />
          )}
        </span>
        <div className="min-w-0">
          <p className="line-clamp-2 text-[13px] font-medium leading-tight" title={skill.name}>
            {skill.name}
          </p>
          <p className="text-[11px] text-ink-faint">{skillLevelLabel(skill.level)}</p>
        </div>
      </div>
      <div className="mt-3">
        <Meter level={skill.level} />
      </div>
    </motion.div>
  );
}

/** Five-segment meter: reads at a glance and avoids implying false precision. */
function Meter({ level, compact = false }: { level: number; compact?: boolean }) {
  const filled = level >= 90 ? 5 : level >= 80 ? 4 : 3;
  return (
    <span className={`flex ${compact ? 'w-10 gap-0.5' : 'w-full gap-1'}`} aria-label={`${skillLevelLabel(level)}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`${compact ? 'h-1' : 'h-1.5'} flex-1 rounded-full ${
            i < filled ? 'bg-gradient-to-r from-accent/90 to-accent' : 'bg-white/[0.08]'
          }`}
        />
      ))}
    </span>
  );
}
