import InsightsWeekClient from "@/components/InsightsWeekClient";

export default function Page({ params }: { params: { weekStart: string } }) {
  return <InsightsWeekClient weekStart={params.weekStart} />;
}
