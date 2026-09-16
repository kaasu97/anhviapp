import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCoupleWithMembers } from "@/lib/couple";
import PairClient from "@/components/PairClient";

export default async function PairPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const couple = await getCoupleWithMembers(session.userId);
  if (couple && couple.userTwoId) redirect("/dashboard");

  return (
    <PairClient
      existingInviteCode={couple?.inviteCode ?? null}
    />
  );
}
