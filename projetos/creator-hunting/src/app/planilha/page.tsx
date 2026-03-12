import { getCreators } from "@/lib/actions/creators";
import { PlanilhaClient } from "@/components/planilha/planilha-client";

export const dynamic = "force-dynamic";

export default async function PlanilhaPage() {
  const creators = await getCreators();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-ink-500">Prospecção</h1>
        <p className="mt-0.5 text-[14px] font-semibold text-[#A08E7E]">
          Gestão de creators prospectados
        </p>
      </div>

      <PlanilhaClient creators={creators} />
    </div>
  );
}
