import type { ComponentType } from 'react';
import { Award, BriefcaseBusiness, Cpu, FileText, FolderCode, Mail, NotebookText, SquareTerminal, User, Users, type LucideIcon } from 'lucide-react';
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
  /** Icon gradient [top, bottom]. */
  tint: readonly [string, string];
  /** Symbol color, when not white. */
  glyph?: string;
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
    tint: ['#9ab9ff', '#3d6df0'],
    size: { w: 760, h: 640 },
    keywords: 'profile bio who intro education languages',
    component: AboutApp,
  },
  {
    id: 'projects',
    name: 'Projects',
    title: 'Projects',
    icon: FolderCode,
    tint: ['#ffd38c', '#ef8f2c'],
    size: { w: 900, h: 660 },
    keywords: 'work portfolio github code repos',
    component: ProjectsApp,
  },
  {
    id: 'skills',
    name: 'Skills',
    title: 'Skills',
    icon: Cpu,
    tint: ['#c9aaff', '#7445ee'],
    size: { w: 880, h: 640 },
    keywords: 'stack technologies tools languages kubernetes docker',
    component: SkillsApp,
  },
  {
    id: 'experience',
    name: 'Experience',
    title: 'Experience',
    icon: BriefcaseBusiness,
    tint: ['#92e3bb', '#2f9466'],
    size: { w: 780, h: 640 },
    keywords: 'work internships jobs career leadership',
    component: ExperienceApp,
  },
  {
    id: 'community',
    name: 'Community',
    title: 'Community',
    icon: Users,
    tint: ['#ffb398', '#de5c45'],
    size: { w: 820, h: 680 },
    keywords: 'volunteering volunteer benevolat bénévolat sports club ecdh community leadership',
    component: CommunityApp,
  },
  {
    id: 'journal',
    name: 'Journal',
    title: 'Journal',
    icon: NotebookText,
    tint: ['#aab2ff', '#5548dc'],
    size: { w: 780, h: 700 },
    keywords: 'posts contributions open source achievements awards hackathon milestones news blog',
    component: JournalApp,
  },
  {
    id: 'certifications',
    name: 'Certifications',
    title: 'Certifications',
    icon: Award,
    tint: ['#ffb6d3', '#d4477c'],
    size: { w: 880, h: 600 },
    keywords: 'certs badges credly kcna oracle docker',
    component: CertificationsApp,
  },
  {
    id: 'contact',
    name: 'Contact',
    title: 'Contact',
    icon: Mail,
    tint: ['#a6dcff', '#2f7de4'],
    size: { w: 880, h: 640 },
    keywords: 'email message hire reach phone linkedin',
    component: ContactApp,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    title: 'mohammed — zsh',
    icon: SquareTerminal,
    tint: ['#6a6a72', '#1b1b1f'],
    glyph: '#5be08b',
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
    tint: ['#ffffff', '#dedee3'],
    glyph: '#ee4b3e',
    size: { w: 760, h: 820 },
    bare: true,
    keywords: 'cv resume pdf download',
    component: ResumeApp,
  },
];

export const APP_MAP = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<AppId, AppDef>;
