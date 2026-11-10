// Journal — open-source contributions and milestones.
//
// HOW TO ADD A POST
// 1. Copy one of the templates below into `journal` (order doesn't matter — posts are sorted by date).
// 2. Put any image in /public/images/journal/ and reference it as '/images/journal/<file>'.
// 3. Run `npm run dev` and open the Journal app to check it.
//
// ── Open-source template ─────────────────────────────────────────────
// {
//   id: 'k8s-docs-fix',                       // unique, kebab-case
//   type: 'opensource',
//   date: '2026-12',                          // 'YYYY-MM' or 'YYYY-MM-DD'
//   title: 'Fixed probe examples in the Kubernetes docs',
//   summary: 'One or two sentences on what you changed and why it mattered.',
//   contribution: {
//     repo: 'kubernetes/website',             // owner/name
//     url: 'https://github.com/kubernetes/website/pull/12345',
//     pr: 12345,
//     status: 'merged',                       // 'merged' | 'open' | 'closed'
//     additions: 42,
//     deletions: 7,
//   },
//   tags: ['Kubernetes', 'Docs'],
// },
//
// ── Achievement template ─────────────────────────────────────────────
// {
//   id: 'some-award',
//   type: 'achievement',
//   date: '2026-06',
//   title: 'Won …',
//   badge: '1st place',                       // optional gold badge next to the title
//   summary: 'Short summary shown on the card.',
//   body: ['Optional longer paragraphs, revealed with "Read more".'],
//   image: { src: '/images/journal/photo.jpg', alt: 'Describe the photo', caption: 'Shown under the photo' },
//   links: [{ label: 'LinkedIn post', url: 'https://…', kind: 'linkedin' }],
//   tags: ['Oracle APEX'],
//   pinned: true,                             // optional: keeps it at the top
// },

export type PostType = 'opensource' | 'achievement' | 'milestone' | 'talk' | 'writing';

export interface Post {
  id: string;
  type: PostType;
  /** 'YYYY-MM' or 'YYYY-MM-DD'. */
  date: string;
  title: string;
  summary: string;
  body?: string[];
  badge?: string;
  pinned?: boolean;
  tags?: string[];
  image?: { src: string; alt: string; caption?: string };
  contribution?: {
    repo: string;
    url: string;
    pr?: number;
    status: 'merged' | 'open' | 'closed';
    additions?: number;
    deletions?: number;
  };
  links?: { label: string; url: string; kind?: 'linkedin' | 'github' | 'web' | 'video' }[];
}

export const journal: Post[] = [
  {
    id: 'oracle-apex-hackathon',
    type: 'achievement',
    date: '2026-06',
    title: 'Won the Oracle APEX Hackathon',
    badge: '1st place',
    pinned: true,
    summary:
      'Our team took 1st place with an app built on the latest Oracle APEX to help Oracle MADC streamline internal communication and coordinate events.',
    body: [
      'We started from a very real problem — "who plays football, and can we organize a game?" — and turned it into a working application in a very short time.',
      'It was a great experience of turning an idea into a real solution while learning, building and collaborating as a team of four.',
    ],
    image: {
      src: '/images/journal/oracle-apex-hackathon.jpg',
      alt: 'Mohammed presenting the winning project on stage at Oracle MADC',
      caption: 'Pitching on stage at Oracle MADC, Casablanca',
    },
    links: [
      {
        label: 'LinkedIn post',
        url: 'https://www.linkedin.com/posts/mohammedbelouarraq_oracle-oracleapex-hackathon-ugcPost-7460762720380887040-swsd/',
        kind: 'linkedin',
      },
    ],
    tags: ['Oracle APEX', 'Low-code', 'Teamwork'],
  },
  {
    id: 'graduation',
    type: 'milestone',
    date: '2026-09',
    title: 'Graduated as a Computer Science Engineer',
    summary: 'Completed my Engineering Degree in Computer Science at ENSA Tétouan, closing six years of study.',
    tags: ['ENSA Tétouan', 'Engineering degree'],
  },
];

export const POST_TYPES: Record<PostType, { label: string; plural: string }> = {
  opensource: { label: 'Open source', plural: 'Open source' },
  achievement: { label: 'Achievement', plural: 'Achievements' },
  milestone: { label: 'Milestone', plural: 'Milestones' },
  talk: { label: 'Talk', plural: 'Talks' },
  writing: { label: 'Writing', plural: 'Writing' },
};
