import WeekClient from "@/components/WeekClient";

export default async function Page({ params }: { params: Promise<{ weekStart: string }> }) {
  const { weekStart } = await params;
  return <WeekClient weekStart={weekStart} />;
}
