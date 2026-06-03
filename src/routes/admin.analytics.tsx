import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/civic/AppShell";
import { adminNav } from "@/data/nav";
import { StatCard } from "@/components/civic/StatCard";
import {
  mockCategoryDistribution,
  mockDailyTrend,
  mockDepartmentPerf,
  mockResolutionTrend,
  mockStatusDistribution,
  mockStats,
} from "@/data/mockData";
import { CATEGORY_BY_KEY } from "@/data/categories";
import { Activity, CheckCircle2, Clock, Star } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/admin/analytics")({ component: AdminAnalytics });

const STATUS_COLORS: Record<string, string> = {
  resolved: "#10B981",
  in_progress: "#F59E0B",
  assigned: "#0EA5E9",
  submitted: "#6366F1",
  rejected: "#EF4444",
};

function AdminAnalytics() {
  return (
    <AppShell role="admin" navItems={adminNav} title="City-Wide Analytics" subtitle="Last 30 days" contextLabel="Admin">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Complaints" value={mockStats.totalComplaints} icon={Activity} trend={12} />
        <StatCard label="Resolved (30d)" value={mockStats.resolvedThisMonth} icon={CheckCircle2} trend={8} />
        <StatCard label="Avg Resolution" value={mockStats.avgResolutionDays} icon={Clock} hint="days" trend={-5} />
        <StatCard label="Satisfaction" value={mockStats.satisfactionRating} icon={Star} hint="out of 5" trend={3} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-card lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Complaints vs Resolutions (30 days)</h2>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-primary" /> Filed</span>
              <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-[var(--status-resolved)]" /> Resolved</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={mockDailyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} interval={3} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="complaints" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={mockStatusDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {mockStatusDistribution.map((s) => (
                    <Cell key={s.key} fill={STATUS_COLORS[s.key] ?? "#888"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">Complaints by Category</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={mockCategoryDistribution} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {mockCategoryDistribution.map((c) => (
                    <Cell key={c.key} fill={CATEGORY_BY_KEY[c.key as keyof typeof CATEGORY_BY_KEY].hex} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">Resolution Rate (7 days)</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={mockResolutionTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} domain={[0, 100]} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `${v}%`} />
                <Line type="monotone" dataKey="resolutionRate" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-sm font-semibold">Department Performance</h2>
          <span className="text-[11px] text-muted-foreground">Ranked by SLA compliance</span>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5">Department</th>
              <th className="px-4 py-2.5">Total</th>
              <th className="px-4 py-2.5">Resolved</th>
              <th className="px-4 py-2.5">Pending</th>
              <th className="px-4 py-2.5">Avg Days</th>
              <th className="px-4 py-2.5">SLA</th>
              <th className="px-4 py-2.5">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[...mockDepartmentPerf].sort((a, b) => b.sla - a.sla).map((d) => (
              <tr key={d.dept} className="hover:bg-accent/40">
                <td className="px-4 py-2.5 font-medium">{d.dept}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{d.total}</td>
                <td className="px-4 py-2.5">{d.resolved}</td>
                <td className="px-4 py-2.5">{d.pending}</td>
                <td className="px-4 py-2.5">{d.avgDays}d</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${d.sla}%`, background: d.sla >= 90 ? "var(--status-resolved)" : d.sla >= 80 ? "var(--warning)" : "var(--emergency)" }} />
                    </div>
                    <span className="text-xs tabular-nums">{d.sla}%</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">⭐ {d.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
