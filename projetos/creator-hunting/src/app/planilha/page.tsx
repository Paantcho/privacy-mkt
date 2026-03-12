import { getCreators } from "@/lib/actions/creators";
import { PlanilhaClient } from "@/components/planilha/planilha-client";

export const dynamic = "force-dynamic";

export default async function PlanilhaPage() {
  const creators = await getCreators();
  return <PlanilhaClient creators={creators} />;
}
