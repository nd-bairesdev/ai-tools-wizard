// lib/questions.ts
// The five-question wizard sequence from the scope (Section 4).

import type { CategoryId, ContextNeed, Priority, TechLevel, UsageMode } from "./tools";

export interface AnswerOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export interface Question<K extends keyof Answers, T extends string = string> {
  id: K;
  prompt: string;
  description: string;
  options: AnswerOption<T>[];
}

export interface Answers {
  category: CategoryId;
  tech: TechLevel;
  usage: UsageMode;
  context: ContextNeed;
  priority: Priority;
}

// We type each question via a discriminated array. Keeping it simple for clarity.
export const QUESTIONS: [
  Question<"category", CategoryId>,
  Question<"tech", TechLevel>,
  Question<"usage", UsageMode>,
  Question<"context", ContextNeed>,
  Question<"priority", Priority>,
] = [
  {
    id: "category",
    prompt: "What are you trying to do with AI?",
    description: "Pick the category that best matches the work you want help with.",
    options: [
      { value: "code",      label: "Write or edit code",                              hint: "Coding agents, copilots, IDEs" },
      { value: "chat",      label: "Have a conversation, get answers, do research",   hint: "General-purpose assistants" },
      { value: "build",     label: "Build a working app or website from a description", hint: "AI app builders" },
      { value: "documents", label: "Analyze documents, files, or data",               hint: "Document & knowledge AI" },
      { value: "agents",    label: "Have AI take actions on its own",                 hint: "Autonomous agents" },
      { value: "image",     label: "Generate images",                                  hint: "Image generation tools" },
      { value: "video",     label: "Generate video",                                   hint: "Video generation tools" },
      { value: "audio",     label: "Generate voice or music",                          hint: "Voice synthesis & music" },
    ],
  },
  {
    id: "tech",
    prompt: "How comfortable are you with code and developer tools?",
    description: "We use this to filter out tools that need setup you would rather skip.",
    options: [
      { value: "daily-coder",   label: "I write code daily" },
      { value: "technical",     label: "I can read code and follow technical setup guides" },
      { value: "non-technical", label: "I am non-technical, I want something I can use without setup" },
    ],
  },
  {
    id: "usage",
    prompt: "How are you planning to use this AI?",
    description: "Different use modes favor very different tools, even in the same category.",
    options: [
      { value: "one-time",  label: "A one-time task or quick experiment" },
      { value: "daily",     label: "Daily, for ongoing work" },
      { value: "api",       label: "Embedded in something I am building, calling its API" },
      { value: "exploring", label: "Not sure yet, just exploring" },
    ],
  },
  {
    id: "context",
    prompt: "What does the AI need to know or remember?",
    description: "This surfaces tools with the right memory and context behavior.",
    options: [
      { value: "static",       label: "Static instructions are fine; I'll explain what I need each time" },
      { value: "session",      label: "It should remember what we talked about within a session" },
      { value: "persistent",   label: "It should remember across sessions and learn my preferences" },
      { value: "long-context", label: "It needs to read large documents, codebases, or knowledge bases" },
    ],
  },
  {
    id: "priority",
    prompt: "If you had to pick one thing, what matters most?",
    description: "The tiebreaker. We'll reference this directly in your result.",
    options: [
      { value: "ease",    label: "Ease of setup",                            hint: "I want to start fast" },
      { value: "power",   label: "Raw capability",                           hint: "I want the most powerful option" },
      { value: "price",   label: "Price",                                    hint: "Best free or cheapest option" },
      { value: "privacy", label: "Privacy and control",                      hint: "Data stays private or self-hosted" },
    ],
  },
];

// Human-readable labels used in the result page narrative.
export const PRIORITY_LABEL: Record<Priority, string> = {
  ease:    "ease of setup",
  power:   "raw capability",
  price:   "price",
  privacy: "privacy and control",
};

export const TECH_LABEL: Record<TechLevel, string> = {
  "daily-coder":   "you write code daily",
  "technical":     "you're comfortable with technical setup",
  "non-technical": "you wanted to skip the setup",
};

export const USAGE_LABEL: Record<UsageMode, string> = {
  "one-time":  "a one-time task",
  "daily":     "daily ongoing work",
  "api":       "API integration",
  "exploring": "exploring",
};
