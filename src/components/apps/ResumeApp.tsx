'use client';

import { useState } from 'react';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { useCoarsePointer } from '@/lib/hooks';
import type { AppProps } from './registry';

type Lang = keyof typeof profile.cv;

const asLang = (v?: string): Lang | null => (v === 'fr' || v === 'en' ? v : null);

export default function ResumeApp({ params, paramsKey = 0 }: AppProps) {
  const [lang, setLang] = useState<Lang>(asLang(params?.lang) ?? 'en');
  // Re-opening the app with a language (e.g. from Spotlight) switches the open window too.
  const [seenKey, setSeenKey] = useState(paramsKey);
  if (paramsKey !== seenKey) {
    setSeenKey(paramsKey);
    const requested = asLang(params?.lang);
    if (requested) setLang(requested);
  }
  // Mobile browsers render embedded PDFs poorly (often just the first page), so offer a clean hand-off instead.
  const touch = useCoarsePointer();
  const cv = profile.cv[lang];
  const fileName = cv.file.slice(1);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-black/20 px-3 py-2">
        <div role="tablist" aria-label="Résumé language" className="inline-flex rounded-lg bg-black/30 p-0.5 shadow-card">
          {(Object.keys(profile.cv) as Lang[]).map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={lang === l}
              title={profile.cv[l].label}
              onClick={() => setLang(l)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                lang === l ? 'bg-white/[0.14] text-ink' : 'text-ink-faint hover:text-ink-muted'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <span className="hidden truncate text-xs text-ink-muted sm:inline">{fileName}</span>
        <div className="ml-auto flex gap-1.5">
          <a
            href={cv.file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs text-ink-muted transition-colors hover:bg-white/10 hover:text-ink"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open</span>
          </a>
          <a
            href={cv.file}
            download={fileName}
            className="flex h-7 items-center gap-1.5 rounded-md bg-white px-2.5 text-xs font-medium text-black transition-colors hover:bg-white/90"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
        </div>
      </div>

      {touch ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-24 w-20 items-center justify-center rounded-lg bg-white shadow-[0_20px_40px_-12px_rgb(0_0_0/0.8)]">
            <FileText className="h-9 w-9 text-neutral-400" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-medium">Résumé — {profile.name}</p>
            <p className="mt-1 text-sm text-ink-faint">PDF · {cv.label}</p>
          </div>
          <a href={cv.file} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Open résumé
          </a>
        </div>
      ) : (
        <div className="flex-1 bg-[#2a2a2e] p-3 sm:p-5">
          <iframe
            key={lang}
            src={`${cv.file}#toolbar=0&navpanes=0&view=FitH`}
            title={`Résumé (${cv.label}) — ${profile.name}`}
            className="h-full w-full rounded-md bg-white shadow-[0_20px_50px_-12px_rgb(0_0_0/0.8)]"
          />
        </div>
      )}
    </div>
  );
}
