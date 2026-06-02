import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/civic/AppShell";
import { adminNav } from "@/data/nav";
import { mockUsers } from "@/data/mockData";
import { initials } from "@/lib/formatters";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

function UsersPage() {
  return (
    <AppShell role="admin" navItems={adminNav} title="User Management" subtitle={`${mockUsers.length} users`} contextLabel="Admin">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground"><tr>
              <th className="px-4 py-2 text-left">User</th><th className="px-4 py-2 text-left">Role</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-right">Complaints</th><th className="px-4 py-2 text-left">Joined</th><th className="px-4 py-2"></th>
            </tr></thead>
            <tbody>
              {mockUsers.map((u) => (
                <tr key={u.id} className="border-t hover:bg-accent/40">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">{initials(u.name)}</span><div><div className="font-medium">{u.name}</div><div className="text-[11px] text-muted-foreground">{u.id}</div></div></div></td>
                  <td className="px-4 py-3 capitalize"><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{u.role}</span></td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-xs"><span className="size-1.5 rounded-full bg-[var(--success)]" /> {u.status}</span></td>
                  <td className="px-4 py-3 text-right">{u.complaints}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.joined}</td>
                  <td className="px-4 py-3 text-right"><button className="rounded-lg border bg-background px-2.5 py-1 text-xs hover:bg-accent">Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
