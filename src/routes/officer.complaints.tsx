import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { officerNav } from "@/data/nav";
import { mockComplaints, mockWorkers, type ComplaintStatus } from "@/data/mockData";
import { CATEGORY_BY_KEY } from "@/data/categories";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";
import { CheckCircle2, Filter, Search, UserPlus2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/formatters";
import { toast } from "sonner";

export const Route = createFileRoute("/officer/complaints")({ component: OfficerComplaints });

const STATUS_TABS: { key: "all" | ComplaintStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "submitted", label: "New" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

function OfficerComplaints() {
  const [tab, setTab] = useState<"all" | ComplaintStatus>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [assignFor, setAssignFor] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return mockComplaints.filter((c) => {
      if (tab !== "all" && c.status !== tab) return false;
      if (q && !`${c.id} ${c.title} ${c.location.address}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tab, q]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const bulkAssign = () => {
    toast.success(`Assigned ${selected.length} complaints to worker queue`);
    setSelected([]);
  };

  return (
    <AppShell role="officer" navItems={officerNav} title="Complaint Management" subtitle={`${filtered.length} of ${mockComplaints.length} complaints`} contextLabel="Roads & Infrastructure">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by ID, title or area…"
            className="w-full rounded-lg border bg-background py-2.5 pl-9 pr-3 text-sm outline-none ring-primary/30 focus:ring-2"
          />
        </div>
        <button className="inline-flex items-center gap-2 self-start rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
          <Filter className="size-4" /> Filters
        </button>
      </div>

      {/* Status tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border bg-card p-1">
        {STATUS_TABS.map((t) => {
          const count = t.key === "all" ? mockComplaints.length : mockComplaints.filter((c) => c.status === t.key).length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                active ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:bg-accent",
              )}
            >
              {t.label} <span className={cn("ml-1 rounded px-1", active ? "bg-primary-foreground/20" : "bg-muted")}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm animate-[fade-in_0.2s_ease-out]">
          <div className="font-medium">{selected.length} selected</div>
          <div className="flex items-center gap-2">
            <button onClick={bulkAssign} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              <UserPlus2 className="size-3.5" /> Bulk assign
            </button>
            <button onClick={() => setSelected([])} className="inline-flex items-center gap-1 rounded-lg border bg-background px-2 py-1.5 text-xs">
              <X className="size-3.5" /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Table (desktop) / Cards (mobile) */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="hidden w-full text-left text-sm md:table">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="w-10 px-3 py-3"></th>
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">Complaint</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Officer</th>
              <th className="px-3 py-3">Submitted</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((c) => {
              const cat = CATEGORY_BY_KEY[c.category];
              const Icon = cat.icon;
              const checked = selected.includes(c.id);
              return (
                <tr key={c.id} className={cn("transition hover:bg-accent/40", checked && "bg-primary/5")}>
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={checked} onChange={() => toggle(c.id)} className="size-4 rounded border-input" />
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-start gap-2">
                      <span className={cn("mt-0.5 inline-flex size-7 items-center justify-center rounded-md", cat.bgClass)}>
                        <Icon className={cn("size-3.5", cat.textClass)} />
                      </span>
                      <div className="min-w-0">
                        <Link to="/citizen/complaints/$id" params={{ id: c.id }} className="line-clamp-1 font-medium hover:underline">{c.title}</Link>
                        <div className="line-clamp-1 text-[11px] text-muted-foreground">{c.location.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-3 py-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-3 py-3 text-xs">{c.assignedOfficer ?? <span className="text-muted-foreground">Unassigned</span>}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{timeAgo(c.createdAt)}</td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => setAssignFor(c.id)} className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs hover:bg-accent">
                      <UserPlus2 className="size-3" /> Assign
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile cards */}
        <ul className="divide-y md:hidden">
          {filtered.map((c) => {
            const cat = CATEGORY_BY_KEY[c.category];
            const Icon = cat.icon;
            return (
              <li key={c.id} className="p-3">
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} className="mt-1 size-4 rounded border-input" />
                  <span className={cn("inline-flex size-9 items-center justify-center rounded-md", cat.bgClass)}>
                    <Icon className={cn("size-4", cat.textClass)} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{c.id}</span>
                      <PriorityBadge priority={c.priority} />
                    </div>
                    <Link to="/citizen/complaints/$id" params={{ id: c.id }} className="block truncate text-sm font-semibold">{c.title}</Link>
                    <div className="mt-1 flex items-center gap-2"><StatusBadge status={c.status} /><span className="text-[11px] text-muted-foreground">{timeAgo(c.createdAt)}</span></div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
            <CheckCircle2 className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">No complaints match your filters</p>
            <p className="text-xs text-muted-foreground">Try a different status tab or clear your search.</p>
          </div>
        )}
      </div>

      {/* Assign drawer */}
      {assignFor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={() => setAssignFor(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-2xl border bg-card p-5 shadow-pop sm:rounded-2xl animate-[fade-in_0.2s_ease-out]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">Assign {assignFor}</h3>
                <p className="text-xs text-muted-foreground">Select a field worker to dispatch.</p>
              </div>
              <button onClick={() => setAssignFor(null)} className="rounded-md p-1 hover:bg-accent"><X className="size-4" /></button>
            </div>
            <ul className="mt-4 space-y-2">
              {mockWorkers.map((w) => (
                <li key={w.id}>
                  <button
                    onClick={() => { toast.success(`${assignFor} assigned to ${w.name}`); setAssignFor(null); }}
                    disabled={!w.available}
                    className="flex w-full items-center justify-between rounded-lg border bg-background p-3 text-left text-sm hover:bg-accent disabled:opacity-50"
                  >
                    <div>
                      <div className="font-medium">{w.name}</div>
                      <div className="text-[11px] text-muted-foreground">{w.dept} • {w.tasks} active tasks</div>
                    </div>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", w.available ? "bg-[color-mix(in_oklab,var(--status-resolved)_18%,transparent)] text-[var(--status-resolved)]" : "bg-muted text-muted-foreground")}>
                      {w.available ? "Available" : "Busy"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AppShell>
  );
}
