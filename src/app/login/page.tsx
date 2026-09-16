"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Chào bạn quay lại</h1>
        <p className="mt-1 text-sm text-muted">Đăng nhập để mở bình thư hôm nay.</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="ban@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Mật khẩu</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-primary-dark">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Tạo tài khoản
          </Link>
        </p>
      </div>
    </div>
  );
}
