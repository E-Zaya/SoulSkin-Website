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
    <div className="min-h-dvh bg-void flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <p className="text-xs tracking-label text-mist uppercase mb-10 text-center">
          SOUL SKIN / ADMIN
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-mist tracking-widest uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ash border border-cinder text-dust text-sm px-4 py-3 focus:border-iron transition-colors"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-error tracking-widest">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-ash border border-iron text-mist text-xs tracking-widest uppercase py-3 hover:bg-cinder hover:text-bone transition-colors disabled:opacity-40"
          >
            {isPending ? "..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
