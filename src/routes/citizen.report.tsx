import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { citizenNav } from "@/data/nav";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowLeft, ArrowRight, Camera, Check, MapPin, Mic, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/citizen/report")({
  component: ReportPage,
  validateSearch: (s: Record<string, unknown>) => ({
    priority: (s.priority as string) === "emergency" ? "emergency" : undefined,
  }),
});

const STEPS = ["Category", "Details", "Location", "Review"] as const;

function ReportPage() {
  const { priority: presetPriority } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "emergency">(
    (presetPriority as "emergency") ?? "medium",
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [address, setAddress] = useState("RC Dutt Road, Vadodara");
  const [anonymous, setAnonymous] = useState(false);

  const canNext = () => {
    if (step === 0) return !!category;
    if (step === 1) return title.length >= 6 && description.length >= 15;
    if (step === 2) return address.length > 0;
    return true;
  };

  const submit = () => {
    toast.success("Complaint submitted — tracking ID CMP-2024-009");
    navigate({ to: "/citizen/complaints" });
  };

  return (
    <AppShell role="citizen" navItems={citizenNav} title="Report an Issue" subtitle={`Step ${step + 1} of ${STEPS.length}`} contextLabel="Citizen">
      <div className="mx-auto max-w-3xl">
        {/* Stepper */}
        <ol className="mb-6 grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition",
                  i < step && "border-primary bg-primary text-primary-foreground",
                  i === step && "border-primary bg-primary/10 text-primary ring-4 ring-primary/15",
                  i > step && "border-border bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </div>
              <span className={cn("text-[11px] font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
          {step === 0 && (
            <section className="animate-[fade-in_0.25s_ease-out]">
              <h2 className="text-lg font-semibold">What's the issue about?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pick the category that best describes your complaint.</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const active = category === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setCategory(c.key)}
                      className={cn(
                        "group flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-pop",
                        active ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-background",
                      )}
                    >
                      <span className={cn("inline-flex size-10 items-center justify-center rounded-lg", c.bgClass)}>
                        <Icon className={cn("size-5", c.textClass)} />
                      </span>
                      <div>
                        <div className="text-sm font-semibold">{c.label}</div>
                        <div className="text-[11px] text-muted-foreground">{c.example}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-[var(--emergency)]/30 bg-[color-mix(in_oklab,var(--emergency)_8%,transparent)] p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-5 text-[var(--emergency)]" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[var(--emergency)]">Life-threatening? Report as emergency</div>
                    <p className="text-xs text-muted-foreground">Gas leaks, fires, exposed live wires — these get auto-routed to first responders.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPriority("emergency")}
                    className={cn(
                      "shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold",
                      priority === "emergency" ? "bg-[var(--emergency)] text-white" : "border border-[var(--emergency)]/40 text-[var(--emergency)]",
                    )}
                  >
                    {priority === "emergency" ? "Selected" : "Mark"}
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="animate-[fade-in_0.25s_ease-out] space-y-4">
              <h2 className="text-lg font-semibold">Tell us more</h2>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Large pothole near City Hospital"
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                />
                <div className="mt-1 text-[11px] text-muted-foreground">{title.length}/80</div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <div className="relative mt-1">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe what happened, when you noticed it, how it's affecting the area…"
                    className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                  />
                  <button type="button" className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-[11px] text-muted-foreground hover:bg-accent">
                    <Mic className="size-3" /> Voice
                  </button>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">{description.length}/500</div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Priority</label>
                <div className="mt-1 grid grid-cols-4 gap-2">
                  {(["low", "medium", "high", "emergency"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "rounded-lg border px-2 py-2 text-xs font-semibold capitalize transition",
                        priority === p
                          ? p === "emergency"
                            ? "border-[var(--emergency)] bg-[var(--emergency)] text-white"
                            : "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:bg-accent",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Photos / Video (optional)</label>
                <div className="mt-1 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {media.map((m, i) => (
                    <div key={i} className="aspect-square rounded-lg border bg-gradient-to-br from-muted to-accent" />
                  ))}
                  {media.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setMedia([...media, `m${media.length}`])}
                      className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground hover:bg-accent"
                    >
                      <Camera className="size-5" />
                      Add
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="animate-[fade-in_0.25s_ease-out] space-y-4">
              <h2 className="text-lg font-semibold">Where is it?</h2>
              <div className="relative h-56 overflow-hidden rounded-xl border bg-[radial-gradient(circle_at_30%_30%,var(--primary)/15%,transparent_60%),linear-gradient(to_bottom_right,var(--muted),var(--accent))]">
                <div className="absolute inset-0 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <span className="absolute inset-0 -m-3 animate-civic-pulse rounded-full bg-primary/30" />
                    <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-pop">
                      <MapPin className="size-4" />
                    </span>
                  </div>
                </div>
                <button type="button" className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-card backdrop-blur hover:bg-background">
                  <MapPin className="size-3.5" /> Use my location
                </button>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">Lat 22.3072, Lng 73.1812 — pinned automatically.</p>
              </div>
              <label className="flex items-center gap-2 rounded-lg border bg-background p-3 text-sm">
                <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="size-4 rounded border-input" />
                <span>Submit anonymously (your name will be hidden from the public timeline)</span>
              </label>
            </section>
          )}

          {step === 3 && (
            <section className="animate-[fade-in_0.25s_ease-out] space-y-4">
              <h2 className="text-lg font-semibold">Review & submit</h2>
              <dl className="divide-y rounded-xl border bg-background text-sm">
                <Row label="Category" value={CATEGORIES.find((c) => c.key === category)?.label ?? "—"} />
                <Row label="Priority" value={<span className="capitalize">{priority}</span>} />
                <Row label="Title" value={title || "—"} />
                <Row label="Description" value={<span className="line-clamp-3 text-muted-foreground">{description || "—"}</span>} />
                <Row label="Location" value={address} />
                <Row label="Photos" value={`${media.length} attached`} />
                <Row label="Submitted as" value={anonymous ? "Anonymous" : "Priya Sharma"} />
              </dl>
              <div className="rounded-xl border bg-primary/5 p-4 text-sm">
                <p><strong>What happens next?</strong> Your complaint will be auto-routed to the correct department within minutes. You'll get notifications at every status change.</p>
              </div>
            </section>
          )}
        </div>

        {/* Footer nav */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-4 py-2.5 text-sm font-semibold disabled:opacity-40 hover:bg-accent"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => canNext() && setStep(step + 1)}
              disabled={!canNext()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-pop disabled:opacity-40"
            >
              Next <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-pop"
            >
              <Upload className="size-4" /> Submit Complaint
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-2.5">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm">{value}</dd>
    </div>
  );
}
