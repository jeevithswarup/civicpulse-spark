import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/civic/ComingSoon";
import { officerNav } from "@/data/nav";
export const Route = createFileRoute("/officer/complaints")({ component: () => <ComingSoon role="officer" navItems={officerNav} title="All Complaints" contextLabel="Roads & Infrastructure" screen="Complaint Management table" /> });
