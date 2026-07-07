import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, ThumbsUp, CheckCircle2, Clock, MapPin, ArrowRight, Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { AppShell } from "@/components/civic/AppShell";
import { StatCard } from "@/components/civic/StatCard";
import { ComplaintCard } from "@/components/civic/ComplaintCard";
import { MapPlaceholder } from "@/components/civic/MapPlaceholder";
import { citizenNav } from "@/data/nav";
import { mockComplaints } from "@/data/mockData";
import { getCitizenDashboard, getMyComplaints, getPopularComplaints, type CitizenDashboardData, type Complaint } from "@/lib/api/complaints";
import { getCachedUser } from "@/lib/api/auth";

export const Route = createFileRoute("/citizen/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · CivicPulse" }] }),
  component: CitizenDashboard,
});

function CitizenDashboard() {
  const user = getCachedUser();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const [stats, setStats] = useState<CitizenDashboardData | null>(null);
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [popular, setPopular] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, my, pop] = await Promise.all([
          getCitizenDashboard(),
          getMyComplaints(),
          getPopularComplaints(),
        ]);
        setStats(s);
        setMyComplaints(my);
        setPopular(pop);
      } catch {
        // fall back to mock data silently if backend is unreachable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const recent = myComplaints.slice(0, 3);
  const community = popular.slice(0, 6);

  // Map API complaint to the shape ComplaintCard expects (mock shape)
  // ComplaintCard works with mockData shape; adapt only the fields it uses
  const adaptComplaint = (c: Complaint) => ({
    id: String(c.id),
    complaintID: c.complaintID,
    title: c.title,
    description: c.description,
    category: c.category,
    status: c.status,
    priority: c.priority,
    address: c.address,
    support_count: c.support_count,
    created_at: c.created_at,
  });

  return (
    <AppShell role="citizen" navItems={citizenNav} title={`Good morning, ${user?.username ?? "there"} 👋`} subtitle={today} contextLabel="Citizen" emergencyCta fabHref="/citizen/report" fabLabel="Report">

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading your dashboard…
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard icon={FileText}    label="My Complaints" value={stats?.my_complaints ?? 0} trend={12} accentClass="bg-primary/10 text-primary" />
        <StatCard icon={CheckCircle2} label="Resolved"     value={stats?.resolved ?? 0}      trend={8}  accentClass="bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]" />
        <StatCard icon={Clock}        label="Pending"      value={stats?.pending ?? 0}        trend={-3} accentClass="bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] text-[var(--warning)]" />
        <StatCard icon={ThumbsUp}     label="Upvotes Given" value={0}                          trend={0}  accentClass="bg-[color-mix(in_oklab,var(--cat-water)_14%,transparent)] text-[var(--cat-water)]" />
      </section>

      {/* Quick actions */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link to={"/citizen/report" as never} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[color-mix(in_oklab,var(--primary)_60%,var(--cat-water))] p-5 text-primary-foreground shadow-pop transition hover:opacity-95">
          <Sparkles className="absolute right-4 top-4 size-5 opacity-60" />
          <div className="text-xs font-medium text-primary-foreground/80">Got an issue?</div>
          <div className="mt-1 text-lg font-bold">Report New Issue</div>
          <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold">Get started <ArrowRight className="size-3.5" /></div>
        </Link>
        <Link to={"/citizen/nearby" as never} className="group rounded-2xl border bg-card p-5 shadow-card transition hover:shadow-card-hover">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--cat-water)_14%,transparent)] text-[var(--cat-water)]"><MapPin className="size-5" /></span>
          <div className="mt-3 text-sm font-semibold">View Nearby Issues</div>
          <div className="text-xs text-muted-foreground">{popular.length} complaints loaded</div>
        </Link>
        <Link to={"/citizen/complaints" as never} className="group rounded-2xl border bg-card p-5 shadow-card transition hover:shadow-card-hover">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--status-in-progress)_18%,transparent)] text-[var(--status-in-progress)]"><FileText className="size-5" /></span>
          <div className="mt-3 text-sm font-semibold">Track Complaints</div>
          <div className="text-xs text-muted-foreground">{(stats?.pending ?? 0)} active right now</div>
        </Link>
      </section>

      {/* Recent + map */}
      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="My Recent Complaints" actionLabel="View all" actionHref="/citizen/complaints" />
          <div className="mt-3 space-y-3">
            {recent.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">No complaints yet. <Link to={"/citizen/report" as never} className="text-primary hover:underline">Report one now →</Link></p>
            )}
            {recent.map((c) => (
              <ComplaintCard key={c.id} complaint={adaptComplaint(c) as never} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader title="On the Map" actionLabel="Open map" actionHref="/citizen/nearby" />
          <div className="mt-3">
            <MapPlaceholder complaints={mockComplaints} height="h-80" showLegend />
          </div>
        </div>
      </section>

      {/* Community feed */}
      <section className="mt-8">
        <SectionHeader title="Popular in Your City" subtitle="Most supported complaints" actionLabel="See nearby" actionHref="/citizen/nearby" />
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {community.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground col-span-3">No community complaints yet.</p>
          )}
          {community.map((c) => (
            <ComplaintCard key={c.id} complaint={adaptComplaint(c) as never} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function SectionHeader({ title, subtitle, actionLabel, actionHref }: { title: string; subtitle?: string; actionLabel?: string; actionHref?: string }) {
  return (
    <div className="flex items-end justify-between gap-2">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground/80">{subtitle}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link to={actionHref as never} className="text-xs font-medium text-primary hover:underline">{actionLabel} →</Link>
      )}
      {actionLabel && !actionHref && (
        <button className="text-xs font-medium text-primary hover:underline">{actionLabel} →</button>
      )}
    </div>
  );
}
