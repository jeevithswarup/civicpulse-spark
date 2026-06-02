import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, type LucideIcon, AlertTriangle, Plus } from "lucide-react";
import { Logo } from "@/components/civic/Logo";
import { ThemeToggle } from "@/components/civic/ThemeToggle";
import { RoleSwitcher } from "@/components/civic/RoleSwitcher";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/formatters";
import type { ReactNode } from "react";
import { mockUser, type Role } from "@/data/mockData";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  exact?: boolean;
}

interface AppShellProps {
  role: Role;
  navItems: NavItem[];
  title: string;
  subtitle?: string;
  contextLabel?: string; // e.g., "Citizen" or "Roads Department"
  emergencyCta?: boolean;
  fabHref?: string;
  fabLabel?: string;
  children: ReactNode;
}

export function AppShell({ role, navItems, title, subtitle, contextLabel, emergencyCta, fabHref, fabLabel, children }: AppShellProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = mockUser[role];
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="flex min-h-dvh w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b px-5">
          <Link to="/" className="flex items-center"><Logo /></Link>
        </div>
        <div className="px-4 pt-4">
          <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{user.name}</div>
              <div className="text-[11px] text-muted-foreground">{contextLabel}</div>
            </div>
          </div>
        </div>
        <nav className="mt-4 flex-1 overflow-y-auto px-3">
          <ul className="space-y-1">
            {navItems.map((it) => {
              const active = isActive(it.to, it.exact);
              const Icon = it.icon;
              return (
                <li key={it.to}>
                  <Link
                    to={it.to as never}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-card"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="flex-1">{it.label}</span>
                    {it.badge !== undefined && (
                      <span className={cn(
                        "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                        active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary",
                      )}>{it.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {emergencyCta && (
          <div className="p-4">
            <Link
              to={"/citizen/report" as never}
              search={{ priority: "emergency" } as never}
              className="flex items-center justify-center gap-2 rounded-xl bg-[var(--emergency)] px-3 py-2.5 text-sm font-semibold text-white shadow-pop transition hover:opacity-90"
            >
              <AlertTriangle className="size-4" /> Report Emergency
            </Link>
          </div>
        )}
        <div className="border-t p-4">
          <RoleSwitcher compact />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur lg:px-6">
          <Link to="/" className="flex items-center lg:hidden"><Logo label={false} /></Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold leading-tight sm:text-lg">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <Link to="/citizen/notifications" className="relative inline-flex size-9 items-center justify-center rounded-lg border bg-background hover:bg-accent" aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-[var(--emergency)] px-1 text-[10px] font-bold text-white">2</span>
          </Link>
          <ThemeToggle />
          <span className="hidden size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary sm:inline-flex">
            {initials(user.name)}
          </span>
        </header>

        <main id="main" className="relative flex-1 animate-[fade-in_0.35s_ease-out] px-4 pb-24 pt-5 lg:px-8 lg:pb-10">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t bg-background/95 py-2 backdrop-blur lg:hidden">
          {navItems.slice(0, 5).map((it) => {
            const active = isActive(it.to, it.exact);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to as never}
                className={cn(
                  "flex min-w-14 flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                <span>{it.label.split(" ")[0]}</span>
                {it.badge !== undefined && (
                  <span className="absolute mt-[-26px] ml-7 inline-flex min-w-4 items-center justify-center rounded-full bg-[var(--emergency)] px-1 text-[9px] font-bold text-white">{it.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile FAB */}
        {fabHref && (
          <Link
            to={fabHref as never}
            className="fixed bottom-20 right-4 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-pop transition hover:opacity-90 lg:hidden"
          >
            <Plus className="size-5" /> {fabLabel ?? "Add"}
          </Link>
        )}
      </div>
    </div>
  );
}
