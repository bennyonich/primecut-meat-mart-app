"use client";

import { useState } from "react";

export function ChatForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      className="mt-6 flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        if (!resp.ok) {
          setError("Could not send message. Login is required.");
          return;
        }
        setMessage("");
        window.location.reload();
      }}
    >
      <input
        className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about delivery, cut options, or availability..."
      />
      <button className="rounded bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500">Send</button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
