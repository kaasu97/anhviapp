"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function PairClient({
  existingInviteCode,
}: {
  existingInviteCode: string | null;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "waiting" | "join">(
    existingInviteCode ? "waiting" : "choose"
  );
  const [inviteCode, setInviteCode] = useState(existingInviteCode ?? "");
  const [joinCode, setJoinCode] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (mode !== "waiting") return;
    pollRef.current = setInterval(async () => {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data.couple?.paired) {
        if (pollRef.current) clearInterval(pollRef.current);
        router.push("/dashboard");
        router.refresh();
      }
    }, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [mode, router]);

  async function createCouple(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/couple/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anniversary: anniversary || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không tạo được bình thư");
      setInviteCode(data.inviteCode);
      setMode("waiting");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  async function joinCouple(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/couple/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: joinCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không ghép đôi được");
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
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
          🫙
        </div>

        {mode === "choose" && (
          <>
            <h1 className="text-xl font-bold">Ghép đôi với người ấy</h1>
            <p className="mt-1 text-sm text-muted">
              Tạo một chiếc bình mới, hoặc nhập mã mời nếu người ấy đã tạo trước.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => setMode("join")}
                className="rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold transition hover:border-primary/40"
              >
                Tôi có mã mời
              </button>
              <div className="border-t border-border pt-4">
                <label className="mb-1 block text-left text-sm font-medium">
                  Ngày bắt đầu yêu (không bắt buộc)
                </label>
                <input
                  type="date"
                  value={anniversary}
                  onChange={(e) => setAnniversary(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
                <button
                  onClick={createCouple}
                  disabled={loading}
                  className="mt-3 w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark disabled:opacity-60"
                >
                  {loading ? "Đang tạo..." : "Tạo bình thư mới"}
                </button>
              </div>
            </div>
          </>
        )}

        {mode === "join" && (
          <>
            <h1 className="text-xl font-bold">Nhập mã mời</h1>
            <p className="mt-1 text-sm text-muted">
              Mã gồm 6 ký tự do người ấy chia sẻ với bạn.
            </p>
            <form onSubmit={joinCouple} className="mt-6 flex flex-col gap-3">
              <input
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg font-semibold tracking-[0.3em] outline-none focus:border-primary"
                placeholder="ABC123"
              />
              {error && <p className="text-sm text-primary-dark">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark disabled:opacity-60"
              >
                {loading ? "Đang ghép đôi..." : "Ghép đôi ngay"}
              </button>
              <button
                type="button"
                onClick={() => setMode("choose")}
                className="text-sm text-muted hover:text-foreground"
              >
                Quay lại
              </button>
            </form>
          </>
        )}

        {mode === "waiting" && (
          <>
            <h1 className="text-xl font-bold">Đang chờ người ấy...</h1>
            <p className="mt-1 text-sm text-muted">
              Gửi mã này cho người ấy để cùng mở bình thư nhé.
            </p>
            <div className="mt-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 py-4 text-3xl font-bold tracking-[0.3em] text-primary-dark">
              {inviteCode}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Đang chờ ghép đôi...
            </div>
          </>
        )}

        {error && mode !== "join" && (
          <p className="mt-3 text-sm text-primary-dark">{error}</p>
        )}
      </div>
    </div>
  );
}
