import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/civic/AppShell";
import { officerNav } from "@/data/nav";
import { StatCard } from "@/components/civic/StatCard";
import { ClipboardList, AlertTriangle, CheckCircle2, Clock, Activity } from "lucide-react";
import { mockComplaints, mockDepartmentPerf } from "@/data/mockData";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";

export const Route = createFileRoute("/officer/dashboard")({ component: OfficerDashboard });

function OfficerDashboard() {
  return (
    <AppShell role="officer" navItems={officerNav} title="Roads Department" subtitle="Officer Dashboard" contextLabel="Roads & Infrastructure">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard icon={ClipboardList} label="Assigned" value={156} trend={6} />
        <StatCard icon={Activity}      label="In Progress" value={23} trend={-2} accentClass="bg-[color-mix(in_oklab,var(--status-in-progress)_18%,transparent)] text-[var(--status-in-progress)]" />
        <StatCard icon={CheckCircle2}  label="Resolved Today" value={8} trend={15} accentClass="bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]" />
        <StatCard icon={AlertTriangle} label="SLA Breached" value={4} trend={-10} accentClass="bg-[color-mix(in_oklab,var(--emergency)_14%,transparent)] text-[var(--emergency)]" />
        <StatCard icon={Clock}         label="Avg Days" value={"3.2"} accentClass="bg-primary/10 text-primary" />
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="border-b px-4 py-3"><h3 className="text-sm font-semibold">Active Complaints</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground"><tr>
              <th className="px-4 py-2 text-left">ID</th><th className="px-4 py-2 text-left">Title</th><th className="px-4 py-2 text-left">Priority</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Location</th><th className="px-4 py-2 text-right">Action</th>
            </tr></thead>
            <tbody>
              {mockComplaints.map((c) => (
                <tr key={c.id} className="border-t hover:bg-accent/40">
                  <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3">{c.title}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} dot /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.location.address}</td>
                  <td className="px-4 py-3 text-right"><button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">Assign</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="border-b px-4 py-3"><h3 className="text-sm font-semibold">Department Performance</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground"><tr>
              <th className="px-4 py-2 text-left">Department</th><th className="px-4 py-2 text-right">Total</th><th className="px-4 py-2 text-right">Resolved</th><th className="px-4 py-2 text-right">Pending</th><th className="px-4 py-2 text-right">Avg Days</th><th className="px-4 py-2 text-right">SLA</th>
            </tr></thead>
            <tbody>
              {mockDepartmentPerf.map((d) => (
                <tr key={d.dept} className="border-t">
                  <td className="px-4 py-3 font-medium">{d.dept}</td>
                  <td className="px-4 py-3 text-right">{d.total}</td>
                  <td className="px-4 py-3 text-right">{d.resolved}</td>
                  <td className="px-4 py-3 text-right">{d.pending}</td>
                  <td className="px-4 py-3 text-right">{d.avgDays}</td>
                  <td className="px-4 py-3 text-right"><span className={d.sla >= 90 ? "text-[var(--success)]" : "text-[var(--emergency)]"}>{d.sla}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
