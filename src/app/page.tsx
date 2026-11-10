import Desktop from '@/components/os/Desktop';
import ErrorBoundary from '@/components/ErrorBoundary';
import { profile, projects } from '@/data/portfolio';

export default function Home() {
  return (
    <main className="h-[100dvh] w-full overflow-hidden">
      {/* Crawlable summary for search engines and screen readers; the desktop UI is rendered on the client. */}
      <div className="sr-only">
        <h1>
          {profile.name} — {profile.headline}
        </h1>
        <p>{profile.tagline}</p>
        <ul>
          {projects.map((p) => (
            <li key={p.id}>
              <a href={p.github}>
                {p.name}: {p.subtitle}
              </a>
            </li>
          ))}
        </ul>
        <a href={profile.github}>GitHub</a> <a href={profile.linkedin}>LinkedIn</a> <a href={profile.cv.en.file}>Résumé (English, PDF)</a>{' '}
        <a href={profile.cv.fr.file}>CV (Français, PDF)</a>
      </div>
      <ErrorBoundary>
        <Desktop />
      </ErrorBoundary>
    </main>
  );
}
