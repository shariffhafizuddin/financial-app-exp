import WeekClient from "@/components/WeekClient";

export default function Page({ params }: { params: { weekStart: string } }) {
  return <WeekClient weekStart={params.weekStart} />;
}
