import InsightsWeekClient from "@/components/InsightsWeekClient";

export default async function Page({ params }: { params: Promise<{ weekStart: string }> }) {
  const { weekStart } = await params;
  return <InsightsWeekClient weekStart={weekStart} />;
}
