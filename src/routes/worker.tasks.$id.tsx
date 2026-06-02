import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, CheckCircle2, MapPin, Navigation } from "lucide-react";
import { AppShell } from "@/components/civic/AppShell";
import { workerNav } from "@/data/nav";
import { mockComplaints } from "@/data/mockData";
import { CategoryBadge } from "@/components/civic/CategoryBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { MapPlaceholder } from "@/components/civic/MapPlaceholder";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/worker/tasks/$id")({ component: TaskDetail });

function TaskDetail() {
  const { id } = Route.useParams();
  const c = mockComplaints.find((x) => x.id === id) ?? mockComplaints[0];
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <AppShell role="worker" navItems={workerNav} title={c.title} subtitle={c.id} contextLabel="Roads · Field Team">
      <Link to={"/worker/dashboard" as never} className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> Back to tasks</Link>

      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center gap-2"><CategoryBadge category={c.category} /><PriorityBadge priority={c.priority} /><StatusBadge status={c.status} dot /></div>
        <p className="mt-3 text-sm">{c.description}</p>
        <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3.5" /> {c.location.address}</div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-3 shadow-card">
          <MapPlaceholder complaints={[c]} height="h-56" showUserDot={false} />
          <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border bg-background py-2 text-xs font-medium hover:bg-accent"><Navigation className="size-3.5" /> Get directions</button>
        </div>
        <div className="space-y-3">
          <button onClick={() => { setCheckedIn(true); toast.success("Checked in at 9:45 AM ✓"); }} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-pop hover:opacity-90 disabled:opacity-60" disabled={checkedIn}>
            <MapPin className="size-4" /> {checkedIn ? "Checked in" : "GPS Check-in"}
          </button>
          <button onClick={() => toast.success("Status updated: In Progress")} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--status-in-progress)] py-3 text-sm font-semibold text-white shadow-pop hover:opacity-90">Mark In Progress</button>
          <button onClick={() => toast.success("Proof submitted · Resolved 🎉")} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--success)] py-3 text-sm font-semibold text-white shadow-pop hover:opacity-90"><Camera className="size-4" /> Upload Proof + Resolve</button>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border bg-card py-3 text-sm font-semibold hover:bg-accent"><CheckCircle2 className="size-4" /> Add work notes</button>
        </div>
      </div>
    </AppShell>
  );
}
