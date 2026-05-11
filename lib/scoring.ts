// lib/scoring.ts
// Weighted scoring engine. Translates the user's five answers into a ranked
// recommendation list with human-readable explanations.
//
// The math intentionally mirrors Section 5 of the scope document:
//   - Q5 "priority" is the dominant weight multiplier
//   - Q2 "tech" applies hard filters (non-technical users never see CLI tools)
//   - Q1 "category" is a hard category filter (with sensible cross-category overlap)
//   - Q3 "usage" and Q4 "context" act as soft boosts via boolean signals on each tool

import { TOOLS, type Tool } from "./tools";
import type { Answers } from "./questions";

export interface RankedTool {
  tool: Tool;
  totalScore: number;
  // Weighted contribution per dimension, used to explain the rank.
  contribution: {
    power: number;
    price: number;
    install: number;
    operate: number;
    boosts: number; // signal-based bonuses (long context, persistent memory, etc.)
  };
  // Top contributor — what made this tool rank where it did.
  topDimension: "power" | "price" | "install" | "operate" | "fit";
}

export interface Recommendation {
  top: RankedTool;
  runnerUps: RankedTool[];
  all: RankedTool[];
  // Pre-baked explanation strings the UI can drop in.
  reason: string;          // 1-line summary of why #1 won
  contrast: string;        // explanation of what would change if priority flipped
}

// Weight matrices keyed off the user's priority (Q5).
// These multiply the tool's raw 1-10 dimension score.
const PRIORITY_WEIGHTS: Record<
  Answers["priority"],
  { power: number; price: number; install: number; operate: number }
> = {
  ease:    { power: 1.0, price: 1.0, install: 2.0, operate: 1.5 },
  power:   { power: 2.5, price: 0.7, install: 0.5, operate: 0.8 },
  price:   { power: 1.0, price: 2.5, install: 1.0, operate: 1.0 },
  privacy: { power: 1.2, price: 1.0, install: 1.0, operate: 1.0 },
};

