import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/civic/AppShell";
import { citizenNav } from "@/data/nav";
import { MapPlaceholder } from "@/components/civic/MapPlaceholder";
import { mockComplaints } from "@/data/mockData";
import { ComplaintCard } from "@/components/civic/ComplaintCard";

export const Route = createFileRoute("/citizen/nearby")({ component: NearbyPage });

function NearbyPage() {
  return (
    <AppShell role="citizen" navItems={citizenNav} title="Nearby Issues" subtitle={`${mockComplaints.length} complaints in your area`} contextLabel="Citizen" emergencyCta>
      <MapPlaceholder complaints={mockComplaints} height="h-[480px]" showLegend />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {mockComplaints.map((c) => <ComplaintCard key={c.id} complaint={c} />)}
      </div>
    </AppShell>
  );
}
