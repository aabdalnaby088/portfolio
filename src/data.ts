// Every piece of copy lives here. Each funny line has a `serious` twin
// that shows up when someone flips on Recruiter Mode.

export type Copy = { fun: string; serious: string }

export const links = {
  email: 'aabdalnaby088@gmail.com',
  github: 'https://github.com/aabdalnaby088',
  linkedin: 'https://www.linkedin.com/in/ahmed-mohamed-b44b7a240',
  cv: '/Ahmed_Abdelnaby_CV.pdf',
}

export const roles: Copy[] = [
  { fun: 'full stack developer', serious: 'Full Stack Developer' },
  { fun: 'professional bug relocator', serious: 'TypeScript Engineer' },
  { fun: 'bilingual in Vue & React', serious: 'Vue.js & React Developer' },
  { fun: 'turns Figma into pixels', serious: 'UI Engineer' },
  { fun: 'API whisperer', serious: 'Node.js & API Developer' },
]

export const heroBlurb: Copy = {
  fun: "I build SaaS products and client websites from the API all the way up to the hover state. I write TypeScript so future me doesn't have to guess, and I name my variables like someone else will read them. (Someone will.)",
  serious:
    'Full Stack Developer with a B.Sc. in Computer Science and AI from Cairo University. I build SaaS products and client websites with React, Vue, TypeScript and Node.js, from API design to polished, accessible UI.',
}

export const stickers = [
  { text: 'Cairo, EG', color: 'lime', x: 4, y: 12, r: -8 },
  { text: '100% organic code', color: 'pink', x: 70, y: 6, r: 6 },
  { text: 'now with types', color: 'blue', x: 78, y: 70, r: -5 },
  { text: 'git push --hope', color: 'orange', x: 8, y: 78, r: 4 },
]

export const marquee = [
  'TypeScript', 'React', 'Vue.js', 'Next.js', 'Node.js', 'Hono', 'NestJS',
  'GraphQL', 'Zod', 'AWS Lambda', 'MongoDB', 'PostgreSQL', 'Cypress', 'Tailwind',
]

export type Release = {
  version: string
  title: string
  org: string
  date: string
  status: 'live' | 'shipped' | 'legacy'
  stack: string[]
  summary?: string
  changes: { tag: 'added' | 'improved' | 'fixed'; text: string }[]
  note?: Copy
  link?: { label: string; href: string }
}

