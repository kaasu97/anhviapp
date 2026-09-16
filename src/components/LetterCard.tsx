"use client";

import { useState } from "react";
import { LetterDTO } from "@/lib/types";
import CountdownBadge from "@/components/CountdownBadge";

const REACTIONS = ["❤️", "🥹", "👏", "😍", "🎉"];

export default function LetterCard({
  letter,
  meId,
  onChange,
}: {
  letter: LetterDTO;
  meId: string;
  onChange: (updated: LetterDTO) => void;
}) {
  const isRecipient = letter.recipientId === meId;
  const isAuthor = letter.authorId === meId;
  const [note, setNote] = useState("");
  const [showComplete, setShowComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function complete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/letters/${letter.id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể hoàn thành");
      onChange(data);
      setShowComplete(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  async function react(emoji: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/letters/${letter.id}/react`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
      const data = await res.json();
      if (res.ok) onChange(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="text-lg">{letter.promptEmoji}</span>
          <span>
            {isAuthor ? `Bạn gửi cho ${letter.recipient.name}` : `${letter.author.name} gửi cho bạn`}
          </span>
        </div>
        <CountdownBadge dueAt={letter.dueAt} status={letter.status} />
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-foreground">{letter.requestText}</p>

      {letter.status === "COMPLETED" && letter.completionNote && (
        <p className="mt-2 rounded-xl bg-background px-3 py-2 text-sm text-muted">
          💬 {letter.completionNote}
        </p>
      )}

      {letter.status === "COMPLETED" && (
        <div className="mt-3 flex items-center gap-2">
          {letter.authorReaction ? (
            <span className="text-lg">{letter.authorReaction}</span>
          ) : isAuthor ? (
            <div className="flex gap-1">
              {REACTIONS.map((r) => (
                <button
                  key={r}
                  disabled={loading}
                  onClick={() => react(r)}
                  className="rounded-full px-2 py-1 text-base transition hover:bg-background"
                >
                  {r}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {isRecipient && letter.status === "PENDING" && (
        <div className="mt-3">
          {!showComplete ? (
            <button
              onClick={() => setShowComplete(true)}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark"
            >
              Đánh dấu đã hoàn thành
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Kể một chút về việc bạn đã làm nhé (không bắt buộc)"
                rows={2}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {error && <p className="text-sm text-primary-dark">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={complete}
                  disabled={loading}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark disabled:opacity-60"
                >
                  {loading ? "Đang gửi..." : "Xác nhận hoàn thành"}
                </button>
                <button
                  onClick={() => setShowComplete(false)}
                  className="rounded-full px-4 py-2 text-sm text-muted hover:text-foreground"
                >
                  Huỷ
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isAuthor && letter.status === "PENDING" && (
        <p className="mt-3 text-sm text-muted">
          Đang chờ {letter.recipient.name} hoàn thành...
        </p>
      )}
    </div>
  );
}
