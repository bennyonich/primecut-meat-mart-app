import Link from "next/link";

import { HomeInteractive } from "@/components/home-interactive";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(120deg,#173067_0%,#0e1f42_45%,#123165_100%)] p-10 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Albto Limited</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
          Delivering Mission-Critical IT, Telecom, and Enterprise Projects Worldwide
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--albto-muted)]">
          Recommended tagline:{" "}
          <strong className="text-white">&quot;Precision Delivery. Global Impact.&quot;</strong>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-lg bg-[var(--albto-secondary)] px-5 py-3 font-semibold text-[#041022]">
            Book a Strategy Call
          </Link>
          <Link href="/case-studies" className="rounded-lg border border-white/20 px-5 py-3 font-semibold">
            Explore Case Studies
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          "IT Program Delivery",
          "Telecom Infrastructure Rollout",
          "General Project Management",
        ].map((item) => (
          <article key={item} className="albto-card rounded-2xl p-5">
            <h3 className="text-lg font-semibold">{item}</h3>
            <p className="mt-2 text-sm text-[var(--albto-muted)]">
              End-to-end planning, governance, and execution with measurable outcomes.
            </p>
          </article>
        ))}
      </section>

      <HomeInteractive />

      <section className="grid gap-4 md:grid-cols-5">
        {[
          ["About", "/about"],
          ["Services", "/services"],
          ["Industries", "/industries"],
          ["Methodology", "/methodology"],
          ["Insights", "/insights"],
        ].map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-white/12 bg-[#0e1c38] p-4 text-sm font-semibold text-[var(--albto-muted)] transition hover:text-white"
          >
            {label}
          </Link>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#0c1b37_0%,#071327_100%)] p-8">
        <h2 className="text-3xl font-bold">Global Reach, Local Execution</h2>
        <p className="mt-2 max-w-3xl text-[var(--albto-muted)]">
          Albto Limited serves international clients from Lagos with dependable project governance and
          delivery maturity that scales across regions and stakeholders.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex rounded-lg bg-[var(--albto-primary)] px-5 py-3 font-semibold"
        >
          Start Your Project
        </Link>
      </section>
    </main>
  );
}
