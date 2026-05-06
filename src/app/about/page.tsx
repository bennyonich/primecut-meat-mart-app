import { PageHero } from "@/components/page-hero";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      <PageHero
        title="About Albto Limited"
        intro="Albto Limited is a project management company delivering large-scale IT, telecom, and enterprise transformation projects for international clients."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          "Governance-first culture",
          "Telecom and IT domain depth",
          "Global delivery mindset",
        ].map((item) => (
          <article key={item} className="albto-card rounded-2xl p-5">
            <h3 className="text-lg font-semibold">{item}</h3>
            <p className="mt-2 text-sm text-[var(--albto-muted)]">
              We combine disciplined execution with modern delivery practices to reduce risk and accelerate value.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
