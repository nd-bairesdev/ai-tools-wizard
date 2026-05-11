// components/Methodology.tsx
// The "How we score" section — what makes the page citable by journalists.
// Drawn directly from Section 5 of the scope document.

const RUBRIC = [
  {
    name: "Power",
    summary: "What the tool can do at the limit.",
    scale: [
      { range: "1–3",  text: "Limited, single-purpose, basic functionality" },
      { range: "4–6",  text: "Solid for its niche, handles common tasks well" },
      { range: "7–8",  text: "Strong, handles complex tasks reliably, near the top of its category" },
      { range: "9–10", text: "Frontier-level capability, sets the standard others are measured against" },
    ],
  },
  {
    name: "Price",
    summary: "Cost at typical usage. 10 means free or nearly free; 1 means very expensive.",
    scale: [
      { range: "10",   text: "Free with no meaningful limits, or open source self-hosted" },
      { range: "8–9",  text: "Useful free tier, low-cost paid plans (under $20/month)" },
      { range: "5–7",  text: "$20–$50/month for standard usage" },
      { range: "3–4",  text: "$100–$200/month for typical professional use" },
      { range: "1–2",  text: "Enterprise pricing, $500+/month or significant API costs at scale" },
    ],
  },
  {
    name: "Ease of Install",
    summary: "How long from \"I want to try this\" to \"it is running.\"",
    scale: [
      { range: "10",   text: "Web app, log in and start (ChatGPT, Claude.ai, Gemini)" },
      { range: "8–9",  text: "Desktop or browser install, less than 5 minutes" },
      { range: "5–7",  text: "CLI tool with simple install, or moderate cloud setup" },
      { range: "3–4",  text: "Requires API keys, configuration files, or technical setup" },
      { range: "1–2",  text: "Self-hosted, requires server provisioning, Docker, or significant infrastructure" },
    ],
  },
  {
    name: "Ease of Operate",
    summary: "Daily friction once installed. UI quality, learning curve, error recovery.",
    scale: [
      { range: "9–10", text: "Anyone can use it, no learning curve, errors are clearly explained" },
      { range: "7–8",  text: "Some learning curve but well-documented, recoverable from mistakes" },
      { range: "5–6",  text: "Requires familiarity with the underlying concepts" },
      { range: "3–4",  text: "Significant skill required, debugging is hard, sharp edges" },
      { range: "1–2",  text: "Expert-only, frequent troubleshooting, brittle in production" },
    ],
  },
];

const WEIGHTING = [
  { priority: "Ease of setup",   power: "1.0×", price: "1.0×", install: "2.0×", operate: "1.5×" },
  { priority: "Raw capability",  power: "2.5×", price: "0.7×", install: "0.5×", operate: "0.8×" },
  { priority: "Price",           power: "1.0×", price: "2.5×", install: "1.0×", operate: "1.0×" },
  { priority: "Privacy",         power: "1.2×", price: "1.0×", install: "1.0×", operate: "1.0×" },
];

