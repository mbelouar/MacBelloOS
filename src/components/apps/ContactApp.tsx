'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, CircleAlert, Copy, LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useOS } from '@/components/os/OSContext';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { AppHeader } from '@/components/ui/Section';
import { profile } from '@/data/portfolio';

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 };

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactApp() {
  const { notify } = useOS();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', company: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      notify({ title: 'Email copied', body: profile.email, icon: <Check className="h-4 w-4 text-ok" /> });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '', company: '' });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'Network error — check your connection and try again.');
    }
  };

  const channels = [
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Based in', value: profile.location },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <AppHeader
        eyebrow="Contact"
        title="Let's build something."
        subtitle="Internships, collaborations or a quick question — I usually reply within a day."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
        {/* Channels */}
        <div className="flex flex-col gap-3">
          <div className="card divide-y divide-white/[0.06]">
            {channels.map((c) => {
              const Inner = (
                <>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-ink-muted">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] text-ink-faint">{c.label}</span>
                    <span className="block truncate text-[13px] font-medium">{c.value}</span>
                  </span>
                </>
              );
              return c.href ? (
                <a key={c.label} href={c.href} className="flex items-center gap-3 p-3.5 transition-colors hover:bg-white/[0.03]">
                  {Inner}
                </a>
              ) : (
                <div key={c.label} className="flex items-center gap-3 p-3.5">
                  {Inner}
                </div>
              );
            })}
          </div>

          <button onClick={copyEmail} className="btn-secondary w-full">
            {copied ? <Check className="h-4 w-4 text-ok" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied to clipboard' : 'Copy email address'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="card card-hover group flex items-center gap-3 p-3.5">
              <LinkedinIcon className="h-5 w-5 text-[#5aa4ff]" />
              <span className="text-[13px] font-medium">LinkedIn</span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="card card-hover group flex items-center gap-3 p-3.5">
              <GithubIcon className="h-5 w-5" />
              <span className="text-[13px] font-medium">GitHub</span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="card relative overflow-hidden p-5">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'sent' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="flex min-h-[340px] flex-col items-center justify-center text-center"
              >
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ok/15 ring-1 ring-ok/30"
                >
                  <Check className="h-8 w-8 text-ok" strokeWidth={2.5} />
                </motion.span>
                <h3 className="text-lg font-semibold">Message sent</h3>
                <p className="mt-1 max-w-xs text-sm text-ink-muted">Thanks for reaching out — I&apos;ll get back to you soon.</p>
                <button onClick={() => setStatus('idle')} className="btn-secondary mt-6">
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={submit}
                className="space-y-3"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Name">
                    <input name="name" value={form.name} onChange={update} required maxLength={LIMITS.name} autoComplete="name" placeholder="Jane Doe" className="input" />
                  </Field>
                  <Field label="Email">
                    <input name="email" type="email" value={form.email} onChange={update} required maxLength={LIMITS.email} autoComplete="email" placeholder="jane@company.com" className="input" />
                  </Field>
                </div>
                <Field label="Subject">
                  <input name="subject" value={form.subject} onChange={update} required maxLength={LIMITS.subject} placeholder="Internship opportunity" className="input" />
                </Field>
                <Field label="Message" counter={`${form.message.length}/${LIMITS.message}`}>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={update}
                    required
                    rows={6}
                    maxLength={LIMITS.message}
                    placeholder="Tell me about your team, project or idea…"
                    className="input resize-none"
                  />
                </Field>
                {/* Honeypot — hidden from people, irresistible to bots */}
                <input
                  name="company"
                  value={form.company}
                  onChange={update}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <AnimatePresence>
                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      role="alert"
                      className="flex items-start gap-2 overflow-hidden rounded-xl bg-red-500/10 px-3 py-2.5 text-[13px] text-red-300 ring-1 ring-red-500/20"
                    >
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={status === 'sending'} className="btn-primary group w-full !py-3">
                  {status === 'sending' ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({ label, counter, children }: { label: string; counter?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink-muted">
        {label}
        {counter && <span className="font-mono text-[10px] text-ink-faint">{counter}</span>}
      </span>
      {children}
    </label>
  );
}
