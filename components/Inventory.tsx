"use client";

// components/Inventory.tsx
// The full tool inventory — the "citation magnet" half of the page.
// Category filter, free-only toggle, sort options, and a row per tool.

import { useMemo, useState } from "react";
import { TOOLS, CATEGORY_META, type CategoryId, type Tool } from "@/lib/tools";
import { ScoreDots } from "./ScoreViz";

type SortKey = "category" | "power" | "price" | "install" | "operate";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "category", label: "Group by category" },
  { value: "power",    label: "Most powerful" },
  { value: "price",    label: "Cheapest first" },
  { value: "install",  label: "Easiest to install" },
  { value: "operate",  label: "Easiest to operate" },
];

export default function Inventory() {
  const [activeCat, setActiveCat] = useState<CategoryId | "all">("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("category");

  const filtered = useMemo(() => {
    let list = TOOLS.slice();
    if (activeCat !== "all") list = list.filter((t) => t.categories.includes(activeCat));
    if (freeOnly) list = list.filter((t) => t.freeTier);
    if (sort !== "category") {
      list.sort((a, b) => b.scores[sort] - a.scores[sort]);
    }
    return list;
  }, [activeCat, freeOnly, sort]);

  // Grouping by category — only used when sort === "category"
  const grouped = useMemo(() => {
    if (sort !== "category") return null;
    const map: Record<string, Tool[]> = {};
    for (const t of filtered) {
      const key = t.primaryCategory;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    }
    return map;
  }, [filtered, sort]);

  const categoryOrder: CategoryId[] = ["code", "chat", "build", "documents", "image", "video", "audio", "agents"];

  return (
    <section id="inventory" className="container-page mt-[30px] mb-[30px] pt-8 pb-20">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            <span className="accent-tick" />
            The inventory
          </div>
          <h2 className="mt-2 font-display text-display-lg font-semibold text-ink">
            Every AI tool worth knowing in 2026
          </h2>
          <p className="mt-3 max-w-2xl text-base text-ink-muted">
            {TOOLS.length} tools across {Object.keys(CATEGORY_META).length} categories, scored on the same four dimensions. Last reviewed April 2026.
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
            Sort
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-line bg-canvas-card px-4 py-2 text-sm font-medium text-ink shadow-sm focus:border-brand focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-8 flex flex-wrap items-center gap-2 rounded-card border border-line bg-canvas-card p-2">
        <FilterChip active={activeCat === "all"} onClick={() => setActiveCat("all")}>
          All ({TOOLS.length})
        </FilterChip>
        {categoryOrder.map((cat) => {
          const count = TOOLS.filter((t) => t.categories.includes(cat)).length;
          return (
            <FilterChip
              key={cat}
              active={activeCat === cat}
              onClick={() => setActiveCat(cat)}
            >
              {CATEGORY_META[cat].label} <span className="opacity-60">({count})</span>
            </FilterChip>
          );
        })}
        <div className="ml-auto flex items-center gap-2 px-2">
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors
                        ${freeOnly ? "bg-ink text-canvas" : "text-ink-muted hover:text-ink"}`}
          >
            <span className={`h-3.5 w-6 rounded-full p-0.5 transition-colors ${freeOnly ? "bg-accent-green" : "bg-line"}`}>
              <span className={`block h-2.5 w-2.5 rounded-full bg-white transition-transform ${freeOnly ? "translate-x-2.5" : ""}`} />
            </span>
            Free tier only
          </button>
        </div>
      </div>

      {/* Tool list */}
      <div className="space-y-12">
        {grouped ? (
          categoryOrder
            .filter((c) => grouped[c]?.length)
            .map((cat) => (
              <CategoryGroup key={cat} category={cat} tools={grouped[cat]} />
            ))
        ) : (
          <div className="grid gap-4">
            {filtered.map((tool) => (
              <ToolRow key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="rounded-card border border-dashed border-line bg-canvas-card px-8 py-16 text-center">
            <div className="font-display text-lg text-ink">No tools match those filters.</div>
            <button
              onClick={() => { setActiveCat("all"); setFreeOnly(false); }}
              className="btn-ghost mt-3"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  active, onClick, children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors
                  ${active
                    ? "bg-brand text-white"
                    : "text-ink-soft hover:bg-canvas-off"}`}
    >
      {children}
    </button>
  );
}

function CategoryGroup({ category, tools }: { category: CategoryId; tools: Tool[] }) {
  const meta = CATEGORY_META[category];
  return (
    <div>
      <div className="mb-5 border-b border-line pb-4">
        <h3 className="font-display text-2xl font-semibold text-ink">
          <span className="accent-tick" />{meta.label}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">{meta.description}</p>
      </div>
      <div className="grid gap-4">
        {tools.map((tool) => (
          <ToolRow key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function ToolRow({ tool }: { tool: Tool }) {
  return (
    <article className="card card-hover grid grid-cols-1 gap-5 p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.25fr)]">
      {/* Left: name + blurb */}
      <div>
        <div className="flex flex-wrap items-baseline gap-3">
          <h4 className="font-display text-xl font-semibold text-ink">{tool.name}</h4>
          <span className="text-xs text-ink-light">by {tool.vendor}</span>
          {tool.freeTier && (
            <span className="chip !bg-canvas-off !text-accent-green">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
              Free tier
            </span>
          )}
          {tool.selfHostable && <span className="chip">Self-hostable</span>}
          {tool.apiFirst && <span className="chip">API-first</span>}
        </div>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
          {tool.blurb}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-light">
          <a
            href={tool.url}
            target="_blank"
            rel="nofollow"
            className="inline-flex items-center gap-1 font-medium text-brand transition-colors hover:text-brand-dark"
          >
            Visit {tool.name}
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path d="M3 9l6-6m0 0H4m5 0v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </a>
          <span>Last reviewed {formatReviewedDate(tool.lastReviewed)}</span>
        </div>
      </div>

      {/* Right: scores */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 self-start rounded-xl border border-line bg-canvas-off px-5 py-4">
        <ScoreDots label="Power"   value={tool.scores.power}   />
        <ScoreDots label="Price"   value={tool.scores.price}   />
        <ScoreDots label="Install" value={tool.scores.install} />
        <ScoreDots label="Operate" value={tool.scores.operate} />
      </div>
    </article>
  );
}

function formatReviewedDate(v: string): string {
  // Inputs look like "2026-04". Render as "April 2026".
  const [y, m] = v.split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const idx = parseInt(m, 10) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx > 11) return v;
  return `${months[idx]} ${y}`;
}
