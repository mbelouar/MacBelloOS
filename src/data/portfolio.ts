// Single source of truth for all portfolio content.
// Every app (and the terminal) reads from here, so edit content in one place.

export const profile = {
  name: 'Mohammed Belouarraq',
  shortName: 'Mohammed',
  initials: 'MB',
  role: 'Computer Engineering Student',
  headline: 'DevOps & Cloud Engineer in the making',
  tagline: 'I build, ship and run cloud-native infrastructure — Kubernetes, containers, IaC and the pipelines that glue them together.',
  location: 'Casablanca, Morocco',
  timezone: 'Africa/Casablanca',
  availability: 'Open to opportunities',
  email: 'medbelouarraq@gmail.com',
  phone: '+212 688 191 812',
  photo: '/images/avatar.jpg',
  cv: {
    en: { label: 'English', file: '/CV_Mohammed_Belouarraq_EN.pdf' },
    fr: { label: 'Français', file: '/CV_Mohammed_Belouarraq_FR.pdf' },
  },
  github: 'https://github.com/mbelouar',
  githubHandle: '@mbelouar',
  linkedin: 'https://www.linkedin.com/in/mohammedbelouarraq/',
  bio: [
    'DevOps & Cloud enthusiast with a strong foundation in technology and programming, developed through hands-on training and real projects.',
    'Skilled in problem-solving, teamwork and project management, and always eager to explore new tools and practices across the DevOps & Cloud ecosystem.',
  ],
  focus: ['Kubernetes', 'CI/CD & GitOps', 'Infrastructure as Code', 'Observability', 'Cloud Security'],
};

export type ProjectCategory = 'devops' | 'fullstack';

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tech: string[];
  year: string;
  type: string;
  category: ProjectCategory;
  github: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 'secureauth',
    name: 'SecureAuth',
    subtitle: 'Identity & Access Management platform',
    description:
      'Designed and implemented an IAM platform supporting SSO, MFA (TOTP, WebAuthn/FIDO) and identity lifecycle management, deployed with Kubernetes (Minikube, K3s), Docker and Helm for scalability and resilience.',
    tech: ['Kubernetes', 'Docker', 'Helm', 'k3s', 'Terraform', 'Prometheus', 'Grafana', 'ArgoCD', 'CI/CD', 'Django', 'REST API'],
    year: '2025',
    type: 'Final Year Project',
    category: 'devops',
    github: 'https://github.com/mbelouar/SecureAuth',
    featured: true,
  },
  {
    id: 'iot',
    name: 'IoT',
    subtitle: 'Lightweight Kubernetes orchestration',
    description:
      'Container orchestration using K3s with Vagrant and K3D with ArgoCD — creating and managing lightweight clusters across environments, from multi-node setups to GitOps-driven CI/CD pipelines.',
    tech: ['Kubernetes', 'k3s', 'k3d', 'Vagrant', 'Docker', 'ArgoCD', 'CI/CD', 'Scripting'],
    year: '2024',
    type: 'Academic Project',
    category: 'devops',
    github: 'https://github.com/mbelouar/IoT-K8s-Orchestration',
  },
  {
    id: 'transendence',
    name: 'Transendence',
    subtitle: 'Multiplayer gaming platform',
    description:
      'A web platform for multiplayer games with user management, blockchain score storage and AI opponents. Hardened with two-factor authentication and GDPR compliance.',
    tech: ['Django', 'JavaScript', 'ThreeJS', 'PostgreSQL', 'Docker', 'Microservices', 'CI/CD', 'Bootstrap'],
    year: '2024',
    type: 'Academic Project',
    category: 'fullstack',
    github: 'https://github.com/mbelouar/Transendence',
  },
  {
    id: 'inception',
    name: 'Inception',
    subtitle: 'Containerized multi-service system',
    description:
      'A secure multi-service system with Nginx, WordPress and MariaDB in isolated Docker containers, orchestrated with Docker Compose — focused on service isolation, networking and security.',
    tech: ['Docker', 'Docker Compose', 'Nginx', 'WordPress', 'MariaDB', 'Linux'],
    year: '2023',
    type: 'Academic Project',
    category: 'devops',
    github: 'https://github.com/mbelouar/Inception',
  },
  {
    id: 'nesttools',
    name: 'NestTools',
    subtitle: 'Community tool-rental platform',
    description:
      'A full-stack app connecting DIY enthusiasts with local tool owners so they can rent equipment for a fraction of the purchase cost — promoting affordable, sustainable access.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Laravel', 'Docker Compose'],
    year: '2023',
    type: 'Academic Project',
    category: 'fullstack',
    github: 'https://github.com/mbelouar/NestTools',
  },
];

