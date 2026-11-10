'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useOS, type AppId } from '@/components/os/OSContext';
import {
  certifications,
  education,
  experiences,
  profile,
  projects,
  skillCategories,
  skillLevelLabel,
} from '@/data/portfolio';

type Tone = 'out' | 'cmd' | 'err' | 'dim' | 'accent' | 'ok' | 'head';
interface Line {
  text: string;
  tone?: Tone;
}

const PROMPT = 'mohammed@portfolio ~ %';

const APP_ALIASES: Record<string, AppId> = {
  about: 'about',
  projects: 'projects',
  skills: 'skills',
  experience: 'experience',
  certifications: 'certifications',
  certs: 'certifications',
  contact: 'contact',
  resume: 'resume',
  cv: 'resume',
};

const FILES = ['README.md', 'resume.pdf', 'contact.txt'];
const COMMANDS = [
  'help', 'about', 'projects', 'skills', 'experience', 'certifications', 'education', 'contact',
  'open', 'neofetch', 'ls', 'cat', 'pwd', 'whoami', 'date', 'echo', 'history', 'clear', 'exit', 'sudo',
];

const pad = (s: string, n: number) => s + ' '.repeat(Math.max(1, n - s.length));
const L = (text: string, tone: Tone = 'out'): Line => ({ text, tone });

function neofetch(): Line[] {
  const art = [
    '      .--.      ',
    '     |o_o |     ',
    '     |:_/ |     ',
    '    //   \\ \\    ',
    '   (|     | )   ',
    "  /'\\_   _/`\\   ",
    '  \\___)=(___/   ',
  ];
  const skills = skillCategories[0].skills.slice(0, 4).map((s) => s.name).join(', ');
  const info: Line[] = [
    L('mohammed@portfolio', 'accent'),
    L('------------------', 'dim'),
    L(`Name     ${profile.name}`),
    L(`Role     ${profile.role}`),
    L(`Focus    DevOps · Cloud · Kubernetes`),
    L(`Stack    ${skills}`),
    L(`Certs    ${certifications.map((c) => c.short).join(', ')}`),
    L(`Locale   ${profile.location}`),
    L(`Status   ${profile.availability}`, 'ok'),
  ];
  return info.map((l, i) => ({ ...l, text: (art[i] ?? ' '.repeat(16)) + '  ' + l.text }));
}

