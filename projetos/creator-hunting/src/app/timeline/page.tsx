import { getCreators } from "@/lib/actions/creators";
import { TimelineClient } from "@/components/timeline/timeline-client";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const creators = await getCreators();
  return <TimelineClient creators={creators} />;
}
