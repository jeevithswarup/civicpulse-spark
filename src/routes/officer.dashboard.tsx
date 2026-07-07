import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { officerNav } from "@/data/nav";
import { StatCard } from "@/components/civic/StatCard";
import { ClipboardList, AlertTriangle, CheckCircle2, Clock, Activity, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { PriorityBadge } from "@/components/civic/PriorityBadge";
import {
  getOfficerDashboard,
  getOfficerComplaints,
  assignWorker,
  type OfficerDashboardData,
  type Complaint,
} from "@/lib/api/complaints";
import { getDepartmentWorkers } from "@/lib/api/complaints";
import { toast } from "sonner";
import { X } from "lucide-react";

export const Route = createFileRoute("/officer/dashboard")({ component: OfficerDashboard });

interface Worker {
  id: number;
  username: string;
  role: string;
}

function OfficerDashboard() {
  const [stats, setStats] = useState<OfficerDashboardData | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignFor, setAssignFor] = useState<number | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [s, c] = await Promise.all([
          getOfficerDashboard(),
          getOfficerComplaints(),
        ]);
        setStats(s);
        setComplaints(c);
      } catch {
        toast.error("Failed to load officer dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function openAssign(complaintId: number) {
    setAssignFor(complaintId);
    if (workers.length === 0) {
      try {
        const w = await getDepartmentWorkers();
        setWorkers(w as Worker[]);
      } catch {
        toast.error("Could not load workers");
      }
    }
  }

  async function doAssign(workerId: number) {
    if (!assignFor) return;
    setAssigning(true);
    try {
      await assignWorker(assignFor, workerId);
      toast.success("Worker assigned!");
      setAssignFor(null);
      // refresh complaints
      const updated = await getOfficerComplaints();
      setComplaints(updated);
    } catch {
      toast.error("Assignment failed");
    } finally {
      setAssigning(false);
    }
  }

  return (
    <AppShell role="officer" navItems={officerNav} title="Officer Dashboard" subtitle="Complaint overview" contextLabel="Department">
      {loading && (
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total Assigned"  value={stats?.total ?? 0}       trend={6} />
        <StatCard icon={Activity}      label="In Progress"     value={stats?.in_progress ?? 0}  trend={-2} accentClass="bg-[color-mix(in_oklab,var(--status-in-progress)_18%,transparent)] text-[var(--status-in-progress)]" />
        <StatCard icon={CheckCircle2}  label="Resolved"        value={stats?.resolved ?? 0}     trend={15} accentClass="bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]" />
        <StatCard icon={Clock}         label="Pending"         value={stats?.pending ?? 0}      accentClass="bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] text-[var(--warning)]" />
      </section>

      {/* Complaints table */}
      <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Active Complaints</h3>
          <span className="text-xs text-muted-foreground">{complaints.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No complaints assigned yet.
                  </td>
                </tr>
              )}
              {complaints.map((c) => (
                <tr key={c.id} className="border-t hover:bg-accent/40">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.complaintID}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate font-medium">{c.title}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} dot /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[150px] truncate">{c.address}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openAssign(c.id)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                    >
                      Assign Worker
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assign worker drawer */}
      {assignFor !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
          onClick={() => setAssignFor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-2xl border bg-card p-5 shadow-pop sm:rounded-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">Assign Worker</h3>
                <p className="text-xs text-muted-foreground">Select a field worker for complaint #{assignFor}</p>
              </div>
              <button onClick={() => setAssignFor(null)} className="rounded-md p-1 hover:bg-accent">
                <X className="size-4" />
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {workers.length === 0 && (
                <li className="text-center text-sm text-muted-foreground py-4">
                  <Loader2 className="size-4 animate-spin mx-auto" />
                </li>
              )}
              {workers.map((w) => (
                <li key={w.id}>
                  <button
                    onClick={() => doAssign(w.id)}
                    disabled={assigning}
                    className="flex w-full items-center justify-between rounded-lg border bg-background p-3 text-left text-sm hover:bg-accent disabled:opacity-60"
                  >
                    <div>
                      <div className="font-medium">{w.username}</div>
                      <div className="text-[11px] text-muted-foreground capitalize">{w.role}</div>
                    </div>
                    <span className="rounded-full bg-[color-mix(in_oklab,var(--success)_18%,transparent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--success)]">
                      Worker
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
