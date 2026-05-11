// components/Hero.tsx
// Editorial hero in line with the BairesDev brand book's corporate aesthetic.
// Outfit Light for the large display copy, brand-orange highlight on the key
// phrase, soft brand orange used sparingly as an underline.

import { TOOLS, CATEGORY_META } from "@/lib/tools";
import ThemeToggle from "./ThemeToggle";

const TOOL_COUNT = TOOLS.length;
const CATEGORY_COUNT = Object.keys(CATEGORY_META).length;

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas pt-14 pb-10 sm:pt-20 sm:pb-12">
      {/* Subtle vertical guides for editorial texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(17,17,17,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 100%",
        }}
      />

      <div className="container-page relative">
        {/* Eyebrow + theme toggle */}
        <div className="flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          <div className="flex items-center gap-2">
            <span className="inline-block h-px w-6 bg-ink-light" />
            BairesDev · Tools
          </div>
          <ThemeToggle />
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <h1
              className="font-display text-display-xl leading-[0.98] tracking-tight text-ink"
              style={{ fontWeight: 300 }}
            >
              Find the right{" "}
              <span className="relative inline-block whitespace-nowrap font-medium">
                <span className="relative z-10">AI tool</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 z-0 h-3 -skew-x-3 bg-brand-soft sm:bottom-2 sm:h-4"
                />
              </span>
              <br />
              in 60&nbsp;seconds.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              Five questions, ranked recommendations, and the full inventory of every AI tool worth knowing in 2026. Updated quarterly.
            </p>
          </div>

          {/* Stat block */}
          <div className="grid grid-cols-3 gap-4 border-t border-line pt-6 lg:border-t-0 lg:pt-0">
            <Stat number={String(TOOL_COUNT)}     label="tools indexed" />
            <Stat number={String(CATEGORY_COUNT)} label="categories" />
            <Stat number="4"                      label="scoring dimensions" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl tracking-tight text-ink sm:text-4xl" style={{ fontWeight: 500 }}>
        {number}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </div>
    </div>
  );
}
