'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, BadgeCheck } from 'lucide-react';
import { AppHeader } from '@/components/ui/Section';
import { certifications, certMeta, type Certification } from '@/data/portfolio';
import { useCoarsePointer } from '@/lib/hooks';

export default function CertificationsApp() {
  return (
    <div className="mx-auto max-w-4xl">
      <AppHeader
        eyebrow={`${certifications.length} verified credentials`}
        title="Certifications"
        subtitle="Industry credentials across cloud, data, AI, Kubernetes and containers."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <CertCard key={c.id} cert={c} index={i} />
        ))}
      </div>
    </div>
  );
}

/** Badge card with a subtle 3D tilt and a holographic sheen that follows the pointer. */
function CertCard({ cert: c, index }: { cert: Certification; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const coarse = useCoarsePointer();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), spring);
  const sheenX = useTransform(px, [0, 1], ['0%', '100%']);
  const sheenY = useTransform(py, [0, 1], ['0%', '100%']);
  const sheen = useTransform(
    [sheenX, sheenY],
    ([x, y]) =>
      `radial-gradient(500px circle at ${x} ${y}, rgb(255 255 255 / 0.12), transparent 40%), linear-gradient(115deg, transparent 30%, rgb(138 180 255 / 0.08) 45%, rgb(255 180 230 / 0.06) 55%, transparent 70%)`,
  );

  const onMove = (e: React.PointerEvent) => {
    if (coarse || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.32, 0.72, 0, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.a
        ref={ref}
        href={c.url}
        target="_blank"
        rel="noopener noreferrer"
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: coarse ? 0 : rotateX, rotateY: coarse ? 0 : rotateY, transformStyle: 'preserve-3d' }}
        className="card group relative flex h-full flex-col overflow-hidden p-5 transition-shadow duration-300 hover:shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.08),0_0_0_1px_rgb(255_255_255/0.1)]"
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: sheen }}
        />

        <div className="flex items-start justify-between">
          <div
            className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_-10px_rgb(0_0_0/0.8)] ${
              c.logoFit === 'contain' ? 'p-2' : ''
            }`}
            style={{ transform: 'translateZ(30px)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.logo}
              alt={`${c.issuer} logo`}
              className={`h-full w-full ${c.logoFit === 'cover' ? 'object-cover' : 'object-contain'}`}
             
            />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-ok/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ok ring-1 ring-ok/20">
            <BadgeCheck className="h-3 w-3" />
            Verified
          </span>
        </div>

        <div className="mt-5" style={{ transform: 'translateZ(20px)' }}>
          <p className="font-mono text-[11px] text-ink-faint">
            {certMeta(c)}
            {c.expires && <span className="text-ink-faint/80"> · expires {c.expires}</span>}
          </p>
          <h3 className="mt-1 text-[15px] font-semibold leading-snug tracking-tight">{c.name}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{c.description}</p>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap gap-1.5">
            {c.skills.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
          {c.credentialId && (
            <p className="mt-3 truncate font-mono text-[10px] text-ink-faint" title={c.credentialId}>
              ID {c.credentialId}
            </p>
          )}
          <span className={`${c.credentialId ? 'mt-2' : 'mt-4'} inline-flex items-center gap-1 text-xs font-medium text-accent`}>
            View credential
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </motion.a>
    </motion.div>
  );
}