export default function TerminalApp() {
  const { open, close, notify } = useOS();
  const [lines, setLines] = useState<Line[]>(() => [
    L(`Last login: ${new Date().toDateString()} on ttys000`, 'dim'),
    L(''),
    ...neofetch(),
    L(''),
    L('Type `help` to list commands · Tab completes · ↑/↓ browse history', 'dim'),
    L(''),
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const run = (raw: string) => {
    const cmdLine = raw.trim();
    const echo = L(`${PROMPT} ${raw}`, 'cmd');
    if (!cmdLine) {
      setLines((l) => [...l, echo]);
      return;
    }
    setHistory((h) => [...h.filter((x) => x !== cmdLine), cmdLine].slice(-50));
    setCursor(null);

    const [cmd, ...args] = cmdLine.split(/\s+/);
    const name = cmd.toLowerCase();
    let out: Line[] = [];

    switch (name) {
      case 'help':
        out = [
          L('Portfolio shell — available commands', 'head'),
          L(''),
          ...[
            ['about', 'Who I am'],
            ['projects', 'Things I have built'],
            ['skills', 'Technologies & proficiency'],
            ['experience', 'Work & leadership'],
            ['certifications', 'Verified credentials'],
            ['education', 'Schools & programs'],
            ['contact', 'How to reach me'],
            ['open <app>', 'Open an app window (e.g. `open projects`)'],
            ['neofetch', 'System summary'],
            ['ls · cat · pwd', 'Browse the file system'],
            ['whoami · date · echo', 'The classics'],
            ['history · clear', 'Shell housekeeping (Ctrl+L clears)'],
            ['exit', 'Close the terminal'],
          ].map(([c, d]) => L(`  ${pad(c, 22)}${d}`)),
        ];
        break;
      case 'about':
        out = [
          L(profile.name, 'head'),
          L(`${profile.role} · ${profile.location}`, 'dim'),
          L(''),
          L(profile.tagline),
          ...profile.bio.map((b) => L(b)),
          L(''),
          L(`Focus: ${profile.focus.join(' · ')}`, 'accent'),
        ];
        break;
      case 'projects':
        out = [L('Projects', 'head'), L('')];
        projects.forEach((p) => {
          out.push(L(`  ${pad(p.name, 16)}${p.year}  ${p.subtitle}`, p.featured ? 'accent' : 'out'));
          out.push(L(`  ${' '.repeat(22)}${p.tech.slice(0, 5).join(', ')}`, 'dim'));
        });
        out.push(L(''), L('Tip: `open projects` for the full view.', 'dim'));
        break;
      case 'skills':
        out = [L('Skills', 'head')];
        skillCategories.forEach((c) => {
          out.push(L(''), L(c.title, 'accent'));
          c.skills.forEach((s) => {
            const bars = s.level >= 90 ? 5 : s.level >= 80 ? 4 : 3;
            out.push(L(`  ${pad(s.name, 16)}${'■'.repeat(bars)}${'□'.repeat(5 - bars)}  ${skillLevelLabel(s.level)}`));
          });
        });
        break;
      case 'experience':
        out = [L('Experience', 'head')];
        experiences.forEach((e) => {
          out.push(L(''), L(`${e.role} — ${e.company}`, 'accent'), L(`  ${e.period} · ${e.type}`, 'dim'));
          e.highlights.forEach((h) => out.push(L(`  • ${h}`)));
        });
        break;
      case 'certifications':
      case 'certs':
        out = [L('Certifications', 'head')];
        certifications.forEach((c) => {
          out.push(L(''), L(`✔ ${c.name}`, 'ok'), L(`  ${c.issuer} · ${c.issued}`, 'dim'));
        });
        break;
      case 'education':
        out = [L('Education', 'head')];
        education.forEach((e) => {
          out.push(L(''), L(e.school, 'accent'), L(`  ${e.program} · ${e.period}`, 'dim'));
        });
        break;
      case 'contact':
        out = [
          L('Contact', 'head'),
          L(''),
          L(`  email     ${profile.email}`),
          L(`  phone     ${profile.phone}`),
          L(`  github    ${profile.github}`),
          L(`  linkedin  ${profile.linkedin}`),
          L(''),
          L('Tip: `open contact` to send a message.', 'dim'),
        ];
        break;
      case 'open': {
        const arg = (args[0] || '').toLowerCase();
        // Exact alias, or an unambiguous prefix (e.g. `open cert`).
        const prefixTargets = arg ? [...new Set(Object.entries(APP_ALIASES).filter(([k]) => k.startsWith(arg)).map(([, v]) => v))] : [];
        const target = APP_ALIASES[arg] ?? (prefixTargets.length === 1 ? prefixTargets[0] : undefined);
        if (!target) {
          out = [L(`open: ${args[0] ? `unknown app '${args[0]}'` : 'missing app name'}`, 'err'), L(`  apps: ${Object.keys(APP_ALIASES).join(', ')}`, 'dim')];
        } else {
          open(target);
          out = [L(`Opening ${target}…`, 'ok')];
        }
        break;
      }
      case 'neofetch':
        out = neofetch();
        break;
      case 'ls':
        out = [L(FILES.join('    '), 'accent')];
        break;
      case 'cat': {
        const file = (args[0] || '').toLowerCase();
        if (!file) out = [L('cat: missing file operand', 'err')];
        else if (file === 'readme.md' || file === 'readme')
          out = [
            L('# Portfolio OS', 'head'),
            L(''),
            L('A desktop-style portfolio built with Next.js, React, Tailwind CSS and Framer Motion.'),
            L(''),
            L('- Drag windows by the title bar, double-click it to zoom'),
            L('- Press ⌘K / Ctrl+K anywhere to search'),
            L('- Option/Alt + 1…8 opens apps, Esc closes overlays'),
          ];
        else if (file === 'contact.txt') out = [L(profile.email), L(profile.phone)];
        else if (file === 'resume.pdf') {
          open('resume');
          out = [L('Binary file — opening in Preview…', 'dim')];
        } else out = [L(`cat: ${args[0]}: No such file or directory`, 'err')];
        break;
      }
      case 'pwd':
        out = [L('/Users/mohammed/portfolio')];
        break;
      case 'whoami':
        out = [L('mohammed — builder of pipelines, breaker of clusters (in staging only).')];
        break;
      case 'date':
        out = [L(new Date().toString())];
        break;
      case 'echo':
        out = [L(args.join(' '))];
        break;
      case 'history':
        out = [...history, cmdLine].map((h, i) => L(`  ${String(i + 1).padStart(3)}  ${h}`));
        break;
      case 'sudo':
        if (args.join(' ').toLowerCase().includes('hire')) {
          out = [L('[sudo] password for recruiter: ********', 'dim'), L('Access granted. Opening a direct line…', 'ok')];
          window.setTimeout(() => open('contact'), 500);
          notify({ title: 'Great choice 🎉', body: 'The contact form is ready for you.' });
        } else {
          out = [L('mohammed is not in the sudoers file. This incident will be reported. 👀', 'err'), L('(psst — try `sudo hire-me`)', 'dim')];
        }
        break;
      case 'clear':
        setLines([]);
        setInput('');
        return;
      case 'exit':
        close('terminal');
        return;
      default:
        out = [L(`zsh: command not found: ${cmd}`, 'err'), L('Type `help` to see what I can do.', 'dim')];
    }

    setLines((l) => [...l, echo, ...out, L('')]);
  };

  const complete = () => {
    const parts = input.split(' ');
    if (parts.length === 1) {
      const matches = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()));
      if (matches.length === 1) setInput(matches[0] + ' ');
      else if (matches.length > 1) setLines((l) => [...l, L(`${PROMPT} ${input}`, 'cmd'), L(matches.join('    '), 'dim')]);
      return;
    }
    const pool = parts[0] === 'open' ? Object.keys(APP_ALIASES) : parts[0] === 'cat' ? FILES : [];
    const last = parts[parts.length - 1].toLowerCase();
    const matches = pool.filter((p) => p.toLowerCase().startsWith(last));
    if (matches.length === 1) setInput([...parts.slice(0, -1), matches[0]].join(' '));
    else if (matches.length > 1) setLines((l) => [...l, L(`${PROMPT} ${input}`, 'cmd'), L(matches.join('    '), 'dim')]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cursor === null) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setInput('');
      } else {
        setCursor(next);
        setInput(history[next]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    } else if (e.key === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault();
      setLines((l) => [...l, L(`${PROMPT} ${input}^C`, 'cmd')]);
      setInput('');
    }
  };

  const toneClass: Record<Tone, string> = {
    out: 'text-[#d4d4d8]',
    cmd: 'text-white',
    err: 'text-[#ff7b72]',
    dim: 'text-[#8b8b93]',
    accent: 'text-[#8ab4ff]',
    ok: 'text-[#56d364]',
    head: 'text-white font-semibold',
  };

  return (
    <div
      className="flex h-full flex-col bg-[#0d0d10]/95 font-mono text-[12.5px] leading-[1.6]"
      onMouseUp={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
      }}
    >
      <div ref={scrollRef} className="scrollbar-mac flex-1 overflow-y-auto px-4 pb-2 pt-3">
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap break-words ${toneClass[l.tone ?? 'out']}`}>
            {l.tone === 'cmd' ? <CmdLine text={l.text} /> : l.text || '\u00a0'}
          </div>
        ))}
        <div className="flex items-center">
          <span className="shrink-0 text-[#56d364]">{PROMPT}</span>
          <span className="relative ml-2 flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              aria-label="Terminal input"
              className="w-full bg-transparent text-white caret-[#8ab4ff] outline-none"
            />
          </span>
        </div>
      </div>
    </div>
  );
}

function CmdLine({ text }: { text: string }) {
  const rest = text.slice(PROMPT.length);
  return (
    <>
      <span className="text-[#56d364]">{PROMPT}</span>
      <span className="text-white">{rest}</span>
    </>
  );
}
