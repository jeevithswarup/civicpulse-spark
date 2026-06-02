import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/civic/AppShell";
import { citizenNav } from "@/data/nav";
import { mockUser } from "@/data/mockData";
import { initials, maskPhone, formatDate } from "@/lib/formatters";
import { ThemeToggle } from "@/components/civic/ThemeToggle";

export const Route = createFileRoute("/citizen/profile")({ component: ProfilePage });

function ProfilePage() {
  const u = mockUser.citizen;
  return (
    <AppShell role="citizen" navItems={citizenNav} title="Profile" contextLabel="Citizen">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 text-center shadow-card lg:col-span-1">
          <div className="mx-auto inline-flex size-20 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">{initials(u.name)}</div>
          <div className="mt-3 text-lg font-bold">{u.name}</div>
          <div className="text-xs text-muted-foreground">{maskPhone(u.phone)}</div>
          <div className="mt-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">Citizen</div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <Stat n={u.complaintsSubmitted} l="Filed" />
            <Stat n={u.resolvedCount} l="Resolved" />
            <Stat n={u.upvotesGiven} l="Upvotes" />
            <Stat n={formatDate(u.joinedDate)} l="Member since" />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Edit profile</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Full name" defaultValue={u.name} />
              <Field label="Email" defaultValue={u.email} />
              <Field label="City" defaultValue={u.city} />
              <Field label="Language" defaultValue={u.language} />
            </div>
            <button className="mt-4 h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">Save changes</button>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Appearance</h3>
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
  return <div className="rounded-lg border bg-background p-3"><div className="text-base font-bold">{n}</div><div className="text-[10px] uppercase tracking-wide text-muted-foreground">{l}</div></div>;
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium">{label}</span>
      <input defaultValue={defaultValue} className="h-10 w-full rounded-lg border bg-background px-3 text-sm focus:outline-2 focus:outline-ring" />
    </label>
  );
}