// Logos from devicon (MIT), self-hosted in /public/icons for speed and reliability.
const devicon = (path: string) => `/icons/${path.split('/').pop()}`;
/** Custom icons (Lucide paths, ISC) for skills that have no official logo. */
const localIcon = (file: string) => `/icons/${file}`;

export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'cloud',
    title: 'DevOps & Cloud',
    skills: [
      { name: 'Docker', level: 95, icon: devicon('docker/docker-original.svg') },
      { name: 'Kubernetes', level: 90, icon: devicon('kubernetes/kubernetes-original.svg') },
      { name: 'Linux / Unix', level: 90, icon: devicon('linux/linux-original.svg') },
      { name: 'Terraform', level: 85, icon: devicon('terraform/terraform-original.svg') },
      { name: 'CI/CD', level: 85, icon: devicon('githubactions/githubactions-original.svg') },
      { name: 'Azure', level: 75, icon: devicon('azure/azure-original.svg') },
      { name: 'Oracle Cloud', level: 75, icon: '/images/oracleimg1.png' },
      { name: 'Prometheus', level: 75, icon: devicon('prometheus/prometheus-original.svg') },
      { name: 'Grafana', level: 75, icon: devicon('grafana/grafana-original.svg') },
      { name: 'Jenkins', level: 75, icon: devicon('jenkins/jenkins-original.svg') },
      { name: 'GitLab CI', level: 75, icon: devicon('gitlab/gitlab-original.svg') },
      { name: 'Podman', level: 75, icon: devicon('podman/podman-original.svg') },
      { name: 'Windows Server / AD', level: 75, icon: devicon('windows11/windows11-original.svg') },
      { name: 'AWS', level: 70, icon: devicon('amazonwebservices/amazonwebservices-original.svg') },
      { name: 'ArgoCD', level: 70, icon: devicon('argocd/argocd-original.svg') },
      { name: 'Ansible', level: 70, icon: devicon('ansible/ansible-original.svg') },
      { name: 'Vagrant', level: 70, icon: devicon('vagrant/vagrant-original.svg') },
    ],
  },
  {
    id: 'ai-quality',
    title: 'AI & Quality Engineering',
    skills: [
      { name: 'GenAI Evaluation', level: 85, icon: localIcon('ai-llm-eval.svg') },
      { name: 'Test Automation', level: 85, icon: localIcon('test-automation.svg') },
      { name: 'AI Agents', level: 75, icon: localIcon('ai-agents.svg') },
    ],
  },
  {
    id: 'languages',
    title: 'Programming',
    skills: [
      { name: 'C / C++', level: 90, icon: devicon('cplusplus/cplusplus-original.svg') },
      { name: 'Python', level: 85, icon: devicon('python/python-original.svg') },
      { name: 'JavaScript / Node.js', level: 85, icon: devicon('nodejs/nodejs-original.svg') },
      { name: 'Bash', level: 85, icon: devicon('bash/bash-original.svg') },
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Databases',
    skills: [
      { name: 'Django', level: 90, icon: devicon('django/django-plain.svg') },
      { name: 'Oracle APEX', level: 85, icon: '/images/oracleimg1.png' },
      { name: 'MySQL', level: 85, icon: devicon('mysql/mysql-original.svg') },
      { name: 'PostgreSQL', level: 80, icon: devicon('postgresql/postgresql-original.svg') },
      { name: 'MongoDB', level: 80, icon: devicon('mongodb/mongodb-original.svg') },
      { name: 'Oracle DB / PL/SQL', level: 75, icon: '/images/oracleimg1.png' },
    ],
  },
  {
    id: 'tools',
    title: 'Tooling',
    skills: [
      { name: 'Git / GitHub', level: 95, icon: devicon('github/github-original.svg') },
      { name: 'Docker Compose', level: 90, icon: devicon('docker/docker-original.svg') },
      { name: 'k3s / k3d', level: 85, icon: devicon('kubernetes/kubernetes-original.svg') },
    ],
  },
];

