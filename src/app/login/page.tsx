"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
          if (result?.error) {
            setError("Invalid email or password.");
            return;
          }
          router.push("/");
        }}
      >
        <input
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button className="w-full rounded bg-emerald-600 px-3 py-2 font-medium hover:bg-emerald-500">
          Sign in
        </button>
      </form>
    </main>
  );
}
