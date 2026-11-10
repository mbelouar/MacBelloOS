import type { ComponentType } from 'react';
import { BadgeCheck, Briefcase, Cpu, FileText, FolderGit2, Mail, SquareTerminal, User, type LucideIcon } from 'lucide-react';
import type { AppId, AppParams } from '@/components/os/OSContext';
import AboutApp from './AboutApp';
import CertificationsApp from './CertificationsApp';
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
  gradient: string;
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
    gradient: 'linear-gradient(180deg, #6aa8ff 0%, #2f6bff 100%)',
    size: { w: 760, h: 640 },
    keywords: 'profile bio who intro education languages',
    component: AboutApp,
  },
  {
    id: 'projects',
    name: 'Projects',
    title: 'Projects',
    icon: FolderGit2,
    gradient: 'linear-gradient(180deg, #ffc35a 0%, #ff8a1f 100%)',
    size: { w: 900, h: 660 },
    keywords: 'work portfolio github code repos',
    component: ProjectsApp,
  },
  {
    id: 'skills',
    name: 'Skills',
    title: 'Skills',
    icon: Cpu,
    gradient: 'linear-gradient(180deg, #b69cff 0%, #7444f5 100%)',
    size: { w: 880, h: 640 },
    keywords: 'stack technologies tools languages kubernetes docker',
    component: SkillsApp,
  },
  {
    id: 'experience',
    name: 'Experience',
    title: 'Experience',
    icon: Briefcase,
    gradient: 'linear-gradient(180deg, #4fe0b0 0%, #0f9a76 100%)',
    size: { w: 780, h: 640 },
    keywords: 'work internships jobs career leadership',
    component: ExperienceApp,
  },
  {
    id: 'certifications',
    name: 'Certifications',
    title: 'Certifications',
    icon: BadgeCheck,
    gradient: 'linear-gradient(180deg, #ff8ab8 0%, #e2366f 100%)',
    size: { w: 880, h: 600 },
    keywords: 'certs badges credly kcna oracle docker',
    component: CertificationsApp,
  },
  {
    id: 'contact',
    name: 'Contact',
    title: 'Contact',
    icon: Mail,
    gradient: 'linear-gradient(180deg, #5fd0ff 0%, #1186e8 100%)',
    size: { w: 880, h: 640 },
    keywords: 'email message hire reach phone linkedin',
    component: ContactApp,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    title: 'mohammed — zsh',
    icon: SquareTerminal,
    gradient: 'linear-gradient(180deg, #3a3a40 0%, #111114 100%)',
    glyph: 'text-[#56d364]',
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
    gradient: 'linear-gradient(180deg, #ffffff 0%, #d9d9de 100%)',
    glyph: 'text-[#ff453a]',
    size: { w: 760, h: 820 },
    bare: true,
    keywords: 'cv resume pdf download',
    component: ResumeApp,
  },
];

export const APP_MAP = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<AppId, AppDef>;