export const spokenLanguages = [
  { name: 'Arabic', code: 'AR', level: 'Native' },
  { name: 'French', code: 'FR', level: 'Professional' },
  { name: 'English', code: 'EN', level: 'Professional' },
];

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  type: string;
  description: string;
  highlights: string[];
  tech: string[];
  logo: string;
  /** Logos that are full-bleed squares (fill the tile instead of being padded). */
  logoCover?: boolean;
}

export const experiences: Experience[] = [
  {
    id: 'oracle',
    company: 'Oracle',
    role: 'Research Assistant',
    period: 'Apr 2026 — Oct 2026',
    type: 'R&D',
    description:
      'APEXLang engineering and generative-AI evaluation in Casablanca: benchmarking LLM-generated Oracle APEX applications and keeping the APEXLang skill release-ready.',
    highlights: [
      'Benchmarked Codex/LLM-generated Oracle APEX applications across 7 reusable test fixtures',
      'Maintained the APEXLang skill and caught bugs in generated apps before release',
      'Implemented deterministic scoring across 4 dimensions for consistent evaluations',
      'Sped up evaluations with parallel, isolated runs, timeouts, token/trace dashboards and batch reports for risk-based release decisions',
    ],
    tech: ['Oracle APEX', 'APEXLang', 'GenAI Evaluation', 'Codex / LLMs', 'JavaScript', 'PL/SQL'],
    logo: '/images/oracleimg1.png',
    logoCover: true,
  },
  {
    id: 'e2ip',
    company: 'E2IP Technologies',
    role: 'DevOps & IAM Intern',
    period: 'Jul 2025 — Sep 2025',
    type: 'Internship',
    description:
      'Deployed and maintained cloud-native IAM solutions, automated CI/CD pipelines and monitored system performance.',
    highlights: ['Cloud-native IAM deployments', 'CI/CD automation for microservices', 'Monitoring with Prometheus'],
    tech: ['Kubernetes', 'Docker', 'Prometheus', 'CI/CD', 'IAM'],
    logo: '/images/e2ip.png',
  },
  {
    id: 'ade',
    company: 'ADE — Student Association',
    role: 'President',
    period: 'Jan 2024 — Mar 2025',
    type: 'Leadership',
    description:
      'Led the student association representing 1,000+ students across academic and extracurricular initiatives.',
    highlights: ['Organized technical events & workshops', 'Managed budgets and sponsorships', 'Partnerships with universities'],
    tech: ['Leadership', 'Project Management', 'Event Organization', 'Budgeting'],
    logo: '/images/ade.png',
  },
  {
    id: 'bmce',
    company: 'BMCE Group',
    role: 'Software Research Intern',
    period: 'Jun 2023 — Aug 2023',
    type: 'Internship',
    description:
      'Hands-on work on document digitization and data management as part of digital transformation initiatives.',
    highlights: ['Document digitization', 'Software research', 'Data management'],
    tech: ['Digitization', 'Data Management', 'Research'],
    logo: '/images/bmce.png',
  },
];

export interface Certification {
  id: string;
  name: string;
  short: string;
  issuer: string;
  /** Omitted when the issue date isn't published (e.g. some course certificates). */
  issued?: string;
  expires?: string;
  credentialId?: string;
  description: string;
  skills: string[];
  logo: string;
  logoFit: 'cover' | 'contain';
  url: string;
}

