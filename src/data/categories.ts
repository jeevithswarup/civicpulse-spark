import {
  Construction,
  Droplets,
  Trash2,
  Zap,
  Waves,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import type { ComplaintCategory, ComplaintStatus, ComplaintPriority } from "@/data/mockData";

export interface CategoryDef {
  key: ComplaintCategory;
  label: string;
  example: string;
  icon: LucideIcon;
  /** Tailwind class referencing CSS token */
  textClass: string;
  bgClass: string;
  ringClass: string;
  borderClass: string;
  /** Used by recharts (raw color value) */
  hex: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    key: "roads",
    label: "Roads & Potholes",
    example: "Potholes, road damage",
    icon: Construction,
    textClass: "text-[var(--cat-roads)]",
    bgClass: "bg-[color-mix(in_oklab,var(--cat-roads)_14%,transparent)]",
    ringClass: "ring-[var(--cat-roads)]",
    borderClass: "border-[var(--cat-roads)]",
    hex: "#92400E",
  },
  {
    key: "water",
    label: "Water Leakage",
    example: "Pipe burst, leaks",
    icon: Droplets,
    textClass: "text-[var(--cat-water)]",
    bgClass: "bg-[color-mix(in_oklab,var(--cat-water)_14%,transparent)]",
    ringClass: "ring-[var(--cat-water)]",
    borderClass: "border-[var(--cat-water)]",
    hex: "#0EA5E9",
  },
  {
    key: "garbage",
    label: "Garbage",
    example: "Overflowing bins",
    icon: Trash2,
    textClass: "text-[var(--cat-garbage)]",
    bgClass: "bg-[color-mix(in_oklab,var(--cat-garbage)_14%,transparent)]",
    ringClass: "ring-[var(--cat-garbage)]",
    borderClass: "border-[var(--cat-garbage)]",
    hex: "#16A34A",
  },
  {
    key: "electricity",
    label: "Electricity",
    example: "Street lights, outages",
    icon: Zap,
    textClass: "text-[var(--cat-electricity)]",
    bgClass: "bg-[color-mix(in_oklab,var(--cat-electricity)_14%,transparent)]",
    ringClass: "ring-[var(--cat-electricity)]",
    borderClass: "border-[var(--cat-electricity)]",
    hex: "#EAB308",
  },
  {
    key: "drainage",
    label: "Drainage",
    example: "Clogged drains, flooding",
    icon: Waves,
    textClass: "text-[var(--cat-drainage)]",
    bgClass: "bg-[color-mix(in_oklab,var(--cat-drainage)_14%,transparent)]",
    ringClass: "ring-[var(--cat-drainage)]",
    borderClass: "border-[var(--cat-drainage)]",
    hex: "#7C3AED",
  },
  {
    key: "safety",
    label: "Public Safety",
    example: "Hazards, unsafe areas",
    icon: ShieldAlert,
    textClass: "text-[var(--cat-safety)]",
    bgClass: "bg-[color-mix(in_oklab,var(--cat-safety)_14%,transparent)]",
    ringClass: "ring-[var(--cat-safety)]",
    borderClass: "border-[var(--cat-safety)]",
    hex: "#DC2626",
  },
];

export const CATEGORY_BY_KEY: Record<ComplaintCategory, CategoryDef> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.key]: c }),
  {} as Record<ComplaintCategory, CategoryDef>,
);

export interface StatusDef {
  key: ComplaintStatus | "received" | "under_review";
  label: string;
  textClass: string;
  bgClass: string;
  hex: string;
}

export const STATUSES: Record<string, StatusDef> = {
  submitted: { key: "submitted", label: "Submitted", textClass: "text-[var(--status-submitted)]", bgClass: "bg-[color-mix(in_oklab,var(--status-submitted)_16%,transparent)]", hex: "#6366F1" },
  received: { key: "received", label: "Received", textClass: "text-[var(--status-assigned)]", bgClass: "bg-[color-mix(in_oklab,var(--status-assigned)_16%,transparent)]", hex: "#0EA5E9" },
  assigned: { key: "assigned", label: "Assigned", textClass: "text-[var(--status-assigned)]", bgClass: "bg-[color-mix(in_oklab,var(--status-assigned)_16%,transparent)]", hex: "#0EA5E9" },
  in_progress: { key: "in_progress", label: "In Progress", textClass: "text-[var(--status-in-progress)]", bgClass: "bg-[color-mix(in_oklab,var(--status-in-progress)_18%,transparent)]", hex: "#F59E0B" },
  under_review: { key: "under_review", label: "Under Review", textClass: "text-[var(--status-in-progress)]", bgClass: "bg-[color-mix(in_oklab,var(--status-in-progress)_18%,transparent)]", hex: "#F59E0B" },
  resolved: { key: "resolved", label: "Resolved", textClass: "text-[var(--status-resolved)]", bgClass: "bg-[color-mix(in_oklab,var(--status-resolved)_18%,transparent)]", hex: "#10B981" },
  rejected: { key: "rejected", label: "Rejected", textClass: "text-[var(--status-rejected)]", bgClass: "bg-[color-mix(in_oklab,var(--status-rejected)_18%,transparent)]", hex: "#EF4444" },
};

export interface PriorityDef {
  key: ComplaintPriority;
  label: string;
  textClass: string;
  bgClass: string;
}
export const PRIORITIES: Record<ComplaintPriority, PriorityDef> = {
  low:       { key: "low",       label: "Low",       textClass: "text-muted-foreground",                bgClass: "bg-muted" },
  medium:    { key: "medium",    label: "Medium",    textClass: "text-[var(--warning)]",                bgClass: "bg-[color-mix(in_oklab,var(--warning)_16%,transparent)]" },
  high:      { key: "high",      label: "High",      textClass: "text-[var(--cat-roads)]",              bgClass: "bg-[color-mix(in_oklab,var(--cat-roads)_16%,transparent)]" },
  emergency: { key: "emergency", label: "Emergency", textClass: "text-[var(--emergency)]",              bgClass: "bg-[color-mix(in_oklab,var(--emergency)_18%,transparent)]" },
};

export const TIMELINE_TEMPLATE: Array<{ key: TimelineEntryStatus; label: string }> = [
  { key: "submitted",    label: "Submitted" },
  { key: "received",     label: "Received" },
  { key: "assigned",     label: "Assigned" },
  { key: "in_progress",  label: "In Progress" },
  { key: "under_review", label: "Under Review" },
  { key: "resolved",     label: "Resolved" },
];

export type TimelineEntryStatus = ComplaintStatus | "received" | "under_review";
