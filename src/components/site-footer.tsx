import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050d1b]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">Albto Limited</h3>
          <p className="mt-2 text-sm text-[var(--albto-muted)]">
            Project management experts in IT, telecom, and enterprise transformation delivery.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="mt-2 text-sm text-[var(--albto-muted)]">info@albtolimited.com</p>
          <p className="text-sm text-[var(--albto-muted)]">+2348088778030</p>
          <p className="text-sm text-[var(--albto-muted)]">40 Emily Akinola Street, Akoka, Lagos</p>
        </div>
        <div>
          <h4 className="font-semibold">Quick links</h4>
          <div className="mt-2 flex flex-col gap-2 text-sm text-[var(--albto-muted)]">
            <Link href="/services">Services</Link>
            <Link href="/case-studies">Case studies</Link>
            <Link href="/contact">Book a strategy call</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
