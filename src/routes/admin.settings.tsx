import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { adminNav } from "@/data/nav";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Bell, Building2, Shield, Sliders } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

const TABS = [
  { key: "sla", label: "SLA & Routing", icon: Sliders },
  { key: "depts", label: "Departments", icon: Building2 },
  { key: "notif", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
] as const;

function AdminSettings() {
  const [tab, setTab] = useState<typeof TABS[number]["key"]>("sla");
  const [slas, setSlas] = useState({ low: 7, medium: 5, high: 2, emergency: 0.25 });
  const [autoRoute, setAutoRoute] = useState(true);
  const [escalate, setEscalate] = useState(true);

  return (
    <AppShell role="admin" navItems={adminNav} title="System Settings" subtitle="Configure SLAs, departments and policies" contextLabel="Admin">
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto rounded-xl border bg-card p-1 lg:flex-col lg:p-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition lg:w-full",
                  active ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:bg-accent",
                )}
              >
                <Icon className="size-4" /> {t.label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-5">
          {tab === "sla" && (
            <section className="rounded-2xl border bg-card p-5 shadow-card animate-[fade-in_0.2s_ease-out]">
              <h2 className="text-base font-semibold">Service Level Agreements</h2>
              <p className="text-xs text-muted-foreground">Maximum days allowed to resolve complaints by priority.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(["low", "medium", "high", "emergency"] as const).map((p) => (
                  <label key={p} className="rounded-lg border bg-background p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{p}</span>
                      <span className="font-mono text-xs text-muted-foreground">{slas[p]}d</span>
                    </div>
                    <input
                      type="range"
                      min={p === "emergency" ? 0.25 : 1}
                      max={p === "emergency" ? 2 : 14}
                      step={p === "emergency" ? 0.25 : 1}
                      value={slas[p]}
                      onChange={(e) => setSlas({ ...slas, [p]: parseFloat(e.target.value) })}
                      className="mt-2 w-full accent-[color:var(--primary)]"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                <ToggleRow label="Auto-route complaints by category" desc="Use AI rules to dispatch to the correct department instantly." value={autoRoute} onChange={setAutoRoute} />
                <ToggleRow label="Auto-escalate on SLA breach" desc="Notify supervisors when a complaint crosses its SLA window." value={escalate} onChange={setEscalate} />
              </div>
              <div className="mt-5 flex justify-end">
                <button onClick={() => toast.success("SLA configuration saved")} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-pop">Save changes</button>
              </div>
            </section>
          )}

          {tab === "depts" && (
            <section className="rounded-2xl border bg-card p-5 shadow-card animate-[fade-in_0.2s_ease-out]">
              <h2 className="text-base font-semibold">Departments & Category Routing</h2>
              <p className="text-xs text-muted-foreground">Each category routes to a default department.</p>
              <ul className="mt-4 divide-y rounded-lg border bg-background">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <li key={c.key} className="flex items-center gap-3 p-3">
                      <span className={cn("inline-flex size-9 items-center justify-center rounded-md", c.bgClass)}>
                        <Icon className={cn("size-4", c.textClass)} />
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{c.label}</div>
                        <div className="text-[11px] text-muted-foreground">{c.example}</div>
                      </div>
                      <select className="rounded-lg border bg-background px-2 py-1.5 text-xs">
                        <option>Roads & Infrastructure</option>
                        <option>Water Works</option>
                        <option>Sanitation</option>
                        <option>Electricity</option>
                        <option>Drainage</option>
                        <option>Public Safety</option>
                      </select>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {tab === "notif" && (
            <section className="rounded-2xl border bg-card p-5 shadow-card space-y-3 animate-[fade-in_0.2s_ease-out]">
              <h2 className="text-base font-semibold">Notification Channels</h2>
              <ToggleRow label="Email — citizen status updates" desc="Send email when complaint status changes." value defaultMode />
              <ToggleRow label="SMS — emergency alerts" desc="Broadcast SMS to citizens in affected wards." value defaultMode />
              <ToggleRow label="In-app push" desc="Real-time push to mobile app users." value defaultMode />
              <ToggleRow label="Weekly digest for officers" desc="Performance summary every Monday morning." value={false} defaultMode />
            </section>
          )}

          {tab === "security" && (
            <section className="rounded-2xl border bg-card p-5 shadow-card space-y-3 animate-[fade-in_0.2s_ease-out]">
              <h2 className="text-base font-semibold">Security & Audit</h2>
              <ToggleRow label="Two-factor authentication for officers" desc="Require OTP login for all staff accounts." value defaultMode />
              <ToggleRow label="Audit log retention (365 days)" desc="Store every action for compliance review." value defaultMode />
              <ToggleRow label="Public API access" desc="Open transparency endpoints for civic data." value={false} defaultMode />
              <div className="rounded-lg border border-[var(--emergency)]/30 bg-[color-mix(in_oklab,var(--emergency)_8%,transparent)] p-3 text-sm">
                <strong className="text-[var(--emergency)]">Danger zone</strong>
                <p className="text-xs text-muted-foreground">Reset all worker tokens and force re-authentication.</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ToggleRow({ label, desc, value, onChange, defaultMode }: { label: string; desc: string; value: boolean; onChange?: (v: boolean) => void; defaultMode?: boolean }) {
  const [v, setV] = useState(value);
  const checked = defaultMode ? v : value;
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border bg-background p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[11px] text-muted-foreground">{desc}</div>
      </div>
      <button
        type="button"
        onClick={() => (defaultMode ? setV(!v) : onChange?.(!value))}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-primary" : "bg-muted",
        )}
        aria-pressed={checked}
      >
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition", checked ? "left-[22px]" : "left-0.5")} />
      </button>
    </label>
  );
}
