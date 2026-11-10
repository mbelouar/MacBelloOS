'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/ui/BrandIcons';
import { AppHeader, Segmented } from '@/components/ui/Section';
import { profile, projects, type Project, type ProjectCategory } from '@/data/portfolio';
import { trackPointer } from '@/lib/hooks';
import type { AppProps } from './registry';

type Filter = 'all' | ProjectCategory;

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
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
      >
        <div className="scrollbar-none -mx-1 max-w-full overflow-x-auto px-1">
          <Segmented value={filter} options={filters} onChange={setFilter} />
        </div>
      </AppHeader>

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
      } ${highlighted ? 'ring-2 ring-accent/70 ring-offset-0' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {p.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                <Sparkles className="h-3 w-3" />
                Featured
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
        </div>
      </div>

      <p className={`mt-3 text-[13.5px] leading-relaxed text-ink-muted ${p.featured ? 'max-w-3xl' : ''}`}>
        {p.description}
      </p>

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
