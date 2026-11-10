'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, BadgeCheck, Command, FileText, MapPin, Sparkles } from 'lucide-react';
import { APPS } from '@/components/apps/registry';
import AppIcon from '@/components/ui/AppIcon';
import { certifications, profile, projects } from '@/data/portfolio';
import { trackPointer, useIsMac, useNow } from '@/lib/hooks';
import { useOS } from './OSContext';

const EASE = [0.32, 0.72, 0, 1] as const;
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.8, delay, ease: EASE },
});

export default function DesktopHome({ mobile }: { mobile: boolean }) {
  return mobile ? <MobileHome /> : <WideHome />;
}

function WideHome() {
  const { open, setSpotlightOpen } = useOS();
  const mac = useIsMac();
  const featured = projects.find((p) => p.featured) ?? projects[0];

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center px-[6vw] pb-24 pt-10">
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        {/* Hero */}
        <div className="pointer-events-auto">
          <motion.p {...enter(0.1)} className="mb-5 flex items-center gap-2 text-[13px] text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-ok/60" />
              <span className="relative h-2 w-2 rounded-full bg-ok" />
            </span>
            {profile.availability} · {profile.location}
          </motion.p>
          <motion.h1
            {...enter(0.18)}
            className="text-[clamp(44px,6.2vw,92px)] font-semibold leading-[0.98] tracking-[-0.045em]"
          >
            <span className="text-gradient">Mohammed</span>
            <br />
            <span className="text-shine">Belouarraq</span>
          </motion.h1>
          <motion.p {...enter(0.28)} className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-white/60">
            {profile.tagline}
          </motion.p>
          <motion.div {...enter(0.38)} className="mt-9 flex flex-wrap items-center gap-3">
            <button onClick={() => open('projects')} className="btn-primary group !rounded-full !px-5 !py-3">
              Explore projects
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <button onClick={() => open('about')} className="btn material-thin !rounded-full !px-5 !py-3 text-white ring-1 ring-white/15 hover:bg-white/15">
              About me
            </button>
            <button
              onClick={() => setSpotlightOpen(true)}
              className="ml-1 flex items-center gap-2 rounded-full px-3 py-2 text-[13px] text-white/50 transition-colors hover:text-white/80"
            >
              <kbd className="flex items-center gap-0.5 rounded-md bg-white/10 px-1.5 py-0.5 font-sans text-[11px] text-white/70 ring-1 ring-white/10">
                {mac ? <Command className="h-3 w-3" /> : 'Ctrl'} K
              </kbd>
              to search
            </button>
          </motion.div>
        </div>

        {/* Widgets */}
        <div className="pointer-events-auto hidden grid-cols-2 gap-4 lg:grid">
          <ProfileWidget />
          <motion.button
            {...enter(0.55)}
            onClick={() => open('projects', { project: featured.id })}
            onPointerMove={trackPointer}
            className="widget spotlight group col-span-2 p-5 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                <Sparkles className="h-3.5 w-3.5" /> Featured project
              </span>
              <ArrowUpRight className="h-4 w-4 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
            <p className="mt-3 text-[22px] font-semibold tracking-tight">{featured.name}</p>
            <p className="text-[13px] text-white/55">{featured.subtitle}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {featured.tech.slice(0, 6).map((t) => (
                <span key={t} className="chip !bg-white/[0.07]">
                  {t}
                </span>
              ))}
            </div>
          </motion.button>
          <motion.button {...enter(0.65)} onClick={() => open('certifications')} className="widget group p-5 text-left">
            <BadgeCheck className="h-5 w-5 text-[#ff8ab8]" />
            <p className="mt-4 text-[34px] font-semibold leading-none tracking-tight">{certifications.length}</p>
            <p className="mt-1 text-[13px] text-white/55">Certifications</p>
            <div className="mt-3 flex -space-x-2">
              {certifications.slice(0, 4).map((c) => (
                <span key={c.id} className="h-7 w-7 overflow-hidden rounded-full bg-white ring-2 ring-[#1d1d22]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.logo} alt="" className={`h-full w-full ${c.logoFit === 'cover' ? 'object-cover' : 'object-contain p-0.5'}`} />
                </span>
              ))}
              {certifications.length > 4 && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2c2c33] text-[10px] font-semibold text-white/80 ring-2 ring-[#1d1d22]">
                  +{certifications.length - 4}
                </span>
              )}
            </div>
          </motion.button>
          <motion.button {...enter(0.72)} onClick={() => open('resume')} className="widget group p-5 text-left">
            <FileText className="h-5 w-5 text-[#ff6b5e]" />
            <p className="mt-4 text-[17px] font-semibold leading-tight tracking-tight">Résumé</p>
            <p className="mt-1 text-[13px] text-white/55">English · Français</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
              Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function ProfileWidget() {
  const now = useNow(15000);
  const { open } = useOS();
  const local = now?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: profile.timezone });

  return (
    <motion.button {...enter(0.45)} onClick={() => open('about')} className="widget group col-span-2 flex items-center gap-4 p-4 text-left">
      <span className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={profile.photo} alt="" className="h-full w-full object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{profile.name}</span>
        <span className="block text-[13px] text-white/55">{profile.role}</span>
        <span className="mt-1.5 flex items-center gap-1 text-xs text-white/40">
          <MapPin className="h-3 w-3" /> {profile.location.split(',')[0]}
          {local && <span className="tabular-nums" suppressHydrationWarning>· {local} local time</span>}
        </span>
      </span>
      <ArrowUpRight className="h-4 w-4 self-start text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
    </motion.button>
  );
}

function MobileHome() {
  const { open } = useOS();
  return (
    <div className="scrollbar-none fixed inset-x-0 bottom-[84px] top-7 overflow-y-auto px-6 pt-8">
      <motion.p {...enter(0.05)} className="flex items-center gap-2 text-xs text-white/60">
        <span className="h-1.5 w-1.5 rounded-full bg-ok" />
        {profile.availability}
      </motion.p>
      <motion.h1 {...enter(0.12)} className="mt-3 text-[40px] font-semibold leading-[1] tracking-[-0.04em]">
        <span className="text-gradient">Mohammed</span>
        <br />
        <span className="text-shine">Belouarraq</span>
      </motion.h1>
      <motion.p {...enter(0.2)} className="mt-4 text-[15px] leading-relaxed text-white/60">
        {profile.headline}
      </motion.p>

      <div className="mt-10 grid grid-cols-4 gap-x-4 gap-y-6 pb-8">
        {APPS.map((a, i) => (
          <motion.button
            key={a.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24, delay: 0.25 + i * 0.035 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => open(a.id)}
            className="flex flex-col items-center gap-1.5"
          >
            <AppIcon icon={a.icon} tint={a.tint} glyph={a.glyph} size={58} />
            <span className="max-w-full truncate text-[11px] font-medium text-white/85">{a.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
