import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCoupleWithMembers } from "@/lib/couple";

export default async function Home() {
  const session = await getSession();
  if (session) {
    const couple = await getCoupleWithMembers(session.userId);
    redirect(couple ? "/dashboard" : "/pair");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
          🫙
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Ánh Vi
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Một chiếc bình thư nhỏ cho hai người ở xa nhau. Mỗi ngày, một người
          bốc một lá thư và gửi gắm một điều nho nhỏ cho người kia — để dù
          cách xa vẫn luôn cảm thấy có nhau mỗi ngày.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/register"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark"
          >
            Bắt đầu cùng người ấy
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40"
          >
            Tôi đã có tài khoản
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
          <FeatureCard emoji="🎟️" text="Bốc một lá thư mỗi ngày từ bình" />
          <FeatureCard emoji="📝" text="Viết một yêu cầu nhỏ cho người ấy" />
          <FeatureCard emoji="⏳" text="Hoàn thành trong vòng một tuần" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-sm">
      <div className="mb-2 text-xl">{emoji}</div>
      {text}
    </div>
  );
}
