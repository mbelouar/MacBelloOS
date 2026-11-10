'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronDown,
  Flag,
  GitMerge,
  GitPullRequest,
  Globe,
  Maximize2,
  Mic,
  PenLine,
  Pin,
  CirclePlay,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import Lightbox from '@/components/ui/Lightbox';
import { AppHeader, Segmented } from '@/components/ui/Section';
import { journal, POST_TYPES, type Post, type PostType } from '@/data/journal';
import { trackPointer } from '@/lib/hooks';

const EASE = [0.32, 0.72, 0, 1] as const;

const TYPE_STYLE: Record<PostType, { icon: LucideIcon; color: string; tint: string }> = {
  opensource: { icon: GitPullRequest, color: '#a78bfa', tint: 'rgb(167 139 250 / 0.14)' },
  achievement: { icon: Trophy, color: '#f5c542', tint: 'rgb(245 197 66 / 0.14)' },
  milestone: { icon: Flag, color: '#4fe0b0', tint: 'rgb(79 224 176 / 0.14)' },
  talk: { icon: Mic, color: '#5fd0ff', tint: 'rgb(95 208 255 / 0.14)' },
  writing: { icon: PenLine, color: '#ff8ab8', tint: 'rgb(255 138 184 / 0.14)' },
};

const GOLD = 'linear-gradient(135deg, #fde68a 0%, #f5c542 45%, #c8901c 100%)';

const fmtDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, (m || 1) - 1, day || 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    ...(day ? { day: 'numeric' } : {}),
  });
};

type Filter = 'all' | PostType;

