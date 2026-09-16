"use client";

import { useEffect, useState } from "react";
import { LetterDTO } from "@/lib/types";

type Step = "rolling" | "prompt" | "compose" | "success";

export default function DrawFlow({
  partnerName,
  onClose,
  onCreated,
}: {
  partnerName: string;
  onClose: () => void;
  onCreated: (letter: LetterDTO) => void;
}) {
  const [step, setStep] = useState<Step>("rolling");
  const [prompt, setPrompt] = useState<{ emoji: string; text: string } | null>(null);
  const [requestText, setRequestText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function rollPrompt() {
    setStep("rolling");
    setError(null);
    try {
      const res = await fetch("/api/jar/prompt");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không bốc được lá thư");
      setPrompt(data);
      setStep("prompt");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      setStep("prompt");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- rollPrompt is also reused by the "reroll" button
    rollPrompt();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptText: prompt.text,
          promptEmoji: prompt.emoji,
          requestText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không gửi được");
      onCreated(data);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-xl animate-unfold">
        {step === "rolling" && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="text-4xl animate-pulse">🫙</div>
            <p className="text-sm text-muted">Đang bốc một lá thư...</p>
          </div>
        )}

        {step === "prompt" && prompt && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-4xl">{prompt.emoji}</div>
            <p className="text-[15px] font-medium leading-relaxed">{prompt.text}</p>
            <p className="text-xs text-muted">
              Đây là gợi ý — bạn có thể dùng hoặc viết yêu cầu của riêng mình ở bước tiếp theo.
            </p>
            <div className="flex w-full gap-2">
              <button
                onClick={rollPrompt}
                className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:border-primary/40"
              >
                Bốc lại
              </button>
              <button
                onClick={() => {
                  setRequestText(prompt.text);
                  setStep("compose");
                }}
                className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark"
              >
                Dùng gợi ý này
              </button>
            </div>
            {error && <p className="text-sm text-primary-dark">{error}</p>}
            <button onClick={onClose} className="text-sm text-muted hover:text-foreground">
              Đóng
            </button>
          </div>
        )}

        {step === "compose" && (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">Viết yêu cầu cho {partnerName}</h2>
            <textarea
              required
              autoFocus
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <p className="text-xs text-muted">
              {partnerName} sẽ có 7 ngày để hoàn thành điều này.
            </p>
            {error && <p className="text-sm text-primary-dark">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("prompt")}
                className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition hover:border-primary/40"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark disabled:opacity-60"
              >
                {loading ? "Đang gửi..." : `Gửi cho ${partnerName}`}
              </button>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="text-4xl">💌</div>
            <h2 className="text-lg font-bold">Đã gửi!</h2>
            <p className="text-sm text-muted">
              {partnerName} sẽ nhận được lá thư này ngay bây giờ.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark"
            >
              Tuyệt vời
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
