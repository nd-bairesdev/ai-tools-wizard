// components/ContactCTA.tsx
// The single soft marketing pitch on the page. Per the scope, this is the
// only lead-gen path; gating the wizard would kill the share rate.

export default function ContactCTA() {
  return (
    <section id="contact" className="border-t border-line bg-canvas-off">
      <div className="container-page py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              <span className="accent-tick" />
              Build with us
            </div>
            <h2 className="mt-2 font-display text-display-lg font-semibold leading-tight text-ink">
              BairesDev builds custom AI integrations<br className="hidden sm:block" /> for companies of every size.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
              From integrating Claude or GPT into a customer support flow to building AI-native products from scratch, our engineers work in your time zone, on your stack, on your timeline.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#" className="btn-primary">Talk to us about your project</a>
              <a href="#" className="btn-ghost">View case studies →</a>
            </div>
          </div>

          {/* Decorative metric column — gives this section visual balance */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-1">
            <Metric number="4,000+" label="Engineers across LATAM" />
            <Metric number="500+"   label="Active client engagements" />
            <Metric number="1,200+" label="Projects shipped" />
            <Metric number="20+"    label="Years building software" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-canvas-card p-6">
      <div className="font-display text-2xl font-semibold tracking-tight text-ink">{number}</div>
      <div className="mt-1 text-xs font-medium text-ink-muted">{label}</div>
    </div>
  );
}
