'use client';

import { motion } from 'framer-motion';
import { AppHeader } from '@/components/ui/Section';
import { experiences } from '@/data/portfolio';
import { trackPointer } from '@/lib/hooks';

export default function ExperienceApp() {
  return (
    <div className="mx-auto max-w-3xl">
      <AppHeader eyebrow="Career" title="Experience" subtitle="Internships and leadership roles that shaped how I work." />

      <ol className="relative">
        {/* Timeline rail */}
        <span
          aria-hidden
          className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-accent/50 via-white/10 to-transparent"
        />
        {experiences.map((e, i) => (
          <motion.li
            key={e.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] }}
            className="relative flex gap-4 pb-4 last:pb-0 sm:gap-5"
          >
            <div
              className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_8px_20px_-8px_rgb(0_0_0/0.8)] ring-4 ring-[#17171b] ${
                e.logoCover ? '' : 'p-2'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.logo} alt={`${e.company} logo`} className={`h-full w-full ${e.logoCover ? 'object-cover' : 'object-contain'}`} />
            </div>

            <article onPointerMove={trackPointer} className="card spotlight min-w-0 flex-1 p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold tracking-tight">{e.role}</h3>
                  <p className="text-sm text-ink-muted">{e.company}</p>
                </div>
                <span className="chip !text-[10px] uppercase tracking-wider">{e.type}</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-accent/90">{e.period}</p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">{e.description}</p>
              <ul className="mt-3 space-y-1.5">
                {e.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-[13px] text-ink-muted">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {e.tech.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
