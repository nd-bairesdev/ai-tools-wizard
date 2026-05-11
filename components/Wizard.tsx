"use client";

// components/Wizard.tsx
// The five-question wizard, results view, and "what if" panel.
// All state lives client-side; permalink encoding is in the URL hash so a
// shared link drops the recipient straight into the result view.

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { QUESTIONS, PRIORITY_LABEL, type Answers } from "@/lib/questions";
import { rankTools, type Recommendation } from "@/lib/scoring";
import { CATEGORY_META, TOOLS } from "@/lib/tools";
import { ScoreBar } from "./ScoreViz";

type Phase = "intro" | "asking" | "result";

// Compact codes for URL encoding. Keeps the share URL readable.
const ENCODE: Record<string, string> = {
  // category
  code: "c", chat: "h", image: "m", video: "v", audio: "u", build: "b", documents: "d", agents: "a",
  // tech
  "daily-coder": "D", "technical": "T", "non-technical": "N",
  // usage
  "one-time": "o", "daily": "y", "api": "i", "exploring": "e",
  // context
  "static": "s", "session": "n", "persistent": "p", "long-context": "l",
  // priority
  "ease": "E", "power": "P", "price": "R", "privacy": "V",
};
const DECODE = Object.fromEntries(Object.entries(ENCODE).map(([k, v]) => [v, k]));

function encodeAnswers(a: Answers): string {
  return [a.category, a.tech, a.usage, a.context, a.priority].map((v) => ENCODE[v]).join("");
}
function decodeAnswers(s: string): Answers | null {
  if (s.length !== 5) return null;
  const out = s.split("").map((c) => DECODE[c]);
  if (out.some((v) => !v)) return null;
  return {
    category: out[0],
    tech: out[1],
    usage: out[2],
    context: out[3],
    priority: out[4],
  } as Answers;
}

