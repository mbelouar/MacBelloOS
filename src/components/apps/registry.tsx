import type { ComponentType } from 'react';
import { BadgeCheck, Briefcase, Cpu, FileText, FolderGit2, HeartHandshake, Mail, NotebookPen, SquareTerminal, User, type LucideIcon } from 'lucide-react';
import type { AppId, AppParams } from '@/components/os/OSContext';
import AboutApp from './AboutApp';
import CertificationsApp from './CertificationsApp';
import CommunityApp from './CommunityApp';
import JournalApp from './JournalApp';
import ContactApp from './ContactApp';
import ExperienceApp from './ExperienceApp';
import ProjectsApp from './ProjectsApp';
import ResumeApp from './ResumeApp';
import SkillsApp from './SkillsApp';
import TerminalApp from './TerminalApp';

export interface AppProps {
  params?: AppParams;
  paramsKey?: number;
}

export interface AppDef {
  id: AppId;
  name: string;
  /** Title shown in the window chrome. */
  title: string;
  icon: LucideIcon;
  /** Signature color used by the graphite-glass icon. */
  accent: string;
  size: { w: number; h: number };
  /** Content manages its own padding/scrolling (terminal, PDF viewer). */
  bare?: boolean;
  keywords: string;
  component: ComponentType<AppProps>;
}

export const APPS: AppDef[] = [
  {
    id: 'about',
    name: 'About Me',
    title: 'About Me',
    icon: User,
    accent: '#7aa7ff',
    size: { w: 760, h: 640 },
    keywords: 'profile bio who intro education languages',
    component: AboutApp,
  },
  {
    id: 'projects',
    name: 'Projects',
    title: 'Projects',
    icon: FolderGit2,
    accent: '#ffb547',
    size: { w: 900, h: 660 },
    keywords: 'work portfolio github code repos',
    component: ProjectsApp,
  },
  {
    id: 'skills',
    name: 'Skills',
    title: 'Skills',
    icon: Cpu,
    accent: '#b79bff',
    size: { w: 880, h: 640 },
    keywords: 'stack technologies tools languages kubernetes docker',
    component: SkillsApp,
  },
  {
    id: 'experience',
    name: 'Experience',
    title: 'Experience',
    icon: Briefcase,
    accent: '#4fe0b0',
    size: { w: 780, h: 640 },
    keywords: 'work internships jobs career leadership',
    component: ExperienceApp,
  },
  {
    id: 'community',
    name: 'Community',
    title: 'Community',
    icon: HeartHandshake,
    accent: '#ff8a6b',
    size: { w: 820, h: 680 },
    keywords: 'volunteering volunteer benevolat bénévolat sports club ecdh community leadership',
    component: CommunityApp,
  },
  {
    id: 'journal',
    name: 'Journal',
    title: 'Journal',
    icon: NotebookPen,
    accent: '#ff8ab8',
    size: { w: 780, h: 700 },
    keywords: 'posts contributions open source achievements awards hackathon milestones news blog',
    component: JournalApp,
  },
  {
    id: 'certifications',
    name: 'Certifications',
    title: 'Certifications',
    icon: BadgeCheck,
    accent: '#f5c542',
    size: { w: 880, h: 600 },
    keywords: 'certs badges credly kcna oracle docker',
    component: CertificationsApp,
  },
  {
    id: 'contact',
    name: 'Contact',
    title: 'Contact',
    icon: Mail,
    accent: '#5fd0ff',
    size: { w: 880, h: 640 },
    keywords: 'email message hire reach phone linkedin',
    component: ContactApp,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    title: 'mohammed — zsh',
    icon: SquareTerminal,
    accent: '#56d364',
    size: { w: 720, h: 480 },
    bare: true,
    keywords: 'shell cli console command',
    component: TerminalApp,
  },
  {
    id: 'resume',
    name: 'Résumé',
    title: 'Résumé',
    icon: FileText,
    accent: '#ff6b5e',
    size: { w: 760, h: 820 },
    bare: true,
    keywords: 'cv resume pdf download',
    component: ResumeApp,
  },
];

export const APP_MAP = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<AppId, AppDef>;
