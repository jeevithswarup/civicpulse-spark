import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { Complaint } from "@/data/mockData";
import { STATUSES, TIMELINE_TEMPLATE, type TimelineEntryStatus } from "@/data/categories";
import { formatDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function ComplaintTimeline({ complaint }: { complaint: Complaint }) {
  const entries = new Map<TimelineEntryStatus, { time: string; note: string; officer?: string }>();
  complaint.timeline.forEach((t) => entries.set(t.status as TimelineEntryStatus, t));

  // Determine current step index from latest entry
  const lastKey = complaint.timeline[complaint.timeline.length - 1]?.status as TimelineEntryStatus;
  const currentIdx = Math.max(0, TIMELINE_TEMPLATE.findIndex((s) => s.key === lastKey));

  return (
    <ol className="relative ml-2 space-y-5 border-l border-dashed border-border pl-6">
      {TIMELINE_TEMPLATE.map((step, i) => {
        const entry = entries.get(step.key);
        const completed = i < currentIdx;
        const active = i === currentIdx && complaint.status !== "resolved";
        const done = i <= currentIdx;
        const s = STATUSES[step.key];

        return (
          <li key={step.key} className="relative">
            <span
              aria-hidden
              className={cn(
                "absolute -left-[33px] top-0 inline-flex size-6 items-center justify-center rounded-full border-2 bg-background",
                done ? "border-transparent" : "border-border",
              )}
              style={done ? { backgroundColor: s.hex, color: "#fff" } : undefined}
            >
              {completed && <CheckCircle2 className="size-3.5" />}
              {active && <span className="size-2 rounded-full bg-white animate-pulse" />}
              {!done && <Circle className="size-3 text-muted-foreground/40" />}
            </span>

            <div className={cn("flex flex-col gap-0.5", !done && "opacity-50")}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{step.label}</span>
                {active && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--status-in-progress)_18%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--status-in-progress)]">
                    <Clock className="size-2.5" /> current
                  </span>
                )}
              </div>
              {entry ? (
                <>
                  <span className="text-xs text-muted-foreground">{formatDateTime(entry.time)}</span>
                  <span className="text-xs">{entry.note}</span>
                  {entry.officer && (
                    <span className="text-[11px] text-muted-foreground">by {entry.officer}</span>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-foreground italic">Upcoming</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
