import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ThumbsUp, CheckCircle2, Clock, PlusCircle, MapPin, Bell, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/civic/AppShell";
import { StatCard } from "@/components/civic/StatCard";
import { ComplaintCard } from "@/components/civic/ComplaintCard";
import { MapPlaceholder } from "@/components/civic/MapPlaceholder";
import { citizenNav } from "@/data/nav";
import { mockComplaints, mockUser } from "@/data/mockData";

export const Route = createFileRoute("/citizen/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · CivicPulse" }] }),
  component: CitizenDashboard,
});

function CitizenDashboard() {
  const u = mockUser.citizen;
  const recent = mockComplaints.slice(0, 3);
  const community = mockComplaints.slice(3, 6);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <AppShell role="citizen" navItems={citizenNav} title={`Good morning, ${u.name.split(" ")[0]} 👋`} subtitle={`${today} · ${u.city}`} contextLabel="Citizen" emergencyCta fabHref="/citizen/report" fabLabel="Report">
      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard icon={FileText}   label="My Complaints" value={u.complaintsSubmitted} trend={12} accentClass="bg-primary/10 text-primary" />
        <StatCard icon={CheckCircle2} label="Resolved"     value={u.resolvedCount}      trend={8}  accentClass="bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]" />
        <StatCard icon={Clock}      label="Pending"        value={u.complaintsSubmitted - u.resolvedCount} trend={-3} accentClass="bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] text-[var(--warning)]" />
        <StatCard icon={ThumbsUp}   label="Upvotes Given"  value={u.upvotesGiven}       trend={22} accentClass="bg-[color-mix(in_oklab,var(--cat-water)_14%,transparent)] text-[var(--cat-water)]" />
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
          <div className="text-xs text-muted-foreground">23 complaints within 1km</div>
        </Link>
        <Link to={"/citizen/complaints" as never} className="group rounded-2xl border bg-card p-5 shadow-card transition hover:shadow-card-hover">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--status-in-progress)_18%,transparent)] text-[var(--status-in-progress)]"><FileText className="size-5" /></span>
          <div className="mt-3 text-sm font-semibold">Track Complaints</div>
          <div className="text-xs text-muted-foreground">2 active right now</div>
        </Link>
      </section>

      {/* Emergency banner (if any) */}
      <section className="mt-6 flex items-center gap-3 rounded-2xl border border-[var(--emergency)]/30 bg-[color-mix(in_oklab,var(--emergency)_8%,var(--card))] p-4">
        <span className="civic-pulse inline-flex size-10 items-center justify-center rounded-xl bg-[var(--emergency)] text-white"><AlertTriangle className="size-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">1 active emergency in your area</div>
          <div className="truncate text-xs text-muted-foreground">Gas leak near Bright Future School, Fatehgunj</div>
        </div>
        <Link to={"/citizen/complaints/$id" as never} params={{ id: "CMP-2024-003" } as never} className="rounded-lg bg-[var(--emergency)] px-3 py-1.5 text-xs font-semibold text-white">View</Link>
      </section>

      {/* Recent + map */}
      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="Recent Complaints" actionLabel="View all" actionHref="/citizen/complaints" />
          <div className="mt-3 space-y-3">
            {recent.map((c) => <ComplaintCard key={c.id} complaint={c} />)}
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
        <SectionHeader title="Community Feed" subtitle="Recent reports from your city" actionLabel="Load more" />
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {community.map((c) => <ComplaintCard key={c.id} complaint={c} />)}
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
