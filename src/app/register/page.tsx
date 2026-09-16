"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EMOJI_OPTIONS = ["🐣", "🐻", "🐰", "🦊", "🐼", "🐱", "🐶", "🦄", "🌷", "🍀"];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, emoji }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng ký thất bại");
      router.push("/pair");
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
        <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
        <p className="mt-1 text-sm text-muted">
          Chuẩn bị chiếc bình thư của riêng hai bạn.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Tên của bạn</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="Vi"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Chọn một biểu tượng</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setEmoji(opt)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition ${
                    emoji === opt
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

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
              placeholder="Ít nhất 6 ký tự"
            />
          </div>

          {error && <p className="text-sm text-primary-dark">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
