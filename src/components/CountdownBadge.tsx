import { daysRemaining } from "@/lib/dates";

export default function CountdownBadge({ dueAt, status }: { dueAt: string; status: string }) {
  if (status === "COMPLETED") {
    return (
      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
        Đã hoàn thành
      </span>
    );
  }
  if (status === "EXPIRED") {
    return (
      <span className="rounded-full bg-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-600">
        Đã hết hạn
      </span>
    );
  }

  const remaining = daysRemaining(new Date(dueAt));
  if (remaining < 0) {
    return (
      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
        Quá hạn
      </span>
    );
  }
  if (remaining === 0) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
        Hạn chót là hôm nay
      </span>
    );
  }
  const tone = remaining <= 2 ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary-dark";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      Còn {remaining} ngày
    </span>
  );
}
