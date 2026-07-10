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
    { text: 'Mikhail architects AI agent systems ' },
    { text: 'that turn manual, repetitive workflows ' },
    { text: 'into automations that run themselves.', accent: true },
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
      desc: 'Automate the repetitive, so people can focus on judgment.',
    },
    {
      idx: '0.2',
      title: 'My Vision',
      desc: 'Every workflow has an agent quietly running behind it.',
    },
    {
      idx: '0.3',
      title: 'My Ambition',
      desc: 'Ship AI systems that just work, without anyone noticing.',
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
      desc: 'End-to-end workflow automation across marketing and sales ops, built with n8n and custom APIs.',
    },
    {
      code: 'B¹',
      tag: '02 / RAG',
      name: 'RAG & LLMs',
      desc: 'Retrieval-augmented pipelines and local + cloud LLM deployments for contextual accuracy.',
    },
    {
      code: 'A¹',
      tag: '03 / AGT',
      name: 'Agent Orchestration',
      desc: 'Multi-agent workflows built with Claude Code, Hermes Agent, and custom integrations.',
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
    { label: 'Stack', value: 'n8n · Claude Code · RAG' },
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