export const releases: Release[] = [
  {
    version: 'v5.0.0',
    title: 'Frontend Developer (Vue.js)',
    org: 'Saqaya · Mobysoft (UK)',
    link: { label: 'mobysoft.com', href: 'https://www.mobysoft.com' },
    date: 'Jul 2025 → now',
    status: 'live',
    stack: ['Vue.js', 'TypeScript', 'Pinia', 'Cypress'],
    changes: [
      { tag: 'added', text: 'Features for RentSense and RepairSense, leading social housing platforms in the UK.' },
      { tag: 'improved', text: 'Usability and performance with responsive, scalable Vue.js features.' },
      { tag: 'improved', text: 'Delivery, by working in agile sprints with cross-functional teams.' },
    ],
    note: {
      fun: 'Cypress tests: green. Me: also green, from tea.',
      serious: 'E2E-tested features in a long-lived product codebase.',
    },
  },
  {
    version: 'v4.0.0',
    title: 'Full Stack Developer',
    org: 'Saqaya · OPSANA',
    link: { label: 'dev.opsana.ai', href: 'https://www.dev.opsana.ai/' },
    date: 'Jul 2026 → now',
    status: 'live',
    stack: ['TypeScript', 'React', 'Hono', 'AWS Lambda', 'Zod', 'GraphQL'],
    summary:
      'OPSANA is an agentic QA SaaS that turns GitHub, Jira and GitHub Projects data into evidence-backed confidence reports.',
    changes: [
      { tag: 'added', text: 'Shipped features end to end in a type-safe TypeScript monorepo: Zod contracts, a Hono REST API on AWS Lambda, and a React SPA with a typed RPC client.' },
      { tag: 'added', text: 'Jira Cloud and GitHub Projects integrations: a paginated GraphQL client, ticket and board ingest as agent context, and UI source pickers.' },
      { tag: 'added', text: 'Led the redesign across the app and marketing site, including the AI report dashboard with live agent logs, a system map, journey flow diagrams and PDF export.' },
      { tag: 'added', text: 'Sign-up, onboarding and pricing flows.' },
      { tag: 'improved', text: 'Performance and accessibility, by removing React Compiler blockers and lazy-loading the PDF tooling.' },
      { tag: 'fixed', text: 'Project-lifecycle data bugs. Also wrote the endpoints for projects, repo linking, agent enablement and team invites, plus their tests.' },
    ],
    note: {
      fun: 'Known issue: says "one small change" right before a 40-file PR.',
      serious: 'Owned features across API, data contracts and UI.',
    },
  },
  {
    version: 'v3.5.0',
    title: 'WordPress Developer',
    org: 'Impact Student Partners',
    link: { label: 'impactstudentpartners.com', href: 'https://impactstudentpartners.com' },
    date: 'Jul 2026 → Oct 2026',
    status: 'shipped',
    stack: ['WordPress'],
    changes: [
      { tag: 'added', text: 'Responsive WordPress site for a UK higher education support provider (Commercial Services Group).' },
      { tag: 'improved', text: 'Site structure built around key services (Non-Medical Help, workplace support, university solutions) so people find things fast.' },
    ],
    note: {
      fun: 'Proof I will touch PHP if the cause is good.',
      serious: 'Delivered on schedule for a UK client.',
    },
  },
  {
    version: 'v3.0.0',
    title: 'Frontend Developer',
    org: 'Holden Knight Group',
    link: { label: 'holdenknight.com', href: 'https://holdenknight.com' },
    date: 'Nov 2025 → now',
    status: 'live',
    stack: ['Next.js', 'Contentful'],
    changes: [
      { tag: 'added', text: 'Pages for holdenknight.com, a multi-division site covering children’s care, recruitment, complex care and an academy.' },
      { tag: 'added', text: 'Contentful content models so non-technical staff manage pages, blogs and testimonials without a developer.' },
      { tag: 'improved', text: 'Reusable responsive components and nested navigation shared across divisions, with optimised images.' },
    ],
    note: {
      fun: 'Made myself unnecessary for blog posts. On purpose.',
      serious: 'Enabled self-serve content editing for staff.',
    },
  },
  {
    version: 'v2.0.0',
    title: 'Freelance Backend Developer',
    org: 'Independent',
    date: 'Mar 2025 → Jun 2025',
    status: 'shipped',
    stack: ['Node.js', 'Mongoose', 'MongoDB'],
    changes: [
      { tag: 'added', text: 'Designed and built a custom freelancing platform that connects clients.' },
      { tag: 'added', text: 'Backend services with Node.js and Mongoose, built for scalability and security.' },
      { tag: 'improved', text: 'Tailored features to match the client’s business requirements.' },
    ],
  },
  {
    version: 'v1.0.0',
    title: 'B.Sc. Computer Science & AI',
    org: 'Cairo University',
    date: '2021 → 2025',
    status: 'legacy',
    stack: ['C++', 'Python', 'Algorithms', 'AI'],
    changes: [
      { tag: 'added', text: 'Initial release. Core modules: data structures, algorithms, machine learning, a lot of coffee.' },
    ],
    note: {
      fun: 'Breaking change: started calling everything "an O(n) problem".',
      serious: 'Faculty of Computer Science and Artificial Intelligence.',
    },
  },
]

export type Project = {
  name: string
  kicker: string
  blurb: Copy
  stack: string[]
  color: 'lime' | 'pink' | 'blue' | 'orange' | 'purple'
  emoji: string
  link?: { label: string; href: string }
}

