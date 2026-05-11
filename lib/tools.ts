// lib/tools.ts
// Tool inventory drawn from the BairesDev AI Tools Wizard scope (April 2026)
// and fact-checked against vendor documentation as of late April 2026.
//
// Scores are 1-10 across the four dimensions. Higher is better in every
// column (a Price of 10 means free or near-free, not expensive).
//
// `categories` contains a primary category plus any secondary categories the
// tool meaningfully serves. The wizard's category filter (Q1) checks the
// full list so a tool like Claude can show up for "chat" and "documents".

export type CategoryId =
  | "code"
  | "chat"
  | "image"        // still image generation
  | "video"        // video generation
  | "audio"        // voice and music generation
  | "build"        // app & website builders
  | "documents"    // research / knowledge / document AI
  | "agents";      // autonomous agents

export type TechLevel = "daily-coder" | "technical" | "non-technical";
export type UsageMode = "one-time" | "daily" | "api" | "exploring";
export type ContextNeed = "static" | "session" | "persistent" | "long-context";
export type Priority = "ease" | "power" | "price" | "privacy";

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  url: string;
  categories: CategoryId[];
  primaryCategory: CategoryId;
  blurb: string;
  scores: {
    power: number;
    price: number;
    install: number;
    operate: number;
  };
  // Hard-filter signals
  requiresCLI?: boolean;          // excluded for non-technical users
  apiFirst?: boolean;             // boosted when usage = "api"
  longContext?: boolean;          // boosted when context = "long-context"
  persistentMemory?: boolean;     // boosted when context = "persistent"
  selfHostable?: boolean;         // required when priority = "privacy"
  freeTier?: boolean;             // boosted when usage = "exploring"
  consumerInterface?: boolean;    // boosted when usage = "daily"
  lastReviewed: string;
}

