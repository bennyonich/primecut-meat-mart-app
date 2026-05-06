import { PageHero } from "@/components/page-hero";

export default function IndustriesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      <PageHero
        title="Industries"
        intro="Focused expertise across IT, telecom, and general project management environments."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["IT Programs", "Cloud migration, cybersecurity initiatives, ERP, and digital workplace delivery."],
          ["Telecom", "Network expansion, infrastructure modernization, and OSS/BSS change programs."],
          ["General PM", "Cross-sector project governance, vendor coordination, and PMO execution."],
        ].map(([title, desc]) => (
          <article key={title} className="albto-card rounded-2xl p-5">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-[var(--albto-muted)]">{desc}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
