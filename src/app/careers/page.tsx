import { PageHero } from "@/components/page-hero";

export default function CareersPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      <PageHero
        title="Careers"
        intro="Join Albto to lead high-impact transformation projects across international markets."
      />
      <section className="albto-card rounded-2xl p-6">
        <p className="text-[var(--albto-muted)]">
          Current openings and talent network applications can be requested by email.
        </p>
        <a className="mt-4 inline-flex rounded-lg bg-[var(--albto-primary)] px-4 py-2 font-semibold" href="mailto:info@albtolimited.com">
          Submit your CV
        </a>
      </section>
    </main>
  );
}
