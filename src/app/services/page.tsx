import { PageHero } from "@/components/page-hero";

const services = [
  "Enterprise PMO setup and optimization",
  "IT program and portfolio delivery",
  "Telecom rollout and integration management",
  "Transformation governance and reporting",
  "Risk, compliance, and stakeholder management",
];

export default function ServicesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      <PageHero
        title="Services"
        intro="Comprehensive project management services designed for complex, multi-stakeholder initiatives."
      />
      <section className="albto-card rounded-2xl p-6">
        <ul className="space-y-3 text-[var(--albto-muted)]">
          {services.map((service) => (
            <li key={service} className="rounded-lg border border-white/10 bg-[#0b1630] p-3">
              {service}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
