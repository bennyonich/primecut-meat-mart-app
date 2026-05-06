export function PageHero({ title, intro }: { title: string; intro: string }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[linear-gradient(125deg,#122a59_0%,#0a1731_50%,#102449_100%)] p-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-3 max-w-3xl text-[var(--albto-muted)]">{intro}</p>
    </section>
  );
}
