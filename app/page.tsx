// app/page.tsx
// Page composition. Header and footer are not included on this page so it
// can be embedded into the existing bairesdev.com chrome.

import Hero from "@/components/Hero";
import Wizard from "@/components/Wizard";
import Inventory from "@/components/Inventory";
import Methodology from "@/components/Methodology";
import ContactCTA from "@/components/ContactCTA";

export default function Page() {
  return (
    <>
      <Hero />

      <section className="container-page pt-10 pb-8 sm:pt-16">
        <Wizard />
      </section>

      <Inventory />
      <Methodology />
      <ContactCTA />
    </>
  );
}
