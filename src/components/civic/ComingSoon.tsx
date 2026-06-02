import { Construction } from "lucide-react";
import { AppShell, type NavItem } from "@/components/civic/AppShell";
import { EmptyState } from "@/components/civic/EmptyState";
import type { Role } from "@/data/mockData";

export function ComingSoon({
  role, navItems, title, subtitle, contextLabel, emergencyCta, fabHref, fabLabel, screen,
}: {
  role: Role; navItems: NavItem[]; title: string; subtitle?: string; contextLabel?: string;
  emergencyCta?: boolean; fabHref?: string; fabLabel?: string; screen: string;
}) {
  return (
    <AppShell role={role} navItems={navItems} title={title} subtitle={subtitle} contextLabel={contextLabel} emergencyCta={emergencyCta} fabHref={fabHref} fabLabel={fabLabel}>
      <EmptyState
        icon={Construction}
        title={`${screen} — coming next`}
        description="This screen is wired into the navigation and design system. The fully-polished version will land in a follow-up build."
      />
    </AppShell>
  );
}
