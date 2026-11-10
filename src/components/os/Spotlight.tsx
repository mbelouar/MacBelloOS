'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import {
  ArrowUpRight,
  BadgeCheck,
  Copy,
  CornerDownLeft,
  Cpu,
  FileText,
  FolderGit2,
  Lock,
  Mail,
  NotebookPen,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { APPS } from '@/components/apps/registry';
import AppIcon from '@/components/ui/AppIcon';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { certifications, certMeta, profile, projects, skillCategories } from '@/data/portfolio';
import { journal } from '@/data/journal';
import { useOS } from './OSContext';

interface Result {
  id: string;
  group: 'Applications' | 'Projects' | 'Journal' | 'Skills' | 'Certifications' | 'Actions';
  title: string;
  subtitle?: string;
  keywords: string;
  icon: React.ReactNode;
  run: () => void;
}

const glyph = (Icon: LucideIcon | ((p: React.SVGProps<SVGSVGElement>) => React.ReactElement), tint = 'text-ink-muted') => (
  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08]">
    <Icon className={`h-4 w-4 ${tint}`} />
  </span>
);

const GROUP_ORDER: Result['group'][] = ['Applications', 'Actions', 'Projects', 'Journal', 'Skills', 'Certifications'];

/** Simple scorer: prefix matches beat word matches beat substring matches. */
function score(r: Result, q: string) {
  const title = r.title.toLowerCase();
  if (title.startsWith(q)) return 3;
  if (title.split(/[\s/—-]+/).some((w) => w.startsWith(q))) return 2;
  if (`${title} ${r.subtitle ?? ''} ${r.keywords}`.toLowerCase().includes(q)) return 1;
  return 0;
}

export default function Spotlight() {
  const { spotlightOpen } = useOS();
  // A new key per opening guarantees a fresh panel, even if reopened mid-exit-animation.
  const [generation, setGeneration] = useState(0);
  const [wasOpen, setWasOpen] = useState(spotlightOpen);
  if (spotlightOpen !== wasOpen) {
    setWasOpen(spotlightOpen);
    if (spotlightOpen) setGeneration((g) => g + 1);
  }
  return <AnimatePresence>{spotlightOpen && <SpotlightPanel key={generation} />}</AnimatePresence>;
}

