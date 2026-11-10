# Portfolio OS

The interactive, desktop-style portfolio of **Mohammed Belouarraq** — DevOps & Cloud.
Built with Next.js 16, React 19, Tailwind CSS and Framer Motion.

## Highlights

- **Desktop shell** — menu bar with working menus, draggable / resizable / zoomable windows with real focus ordering, minimize-to-Dock animation.
- **Dock** — macOS-style magnification, launch bounce, running indicators.
- **Spotlight** (`⌘K` / `Ctrl+K`) — search apps, projects, skills, certifications and quick actions (copy email, download résumé…). Results deep-link into apps.
- **Apps** — About, Projects (filterable), Skills, Experience timeline, Community (volunteering), Certifications (tilt cards), Contact form, Terminal, Résumé viewer.
- **Terminal** — `help`, `neofetch`, `open <app>`, Tab completion, ↑/↓ history, and a few easter eggs.
- **Mobile** — home-screen app grid, full-screen apps, compact Dock.
- **Accessible & fast** — respects reduced-motion, keyboard shortcuts everywhere, self-hosted logos, optimized images.

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | Spotlight search |
| `⌥1`–`⌥9` / `Alt+1`–`Alt+9` | Open an app |
| `⌥W` / `Alt+W` | Close focused window |
| `⌥M` / `Alt+M` | Minimize focused window |
| `⌥L` / `Alt+L` | Lock screen |
| `?` | Show all shortcuts |

## Getting started

```bash
npm install
cp env.example .env.local   # then fill in your email credentials (see CONTACT_SETUP.md)
npm run dev                 # http://localhost:3000
```

Requires Node.js 20.9+.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Editing content

All content lives in **`src/data/portfolio.ts`** — profile, projects, skills, experience, certifications and education. The apps *and* the terminal read from it, so one edit updates everywhere.

## Project structure

```
src/
  app/                 layout, page, global styles, /api/contact route
  data/portfolio.ts    all portfolio content
  components/
    os/                desktop shell: Desktop, Window, Dock, MenuBar, Spotlight, LockScreen…
    apps/              one file per app + registry.tsx (icons, sizes, ordering)
    ui/                shared primitives (AppIcon, section headers, brand icons)
  lib/hooks.ts         small client hooks (media queries, clock, viewport)
public/
  icons/               self-hosted technology logos (devicon, MIT)
  images/              avatar and organization logos
```
