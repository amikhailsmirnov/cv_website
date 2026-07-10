import type { Mode } from './lib/ModeContext';

// All copy that switches with the AI Agents / Business Dev toggle lives here,
// sourced from Mikhail's actual CV (Go Mobile, Xenara Inc., afp.ai, Keywords
// Studios, PartyTeam, Air Agency).

export const MODE_LABEL: Record<Mode, string> = {
  ai: 'AI Automation Architect',
  bd: 'Head of Business Development',
};

interface HeroContent {
  line1: string;
  line2: string;
  subPill: string;
  tags: string[];
}

export const HERO: Record<Mode, HeroContent> = {
  ai: {
    line1: 'Where logic',
    line2: 'meets autonomy.',
    subPill: 'Discover the automation side',
    tags: ['n8n', 'RAG', 'Claude Code'],
  },
  bd: {
    line1: 'Where deals',
    line2: 'meet momentum.',
    subPill: 'Discover the partnerships side',
    tags: ['LatAm', 'GCC', 'EMEA'],
  },
};

interface StatementPhrase {
  text: string;
  accent?: boolean;
}

export const STATEMENT: Record<Mode, StatementPhrase[]> = {
  ai: [
    { text: 'I audit real workflows, prove the ROI, ' },
    { text: 'then build the AI agents and automations ' },
    { text: 'that take the manual work off the table.', accent: true },
  ],
  bd: [
    { text: 'I build partnerships and pipelines ' },
    { text: 'that turn the hardest markets ' },
    { text: 'into revenue that keeps compounding.', accent: true },
  ],
};

interface ManifestoItem {
  idx: string;
  title: string;
  desc: string;
}

export const MANIFESTO: Record<Mode, ManifestoItem[]> = {
  ai: [
    {
      idx: '0.1',
      title: 'My Mission',
      desc: 'Audit first, automate second. Cut cost and routine, not corners.',
    },
    {
      idx: '0.2',
      title: 'My Vision',
      desc: 'Every workflow has an agent quietly running behind it.',
    },
    {
      idx: '0.3',
      title: 'My Ambition',
      desc: 'Build automation architecture that scales past the first integration.',
    },
  ],
  bd: [
    {
      idx: '0.1',
      title: 'My Mission',
      desc: 'Open doors in markets everyone else finds too hard.',
    },
    {
      idx: '0.2',
      title: 'My Vision',
      desc: 'Partnerships that compound, not just close once.',
    },
    {
      idx: '0.3',
      title: 'My Ambition',
      desc: 'Build sales engines that keep scaling without me in the room.',
    },
  ],
};

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export const EXPERIENCE_TITLE: Record<Mode, string> = {
  ai: 'Shipped in the field.',
  bd: 'Closed in the field.',
};

