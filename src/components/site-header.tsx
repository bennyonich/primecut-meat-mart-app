import Link from "next/link";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/methodology", label: "Methodology" },
  { href: "/team", label: "Team" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#061024]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          Albto Limited
        </Link>
        <nav className="hidden flex-wrap items-center gap-4 text-sm text-[var(--albto-muted)] lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="rounded-lg bg-[var(--albto-secondary)] px-4 py-2 font-semibold text-[#041022]">
            Book a Call
          </Link>
        </nav>
      </div>
    </header>
  );
}
