import { PageHero } from "@/components/page-hero";

export default function InsightsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      <PageHero
        title="Insights"
        intro="Thought leadership on project delivery, telecom evolution, and strategic PM execution."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          "How to De-Risk Multi-Vendor IT Programs",
          "Telecom Rollout Governance Playbook",
          "Executive Reporting That Drives Decisions",
        ].map((post) => (
          <article key={post} className="albto-card rounded-2xl p-5">
            <h3 className="text-lg font-semibold">{post}</h3>
            <p className="mt-2 text-sm text-[var(--albto-muted)]">Read article (placeholder)</p>
          </article>
        ))}
      </section>
    </main>
  );
}