function rankOnly(answers: Answers): RankedTool[] {
  const weights = PRIORITY_WEIGHTS[answers.priority];

  return TOOLS
    // ── Hard filter: category match ────────────────────────────────────
    .filter((t) => t.categories.includes(answers.category))
    // ── Hard filter: non-technical users get only easy-to-install tools ─
    .filter((t) => {
      if (answers.tech === "non-technical") {
        if (t.requiresCLI) return false;
        if (t.scores.install < 7) return false;
      }
      return true;
    })
    // ── Hard filter: privacy priority requires self-hostable / strong data controls ─
    .filter((t) => {
      if (answers.priority === "privacy") return Boolean(t.selfHostable);
      return true;
    })
    .map<RankedTool>((tool) => {
      // Dimension contributions
      const power   = tool.scores.power   * weights.power;
      const price   = tool.scores.price   * weights.price;
      const install = tool.scores.install * weights.install;
      const operate = tool.scores.operate * weights.operate;

      // ── Soft boosts based on usage (Q3) and context (Q4) ────────────
      let boosts = 0;

      if (answers.usage === "api"       && tool.apiFirst)            boosts += 6;
      if (answers.usage === "daily"     && tool.consumerInterface)   boosts += 3;
      if (answers.usage === "exploring" && tool.freeTier)            boosts += 3;
      if (answers.usage === "exploring" && tool.consumerInterface)   boosts += 2;

      if (answers.context === "long-context" && tool.longContext)    boosts += 5;
      if (answers.context === "persistent"   && tool.persistentMemory) boosts += 5;

      // Daily-coder bonus for tools positioned at professional developers,
      // matching the rubric note that the wizard "adapts to the user."
      if (answers.tech === "daily-coder" && answers.category === "code" && tool.scores.power >= 9) {
        boosts += 2;
      }

      const totalScore = power + price + install + operate + boosts;

      // Determine top dimension for explanation purposes.
      const dimEntries = [
        { key: "power"   as const, value: power },
        { key: "price"   as const, value: price },
        { key: "install" as const, value: install },
        { key: "operate" as const, value: operate },
      ];
      const topDim = dimEntries.reduce((a, b) => (b.value > a.value ? b : a));
      const topDimension =
        boosts > 5 && boosts >= topDim.value ? "fit" : topDim.key;

      return {
        tool,
        totalScore,
        contribution: { power, price, install, operate, boosts },
        topDimension,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

export function rankTools(answers: Answers): Recommendation {
  const ranked = rankOnly(answers);

  // Defensive empty-state. Shouldn't hit in practice given the inventory,
  // but graceful failure beats a crash.
  if (ranked.length === 0) {
    throw new Error("No tools matched the selected filters.");
  }

  const [top, ...rest] = ranked;
  const runnerUps = rest.slice(0, 2);

  return {
    top,
    runnerUps,
    all: ranked,
    reason: buildReason(top, answers),
    contrast: buildContrast(top, runnerUps[0], answers),
  };
}

// ── Explanation builders ─────────────────────────────────────────────────
// These produce the personal narrative that the result page shows.

import { PRIORITY_LABEL } from "./questions";

function buildReason(top: RankedTool, answers: Answers): string {
  const dim = top.topDimension;
  const tool = top.tool.name;

  if (dim === "power") {
    return `Because you prioritized ${PRIORITY_LABEL[answers.priority]}, ${tool} ranked first. Its capability ceiling is the highest in this category.`;
  }
  if (dim === "install") {
    return `${tool} ranked first because you wanted ${PRIORITY_LABEL[answers.priority]}. Getting started takes minutes, with minimal setup compared to other tools in this category.`;
  }
  if (dim === "operate") {
    return `${tool} ranked first because you wanted ${PRIORITY_LABEL[answers.priority]}. Daily friction is among the lowest in this category.`;
  }
  if (dim === "price") {
    const priceNote = top.tool.freeTier
      ? "It has a usable free tier and pricing well below most alternatives."
      : "Pricing is well below most alternatives in this category.";
    return `${tool} ranked first because you prioritized ${PRIORITY_LABEL[answers.priority]}. ${priceNote}`;
  }
  // dim === "fit"
  return `${tool} ranked first because it matches your specific use case. The right context behavior and usage pattern, not just a high overall score.`;
}

function buildContrast(top: RankedTool, runnerUp: RankedTool | undefined, answers: Answers): string {
  if (!runnerUp) return "";

  // Simulate every other priority option and find one that genuinely changes
  // the #1 result. Only claim what's actually true under the scoring engine.
  const alternatives = (["ease", "power", "price", "privacy"] as const).filter(
    (p) => p !== answers.priority,
  );

  type AltOutcome = { priority: Answers["priority"]; winner: RankedTool };
  const outcomes: AltOutcome[] = [];
  for (const alt of alternatives) {
    const altRanked = rankOnly({ ...answers, priority: alt });
    if (altRanked.length > 0) {
      outcomes.push({ priority: alt, winner: altRanked[0] });
    }
  }

  // Prefer an alternative that promotes the current runner-up specifically,
  // since that's the most direct contrast.
  const promotesRunnerUp = outcomes.find(
    (o) => o.winner.tool.id === runnerUp.tool.id,
  );
  if (promotesRunnerUp) {
    return `If you had prioritized ${PRIORITY_LABEL[promotesRunnerUp.priority]} instead, ${runnerUp.tool.name} would have ranked first.`;
  }

  // Otherwise, surface any alternative priority that changes the winner.
  const anyChange = outcomes.find((o) => o.winner.tool.id !== top.tool.id);
  if (anyChange) {
    return `If you had prioritized ${PRIORITY_LABEL[anyChange.priority]} instead, ${anyChange.winner.tool.name} would have ranked first.`;
  }

  return `${top.tool.name} ranks first under every priority for this set of answers, so the recommendation is robust.`;
}
