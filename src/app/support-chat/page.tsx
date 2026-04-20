import { db } from "@/lib/db";
import { ChatForm } from "@/components/chat-form";

export default async function SupportChatPage() {
  const messages = await db.chatMessage
    .findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    .catch(() => []);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">Buyer Support Chat</h1>
      <div className="mt-6 space-y-3">
        {messages.map((item) => (
          <article key={item.id} className="rounded border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-xs text-zinc-400">{item.user?.name ?? "Customer"}</p>
            <p>{item.message}</p>
          </article>
        ))}
      </div>
      <ChatForm />
    </main>
  );
}