export const certifications: Certification[] = [
  {
    id: 'agentic-ai',
    name: 'Agentic AI Certified Foundations Associate',
    short: 'Agentic AI Foundations',
    issuer: 'Oracle',
    issued: 'Sep 2026',
    description: 'Foundations of AI agents: reasoning, tool use, orchestration and agentic workflows on Oracle AI services.',
    skills: ['AI Agents', 'MCP', 'Agentic AI'],
    logo: '/images/oracleimg1.png',
    logoFit: 'cover',
    url: 'https://www.linkedin.com/in/mohammedbelouarraq/details/certifications/',
  },
  {
    id: 'oracle-data-platform',
    name: 'Oracle Data Platform Certified Foundations Associate',
    short: 'Oracle Data Platform Foundations',
    issuer: 'Oracle',
    issued: 'Apr 2026',
    description: "Oracle's data platform: databases, lakehouse, analytics and data integration on OCI.",
    skills: ['Oracle Database', 'Data Lakehouse', 'Analytics'],
    logo: '/images/oracleimg1.png',
    logoFit: 'cover',
    url: 'https://www.linkedin.com/in/mohammedbelouarraq/details/certifications/',
  },
  {
    id: 'oci',
    name: 'Oracle Cloud Infrastructure Certified Foundations Associate',
    short: 'OCI Foundations Associate',
    issuer: 'Oracle',
    issued: 'Oct 2025',
    expires: 'Oct 2027',
    description: 'OCI core services, security, pricing and support.',
    skills: ['Oracle Cloud', 'Cloud Computing', 'Cloud Security'],
    logo: '/images/oracleimg1.png',
    logoFit: 'cover',
    url: 'https://shorturl.at/CTFtI',
  },
  {
    id: 'kcna',
    name: 'Kubernetes and Cloud Native Associate',
    short: 'KCNA',
    issuer: 'The Linux Foundation',
    issued: 'Sep 2025',
    credentialId: 'LF-069aer9w3k',
    description: 'Kubernetes fundamentals, cloud-native architecture and container orchestration.',
    skills: ['Kubernetes', 'Cloud Native', 'Orchestration'],
    logo: '/images/KCNA-Logo.png',
    logoFit: 'contain',
    url: 'https://www.credly.com/badges/110eaa5a-b764-421d-8310-1e44c6c4033b',
  },
  {
    id: 'docker',
    name: 'Docker Foundations Professional Certificate',
    short: 'Docker Foundations',
    issuer: 'Docker, Inc.',
    issued: 'Jun 2025',
    description: 'Containerization, image management and container orchestration.',
    skills: ['Docker', 'Containerization', 'Docker Compose'],
    logo: '/images/dock.png',
    logoFit: 'contain',
    url: 'https://shorturl.at/tA4ua',
  },
  {
    id: 'lf-devops-sre',
    name: 'Introduction to DevOps and Site Reliability Engineering',
    short: 'Intro to DevOps & SRE',
    issuer: 'The Linux Foundation',
    credentialId: 'f4787d36-a305-40c5-97ce-5590d660c35d',
    description: 'DevOps culture, CI/CD, infrastructure as code, observability and SRE practices.',
    skills: ['DevOps', 'SRE', 'Kubernetes'],
    logo: '/images/linux-foundation.svg',
    logoFit: 'cover',
    url: 'https://www.linkedin.com/in/mohammedbelouarraq/details/certifications/',
  },
  {
    id: 'lf-kcne',
    name: 'Kubernetes and Cloud Native Essentials',
    short: 'Kubernetes & Cloud Native Essentials',
    issuer: 'The Linux Foundation',
    credentialId: 'd7ce7da9-a17a-4974-9f53-1c20d2b01e71',
    description: 'Cloud-native fundamentals: containers, Kubernetes architecture, orchestration and the CNCF ecosystem.',
    skills: ['Kubernetes', 'Cloud Native', 'Containers'],
    logo: '/images/linux-foundation.svg',
    logoFit: 'cover',
    url: 'https://www.linkedin.com/in/mohammedbelouarraq/details/certifications/',
  },
];

export const education = [
  {
    id: 'ensa',
    school: 'National School of Applied Sciences',
    program: 'Computer Science Engineering',
    detail: 'Software engineering, DevOps and cloud computing.',
    period: '2020 — 2025',
    logo: '/images/ensate.png',
  },
  {
    id: '1337',
    school: 'UM6P — 1337 Coding School',
    program: 'Digital Technology Architect',
    detail: 'Peer-learning program: advanced programming, systems and software architecture.',
    period: '2022 — 2025',
    logo: '/images/UM6P_1337.png',
  },
];

export const skillLevelLabel = (level: number) =>
  level >= 90 ? 'Expert' : level >= 80 ? 'Advanced' : 'Proficient';

/** "Issuer · Mon YYYY" — skips the date when it isn't published. */
export const certMeta = (c: Certification) => [c.issuer, c.issued].filter(Boolean).join(' · ');
