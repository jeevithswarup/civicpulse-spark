import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/civic/ComingSoon";
import { adminNav } from "@/data/nav";
export const Route = createFileRoute("/admin/analytics")({ component: () => <ComingSoon role="admin" navItems={adminNav} title="Analytics" contextLabel="Admin" screen="City-wide analytics" /> });
