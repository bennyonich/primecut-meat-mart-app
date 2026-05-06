import { PageHero } from "@/components/page-hero";

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      <PageHero
        title="Contact Albto Limited"
        intro="Book a strategy call and let us design your project delivery roadmap."
      />
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="albto-card rounded-2xl p-6">
          <h3 className="text-xl font-semibold">Contact details</h3>
          <p className="mt-3 text-sm text-[var(--albto-muted)]">Email: info@albtolimited.com</p>
          <p className="text-sm text-[var(--albto-muted)]">Phone: +2348088778030</p>
          <p className="text-sm text-[var(--albto-muted)]">40 Emily Akinola Street, Akoka, Lagos</p>
          <p className="mt-3 text-sm text-[var(--albto-muted)]">Primary market: International</p>
        </article>
        <article className="albto-card rounded-2xl p-6">
          <h3 className="text-xl font-semibold">Book a strategy call</h3>
          <form className="mt-3 space-y-3">
            <input className="w-full rounded-lg border border-white/10 bg-[#071126] p-2" placeholder="Full name" />
            <input className="w-full rounded-lg border border-white/10 bg-[#071126] p-2" placeholder="Work email" />
            <textarea className="w-full rounded-lg border border-white/10 bg-[#071126] p-2" rows={4} placeholder="Project summary" />
            <button className="w-full rounded-lg bg-[var(--albto-secondary)] px-4 py-2 font-semibold text-[#041022]" type="button">
              Request Consultation
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