export const TOOLS: Tool[] = [
  // ── Coding AI ──────────────────────────────────────────────────────────
  {
    id: "claude-code",
    name: "Claude Code",
    vendor: "Anthropic",
    url: "https://www.anthropic.com/claude-code",
    categories: ["code", "agents"],
    primaryCategory: "code",
    blurb:
      "Anthropic's terminal-native coding agent, powered by Opus 4.7 with a 1M-token context window. Strongest at autonomous multi-file work and large-scale refactors. The pick if you write code daily and want the most capable agent, even at the cost of a steeper learning curve than IDE-based tools.",
    scores: { power: 10, price: 5, install: 6, operate: 6 },
    requiresCLI: true,
    longContext: true,
    lastReviewed: "2026-04",
  },
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Anysphere",
    url: "https://cursor.com",
    categories: ["code"],
    primaryCategory: "code",
    blurb:
      "The dominant AI-first IDE. Cursor 3 (April 2026) ships a dedicated Agents Window, cloud-to-local handoff, and Composer 2 as the default frontier coding model. Now also available in JetBrains IDEs via the Agent Client Protocol. The pick if you want the best polished IDE experience and want to stay close to VS Code conventions.",
    scores: { power: 9, price: 6, install: 9, operate: 9 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Cognition AI",
    url: "https://windsurf.com",
    categories: ["code"],
    primaryCategory: "code",
    blurb:
      "Cognition's agentic IDE, built around the SWE-1.5 model running at 950 tokens per second on Cerebras hardware. Stronger than Cursor on raw inference speed and broad IDE coverage. The pick if you do not want to abandon your editor, or if you need enterprise compliance such as HIPAA or FedRAMP.",
    scores: { power: 9, price: 6, install: 8, operate: 8 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub / Microsoft",
    url: "https://github.com/features/copilot",
    categories: ["code"],
    primaryCategory: "code",
    blurb:
      "Still the cheapest premium option at $10/month for Pro and $39/month for Pro+. Moving to usage-based billing on June 1, 2026, with monthly AI Credits replacing premium request units. The pick if you live in GitHub already and want the most native integration.",
    scores: { power: 8, price: 8, install: 9, operate: 9 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "chatgpt-codex",
    name: "ChatGPT Codex",
    vendor: "OpenAI",
    url: "https://openai.com/codex",
    categories: ["code"],
    primaryCategory: "code",
    blurb:
      "Bundled into ChatGPT Plus, Pro, Business, and Enterprise plans rather than billed separately. GPT-5.5 is the default in Codex as of April 23, 2026. The pick if you already pay for ChatGPT and want a coding agent that comes with it.",
    scores: { power: 9, price: 7, install: 8, operate: 8 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "cline-aider",
    name: "Cline / Aider",
    vendor: "Open source",
    url: "https://github.com/Aider-AI/aider",
    categories: ["code"],
    primaryCategory: "code",
    blurb:
      "Free open-source coding agents you bring your own API key to. The pick if you want full control over costs and prompt logic, and you do not mind doing the wiring yourself. Heavy hitter in the developer community despite the install friction.",
    scores: { power: 8, price: 9, install: 5, operate: 4 },
    requiresCLI: true,
    selfHostable: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },

  // ── Chat & general-purpose ─────────────────────────────────────────────
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    url: "https://chatgpt.com",
    categories: ["chat", "documents"],
    primaryCategory: "chat",
    blurb:
      "The default for most people. GPT-5.5 launched April 23, 2026 as OpenAI's flagship agentic model, with strong gains on complex coding, computer use, and multi-step research workflows. The pick if you want the broadest capability across tasks and the deepest ecosystem of integrations and plugins.",
    scores: { power: 10, price: 6, install: 10, operate: 10 },
    consumerInterface: true,
    persistentMemory: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    url: "https://claude.ai",
    categories: ["chat", "documents"],
    primaryCategory: "chat",
    blurb:
      "Anthropic's consumer chat interface at claude.ai, $20/month Pro or $100 to $200/month Max. Opus 4.7 (released April 16, 2026) leads on SWE-bench Verified at 87.6% and on writing quality. The pick if you write a lot, work with long documents, or care about response quality over breadth of features.",
    scores: { power: 10, price: 6, install: 10, operate: 10 },
    consumerInterface: true,
    longContext: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    url: "https://gemini.google.com",
    categories: ["chat", "documents"],
    primaryCategory: "chat",
    blurb:
      "Gemini 3.1 Pro (Feb 2026) brought significant gains on agentic reasoning, scoring 77.1% on ARC-AGI-2, and ships a 1M-token context window. The pick if you live in Google Workspace, need very long context, or want the cheapest frontier API at $2/$12 per million tokens.",
    scores: { power: 9, price: 7, install: 10, operate: 9 },
    consumerInterface: true,
    longContext: true,
    apiFirst: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity AI",
    url: "https://www.perplexity.ai",
    categories: ["chat", "documents"],
    primaryCategory: "chat",
    blurb:
      "Built around answering questions with cited sources rather than open-ended chat. Routes across multiple frontier models depending on the query. The pick if your primary use is research, fact-checking, or anything where source citations matter.",
    scores: { power: 8, price: 6, install: 10, operate: 10 },
    consumerInterface: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },
  {
    id: "grok",
    name: "Grok",
    vendor: "xAI",
    url: "https://grok.x.ai",
    categories: ["chat"],
    primaryCategory: "chat",
    blurb:
      "xAI's chat assistant, $30/month for SuperGrok or $300/month for SuperGrok Heavy. The pick if you want real-time integration with X (Twitter) data or fewer content guardrails than the alternatives. Niche outside that.",
    scores: { power: 7, price: 4, install: 9, operate: 8 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    vendor: "DeepSeek",
    url: "https://www.deepseek.com",
    categories: ["chat", "code"],
    primaryCategory: "chat",
    blurb:
      "Free web chat plus a pay-per-token API at roughly 35-100x cheaper than Western frontier models, with open-weight releases. The pick if cost is the primary concern, especially for API usage at scale, and you can tolerate slightly less polish.",
    scores: { power: 8, price: 10, install: 9, operate: 8 },
    apiFirst: true,
    selfHostable: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },
  {
    id: "mistral",
    name: "Mistral Le Chat",
    vendor: "Mistral",
    url: "https://chat.mistral.ai",
    categories: ["chat", "code"],
    primaryCategory: "chat",
    blurb:
      "European AI lab with open-weight models, GDPR-friendly hosting, and strong code-focused models (Codestral). The pick for European businesses with data residency requirements, or anyone who wants a credible non-US, non-China option.",
    scores: { power: 7, price: 8, install: 9, operate: 8 },
    selfHostable: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },
  {
    id: "pi",
    name: "Pi",
    vendor: "Inflection",
    url: "https://pi.ai",
    categories: ["chat"],
    primaryCategory: "chat",
    blurb:
      "Inflection's personal AI, free with paid tiers. Built around emotional intelligence and conversational tone rather than raw capability. The pick if you want an AI that feels like a friend more than a tool.",
    scores: { power: 6, price: 9, install: 10, operate: 10 },
    consumerInterface: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },

  // ── App & website builders ─────────────────────────────────────────────
  {
    id: "replit-agent",
    name: "Replit Agent",
    vendor: "Replit",
    url: "https://replit.com",
    categories: ["build"],
    primaryCategory: "build",
    blurb:
      "The pick for non-developers who want to build a working app from a description. Combines code generation with hosting in one place. Subscription-based, with pricing tied to compute usage.",
    scores: { power: 7, price: 7, install: 9, operate: 8 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "bolt",
    name: "Bolt.new",
    vendor: "StackBlitz",
    url: "https://bolt.new",
    categories: ["build"],
    primaryCategory: "build",
    blurb:
      "Web app builder powered by AI, with a generous free tier (1M tokens per month). The pick for quick prototyping of web apps without a full IDE setup. Faster from idea to working URL than almost any alternative.",
    scores: { power: 7, price: 8, install: 9, operate: 8 },
    consumerInterface: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },
  {
    id: "lovable",
    name: "Lovable",
    vendor: "Lovable",
    url: "https://lovable.dev",
    categories: ["build"],
    primaryCategory: "build",
    blurb:
      "Similar to Bolt but with more polished output for production-leaning apps. The pick if you want something closer to a real product on the first build, not just a working prototype.",
    scores: { power: 7, price: 6, install: 9, operate: 8 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "v0",
    name: "v0",
    vendor: "Vercel",
    url: "https://v0.dev",
    categories: ["build"],
    primaryCategory: "build",
    blurb:
      "Vercel's AI UI generator, focused on producing React components and full Next.js apps. The pick for designers and front-end developers who want generated UI that drops directly into a real codebase.",
    scores: { power: 7, price: 7, install: 9, operate: 8 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },

  // ── Research & knowledge work ──────────────────────────────────────────
  {
    id: "notebooklm",
    name: "NotebookLM",
    vendor: "Google",
    url: "https://notebooklm.google.com",
    categories: ["documents"],
    primaryCategory: "documents",
    blurb:
      "Google's document-grounded AI assistant. Upload sources, ask questions, get cited answers. Free with a Google account. The pick for research tasks where you want to constrain the AI to specific sources, or for turning documents into audio overviews.",
    scores: { power: 7, price: 10, install: 10, operate: 9 },
    consumerInterface: true,
    longContext: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    vendor: "Notion",
    url: "https://www.notion.so/product/ai",
    categories: ["documents"],
    primaryCategory: "documents",
    blurb:
      "AI built into Notion, $10 per member per month as an add-on. The pick if you already use Notion as your knowledge base. Genuinely useful for summarizing pages, drafting docs, and querying across your workspace.",
    scores: { power: 7, price: 7, install: 10, operate: 9 },
    consumerInterface: true,
    persistentMemory: true,
    lastReviewed: "2026-04",
  },
  {
    id: "glean",
    name: "Glean",
    vendor: "Glean",
    url: "https://www.glean.com",
    categories: ["documents"],
    primaryCategory: "documents",
    blurb:
      "Enterprise AI search across all your company's tools. The pick for larger companies that want a single AI interface to query across Slack, Drive, Notion, Salesforce, and the rest of the SaaS sprawl.",
    scores: { power: 8, price: 3, install: 5, operate: 7 },
    persistentMemory: true,
    lastReviewed: "2026-04",
  },
  {
    id: "claude-projects",
    name: "Claude Projects",
    vendor: "Anthropic",
    url: "https://claude.ai/projects",
    categories: ["documents", "chat"],
    primaryCategory: "documents",
    blurb:
      "A feature inside claude.ai for grouping documents and instructions into a persistent context. Worth listing separately from base Claude because it changes the use case. The pick if you have a recurring task with stable reference material.",
    scores: { power: 8, price: 6, install: 10, operate: 9 },
    consumerInterface: true,
    persistentMemory: true,
    longContext: true,
    lastReviewed: "2026-04",
  },

  // ── Image generation ───────────────────────────────────────────────────
  {
    id: "midjourney",
    name: "Midjourney",
    vendor: "Midjourney",
    url: "https://www.midjourney.com",
    categories: ["image"],
    primaryCategory: "image",
    blurb:
      "Still the pick for cinematic, artistic image generation, particularly for concept art and editorial visuals. Best for taste-driven work where aesthetic matters more than precise control.",
    scores: { power: 9, price: 6, install: 8, operate: 8 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "firefly",
    name: "Adobe Firefly",
    vendor: "Adobe",
    url: "https://www.adobe.com/products/firefly.html",
    categories: ["image"],
    primaryCategory: "image",
    blurb:
      "The pick for commercial work where copyright safety matters. Trained on licensed and public domain content, and integrates natively into Photoshop and the rest of Adobe Creative Cloud.",
    scores: { power: 8, price: 5, install: 8, operate: 8 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "ideogram",
    name: "Ideogram",
    vendor: "Ideogram",
    url: "https://ideogram.ai",
    categories: ["image"],
    primaryCategory: "image",
    blurb:
      "The pick when you need text rendered in images correctly (logos, posters, designs with typography). Free tier is generous at 40 images per day.",
    scores: { power: 8, price: 8, install: 9, operate: 9 },
    consumerInterface: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },
  {
    id: "flux",
    name: "FLUX",
    vendor: "Black Forest Labs",
    url: "https://blackforestlabs.ai",
    categories: ["image"],
    primaryCategory: "image",
    blurb:
      "Black Forest Labs' image model. The pick for photorealism and prompt adherence at API or self-hosted scale. Open-weight versions available, and commercial-grade output throughout.",
    scores: { power: 9, price: 7, install: 5, operate: 5 },
    apiFirst: true,
    selfHostable: true,
    lastReviewed: "2026-04",
  },
  {
    id: "gpt-image",
    name: "GPT Image",
    vendor: "OpenAI",
    url: "https://openai.com",
    categories: ["image"],
    primaryCategory: "image",
    blurb:
      "OpenAI's native image generation inside ChatGPT and via API. The pick if you are already in the OpenAI ecosystem and want image generation that handles text and instructions exceptionally well.",
    scores: { power: 8, price: 6, install: 10, operate: 10 },
    consumerInterface: true,
    apiFirst: true,
    lastReviewed: "2026-04",
  },

  // ── Video generation ───────────────────────────────────────────────────
  {
    id: "sora",
    name: "Sora 2",
    vendor: "OpenAI",
    url: "https://openai.com/sora",
    categories: ["video"],
    primaryCategory: "video",
    blurb:
      "OpenAI's flagship video generation. Best for cinematic-quality short clips with photorealistic lighting. Available through ChatGPT Pro and Enterprise plans.",
    scores: { power: 9, price: 4, install: 8, operate: 7 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "runway",
    name: "Runway",
    vendor: "Runway",
    url: "https://runwayml.com",
    categories: ["video"],
    primaryCategory: "video",
    blurb:
      "The professional video tool. Best at slow-motion, cinematic shots, and video-to-video editing (Act One). Used by film and ad teams.",
    scores: { power: 9, price: 5, install: 7, operate: 7 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "veo",
    name: "Google Veo 3.1",
    vendor: "Google",
    url: "https://deepmind.google/technologies/veo",
    categories: ["video"],
    primaryCategory: "video",
    blurb:
      "Strong video generation included in Google AI Pro and Ultra plans. The pick if you already pay for Google AI subscriptions or need tight Google Workspace integration.",
    scores: { power: 8, price: 6, install: 8, operate: 8 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "kling",
    name: "Kling",
    vendor: "Kuaishou",
    url: "https://kling.kuaishou.com",
    categories: ["video"],
    primaryCategory: "video",
    blurb:
      "Kuaishou's video model. Strong at character consistency and longer clips. Worth listing as the credible non-Western option in video generation.",
    scores: { power: 8, price: 7, install: 7, operate: 7 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },

  // ── Voice & music ──────────────────────────────────────────────────────
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    vendor: "ElevenLabs",
    url: "https://elevenlabs.io",
    categories: ["audio"],
    primaryCategory: "audio",
    blurb:
      "The pick for voice synthesis and audio. High-quality voice cloning, multilingual TTS, and audiobook-grade narration. Subscription tiers from $5 to $330 per month.",
    scores: { power: 9, price: 7, install: 9, operate: 8 },
    consumerInterface: true,
    apiFirst: true,
    lastReviewed: "2026-04",
  },
  {
    id: "suno",
    name: "Suno",
    vendor: "Suno",
    url: "https://suno.com",
    categories: ["audio"],
    primaryCategory: "audio",
    blurb:
      "Music generation, full songs with vocals. Best for fast iteration on song ideas. Free tier exists, with paid tiers unlocking commercial rights.",
    scores: { power: 8, price: 7, install: 9, operate: 9 },
    consumerInterface: true,
    freeTier: true,
    lastReviewed: "2026-04",
  },
  {
    id: "udio",
    name: "Udio",
    vendor: "Udio",
    url: "https://www.udio.com",
    categories: ["audio"],
    primaryCategory: "audio",
    blurb:
      "Suno's main competitor in AI music. Stronger at production quality and stems for serious producers.",
    scores: { power: 8, price: 7, install: 9, operate: 8 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },

  // ── Autonomous agents ──────────────────────────────────────────────────
  {
    id: "devin",
    name: "Devin",
    vendor: "Cognition AI",
    url: "https://devin.ai",
    categories: ["agents", "code"],
    primaryCategory: "agents",
    blurb:
      "Cognition AI's autonomous coding agent. Now also powers parts of Windsurf. Aimed at long-running autonomous tasks rather than interactive coding. Enterprise-priced.",
    scores: { power: 9, price: 2, install: 5, operate: 6 },
    lastReviewed: "2026-04",
  },
  {
    id: "computer-use",
    name: "Anthropic Computer Use",
    vendor: "Anthropic",
    url: "https://www.anthropic.com",
    categories: ["agents"],
    primaryCategory: "agents",
    blurb:
      "Claude's ability to control a browser or desktop. Available via API. Still early, but the most capable computer-use agent as of April 2026. The pick if you want to experiment with autonomous browsing and form-filling.",
    scores: { power: 7, price: 5, install: 4, operate: 4 },
    apiFirst: true,
    lastReviewed: "2026-04",
  },
  {
    id: "operator",
    name: "OpenAI Operator",
    vendor: "OpenAI",
    url: "https://openai.com",
    categories: ["agents"],
    primaryCategory: "agents",
    blurb:
      "OpenAI's computer-use agent, available to ChatGPT Pro subscribers. Similar use cases to Anthropic Computer Use, with the OpenAI ecosystem and tighter integration with ChatGPT.",
    scores: { power: 7, price: 5, install: 7, operate: 6 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
  {
    id: "manus",
    name: "Manus",
    vendor: "Manus",
    url: "https://manus.im",
    categories: ["agents"],
    primaryCategory: "agents",
    blurb:
      "Chinese autonomous agent that gained attention for end-to-end task completion (research, writing, basic computer use). Worth listing as a distinct entrant in the autonomous agent space.",
    scores: { power: 7, price: 6, install: 7, operate: 6 },
    consumerInterface: true,
    lastReviewed: "2026-04",
  },
];

export const CATEGORY_META: Record<CategoryId, { label: string; description: string }> = {
  code:      { label: "Coding AI",                description: "AI agents and copilots that write, refactor, and debug software." },
  chat:      { label: "Chat & general-purpose",   description: "All-rounder assistants for conversation, drafting, and research." },
  build:     { label: "App & website builders",   description: "AI that turns a description into a working app, prototype, or site." },
  documents: { label: "Research & knowledge",     description: "Document-grounded AI for research, summarization, and knowledge work." },
  image:     { label: "Image generation",         description: "Generative tools for still images, illustration, and design." },
  video:     { label: "Video generation",         description: "Generative tools for short-form and cinematic video." },
  audio:     { label: "Voice & music",            description: "Generative tools for voice synthesis, narration, and music." },
  agents:    { label: "Autonomous agents",        description: "AI that takes long-running actions on your behalf." },
};
