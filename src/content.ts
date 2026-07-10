import type { Mode } from './lib/ModeContext';

// All copy that switches with the AI Agents / Business Dev toggle lives here,
// sourced from Mikhail's actual CV (Go Mobile, Xenara Inc., afp.ai, Keywords
// Studios, PartyTeam, Air Agency).

export const MODE_LABEL: Record<Mode, string> = {
  ai: 'AI Agents',
  bd: 'Business Dev',
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
    { text: 'Mikhail audits real workflows, proves the ROI, ' },
    { text: 'then architects the AI agents and automations ' },
    { text: 'that actually replace the manual work.', accent: true },
  ],
  bd: [
    { text: 'Mikhail builds partnerships and pipelines ' },
    { text: 'that turn the hardest markets ' },
    { text: 'into recurring, compounding revenue.', accent: true },
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
      desc: 'Audit first, automate second — cut cost and routine, not corners.',
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
      period: 'Nov 2025 — Present',
      bullets: [
        'Surveyed 9 teams, surfaced 97 real process problems, and shipped 7 AI automations from scratch that cut roughly 35 hours of manual work every week.',
        'Audited workflows through cross-functional interviews and modeled the ROI case before building anything.',
        'Built end-to-end automations on n8n, custom APIs, and PostgreSQL; deployed local + cloud LLMs (OpenClaw, Claude, Hermes Agent) with RAG databases underneath for accuracy.',
        'Shipped two production RAG-backed AI assistants — an internal legal-FAQ assistant and a media-buying guide navigator — plus an automated Plan/Fact analytics pipeline and a document router feeding Google Drive and Bitrix24.',
      ],
    },
    {
      company: 'afp.ai',
      role: 'AI Agent Architecture, International Division',
      period: 'Jan 2024 — Present',
      bullets: [
        'Designed and shipped a fully autonomous multi-channel cold-outreach agent, automating the pipeline end to end from lead sourcing to deal close.',
        'Built LLM-based lead scoring and routing that auto-classified companies by region and need, and hyper-personalized every LinkedIn/email message per lead — no templates.',
        'Ran the outreach engine at 2,000+ cold emails a week across 10 fresh sequences every quarter, with zero extra headcount.',
      ],
    },
    {
      company: 'Xenara Inc.',
      role: 'AI Call Intelligence',
      period: 'Jun 2025 — Nov 2025',
      bullets: [
        'Built automatic transcription and AI analysis of client calls, extracting intent and objections and writing structured notes straight into the CRM with no manual entry.',
        'Stood up the sales-automation stack (CRM, Apollo.io, LinkedIn Sales Navigator) for an autonomous AI customer-service platform launching into the US and EU.',
      ],
    },
    {
      company: 'Air Agency',
      role: 'Marketing Automation Engineer',
      period: 'Aug 2017 — Aug 2019',
      bullets: [
        'Built a custom Python bot suite from scratch to run Instagram/Facebook campaigns: algorithmic audience targeting, auto-commenting on trigger hashtags, and a DM chatbot that qualified leads and escalated only complex queries.',
        'Fully automated the SMM team’s lead-gen and moderation workload, driving 49.54% average audience growth across a 30-account portfolio.',
      ],
    },
  ],
  bd: [
    {
      company: 'afp.ai',
      role: 'Partnerships Manager → Head of Business Development',
      period: 'Apr 2023 — Present',
      bullets: [
        'Manage a client portfolio generating roughly $144K in quarterly recurring revenue across LatAm, MENA, Africa, EMEA, and APAC.',
        'Personally brought in 18 partners across five regions — 12 publishers, 4 agencies, 2 sellers.',
        'Lead a team of 5; ran 10 ad campaigns solo end to end before moving into the leadership role.',
        'Named Employee of the Year, 2024.',
      ],
    },
    {
      company: 'Xenara Inc.',
      role: 'Head of Sales',
      period: 'Jun 2025 — Nov 2025',
      bullets: [
        'Built the sales engine from nothing — CRM, workflows, performance tracking, and multi-channel lead gen via Apollo.io and LinkedIn Sales Navigator.',
        'Closed 3 enterprise deals from a standing start, including one with a global e-commerce company.',
        'Ran full-cycle sales: demos, closes, competitive positioning.',
      ],
    },
    {
      company: 'Keywords Studios',
      role: 'Customer Experience Manager',
      period: 'Oct 2021 — Apr 2023',
      bullets: [
        'Managed a team of 10 supporting a title with 140M+ downloads worldwide.',
        'Ranked top 3 employee of the month every month for a year straight.',
      ],
    },
    {
      company: 'PartyTeam',
      role: 'Events Lead',
      period: 'Oct 2015 — Nov 2019',
      bullets: [
        'Planned and ran events for up to 35,000 attendees, 200+ events total.',
        'Attracted 25 new regular clients every year; managed VIP relationships.',
      ],
    },
  ],
};

interface Card {
  code: string;
  tag: string;
  name: string;
  desc: string;
}

export const PRODUCTS_TITLE: Record<Mode, string> = {
  ai: 'Built on three systems.',
  bd: 'Built on three markets.',
};

export const CARDS: Record<Mode, Card[]> = {
  ai: [
    {
      code: 'A¹',
      tag: '01 / AUT',
      name: 'Automation',
      desc: 'End-to-end workflow automation across marketing and sales ops, built with n8n, custom APIs, and PostgreSQL.',
    },
    {
      code: 'B¹',
      tag: '02 / RAG',
      name: 'RAG & LLMs',
      desc: 'Retrieval-augmented pipelines and local + cloud LLM deployments (Yandex AI Studio, OpenClaw) for contextual accuracy.',
    },
    {
      code: 'A¹',
      tag: '03 / AGT',
      name: 'Agent Orchestration',
      desc: 'Autonomous multi-agent workflows built with Claude Code, Hermes Agent, and custom integrations.',
    },
  ],
  bd: [
    {
      code: 'A¹',
      tag: '01 / BD',
      name: 'Partnerships',
      desc: 'Built and led BD teams across LatAm, MENA, GCC, and EMEA for adtech and SaaS platforms.',
    },
    {
      code: 'B¹',
      tag: '02 / SLS',
      name: 'Sales Systems',
      desc: 'CRM, outreach, and reporting infrastructure built from scratch to scale pipeline predictably.',
    },
    {
      code: 'A¹',
      tag: '03 / MKT',
      name: 'Market Expansion',
      desc: 'Positioned products against competitors and closed deals across luxury, banking, iGaming, and e-commerce.',
    },
  ],
};

interface InfoPair {
  label: string;
  value: string;
}

export const INFO: Record<Mode, InfoPair[]> = {
  ai: [
    { label: 'Stack', value: 'n8n · PostgreSQL · RAG' },
    { label: 'Core Business', value: 'Workflow Automation' },
    { label: 'Current Role', value: 'AI Automation Architect' },
    { label: 'Approach', value: 'Audit → Automate → Scale' },
  ],
  bd: [
    { label: 'Markets', value: 'LatAm · GCC · EMEA' },
    { label: 'Core Business', value: 'B2B / SaaS Partnerships' },
    { label: 'Current Role', value: 'Head of Business Development' },
    { label: 'Languages', value: 'EN · ES · RU' },
  ],
};
