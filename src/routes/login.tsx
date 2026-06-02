import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, MapPin, BellRing, Loader2 } from "lucide-react";
import { Logo } from "@/components/civic/Logo";
import { ThemeToggle } from "@/components/civic/ThemeToggle";
import { RoleSwitcher } from "@/components/civic/RoleSwitcher";
import { useRole, dashboardPathForRole } from "@/hooks/useRole";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login · CivicPulse" }, { name: "description", content: "Login to track your civic complaints in real time." }] }),
  component: LoginPage,
});

function LoginPage() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(false);
    setTimeout(() => {
      setLoading(false);
      toast.success("Welcome back!");
      navigate({ to: dashboardPathForRole(role) as never });
    }, 900);
  }

  const isStaff = role === "officer" || role === "admin";

  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-primary to-[color-mix(in_oklab,var(--primary)_50%,var(--cat-water))] p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 civic-grid opacity-15" aria-hidden />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-tight">Your voice<br />moves cities.</h2>
          <p className="mt-3 max-w-sm text-primary-foreground/80">Join 8,400+ citizens shaping Vadodara through transparent civic action.</p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              { icon: ShieldCheck, t: "Verified Govt-backed platform" },
              { icon: MapPin,      t: "Auto-routed to the right department" },
              { icon: BellRing,    t: "Live updates from submission to fix" },
            ].map(({ icon: I, t }) => (
              <li key={t} className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary-foreground/10"><I className="size-4" /></span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-xs text-primary-foreground/70">© 2026 CivicPulse</div>
      </aside>

      {/* Form panel */}
      <section className="flex flex-col px-5 py-6 sm:px-12">
        <div className="flex items-center justify-between lg:hidden">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="ml-auto mt-2 hidden lg:block"><ThemeToggle /></div>

        <div className="m-auto w-full max-w-md py-10">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">{isStaff ? "Department dashboard awaits." : "Login to track your complaints."}</p>

          <div className="mt-6"><RoleSwitcher /></div>

          <form onSubmit={onSubmit} className={cn("mt-6 space-y-4", err && "animate-[shake_0.4s_ease-in-out]")}>
            <Field label={isStaff ? "Officer ID" : "Phone or Email"} htmlFor="login-id" icon={isStaff ? ShieldCheck : Phone}>
              <input id="login-id" required placeholder={isStaff ? "OFF-001" : "+91 98765 43210"} className="civic-input" />
            </Field>
            <Field label="Password" htmlFor="login-pw" icon={Lock}
              suffix={
                <button type="button" onClick={() => setShow((s) => !s)} aria-label="Toggle password visibility" className="text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              }>
              <input id="login-pw" required type={show ? "text" : "password"} placeholder="••••••••" className="civic-input" />
            </Field>
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="size-4 rounded border" /> Remember me</label>
              <a href="#" className="font-medium text-primary hover:underline">Forgot password?</a>
            </div>
            <button disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-pop transition hover:opacity-90 disabled:opacity-60">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Signing in..." : "Login"}
            </button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
            <button type="button" onClick={() => toast.info("Google sign-in is mocked in this demo")} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border bg-card text-sm font-medium hover:bg-accent">
              <GoogleG /> Continue with Google
            </button>

            <p className="text-center text-sm text-muted-foreground">
              New to CivicPulse? <Link to="/register" className="font-semibold text-primary hover:underline">Register</Link>
            </p>
          </form>
        </div>
      </section>

      <style>{`.civic-input{width:100%;height:2.75rem;padding:0 2.5rem;border-radius:.5rem;border:1px solid var(--color-input);background:var(--color-background);color:var(--color-foreground);font-size:.875rem}.civic-input:focus{outline:2px solid var(--color-ring);outline-offset:1px}`}</style>
    </div>
  );
}

function Field({ label, htmlFor, icon: Icon, children, suffix }: { label: string; htmlFor: string; icon: React.ElementType; children: React.ReactNode; suffix?: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        {children}
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>}
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="size-4"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.2 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.3-.1-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.2 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5C29.7 35 27 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.5 5.5C40.9 35.7 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5z"/></svg>
  );
}
