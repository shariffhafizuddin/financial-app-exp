import TransactionDetailClient from "@/components/TransactionDetailClient";

export default function Page({ params }: { params: { id: string } }) {
  return <TransactionDetailClient id={params.id} />;
}
