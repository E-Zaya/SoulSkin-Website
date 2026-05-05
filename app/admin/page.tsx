"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid password. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#555] uppercase mb-10 text-center">
          SOUL SKIN / ADMIN
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] text-[#555] tracking-widest uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#141414] border border-[#222] text-[#ccc] font-mono text-sm px-4 py-3 focus:outline-none focus:border-[#444] transition-colors"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="font-mono text-[10px] text-red-400 tracking-widest">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1a1a1a] border border-[#333] text-[#aaa] font-mono text-[11px] tracking-widest uppercase py-3 hover:bg-[#222] hover:text-white transition-colors disabled:opacity-40"
          >
            {isPending ? "..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