export default function Wizard() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [direction, setDirection] = useState<1 | -1>(1);

  // Hydrate from URL hash on mount (permalink support)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#r=/, "");
    if (hash) {
      const decoded = decodeAnswers(hash);
      if (decoded) {
        setAnswers(decoded);
        setPhase("result");
      }
    }
  }, []);

  // Update URL when answers complete
  useEffect(() => {
    if (phase === "result" && isComplete(answers)) {
      const code = encodeAnswers(answers as Answers);
      const newHash = `#r=${code}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, "", newHash);
      }
    }
  }, [phase, answers]);

  function handleSelect(qIndex: number, value: string) {
    const q = QUESTIONS[qIndex];
    const next = { ...answers, [q.id]: value } as Partial<Answers>;
    setAnswers(next);

    if (qIndex < QUESTIONS.length - 1) {
      // Slight delay so the user can see their selection before transitioning
      setDirection(1);
      setTimeout(() => setStep(qIndex + 1), 220);
    } else {
      setTimeout(() => setPhase("result"), 220);
    }
  }

  function goBack() {
    if (step === 0) {
      setPhase("intro");
    } else {
      setDirection(-1);
      setStep(step - 1);
    }
  }

  function reset() {
    setPhase("intro");
    setStep(0);
    setAnswers({});
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  function startOver() {
    reset();
    setPhase("asking");
  }

  // ── Render ─────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return <Intro onStart={() => setPhase("asking")} />;
  }

  if (phase === "result" && isComplete(answers)) {
    return (
      <Result
        answers={answers}
        onChangeAnswer={(field, value) => setAnswers({ ...answers, [field]: value })}
        onStartOver={startOver}
      />
    );
  }

  const q = QUESTIONS[step];
  const totalSteps = QUESTIONS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="card relative mx-auto w-full max-w-3xl shadow-wizard">
      {/* Progress strip */}
      <div className="px-8 pt-7">
        <div className="flex items-center justify-between text-xs font-medium text-ink-muted">
          <span>
            Question <span className="font-mono tabular-nums text-ink">{step + 1}</span>
            <span className="mx-1.5 text-ink-light">/</span>
            <span className="font-mono tabular-nums">{totalSteps}</span>
          </span>
          <button
            onClick={goBack}
            className="btn-ghost"
            aria-label={step === 0 ? "Cancel" : "Go back to previous question"}
          >
            ← Back
          </button>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-canvas-off">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        key={step}
        className={`px-8 pb-8 pt-6 ${direction === 1 ? "animate-slide-up" : "animate-fade-in"}`}
      >
        <h2 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
          {q.prompt}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">{q.description}</p>

        <div className="mt-6 grid gap-2.5">
          {q.options.map((opt, i) => {
            const selected = (answers as any)[q.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(step, opt.value)}
                style={{ animationDelay: `${i * 40}ms` }}
                className={`group flex items-start gap-4 rounded-xl border bg-canvas-card px-5 py-4 text-left
                            transition-all duration-150 ease-out animate-slide-up
                            ${
                              selected
                                ? "border-brand bg-brand-50 shadow-[0_0_0_3px_rgba(246,97,53,0.10)]"
                                : "border-line hover:border-ink/30 hover:bg-canvas-off"
                            }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2
                              transition-colors
                              ${selected ? "border-brand bg-brand" : "border-line group-hover:border-ink-muted"}`}
                  aria-hidden
                >
                  {selected && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-ink">{opt.label}</div>
                  {opt.hint && (
                    <div className="mt-0.5 text-xs text-ink-muted">{opt.hint}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Intro panel ──────────────────────────────────────────────────────────
function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="card mx-auto w-full max-w-3xl px-8 py-10 text-center shadow-wizard">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-canvas-off px-3 py-1 text-xs font-medium text-ink-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
        Last reviewed April 2026 · {TOOLS.length} tools indexed
      </div>
      <h1 className="mt-5 font-display text-display-md font-semibold text-ink">
        Five questions. One recommendation you can actually act on.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-ink-muted">
        We score every major AI tool on Power, Price, Ease of Install, and Ease of Operate. Answer five questions and we'll rank the best matches for what you're trying to do.
      </p>
      <button onClick={onStart} className="btn-primary mt-7 !px-8 !py-3.5 text-base">
        Start the wizard
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="mt-6 text-xs text-ink-light">
        Takes about 60 seconds · No email required
      </div>
    </div>
  );
}

// ── Result panel ─────────────────────────────────────────────────────────
function Result({
  answers,
  onChangeAnswer,
  onStartOver,
}: {
  answers: Answers;
  onChangeAnswer: <K extends keyof Answers>(k: K, v: Answers[K]) => void;
  onStartOver: () => void;
}) {
  const recommendation: Recommendation = useMemo(() => {
    try {
      return rankTools(answers);
    } catch {
      // Privacy filter can produce empty results in extreme cases; fall back
      // to a relaxed rank by temporarily dropping the privacy constraint.
      return rankTools({ ...answers, priority: "ease" });
    }
  }, [answers]);

  const [showWhatIf, setShowWhatIf] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [copied, setCopied] = useState(false);

  const top = recommendation.top.tool;
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}#r=${encodeAnswers(answers)}`
    : "";

  const shareText = `I asked the BairesDev AI Tools Wizard what to use for ${CATEGORY_META[answers.category].label.toLowerCase()} and it recommended ${top.name}. Try it:`;

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Header strip with reset action */}
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
          Result · based on your 5 answers
        </span>
        <button onClick={onStartOver} className="btn-ghost">
          ↻ Start over
        </button>
      </div>

      {/* Top recommendation card */}
      <div className="card overflow-hidden shadow-wizard">
        <div className="relative bg-gradient-to-br from-brand-50 via-canvas-card to-canvas-card p-8 sm:p-10">
          {/* Decorative ranking marker */}
          <div className="absolute right-6 top-6 hidden text-right sm:block">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
              Top match
            </div>
            <div className="font-display text-5xl font-semibold leading-none tracking-tight text-brand">
              #1
            </div>
          </div>

          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            {CATEGORY_META[top.primaryCategory].label}
          </div>
          <h2 className="mt-1 font-display text-display-md font-semibold leading-tight text-ink">
            {top.name}
          </h2>
          <div className="mt-1 text-sm text-ink-muted">by {top.vendor}</div>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
            {recommendation.reason}
          </p>

          {/* Score row */}
          <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            <ScoreBar label="Power"   value={top.scores.power}   />
            <ScoreBar label="Price"   value={top.scores.price}   />
            <ScoreBar label="Install" value={top.scores.install} />
            <ScoreBar label="Operate" value={top.scores.operate} />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={top.url} target="_blank" rel="nofollow" className="btn-primary">
              Try {top.name}
              <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none">
                <path d="M3 9l6-6m0 0H4m5 0v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
            <button onClick={() => setShowWhy(!showWhy)} className="btn-secondary">
              {showWhy ? "Hide reasoning" : "Why this one?"}
            </button>
          </div>

          {showWhy && (
            <div className="mt-5 animate-slide-up rounded-xl border border-line bg-canvas-card/70 p-5 text-sm leading-relaxed text-ink-soft backdrop-blur-sm">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                How we ranked it
              </div>
              <p>
                You picked{" "}
                <strong className="text-ink">{categoryLabel(answers.category)}</strong>,{" "}
                <strong className="text-ink">{techLabel(answers.tech)}</strong>, and prioritized{" "}
                <strong className="text-ink">{PRIORITY_LABEL[answers.priority]}</strong>. That tilted the weighting matrix
                toward {top.name}'s strongest dimensions. {recommendation.contrast}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Runner-ups */}
      {recommendation.runnerUps.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {recommendation.runnerUps.map((r, idx) => (
            <RunnerUpCard key={r.tool.id} rank={idx + 2} tool={r.tool} />
          ))}
        </div>
      )}

      {/* What-if + Share row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <button
          onClick={() => setShowWhatIf(!showWhatIf)}
          className="card card-hover flex items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0l-4-4m4 4l-4 4M3 4v8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-ink">What if I changed an answer?</div>
              <div className="text-xs text-ink-muted">Flip any question and see the recommendation update live.</div>
            </div>
          </div>
          <svg className={`h-4 w-4 text-ink-muted transition-transform ${showWhatIf ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex flex-wrap gap-2">
          <button onClick={copyLink} className="btn-secondary !px-4 !py-3">
            {copied ? "Copied" : "Copy link"}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="btn-secondary !px-4 !py-3"
          >
            Share on X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="btn-secondary !px-4 !py-3"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {showWhatIf && <WhatIf answers={answers} onChange={onChangeAnswer} />}

      {/* Soft CTA */}
      <div className="mt-10 rounded-card border border-line bg-canvas-warm px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-lg font-semibold text-ink">
              Need help implementing this in your business?
            </div>
            <div className="mt-1 text-sm text-ink-muted">
              BairesDev builds custom AI integrations for companies of every size.
            </div>
          </div>
          <a href="#contact" className="btn-primary">Talk to us</a>
        </div>
      </div>
    </div>
  );
}

function RunnerUpCard({ rank, tool }: { rank: number; tool: Recommendation["top"]["tool"] }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const blurbRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = blurbRef.current;
    if (!el) return;
    const check = () => {
      const wasExpanded = !el.classList.contains("line-clamp-3");
      if (wasExpanded) return;
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function handleToggle() {
    const next = !expanded;
    setExpanded(next);
    if (!next) return;
    // Wait for the expansion to render before measuring/scrolling.
    requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const overflowsViewport = rect.bottom > window.innerHeight;
      if (overflowsViewport) {
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  return (
    <div ref={cardRef} className="card card-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs font-medium tabular-nums text-ink-light">
            #{rank}
          </span>
          <div>
            <div className="font-display text-lg font-semibold leading-tight text-ink">
              {tool.name}
            </div>
            <div className="text-xs text-ink-muted">by {tool.vendor}</div>
          </div>
        </div>
      </div>
      <p
        ref={blurbRef}
        className={`mt-3 text-sm leading-relaxed text-ink-soft ${expanded ? "" : "line-clamp-3"}`}
      >
        {tool.blurb}
      </p>
      {(isOverflowing || expanded) && (
        <button
          onClick={handleToggle}
          className="mt-2 self-start text-xs font-medium text-brand hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <ScoreBar label="Power"   value={tool.scores.power}   size="sm" />
        <ScoreBar label="Price"   value={tool.scores.price}   size="sm" />
        <ScoreBar label="Install" value={tool.scores.install} size="sm" />
        <ScoreBar label="Operate" value={tool.scores.operate} size="sm" />
      </div>
    </div>
  );
}

function WhatIf({
  answers,
  onChange,
}: {
  answers: Answers;
  onChange: <K extends keyof Answers>(k: K, v: Answers[K]) => void;
}) {
  return (
    <div className="card mt-4 animate-slide-up p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          Live re-ranking
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {QUESTIONS.map((q) => (
          <div key={q.id}>
            <div className="mb-2 text-xs font-medium text-ink-muted">{q.prompt}</div>
            <div className="flex flex-wrap gap-1.5">
              {q.options.map((opt) => {
                const selected = (answers as any)[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => onChange(q.id as keyof Answers, opt.value as never)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
                                ${selected
                                  ? "border-brand bg-brand text-white"
                                  : "border-line bg-canvas-card text-ink-soft hover:border-ink/30"}`}
                  >
                    {shortLabel(opt.label)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────
function isComplete(a: Partial<Answers>): a is Answers {
  return Boolean(a.category && a.tech && a.usage && a.context && a.priority);
}

function shortLabel(label: string): string {
  // Shorten verbose option labels for the what-if chips
  if (label.length <= 22) return label;
  return label.split(/[,—]/)[0].trim();
}

function categoryLabel(c: Answers["category"]): string {
  return CATEGORY_META[c].label.toLowerCase();
}

function techLabel(t: Answers["tech"]): string {
  return ({
    "daily-coder":   "writing code daily",
    "technical":     "being comfortable with technical setup",
    "non-technical": "skipping setup",
  } as const)[t];
}