export const projects: Project[] = [
  {
    name: 'OPSANA',
    kicker: 'Agentic QA SaaS',
    blurb: {
      fun: 'Robots read your GitHub and Jira, then tell you how confident you should feel about shipping. I built the bits they talk through and the dashboard that shows their work.',
      serious: 'Agentic QA platform producing evidence-backed confidence reports from GitHub, Jira and GitHub Projects data. Full stack: Hono on Lambda, Zod contracts, React dashboard.',
    },
    stack: ['React', 'Hono', 'AWS Lambda', 'GraphQL', 'Zod'],
    color: 'lime',
    emoji: '🤖',
    link: { label: 'dev.opsana.ai', href: 'https://www.dev.opsana.ai/' },
  },
  {
    name: 'Holden Knight',
    kicker: 'Multi-division website',
    blurb: {
      fun: 'Four divisions, one navigation that doesn’t make anyone cry. Staff edit their own content now, which means fewer emails titled “quick change”.',
      serious: 'Next.js site with Contentful CMS for a multi-division care and recruitment group. Shared component library, nested navigation, optimised images.',
    },
    stack: ['Next.js', 'Contentful'],
    color: 'orange',
    emoji: '🏰',
    link: { label: 'holdenknight.com', href: 'https://holdenknight.com' },
  },
  {
    name: 'Impact Student Partners',
    kicker: 'UK higher education support',
    blurb: {
      fun: 'A WordPress site for people who help university students thrive. Every service is two clicks away, because students already have enough deadlines.',
      serious: 'Responsive WordPress site for a UK Non-Medical Help and student wellbeing provider, structured around its core services: NMH, workplace support and university solutions.',
    },
    stack: ['WordPress', 'Responsive design', 'Information architecture'],
    color: 'purple',
    emoji: '🎓',
    link: { label: 'impactstudentpartners.com', href: 'https://impactstudentpartners.com' },
  },
  {
    name: 'KmtKids',
    kicker: 'Graduation project',
    blurb: {
      fun: 'Teachers upload boring PDFs, kids get interactive stories, quizzes and a chatbot they can actually talk to. Authorized by Egypt’s Ministry of Culture, so it’s officially fun.',
      serious: 'Educational platform authorized by the Ministry of Culture, Egypt. Auto-categorizes teacher materials into interactive lessons and quizzes, with a text and voice chatbot grounded in uploaded content.',
    },
    stack: ['Express.js', 'FastAPI', 'LangChain', 'Flutter', 'MongoDB'],
    color: 'pink',
    emoji: '🧸',
  },
  {
    name: 'Areeb Event Booking',
    kicker: 'Competition build',
    blurb: {
      fun: 'A full event booking app with an admin panel that bouncers would approve of. Speaks English and Spanish, because events are international and so is my confidence.',
      serious: 'Event booking app for the Areeb Technology competition: user and admin workflows, secure admin CRUD, JWT auth, i18n (EN/ES), deployed on MongoDB Atlas.',
    },
    stack: ['React', 'NestJS', 'Redux Toolkit', 'React Query', 'Tailwind'],
    color: 'blue',
    emoji: '🎟️',
  },
]

export const inventory: { group: string; icon: string; items: string[] }[] = [
  { group: 'Languages', icon: '🗣️', items: ['TypeScript', 'JavaScript', 'HTML5', 'CSS / SCSS', 'SQL', 'Python', 'C++', 'C#'] },
  { group: 'Frameworks', icon: '⚔️', items: ['React', 'Vue.js', 'Next.js', 'Node.js', 'NestJS', 'Hono', 'FastAPI', 'GraphQL', 'Zod', 'Tailwind'] },
  { group: 'Data', icon: '🗄️', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'TypeORM', 'Sequelize', 'Mongoose'] },
  { group: 'Testing & Cloud', icon: '🧪', items: ['Cypress', 'Jest', 'AWS Lambda', 'Docker', 'SonarCloud', 'Git'] },
  { group: 'CMS', icon: '📝', items: ['Contentful', 'WordPress', 'Elementor'] },
  { group: 'Team & Design', icon: '🎨', items: ['Figma', 'Adobe XD', 'Jira', 'Miro', 'Notion', 'Asana'] },
]

export const faq: { q: string; a: Copy }[] = [
  {
    q: 'Vue or React?',
    a: {
      fun: 'Yes. I use Vue at one job and React at the other. They know about each other and are fine with it.',
      serious: 'Both, professionally: Vue.js on Mobysoft products, React on OPSANA.',
    },
  },
  {
    q: 'Frontend or backend?',
    a: {
      fun: 'Both ends, and the awkward middle where the types live.',
      serious: 'Full stack: REST and GraphQL APIs, serverless on AWS Lambda, and production UIs.',
    },
  },
  {
    q: 'Do you deploy on Fridays?',
    a: {
      fun: 'Only with tests passing, a rollback plan and a snack nearby.',
      serious: 'I write unit and E2E tests (Jest, Cypress) so releases are boring in the good way.',
    },
  },
  {
    q: 'Are you open to new things?',
    a: {
      fun: 'For interesting problems and nice people, always. The inbox is right below this.',
      serious: 'Yes. I’m happy to hear about roles and freelance projects. Contact details below.',
    },
  },
]
