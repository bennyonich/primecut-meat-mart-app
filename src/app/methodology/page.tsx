import { PageHero } from "@/components/page-hero";

export default function MethodologyPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      <PageHero
        title="Methodology"
        intro="Albto applies a structured lifecycle model with transparent governance and measurable performance."
      />
      <section className="grid gap-4 md:grid-cols-2">
        {[
          "Initiation & business case",
          "Integrated planning & controls",
          "Execution governance",
          "Quality assurance & closure",
        ].map((item) => (
          <article key={item} className="albto-card rounded-2xl p-5">
            <p className="font-medium">{item}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
