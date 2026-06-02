import { cn } from "@/lib/utils";
import { CATEGORY_BY_KEY } from "@/data/categories";
import type { Complaint } from "@/data/mockData";
import { MapPin, Navigation } from "lucide-react";

type Pin = { complaint: Complaint; xPct: number; yPct: number };

type Props = {
  complaints?: Complaint[];
  height?: string;
  showLegend?: boolean;
  showUserDot?: boolean;
  className?: string;
  onPinClick?: (c: Complaint) => void;
};

// Deterministic pseudo-positions so the map looks consistent
function pseudoPos(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const x = 10 + (h % 80);
  const y = 12 + ((h >> 7) % 70);
  return { xPct: x, yPct: y };
}

export function MapPlaceholder({ complaints = [], height = "h-96", showLegend, showUserDot = true, className, onPinClick }: Props) {
  const pins: Pin[] = complaints.map((c) => ({ complaint: c, ...pseudoPos(c.id) }));
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[color-mix(in_oklab,var(--cat-water)_8%,var(--card))] via-card to-[color-mix(in_oklab,var(--cat-garbage)_6%,var(--card))]", height, className)}>
      {/* grid overlay */}
      <div className="absolute inset-0 civic-grid opacity-50" aria-hidden />
      {/* river-ish curve */}
      <svg className="absolute inset-0 size-full" aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M -5 60 Q 30 40 55 55 T 110 50" stroke="color-mix(in oklab, var(--cat-water) 30%, transparent)" strokeWidth="4" fill="none" />
        <path d="M -5 20 Q 30 28 60 22 T 110 25" stroke="color-mix(in oklab, var(--foreground) 8%, transparent)" strokeWidth="0.7" fill="none" strokeDasharray="2 2" />
        <path d="M 40 -5 Q 50 40 45 60 T 60 110" stroke="color-mix(in oklab, var(--foreground) 8%, transparent)" strokeWidth="0.7" fill="none" strokeDasharray="2 2" />
      </svg>

      {/* User position */}
      {showUserDot && (
        <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <span className="absolute inset-0 -m-3 rounded-full bg-primary/30 animate-ping" aria-hidden />
          <span className="relative block size-3 rounded-full bg-primary ring-4 ring-primary/30" />
        </div>
      )}

      {/* Pins */}
      {pins.map(({ complaint: c, xPct, yPct }) => {
        const cat = CATEGORY_BY_KEY[c.category];
        const Icon = cat.icon;
        const isEm = c.priority === "emergency";
        return (
          <button
            key={c.id}
            onClick={() => onPinClick?.(c)}
            aria-label={c.title}
            className={cn(
              "group absolute inline-flex size-8 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full text-white shadow-pop transition hover:scale-110",
              isEm && "civic-pulse",
            )}
            style={{ left: `${xPct}%`, top: `${yPct}%`, backgroundColor: cat.hex }}
          >
            <Icon className="size-4" />
            <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" style={{ backgroundColor: cat.hex }} aria-hidden />
          </button>
        );
      })}

      {/* Compass */}
      <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium backdrop-blur">
        <Navigation className="size-3" /> N
      </div>

      {showLegend && (
        <div className="absolute bottom-3 right-3 rounded-xl bg-background/85 p-2 text-[10px] backdrop-blur">
          <div className="mb-1 font-semibold">Categories</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {Object.values(CATEGORY_BY_KEY).map((c) => (
              <div key={c.key} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ backgroundColor: c.hex }} />
                <span>{c.label.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!pins.length && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
          <MapPin className="size-6" />
          <span className="text-xs">No complaints in this view</span>
        </div>
      )}
    </div>
  );
}
