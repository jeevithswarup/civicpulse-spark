import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/civic/ComingSoon";
import { adminNav } from "@/data/nav";
export const Route = createFileRoute("/admin/settings")({ component: () => <ComingSoon role="admin" navItems={adminNav} title="System Settings" contextLabel="Admin" screen="Settings & SLA config" /> });
