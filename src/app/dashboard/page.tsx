import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCoupleWithMembers } from "@/lib/couple";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const couple = await getCoupleWithMembers(session.userId);
  if (!couple || !couple.userTwoId) redirect("/pair");

  return <DashboardClient />;
}
