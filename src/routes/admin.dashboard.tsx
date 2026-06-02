import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/civic/AppShell";
import { adminNav } from "@/data/nav";
import { StatCard } from "@/components/civic/StatCard";
import { FileText, CheckCircle2, AlertTriangle, Users, Shield, Activity } from "lucide-react";
import { mockStats, mockDailyTrend, mockStatusDistribution, mockDepartmentPerf } from "@/data/mockData";
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

const PIE_COLORS = ["var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-1)", "var(--color-chart-5)"];

function AdminDashboard() {
  return (
    <AppShell role="admin" navItems={adminNav} title="Platform Overview" subtitle="Commissioner's view" contextLabel="Admin">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={FileText} label="Total Complaints" value={mockStats.totalComplaints} trend={9} />
        <StatCard icon={Activity} label="Active Today" value={mockStats.activeToday} trend={4} accentClass="bg-[color-mix(in_oklab,var(--status-in-progress)_18%,transparent)] text-[var(--status-in-progress)]" />
        <StatCard icon={CheckCircle2} label="Resolved (Mo)" value={mockStats.resolvedThisMonth} trend={14} accentClass="bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]" />
        <StatCard icon={Users} label="Total Citizens" value={mockStats.totalCitizens} trend={6} accentClass="bg-[color-mix(in_oklab,var(--cat-water)_14%,transparent)] text-[var(--cat-water)]" />
        <StatCard icon={Shield} label="Active Officers" value={mockStats.activeOfficers} accentClass="bg-primary/10 text-primary" />
        <StatCard icon={AlertTriangle} label="SLA Breach %" value={`${mockStats.slaBreachRate}%`} trend={-2} accentClass="bg-[color-mix(in_oklab,var(--emergency)_14%,transparent)] text-[var(--emergency)]" />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Daily complaints — last 30 days</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={mockDailyTrend}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5}/><stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="complaints" stroke="var(--color-chart-1)" fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Status distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={mockStatusDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {mockStatusDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-5 shadow-card">
        <h3 className="mb-3 text-sm font-semibold">Heatmap — Vadodara civic activity (last 30 days)</h3>
        <div className="relative h-64 overflow-hidden rounded-xl bg-gradient-to-br from-[color-mix(in_oklab,var(--success)_20%,var(--card))] via-[color-mix(in_oklab,var(--warning)_25%,var(--card))] to-[color-mix(in_oklab,var(--emergency)_30%,var(--card))]">
          <div className="absolute inset-0 civic-grid opacity-30" aria-hidden />
          <div className="absolute left-1/4 top-1/3 size-32 rounded-full bg-[var(--emergency)]/40 blur-3xl" aria-hidden />
          <div className="absolute right-1/4 bottom-1/4 size-40 rounded-full bg-[var(--warning)]/40 blur-3xl" aria-hidden />
          <div className="absolute left-1/2 top-1/2 size-24 rounded-full bg-[var(--cat-roads)]/40 blur-2xl" aria-hidden />
          <span className="absolute right-3 top-3 rounded-full border bg-background/80 px-2 py-1 text-[10px] font-medium backdrop-blur">Live map coming soon</span>
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-background/80 px-2 py-1 text-[10px] backdrop-blur">
            Low <span className="inline-block h-2 w-24 rounded-full bg-gradient-to-r from-[var(--success)] via-[var(--warning)] to-[var(--emergency)]" /> High
          </span>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="border-b px-4 py-3"><h3 className="text-sm font-semibold">Department performance</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground"><tr>
              <th className="px-4 py-2 text-left">Department</th><th className="px-4 py-2 text-right">Total</th><th className="px-4 py-2 text-right">Resolved</th><th className="px-4 py-2 text-right">Avg Days</th><th className="px-4 py-2 text-right">SLA</th><th className="px-4 py-2 text-right">Rating</th>
            </tr></thead>
            <tbody>
              {mockDepartmentPerf.map((d) => (
                <tr key={d.dept} className="border-t">
                  <td className="px-4 py-3 font-medium">{d.dept}</td>
                  <td className="px-4 py-3 text-right">{d.total}</td>
                  <td className="px-4 py-3 text-right">{d.resolved}</td>
                  <td className="px-4 py-3 text-right">{d.avgDays}</td>
                  <td className={`px-4 py-3 text-right ${d.sla >= 90 ? "text-[var(--success)]" : "text-[var(--emergency)]"}`}>{d.sla}%</td>
                  <td className="px-4 py-3 text-right">⭐ {d.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
