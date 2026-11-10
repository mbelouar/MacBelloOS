'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight, FileText, GraduationCap, Mail, MapPin } from 'lucide-react';
import { useOS } from '@/components/os/OSContext';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { SectionTitle } from '@/components/ui/Section';
import { certifications, education, experiences, profile, projects, spokenLanguages } from '@/data/portfolio';

const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.05 * i, duration: 0.5, ease: [0.32, 0.72, 0, 1] as const } }),
};

export default function AboutApp() {
  const { open } = useOS();

  const stats = [
    { value: projects.length, label: 'Projects', app: 'projects' as const },
    { value: certifications.length, label: 'Certifications', app: 'certifications' as const },
    { value: experiences.length, label: 'Experiences', app: 'experience' as const },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="show"
        custom={0}
        variants={rise}
        className="relative overflow-hidden rounded-3xl p-6 shadow-card sm:p-8"
        style={{
          background:
            'radial-gradient(120% 120% at 100% 0%, rgb(138 180 255 / 0.16), transparent 50%), radial-gradient(90% 90% at 0% 100%, rgb(255 255 255 / 0.06), transparent 60%), rgb(255 255 255 / 0.03)',
        }}
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="h-28 w-28 overflow-hidden rounded-[28px] shadow-[0_20px_40px_-12px_rgb(0_0_0/0.7)] ring-1 ring-white/15 sm:h-32 sm:w-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photo}
                alt={profile.name}
                width={256}
                height={256}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#16161a] ring-1 ring-white/10">
              <span className="h-2.5 w-2.5 rounded-full bg-ok shadow-[0_0_10px_rgb(52_211_153/0.9)]" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-ok/10 px-2.5 py-1 text-[11px] font-medium text-ok ring-1 ring-ok/20">
              <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-ok" />
              {profile.availability}
            </span>
            <h1 className="text-gradient text-3xl font-semibold tracking-tight sm:text-[40px] sm:leading-[1.1]">
              {profile.name}
            </h1>
            <p className="mt-1.5 text-[15px] text-ink-muted">{profile.headline}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-faint">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button className="btn-primary" onClick={() => open('resume')}>
            <FileText className="h-4 w-4" />
            View résumé
          </button>
          <button className="btn-secondary" onClick={() => open('contact')}>
            <Mail className="h-4 w-4" />
            Get in touch
          </button>
          <div className="ml-auto flex gap-2">
            <a className="btn-icon" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
            <a className="btn-icon" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedinIcon className="h-[17px] w-[17px]" />
            </a>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.div initial="hidden" animate="show" custom={1} variants={rise} className="mt-4 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => open(s.app)}
            className="card card-hover group p-4 text-left"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl font-semibold tracking-tight tabular-nums">{s.value}</span>
              <ArrowUpRight className="h-4 w-4 text-ink-faint opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </div>
            <span className="mt-1 block text-xs text-ink-faint">{s.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Bio */}
      <motion.section initial="hidden" animate="show" custom={2} variants={rise}>
        <SectionTitle>Profile</SectionTitle>
        <div className="card space-y-3 p-5 text-[14px] leading-relaxed text-ink-muted">
          <p className="text-ink">{profile.tagline}</p>
          {profile.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.focus.map((f) => (
              <span key={f} className="chip">
                {f}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Education */}
      <motion.section initial="hidden" animate="show" custom={3} variants={rise}>
        <SectionTitle aside={<GraduationCap className="h-4 w-4 text-ink-faint" />}>Education</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {education.map((e) => (
            <div key={e.id} className="card card-hover flex gap-4 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.logo} alt="" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="font-medium leading-snug">{e.school}</p>
                <p className="mt-0.5 text-[13px] text-accent">{e.program}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-faint">{e.detail}</p>
                <p className="mt-2 font-mono text-[11px] text-ink-faint">{e.period}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Languages */}
      <motion.section initial="hidden" animate="show" custom={4} variants={rise} className="pb-2">
        <SectionTitle>Languages</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {spokenLanguages.map((l) => (
            <div key={l.code} className="card flex items-center gap-3 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] font-mono text-xs font-semibold text-ink-muted">
                {l.code}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{l.name}</p>
                <p className="truncate text-xs text-ink-faint">{l.level}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
