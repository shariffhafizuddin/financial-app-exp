import TransactionDetailClient from "@/components/TransactionDetailClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TransactionDetailClient id={id} />;
}