export default function JournalApp() {
  const [filter, setFilter] = useState<Filter>('all');

  const sorted = useMemo(
    () => [...journal].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date)),
    [],
  );
  const visible = sorted.filter((p) => filter === 'all' || p.type === filter);

  // Only offer filters for types that actually have posts.
  const presentTypes = (Object.keys(POST_TYPES) as PostType[]).filter((t) => journal.some((p) => p.type === t));
  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...presentTypes.map((t) => ({ value: t as Filter, label: POST_TYPES[t].plural })),
  ];

  // Group by year, keeping pinned posts in their own group at the top.
  const groups = useMemo(() => {
    const out: { key: string; label: string; posts: Post[] }[] = [];
    for (const p of visible) {
      const key = p.pinned && filter === 'all' ? 'pinned' : p.date.slice(0, 4);
      let g = out.find((x) => x.key === key);
      if (!g) out.push((g = { key, label: key === 'pinned' ? 'Pinned' : key, posts: [] }));
      g.posts.push(p);
    }
    return out;
  }, [visible, filter]);

  const counts = presentTypes.map((t) => ({ type: t, n: journal.filter((p) => p.type === t).length }));

  return (
    <div className="mx-auto max-w-3xl">
      <AppHeader
        eyebrow="Contributions & milestones"
        title="Journal"
        subtitle="Open-source work, wins and moments worth writing down — newest first."
      />

      <div className="-mt-2 mb-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="scrollbar-none -mx-1 overflow-x-auto px-1 pb-1">
          <Segmented value={filter} options={filters} onChange={setFilter} />
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-ink-faint">
          {counts.map(({ type, n }) => {
            const s = TYPE_STYLE[type];
            return (
              <span key={type} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                {n} {n === 1 ? POST_TYPES[type].label.toLowerCase() : POST_TYPES[type].plural.toLowerCase()}
              </span>
            );
          })}
        </div>
      </div>

      <div className="relative">
        {/* Timeline rail */}
        <span aria-hidden className="absolute bottom-0 left-[15px] top-2 w-px bg-gradient-to-b from-white/15 via-white/[0.07] to-transparent" />

        <AnimatePresence mode="popLayout" initial={false}>
          {groups.map((g) => (
            <motion.section key={`${filter}-${g.key}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative mb-3 flex items-center gap-3 pt-1">
                <span className="relative z-10 flex h-[31px] w-[31px] items-center justify-center rounded-full bg-[#1b1b20] ring-1 ring-white/10">
                  {g.key === 'pinned' ? <Pin className="h-3.5 w-3.5 text-ink-muted" /> : <span className="h-1.5 w-1.5 rounded-full bg-white/40" />}
                </span>
                <h2 className="font-mono text-xs font-semibold tracking-wider text-ink-muted">{g.label}</h2>
              </div>
              <ol className="mb-8 space-y-4">
                {g.posts.map((p, i) => (
                  <PostEntry key={p.id} post={p} index={i} />
                ))}
              </ol>
            </motion.section>
          ))}
        </AnimatePresence>

        {visible.length === 0 && <p className="py-10 text-center text-sm text-ink-faint">Nothing here yet.</p>}
      </div>
    </div>
  );
}

function PostEntry({ post: p, index }: { post: Post; index: number }) {
  const s = TYPE_STYLE[p.type];
  const Icon = s.icon;
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const isAward = p.type === 'achievement' && p.badge;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
      className="relative flex gap-4"
    >
      {/* Rail marker */}
      <span
        className="relative z-10 mt-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-[#17171b]"
        style={{ background: s.tint, color: s.color }}
      >
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </span>

      <article
        onPointerMove={trackPointer}
        className="card spotlight min-w-0 flex-1 overflow-hidden"
        style={isAward ? { boxShadow: 'inset 0 1px 0 0 rgb(255 255 255 / 0.06), 0 0 0 1px rgb(245 197 66 / 0.3), 0 24px 60px -36px rgb(245 197 66 / 0.6)' } : undefined}
      >
        {p.image && (
          <button type="button" onClick={() => setZoom(true)} aria-label="Enlarge photo" className="group/photo relative block aspect-[16/9] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image.src}
              alt={p.image.alt}
              className="absolute inset-0 h-full w-full object-cover object-[50%_40%] transition-transform duration-700 ease-mac group-hover/photo:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {p.image.caption && (
              <span className="absolute bottom-3 left-4 text-[11px] font-medium text-white/85">{p.image.caption}</span>
            )}
            <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity group-hover/photo:opacity-100">
              <Maximize2 className="h-3.5 w-3.5" />
            </span>
          </button>
        )}

        <div className="p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-full px-2 py-0.5 font-semibold uppercase tracking-wider" style={{ background: s.tint, color: s.color }}>
              {POST_TYPES[p.type].label}
            </span>
            <time className="font-mono text-ink-faint" dateTime={p.date}>
              {fmtDate(p.date)}
            </time>
          </div>

          <h3 className="flex flex-wrap items-center gap-2 text-[17px] font-semibold leading-snug tracking-tight">
            {p.title}
            {p.badge && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3a2600]"
                style={{ background: GOLD }}
              >
                <Trophy className="h-3 w-3" strokeWidth={2.5} />
                {p.badge}
              </span>
            )}
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">{p.summary}</p>

          {p.contribution && <ContributionPanel c={p.contribution} />}

          {p.body && p.body.length > 0 && (
            <>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pt-2 text-[13.5px] leading-relaxed text-ink-muted">
                      {p.body.map((para) => (
                        <p key={para}>{para}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                {expanded ? 'Show less' : 'Read more'}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </>
          )}

          {(p.tags?.length || p.links?.length) && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {p.tags?.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.links?.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 text-xs font-medium text-ink-muted shadow-card transition-colors hover:bg-white/[0.12] hover:text-ink"
                  >
                    <LinkIcon kind={l.kind} />
                    {l.label}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {p.image && (
        <Lightbox open={zoom} onClose={() => setZoom(false)} src={p.image.src} alt={p.image.alt} caption={p.image.caption ?? ''} />
      )}
    </motion.li>
  );
}

/** GitHub-style pull-request summary. */
function ContributionPanel({ c }: { c: NonNullable<Post['contribution']> }) {
  const status = {
    merged: { label: 'Merged', bg: '#8957e5', icon: GitMerge },
    open: { label: 'Open', bg: '#238636', icon: GitPullRequest },
    closed: { label: 'Closed', bg: '#6e7681', icon: GitPullRequest },
  }[c.status];
  const StatusIcon = status.icon;
  const total = (c.additions ?? 0) + (c.deletions ?? 0);
  const addShare = total ? Math.round(((c.additions ?? 0) / total) * 5) : 0;

  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-black/30 px-3.5 py-3 font-mono text-[12px] ring-1 ring-white/[0.07] transition-colors hover:ring-white/15"
    >
      <GithubIcon className="h-4 w-4 shrink-0 text-ink-muted" />
      <span className="min-w-0 truncate text-ink">
        {c.repo}
        {c.pr && <span className="text-ink-faint"> #{c.pr}</span>}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold text-white" style={{ background: status.bg }}>
        <StatusIcon className="h-3 w-3" />
        {status.label}
      </span>
      {total > 0 && (
        <span className="ml-auto flex items-center gap-2">
          <span className="text-[#3fb950]">+{c.additions ?? 0}</span>
          <span className="text-[#f85149]">−{c.deletions ?? 0}</span>
          <span className="flex gap-0.5" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`h-2 w-2 rounded-[2px] ${i < addShare ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} />
            ))}
          </span>
        </span>
      )}
      <ArrowUpRight className="h-3.5 w-3.5 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function LinkIcon({ kind }: { kind?: string }) {
  if (kind === 'linkedin') return <LinkedinIcon className="h-3.5 w-3.5 text-[#5aa4ff]" />;
  if (kind === 'github') return <GithubIcon className="h-3.5 w-3.5" />;
  if (kind === 'video') return <CirclePlay className="h-3.5 w-3.5" />;
  return <Globe className="h-3.5 w-3.5" />;
}