export const EXPERIENCE: Record<Mode, ExperienceItem[]> = {
  ai: [
    {
      company: 'Go Mobile',
      role: 'AI Automation Architect',
      period: 'Nov 2025 - May 2026',
      location: 'Jakarta, Indonesia',
      bullets: [
        'Interviewed 9 teams, dug up 97 real process problems, and shipped 7 AI automations from scratch. They now save about 35 hours of manual work a week and cut operational overhead by 30%.',
        'Counted the ROI before building anything: 10+ automation opportunities worth around $67K a year in projected savings.',
        'Built everything end to end on n8n, custom APIs and PostgreSQL, with local and cloud LLMs (OpenClaw, Claude, Hermes Agent) sitting on RAG databases for accuracy. Process efficiency went up 39%, system integration got 20% faster.',
        'Put two RAG-backed assistants into production: a legal FAQ bot and a media-buying guide navigator. Plus an automated Plan/Fact analytics pipeline and a document router that feeds Google Drive and Bitrix24.',
      ],
    },
    {
      company: 'afp.ai',
      role: 'AI Agent Architecture, International Division',
      period: 'Jan 2024 - Present',
      location: 'Dubai, UAE',
      bullets: [
        'Designed and shipped a fully autonomous multi-channel cold outreach agent that runs the whole pipeline, from finding a lead to closing the deal.',
        'Built LLM lead scoring and routing that sorts companies by region and need, and writes a personal LinkedIn or email message for every single lead. No templates.',
        'The engine runs at 2,000+ cold emails a week across 10 fresh sequences every quarter, without hiring a single extra person.',
      ],
    },
    {
      company: 'Xenara Inc.',
      role: 'AI Call Intelligence',
      period: 'Jun 2025 - Nov 2025',
      location: 'Toronto, Canada',
      bullets: [
        'Set up automatic transcription and AI analysis of client calls: the system pulls out intent and objections and writes structured notes straight into the CRM, no manual entry.',
        'Stood up the whole sales automation stack (CRM, Apollo.io, LinkedIn Sales Navigator) for an autonomous AI customer service platform entering the US and EU.',
      ],
    },
    {
      company: 'Air Agency',
      role: 'Marketing Automation Engineer',
      period: 'Aug 2017 - Aug 2019',
      location: 'Marbella, Spain',
      bullets: [
        'Wrote a custom Python bot suite from scratch to run Instagram and Facebook campaigns: audience targeting, auto-commenting on trigger hashtags, and a DM chatbot that qualified leads and only passed the tricky cases to a human.',
        'Grew audiences 376% and engagement 212% across 30 accounts in six months, holding 49.54% average growth overall.',
      ],
    },
  ],
  bd: [
    {
      company: 'afp.ai',
      role: 'Partnerships Manager → Head of Business Development',
      period: 'Apr 2023 - Present',
      location: 'Dubai, UAE',
      bullets: [
        'Run a client portfolio doing around $144K in quarterly recurring revenue across LatAm, MENA, Africa, EMEA and APAC. 18 of those partners I brought in myself: 12 publishers, 4 agencies and 2 sellers.',
        'Lead and train a team of 5. KPI attainment is up 30% and partnership engagement up 21% within six months.',
        'Before the promotion I ran 10 ad campaigns solo, lifting KPI performance 68% and cutting project lead times 32%.',
        'Handle around 50 client inquiries a week in English and Spanish. Acting on partner feedback lifted engagement 39% over a year.',
        'Employee of the Year 2024.',
      ],
    },
    {
      company: 'Xenara Inc.',
      role: 'Head of Sales',
      period: 'Jun 2025 - Nov 2025',
      location: 'Toronto, Canada',
      bullets: [
        'Built the sales engine from nothing: CRM, workflows, performance tracking and multi-channel lead gen through Apollo.io and LinkedIn Sales Navigator.',
        'Walked away with 3 closed enterprise deals from a standing start, one of them with a global e-commerce company.',
        'Ran the full sales cycle myself: demos, closes, competitive positioning.',
      ],
    },
    {
      company: 'Keywords Studios',
      role: 'Customer Experience Manager',
      period: 'Oct 2021 - Apr 2023',
      location: 'Montreal, Canada',
      bullets: [
        'Managed a team of 10 supporting a game with 140M+ downloads worldwide.',
        'Top 3 employee of the month, every single month, for a year straight.',
      ],
    },
    {
      company: 'PartyTeam',
      role: 'Events Lead',
      period: 'Oct 2015 - Nov 2019',
      location: 'Marbella, Spain',
      bullets: [
        'Planned and ran over 200 events, parties and concerts, some up to 35,000 people.',
        'Brought in 25 new regular clients every year and handled the VIP relationships myself.',
      ],
    },
  ],
};

interface EducationItem {
  school: string;
  degree: string;
  years: string;
}

const UNIVERSIDAD: EducationItem = {
  school: 'Universidad Europea Miguel de Cervantes',
  degree: "Bachelor's Degree, Tourism",
  years: '2017–2021',
};
const HELLO_CODING: EducationItem = {
  school: 'Hello Coding',
  degree: 'Associate Degree, Mobile App Development',
  years: '2017–2019',
};
const RADIO_TV: EducationItem = {
  school: 'The Academy of Radio and TV Broadcasting',
  degree: "Associate's Degree, Radio and Television",
  years: '2021',
};
const NOVIKOV: EducationItem = {
  school: 'Novikov Elite Culinary School',
  degree: "Associate's Degree, Culinary Arts / Chef Training",
  years: '2020–2021',
};
const LAUDE: EducationItem = {
  school: 'LAUDE San Pedro International College',
  degree: 'High School, Tourism and Travel Services Management',
  years: '2009–2017',
};

// Same schooling either way, but ordered by what matters to each resume:
// the coding degree leads on the AI side, the tourism/business track leads
// on the BD side.
export const EDUCATION: Record<Mode, EducationItem[]> = {
  ai: [HELLO_CODING, UNIVERSIDAD, RADIO_TV, NOVIKOV, LAUDE],
  bd: [UNIVERSIDAD, LAUDE, HELLO_CODING, RADIO_TV, NOVIKOV],
};

export interface ContactLink {
  label: string;
  href: string;
}

export const CONTACTS: ContactLink[] = [
  { label: 'amikhailsmirnov@gmail.com', href: 'mailto:amikhailsmirnov@gmail.com' },
  { label: '+995 59 100 4603', href: 'tel:+995591004603' },
  { label: 'linkedin.com/in/amikhailsmirnov', href: 'https://www.linkedin.com/in/amikhailsmirnov' },
  { label: 't.me/amikhailsmirnov', href: 'https://t.me/amikhailsmirnov' },
];

interface InfoPair {
  label: string;
  value: string;
}

export const INFO: Record<Mode, InfoPair[]> = {
  ai: [
    { label: 'Stack', value: 'n8n · PostgreSQL · RAG' },
    { label: 'Core Business', value: 'Workflow Automation' },
    { label: 'Current Role', value: 'AI Automation Architect' },
    { label: 'Approach', value: 'Audit, automate, scale' },
  ],
  bd: [
    { label: 'Markets', value: 'LatAm · GCC · EMEA' },
    { label: 'Core Business', value: 'B2B / SaaS Partnerships' },
    { label: 'Current Role', value: 'Head of Business Development' },
    { label: 'Languages', value: 'EN C2 · ES C1 · RU native' },
  ],
};
