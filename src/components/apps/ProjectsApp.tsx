'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, ChevronDown, Lock, MessageSquare, Sparkles } from 'lucide-react';
import { useOS } from '@/components/os/OSContext';
import { GithubIcon } from '@/components/ui/BrandIcons';
import { AppHeader, Segmented } from '@/components/ui/Section';
import { profile, projects, type CaseStudy, type Project, type ProjectCategory } from '@/data/portfolio';
import { trackPointer } from '@/lib/hooks';
import type { AppProps } from './registry';

type Filter = 'all' | ProjectCategory;

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ai', label: 'AI & QA' },
  { value: 'devops', label: 'Cloud & DevOps' },
  { value: 'fullstack', label: 'Full-stack' },
  { value: 'data', label: 'Data' },
  { value: 'systems', label: 'Systems' },
];

export default function ProjectsApp({ params, paramsKey }: AppProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [highlight, setHighlight] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  // Deep-link from Spotlight / widgets: reset the filter and pulse the requested project.
  const request = params?.project ? `${params.project}:${paramsKey ?? 0}` : null;
  const [handled, setHandled] = useState<string | null>(null);
  if (request !== handled) {
    setHandled(request);
    if (params?.project) {
      setFilter('all');
      setHighlight(params.project);
    }
  }

  useEffect(() => {
    const id = params?.project;
    if (!id) return;
    const t1 = window.setTimeout(() => refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
    const t2 = window.setTimeout(() => setHighlight(null), 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [params?.project, paramsKey]);

  const visible = useMemo(
    () => projects.filter((p) => filter === 'all' || p.category === filter),
    [filter],
  );

  return (
    <div className="mx-auto max-w-4xl">
      <AppHeader
        eyebrow={`${projects.length} projects`}
        title="Projects"
        subtitle="Infrastructure, platforms and products I've designed, built and shipped."
      />
      <div className="scrollbar-none -mx-1 -mt-2 mb-5 overflow-x-auto px-1 pb-1">
        <Segmented value={filter} options={filters} onChange={setFilter} />
      </div>

      <motion.div layout className="grid gap-3 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              highlighted={highlight === p.id}
              innerRef={(el) => {
                refs.current[p.id] = el;
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <a
        href={`${profile.github}?tab=repositories`}
        target="_blank"
        rel="noopener noreferrer"
        className="card card-hover group mt-3 flex items-center justify-between p-4"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
            <GithubIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-medium">More on GitHub</span>
            <span className="block text-xs text-ink-faint">{profile.githubHandle} · all repositories</span>
          </span>
        </span>
        <ArrowUpRight className="h-4 w-4 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
      </a>
    </div>
  );
}

function ProjectCard({
  project: p,
  index,
  highlighted,
  innerRef,
}: {
  project: Project;
  index: number;
  highlighted: boolean;
  innerRef: (el: HTMLElement | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      ref={innerRef}
      layout
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.32, 0.72, 0, 1] }}
      onPointerMove={trackPointer}
      className={`card spotlight group flex flex-col p-5 transition-shadow duration-500 ${
        p.featured ? 'md:col-span-2' : ''
      } ${highlighted ? 'ring-2 ring-accent/70 ring-offset-0' : ''} ${
        p.proprietary ? 'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.05),0_0_0_1px_rgb(199_70_52/0.35),0_20px_60px_-30px_rgb(199_70_52/0.6)]' : ''
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {p.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}
            {p.proprietary && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#c74634]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#ff8a75] ring-1 ring-[#c74634]/30">
                <Lock className="h-3 w-3" />
                Proprietary · {p.proprietary.org}
              </span>
            )}
            <span className="font-mono text-[11px] text-ink-faint">
              {p.year} · {p.type}
            </span>
          </div>
          <h3 className={`font-semibold tracking-tight ${p.featured ? 'text-2xl' : 'text-lg'}`}>{p.name}</h3>
          <p className="mt-0.5 text-sm text-ink-muted">{p.subtitle}</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          {p.demo && (
            <a
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.name} live demo`}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-medium text-black transition-colors hover:bg-white/90"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              Live
            </a>
          )}
          {p.caseStudy && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-medium text-black transition-colors hover:bg-white/90"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Case study
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>
          )}
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.name} source code on GitHub`}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 text-xs font-medium text-ink-muted shadow-card transition-colors hover:bg-white/[0.12] hover:text-ink"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              Code
              <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      <p className={`mt-3 text-[13.5px] leading-relaxed text-ink-muted ${p.featured ? 'max-w-3xl' : ''}`}>
        {p.description}
      </p>

      <AnimatePresence initial={false}>
        {open && p.caseStudy && <CaseStudyPanel project={p} caseStudy={p.caseStudy} />}
      </AnimatePresence>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
        {p.tech.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

function CaseStudyPanel({ project: p, caseStudy: cs }: { project: Project; caseStudy: CaseStudy }) {
  const { open } = useOS();
  const EASE = [0.32, 0.72, 0, 1] as const;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="mt-5 space-y-5 border-t border-white/[0.07] pt-5">
        {/* Problem */}
        <div>
          <p className="eyebrow mb-1.5">The problem</p>
          <p className="max-w-3xl text-[13.5px] leading-relaxed text-ink">{cs.problem}</p>
        </div>

        {/* Pipeline */}
        <div>
          <p className="eyebrow mb-3">How it works</p>
          <ol className="relative grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {cs.pipeline.map((s, i) => (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: EASE }}
                className="relative rounded-xl bg-black/25 p-3 ring-1 ring-white/[0.06]"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-b from-[#ff8a75] to-[#c74634] font-mono text-[11px] font-semibold text-white shadow-[0_4px_10px_-2px_rgb(199_70_52/0.6)]">
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-semibold">{s.step}</span>
                </div>
                <p className="text-[11.5px] leading-snug text-ink-faint">{s.detail}</p>
                {i < cs.pipeline.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-2.5 top-1/2 hidden h-px w-2 -translate-y-1/2 bg-gradient-to-r from-[#ff8a75] to-transparent lg:block"
                  />
                )}
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cs.results.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.45 + i * 0.06, ease: EASE }}
              className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.06]"
            >
              <p className="text-2xl font-semibold tracking-tight">{r.value}</p>
              <p className="text-[11px] text-ink-faint">{r.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Confidentiality note + CTA */}
        {p.proprietary && (
          <div className="flex flex-col gap-3 rounded-xl bg-[#c74634]/[0.08] p-4 ring-1 ring-[#c74634]/20 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-muted">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ff8a75]" />
              {p.proprietary.note}
            </p>
            <button
              type="button"
              onClick={() => open('contact', { subject: `About your ${p.name}` })}
              className="btn-primary shrink-0 !py-2 text-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Ask me about it
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
