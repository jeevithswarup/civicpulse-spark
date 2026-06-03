import { createFileRoute } from "@tanstack/react-router";
import { citizenNav } from "@/data/nav";
import { AppShell } from "@/components/civic/AppShell";
import { ComplaintCard } from "@/components/civic/ComplaintCard";
import { mockComplaints } from "@/data/mockData";

export const Route = createFileRoute("/citizen/complaints")({ component: ListPage });

function ListPage() {
  const mine = mockComplaints.filter((c) => c.citizen === "Priya Sharma");
  return (
    <AppShell role="citizen" navItems={citizenNav} title="My Complaints" subtitle={`${mine.length} total`} contextLabel="Citizen" emergencyCta fabHref="/citizen/report" fabLabel="Report">
      <div className="grid gap-3 md:grid-cols-2">
        {mine.map((c) => <ComplaintCard key={c.id} complaint={c} />)}
      </div>
    </AppShell>
  );
}
