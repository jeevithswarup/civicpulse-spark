import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/civic/AppShell";
import { citizenNav } from "@/data/nav";
import { ThemeToggle } from "@/components/civic/ThemeToggle";
import { getProfile, type AuthUser } from "@/lib/api/auth";
import { getCitizenDashboard, type CitizenDashboardData } from "@/lib/api/complaints";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { clearTokens } from "@/lib/api/client";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/citizen/profile")({ component: ProfilePage });

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<CitizenDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [u, s] = await Promise.all([getProfile(), getCitizenDashboard()]);
        setUser(u);
        setStats(s);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function logout() {
    clearTokens();
    navigate({ to: "/login" as never });
  }

  if (loading) {
    return (
      <AppShell role="citizen" navItems={citizenNav} title="Profile" contextLabel="Citizen">
        <div className="flex items-center gap-2 py-20 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading profile…
        </div>
      </AppShell>
    );
  }

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "?";

  return (
    <AppShell role="citizen" navItems={citizenNav} title="Profile" contextLabel="Citizen">
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Avatar card */}
        <div className="rounded-2xl border bg-card p-6 text-center shadow-card lg:col-span-1">
          <div className="mx-auto inline-flex size-20 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
            {initials}
          </div>
          <div className="mt-3 text-lg font-bold">{user?.username}</div>
          {user?.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
          {user?.phone && <div className="text-xs text-muted-foreground">{user.phone}</div>}
          <div className="mt-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-primary">
            {user?.role}
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <Stat n={stats?.my_complaints ?? 0} l="Filed" />
            <Stat n={stats?.resolved ?? 0} l="Resolved" />
            <Stat n={stats?.pending ?? 0} l="Pending" />
            <Stat n={user?.preferred_language ?? "English"} l="Language" />
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="mt-5 w-full rounded-xl border border-destructive/40 bg-background py-2 text-sm font-semibold text-destructive hover:bg-destructive/5"
          >
            Log out
          </button>
        </div>

        {/* Edit area */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Account info
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Username" defaultValue={user?.username} disabled />
              <Field label="Email" defaultValue={user?.email ?? ""} type="email" />
              <Field label="Phone" defaultValue={user?.phone ?? ""} type="tel" />
              <div>
                <label className="mb-1 block text-xs font-medium">Language</label>
                <select
                  defaultValue={user?.preferred_language ?? "English"}
                  className="h-10 w-full rounded-lg border bg-background px-3 text-sm focus:outline-2 focus:outline-ring"
                >
                  <option>English</option>
                  <option>हिंदी (Hindi)</option>
                  <option>ગુજરાતી (Gujarati)</option>
                  <option>தமிழ் (Tamil)</option>
                  <option>తెలుగు (Telugu)</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => toast.info("Profile editing coming soon")}
              className="mt-4 h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Save changes
            </button>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Appearance
            </h3>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Theme</div>
                <div className="text-xs text-muted-foreground">Switch between light and dark</div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ n, l }: { n: React.ReactNode; l: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="text-base font-bold">{n}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{l}</div>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
  disabled,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium">{label}</span>
      <input
        defaultValue={defaultValue}
        type={type}
        disabled={disabled}
        className="h-10 w-full rounded-lg border bg-background px-3 text-sm focus:outline-2 focus:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}