export default function Methodology() {
  return (
    <section id="methodology" className="border-t border-line bg-canvas">
      <div className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          {/* Sidebar: Section header */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              <span className="accent-tick" />
              Methodology
            </div>
            <h2 className="mt-2 font-display text-display-lg font-semibold text-ink">
              How we score
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              The rubric is published openly so anyone, including a journalist, can verify how the scoring works. Every score is set by a small team that has actually used the tool, calibrated against the descriptions below.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a href="#rubric" className="block text-brand hover:text-brand-dark">→ The four-dimension rubric</a>
              <a href="#weighting" className="block text-brand hover:text-brand-dark">→ How recommendations are weighted</a>
              <a href="#cadence" className="block text-brand hover:text-brand-dark">→ Update cadence</a>
              <a href="#scope" className="block text-brand hover:text-brand-dark">→ What we excluded and why</a>
              <a href="#disclosure" className="block text-brand hover:text-brand-dark">→ Conflict & bias disclosure</a>
            </div>
          </div>

          <div className="space-y-12">
            {/* The rubric */}
            <div id="rubric">
              <h3 className="font-display text-2xl font-semibold text-ink">The four-dimension rubric</h3>
              <p className="mt-2 max-w-prose text-sm text-ink-muted">
                Each tool gets a numerical score from 1 to 10 across four dimensions. Higher is better in every column: a Price of 10 means "free or nearly free," not "expensive."
              </p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {RUBRIC.map((r) => (
                  <div key={r.name} className="card p-6">
                    <div className="font-display text-lg font-semibold text-ink">{r.name}</div>
                    <div className="mt-1 text-xs text-ink-muted">{r.summary}</div>
                    <ul className="mt-4 space-y-2">
                      {r.scale.map((s) => (
                        <li key={s.range} className="flex items-start gap-3 text-sm">
                          <span className="mt-0.5 inline-flex w-12 shrink-0 justify-center rounded border border-line bg-canvas-off px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink">
                            {s.range}
                          </span>
                          <span className="text-ink-soft">{s.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Weighting matrix */}
            <div id="weighting">
              <h3 className="font-display text-2xl font-semibold text-ink">How recommendations are weighted</h3>
              <p className="mt-2 max-w-prose text-sm text-ink-muted">
                The wizard scores each tool against your answers using a weighted matrix. Your priority answer (Q5) modifies the weights on the four dimensions. Hard filters from your technical level (Q2) remove tools that wouldn't be a fit regardless of score.
              </p>
              <div className="mt-6 overflow-x-auto rounded-card border border-line">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="bg-canvas-off">
                    <tr>
                      <th scope="col" className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">When you prioritize</th>
                      <th scope="col" className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">Power</th>
                      <th scope="col" className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">Price</th>
                      <th scope="col" className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">Install</th>
                      <th scope="col" className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">Operate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {WEIGHTING.map((w) => (
                      <tr key={w.priority} className="bg-canvas-card">
                        <th scope="row" className="px-5 py-3.5 text-left font-medium text-ink">{w.priority}</th>
                        <td className="px-3 py-3.5 text-center font-mono text-ink-soft">{w.power}</td>
                        <td className="px-3 py-3.5 text-center font-mono text-ink-soft">{w.price}</td>
                        <td className="px-3 py-3.5 text-center font-mono text-ink-soft">{w.install}</td>
                        <td className="px-3 py-3.5 text-center font-mono text-ink-soft">{w.operate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-light">
                Hard filter examples: a non-technical user never sees a tool with an Install score below 7. A user prioritizing privacy only sees tools that support self-hosting or have strong data controls.
              </p>
            </div>

            {/* Cadence */}
            <div id="cadence">
              <h3 className="font-display text-2xl font-semibold text-ink">Update cadence</h3>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
                AI tools change weekly. We commit to a quarterly review of the full inventory plus an "update on release" policy: major model launches (new GPT, new Claude, etc.) trigger a same-week score review for affected tools. The "Last reviewed" date is shown on every tool row and at the top of the page.
              </p>
            </div>

            {/* Scope */}
            <div id="scope">
              <h3 className="font-display text-2xl font-semibold text-ink">What we excluded and why</h3>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
                The wizard answers a specific question: among AI products where the AI is the product, which one fits this user's use case best?
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <ExclusionCard title="Workflow automation" examples="Zapier, n8n, Make">
                  These call AI APIs but the platform is not AI; it's a workflow engine.
                </ExclusionCard>
                <ExclusionCard title="Agent frameworks" examples="LangChain, LangGraph, AutoGen">
                  Infrastructure for engineers building AI products, not AI products themselves.
                </ExclusionCard>
                <ExclusionCard title="Hosting & inference" examples="OpenRouter, Together AI, Groq">
                  You don't interact with these directly; they're plumbing.
                </ExclusionCard>
                <ExclusionCard title="Observability tools" examples="LangSmith, Helicone">
                  Same reason: infrastructure, not the product the end user opens.
                </ExclusionCard>
              </div>
            </div>

            {/* Disclosure */}
            <div id="disclosure">
              <h3 className="font-display text-2xl font-semibold text-ink">Conflict & bias disclosure</h3>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
                BairesDev is a software services company that builds AI integrations for clients. We may have partnership relationships with some of the vendors listed. We disclose any active partnerships on this page and our policy is that partnerships do not affect scoring. Every score is justifiable against the published rubric. If a vendor believes a score is wrong, they can contact us; we re-review on request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExclusionCard({
  title, examples, children,
}: {
  title: string;
  examples: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-canvas-off p-5">
      <div className="font-medium text-ink">{title}</div>
      <div className="mt-1 text-xs text-ink-light">{examples}</div>
      <p className="mt-3 text-sm text-ink-soft">{children}</p>
    </div>
  );
}
