import { PageHero } from "@/components/page-hero";

const studies = [
  {
    title: "Pan-African Telecom Expansion PMO",
    outcome: "Reduced delivery slippage by 31% across 12-country rollout.",
  },
  {
    title: "Enterprise IT Modernization Program",
    outcome: "Delivered migration and adoption milestones 8 weeks early.",
  },
  {
    title: "Regulatory Readiness Transformation",
    outcome: "Achieved compliance with zero critical audit findings.",
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      <PageHero
        title="Case Studies"
        intro="Representative project outcomes showcasing Albto's capability in complex environments."
      />
      <section className="space-y-4">
        {studies.map((study) => (
          <article key={study.title} className="albto-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold">{study.title}</h3>
            <p className="mt-2 text-sm text-[var(--albto-muted)]">{study.outcome}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
