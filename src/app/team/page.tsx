import { PageHero } from "@/components/page-hero";

export default function TeamPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      <PageHero
        title="Leadership Team"
        intro="Experienced project leaders with track records in telecom infrastructure, enterprise IT, and PMO excellence."
      />
      <section className="grid gap-4 md:grid-cols-3">
        {["Managing Director", "Head of PMO", "Telecom Program Lead"].map((role) => (
          <article key={role} className="albto-card rounded-2xl p-5">
            <p className="text-sm text-[var(--albto-muted)]">{role}</p>
            <h3 className="mt-2 text-lg font-semibold">Profile Placeholder</h3>
          </article>
        ))}
      </section>
    </main>
  );
}
