import { getCreators } from "@/lib/actions/creators";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const creators = await getCreators();
  return <DashboardClient creators={creators} />;
}
