import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Share2, ThumbsUp, Copy } from "lucide-react";
import { AppShell } from "@/components/civic/AppShell";
import { citizenNav } from "@/data/nav";
import { mockComplaints } from "@/data/mockData";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";
import { CategoryBadge } from "@/components/civic/CategoryBadge";
import { ComplaintTimeline } from "@/components/civic/ComplaintTimeline";
import { MapPlaceholder } from "@/components/civic/MapPlaceholder";
import { toast } from "sonner";

export const Route = createFileRoute("/citizen/complaints/$id")({ component: DetailPage });

function DetailPage() {
  const { id } = Route.useParams();
  const c = mockComplaints.find((x) => x.id === id) ?? mockComplaints[0];
  return (
    <AppShell role="citizen" navItems={citizenNav} title={c.title} subtitle={c.id} contextLabel="Citizen" emergencyCta>
      <div className="mb-4 flex items-center gap-2">
        <Link to={"/citizen/complaints" as never} className="inline-flex items-center gap-1 rounded-lg border bg-card px-2.5 py-1.5 text-xs hover:bg-accent"><ArrowLeft className="size-3.5" /> Back</Link>
        <button onClick={() => { navigator.clipboard?.writeText(c.id); toast.success("ID copied"); }} className="inline-flex items-center gap-1 rounded-lg border bg-card px-2.5 py-1.5 text-xs hover:bg-accent"><Copy className="size-3.5" /> {c.id}</button>
        <button className="ml-auto inline-flex items-center gap-1 rounded-lg border bg-card px-2.5 py-1.5 text-xs hover:bg-accent"><Share2 className="size-3.5" /> Share</button>
        <StatusBadge status={c.status} dot />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={c.category} />
              <PriorityBadge priority={c.priority} />
            </div>
            <h2 className="mt-3 text-lg font-bold">{c.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {c.location.address}</span>
              <span>Dept: {c.department}</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Timeline</h3>
            <ComplaintTimeline complaint={c} />
          </div>
        </div>

        <div className="space-y-5">
          <button className="flex w-full items-center justify-between rounded-2xl border bg-card p-4 shadow-card transition hover:shadow-card-hover">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ThumbsUp className="size-5" /></span>
              <div className="text-left">
                <div className="text-sm font-semibold">{c.upvotes} upvotes</div>
                <div className="text-xs text-muted-foreground">Show support for this issue</div>
              </div>
            </div>
            <span className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Upvote</span>
          </button>

          <div className="rounded-2xl border bg-card p-3 shadow-card">
            <MapPlaceholder complaints={[c]} height="h-56" showUserDot={false} />
            <button className="mt-2 w-full rounded-lg border bg-background py-2 text-xs font-medium hover:bg-accent">Open in Maps</button>
          </div>

          {c.assignedOfficer && (
            <div className="rounded-2xl border bg-card p-4 shadow-card">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assigned Officer</h4>
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {c.assignedOfficer.split(" ").map((s) => s[0]).join("")}
                </span>
                <div>
                  <div className="text-sm font-semibold">{c.assignedOfficer}</div>
                  <div className="text-xs text-muted-foreground">{c.department}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
