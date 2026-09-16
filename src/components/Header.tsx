"use client";

import { useRouter } from "next/navigation";
import { PersonDTO } from "@/lib/types";

export default function Header({ user }: { user: PersonDTO | null }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-border px-5 py-4">
      <div className="flex items-center gap-2 font-bold text-primary-dark">
        <span className="text-xl">🫙</span> Ánh Vi
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <span className="text-base">{user.emoji}</span>
            {user.name}
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-primary/40 hover:text-foreground"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </header>
  );
}