/** Mounted only while open, so query/selection reset naturally each time. */
function SpotlightPanel() {
  const os = useOS();
  const present = useIsPresent();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const close = () => os.setSpotlightOpen(false);

  const all = useMemo<Result[]>(
    () => [
      ...APPS.map((a) => ({
        id: `app-${a.id}`,
        group: 'Applications' as const,
        title: a.name,
        subtitle: 'Application',
        keywords: a.keywords,
        icon: <AppIcon icon={a.icon} accent={a.accent} size={28} />,
        run: () => os.open(a.id),
      })),
      {
        id: 'act-cv',
        group: 'Actions',
        title: 'Résumé (English)',
        subtitle: 'PDF',
        keywords: 'cv resume pdf download english en',
        icon: glyph(FileText),
        run: () => os.open('resume', { lang: 'en' }),
      },
      {
        id: 'act-cv-fr',
        group: 'Actions',
        title: 'CV (Français)',
        subtitle: 'PDF',
        keywords: 'cv resume pdf download french francais fr',
        icon: glyph(FileText),
        run: () => os.open('resume', { lang: 'fr' }),
      },
      {
        id: 'act-email',
        group: 'Actions',
        title: 'Copy Email Address',
        subtitle: profile.email,
        keywords: 'mail contact clipboard',
        icon: glyph(Copy),
        run: () => {
          navigator.clipboard
            ?.writeText(profile.email)
            .then(() => os.notify({ title: 'Email copied', body: profile.email }))
            .catch(() => {});
        },
      },
      {
        id: 'act-message',
        group: 'Actions',
        title: 'Send a Message',
        subtitle: 'Contact form',
        keywords: 'hire email write contact',
        icon: glyph(Mail),
        run: () => os.open('contact'),
      },
      {
        id: 'act-github',
        group: 'Actions',
        title: 'Open GitHub',
        subtitle: profile.githubHandle,
        keywords: 'code repositories source',
        icon: glyph(GithubIcon),
        run: () => window.open(profile.github, '_blank', 'noopener'),
      },
      {
        id: 'act-linkedin',
        group: 'Actions',
        title: 'Open LinkedIn',
        subtitle: 'Profile',
        keywords: 'network social',
        icon: glyph(LinkedinIcon, 'text-[#5aa4ff]'),
        run: () => window.open(profile.linkedin, '_blank', 'noopener'),
      },
      {
        id: 'act-lock',
        group: 'Actions',
        title: 'Lock Screen',
        keywords: 'sleep logout',
        icon: glyph(Lock),
        run: os.lock,
      },
      ...projects.map((p) => ({
        id: `proj-${p.id}`,
        group: 'Projects' as const,
        title: p.name,
        subtitle: p.subtitle,
        keywords: p.tech.join(' '),
        icon: glyph(FolderGit2, 'text-[#ffb547]'),
        run: () => os.open('projects', { project: p.id }),
      })),
      ...journal.map((post) => ({
        id: `post-${post.id}`,
        group: 'Journal' as const,
        title: post.title,
        subtitle: post.date.slice(0, 4),
        keywords: `${post.summary} ${(post.tags ?? []).join(' ')}`,
        icon: glyph(NotebookPen, 'text-[#8f9bff]'),
        run: () => os.open('journal'),
      })),
      ...skillCategories.flatMap((c) =>
        c.skills.map((s) => ({
          id: `skill-${c.id}-${s.name}`,
          group: 'Skills' as const,
          title: s.name,
          subtitle: c.title,
          keywords: '',
          icon: glyph(Cpu, 'text-[#b69cff]'),
          run: () => os.open('skills', { q: s.name }),
        })),
      ),
      ...certifications.map((c) => ({
        id: `cert-${c.id}`,
        group: 'Certifications' as const,
        title: c.short,
        subtitle: certMeta(c),
        keywords: c.name,
        icon: glyph(BadgeCheck, 'text-[#ff8ab8]'),
        run: () => os.open('certifications'),
      })),
    ],
    [os],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all.filter((r) => r.group === 'Applications' || r.id === 'act-cv' || r.id === 'act-cv-fr' || r.id === 'act-email');
    const ranked = all
      .map((r) => ({ r, s: score(r, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || GROUP_ORDER.indexOf(a.r.group) - GROUP_ORDER.indexOf(b.r.group))
      .slice(0, 14)
      .map((x) => x.r);
    // Keep results grouped, with the group holding the best match first (sort is stable).
    const groups = [...new Set(ranked.map((r) => r.group))];
    return ranked.sort((a, b) => groups.indexOf(a.group) - groups.indexOf(b.group));
  }, [all, query]);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const execute = (r?: Result) => {
    if (!r) return;
    close();
    r.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      execute(results[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[9800] flex items-start justify-center bg-black/25 px-4 pt-[14vh]"
      style={{ pointerEvents: present ? 'auto' : 'none' }}
      onPointerDown={(e) => e.target === e.currentTarget && close()}
    >
      <motion.div
        role="dialog"
        aria-label="Spotlight search"
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -6 }}
        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        className="material-thick w-full max-w-[640px] overflow-hidden rounded-2xl shadow-popover"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 px-4">
          <Search className="h-5 w-5 shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search apps, projects, skills…"
            aria-label="Search"
            aria-controls="spotlight-results"
            aria-activedescendant={results[active] ? `sr-${results[active].id}` : undefined}
            className="h-14 flex-1 bg-transparent text-[19px] font-light text-ink placeholder:text-ink-faint focus:outline-none"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="hidden rounded-md bg-white/[0.08] px-1.5 py-0.5 font-sans text-[11px] text-ink-faint sm:block">esc</kbd>
        </div>

        <div
          ref={listRef}
          id="spotlight-results"
          role="listbox"
          className="scrollbar-mac max-h-[min(420px,55vh)] overflow-y-auto border-t border-white/[0.07] p-2"
        >
          {results.length === 0 && <p className="px-3 py-8 text-center text-sm text-ink-faint">No results for “{query}”</p>}
          {results.map((r, i) => {
            const header = i === 0 || results[i - 1].group !== r.group ? r.group : null;
            const isActive = i === active;
            return (
              <div key={r.id}>
                {header && <p className="px-3 pb-1 pt-2.5 text-[11px] font-semibold text-ink-faint">{header}</p>}
                <button
                  id={`sr-${r.id}`}
                  data-idx={i}
                  role="option"
                  aria-selected={isActive}
                  onPointerMove={() => !isActive && setActive(i)}
                  onClick={() => execute(r)}
                  className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left transition-colors duration-75 ${
                    isActive ? 'bg-[#2f64d6] text-white' : 'text-ink'
                  }`}
                >
                  {r.icon}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium">{r.title}</span>
                  </span>
                  {r.subtitle && (
                    <span
                      className={`hidden max-w-[45%] truncate text-xs sm:block ${isActive ? 'text-white/75' : 'text-ink-faint'}`}
                    >
                      {r.subtitle}
                    </span>
                  )}
                  {isActive &&
                    (r.id.startsWith('act-github') || r.id.startsWith('act-linkedin') ? (
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-white/80" />
                    ) : (
                      <CornerDownLeft className="h-4 w-4 shrink-0 text-white/80" />
                    ))}
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
