"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Jar from "@/components/Jar";
import DrawFlow from "@/components/DrawFlow";
import LetterCard from "@/components/LetterCard";
import { LetterDTO, MeDTO } from "@/lib/types";

type Tab = "today" | "history";

export default function DashboardClient() {
  const [me, setMe] = useState<MeDTO | null>(null);
  const [pending, setPending] = useState<LetterDTO[]>([]);
  const [history, setHistory] = useState<LetterDTO[]>([]);
  const [tab, setTab] = useState<Tab>("today");
  const [showDraw, setShowDraw] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const res = await fetch("/api/me");
    const data = await res.json();
    setMe(data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const [meRes, lettersRes] = await Promise.all([fetch("/api/me"), fetch("/api/letters")]);
      const [meData, lettersData] = await Promise.all([meRes.json(), lettersRes.json()]);
      if (cancelled) return;
      setMe(meData);
      setPending(lettersData.pending ?? []);
      setHistory(lettersData.history ?? []);
      setLoading(false);
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleJarClick() {
    if (!me?.couple?.canDrawToday) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setShowDraw(true);
  }

  function handleCreated(letter: LetterDTO) {
    setPending((prev) => [letter, ...prev]);
    loadMe();
  }

  function handleLetterChange(updated: LetterDTO) {
    if (updated.status === "PENDING") {
      setPending((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    } else {
      setPending((prev) => prev.filter((l) => l.id !== updated.id));
      setHistory((prev) => {
        const exists = prev.some((l) => l.id === updated.id);
        return exists ? prev.map((l) => (l.id === updated.id ? updated : l)) : [updated, ...prev];
      });
    }
  }

  if (loading || !me) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted">Đang tải...</div>
    );
  }

  const couple = me.couple!;
  const incoming = pending.filter((l) => l.recipientId === me.user.id);
  const outgoing = pending.filter((l) => l.authorId === me.user.id);

  return (
    <div className="flex flex-1 flex-col">
      <Header user={me.user} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 py-6">
        <section className="rounded-3xl border border-border bg-surface p-5 text-center shadow-sm">
          <div className="flex items-center justify-center gap-3 text-sm text-muted">
            <span>
              {me.user.emoji} {me.user.name}
            </span>
            <span className="text-primary">♥</span>
            <span>
              {couple.partner?.emoji} {couple.partner?.name}
            </span>
          </div>
          {couple.daysTogether !== null && (
            <p className="mt-1 text-xs text-muted">
              Đã bên nhau {couple.daysTogether} ngày
            </p>
          )}

          <div className="mt-5 flex justify-center">
            <Jar canDraw={couple.canDrawToday} shaking={shaking} onClick={handleJarClick} />
          </div>

          <p className="mt-3 text-xs text-muted">
            {couple.canDrawToday
              ? "Hôm nay là lượt của bạn — hãy bốc một lá thư nhé!"
              : couple.alreadyDrawnToday
              ? "Bình thư hôm nay đã được mở rồi. Hẹn mai nhé!"
              : `Hôm nay là lượt của ${couple.turnName ?? "người ấy"}.`}
          </p>
        </section>

        <div className="flex rounded-full border border-border bg-surface p-1 text-sm font-semibold">
          <button
            onClick={() => setTab("today")}
            className={`flex-1 rounded-full py-2 transition ${
              tab === "today" ? "bg-primary text-white" : "text-muted"
            }`}
          >
            Hôm nay ({pending.length})
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 rounded-full py-2 transition ${
              tab === "history" ? "bg-primary text-white" : "text-muted"
            }`}
          >
            Lịch sử
          </button>
        </div>

        {tab === "today" && (
          <div className="flex flex-col gap-4">
            {incoming.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-muted">Việc bạn cần làm</h3>
                <div className="flex flex-col gap-3">
                  {incoming.map((l) => (
                    <LetterCard key={l.id} letter={l} meId={me.user.id} onChange={handleLetterChange} />
                  ))}
                </div>
              </div>
            )}
            {outgoing.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-muted">Bạn đã gửi</h3>
                <div className="flex flex-col gap-3">
                  {outgoing.map((l) => (
                    <LetterCard key={l.id} letter={l} meId={me.user.id} onChange={handleLetterChange} />
                  ))}
                </div>
              </div>
            )}
            {pending.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
                Chưa có lá thư nào đang chờ. {couple.canDrawToday ? "Bốc một lá ngay nhé!" : "Chờ người ấy bốc thư hôm nay."}
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="flex flex-col gap-3">
            {history.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
                Lịch sử những lá thư đã hoàn thành sẽ xuất hiện ở đây.
              </div>
            )}
            {history.map((l) => (
              <LetterCard key={l.id} letter={l} meId={me.user.id} onChange={handleLetterChange} />
            ))}
          </div>
        )}
      </main>

      {showDraw && (
        <DrawFlow
          partnerName={couple.partner?.name ?? "người ấy"}
          onClose={() => setShowDraw(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
