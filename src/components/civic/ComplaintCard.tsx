import { Link } from "@tanstack/react-router";
import { MapPin, ThumbsUp } from "lucide-react";
import { CATEGORY_BY_KEY } from "@/data/categories";
import type { Complaint } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/formatters";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { CategoryIcon } from "./CategoryBadge";

type Props = {
  complaint: Complaint;
  detailHref?: string;
  className?: string;
};

export function ComplaintCard({ complaint, detailHref, className }: Props) {
  const cat = CATEGORY_BY_KEY[complaint.category];
  const isEmergency = complaint.priority === "emergency";
  const href = detailHref ?? `/citizen/complaints/${complaint.id}`;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card shadow-card transition-all hover:shadow-card-hover",
        isEmergency && "border-[var(--emergency)]/40",
        className,
      )}
    >
      {/* Category color strip */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: cat.hex }}
      />
      <div className="flex gap-3 p-4 pl-5">
        <CategoryIcon category={complaint.category} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{complaint.title}</h3>
            <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(complaint.createdAt)}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{complaint.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={complaint.status} dot />
            <PriorityBadge priority={complaint.priority} />
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ThumbsUp className="size-3.5" />
              {complaint.upvotes}
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{complaint.location.address}</span>
            </span>
            <Link
              to={href}
              className="shrink-0 font-medium text-primary hover:underline focus-visible:outline-none focus-visible:underline"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
