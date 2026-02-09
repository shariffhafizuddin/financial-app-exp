import TransactionEditClient from "@/components/TransactionEditClient";

export default function Page({ params }: { params: { id: string } }) {
  return <TransactionEditClient id={params.id} />;
}
