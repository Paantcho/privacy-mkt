import { getCreators } from "@/lib/actions/creators";
import { MetasClient } from "@/components/metas/metas-client";

export const dynamic = "force-dynamic";

export default async function MetasPage() {
  const creators = await getCreators();
  return <MetasClient creators={creators} />;
}
