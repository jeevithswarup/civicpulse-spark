import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Camera, ClipboardCheck, MapPin, Quote, Sparkles, CheckCircle2, Building2, Menu, X } from "lucide-react";
import { Logo } from "@/components/civic/Logo";
import { ThemeToggle } from "@/components/civic/ThemeToggle";
import { CATEGORIES } from "@/data/categories";
import { mockTestimonials } from "@/data/mockData";
import { ComplaintCard } from "@/components/civic/ComplaintCard";
import { mockComplaints } from "@/data/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CivicPulse — Your Voice. Your City. Fixed Faster." },
      { name: "description", content: "Report civic issues in 2 minutes. Track resolution in real-time. Connect with 6 city departments through one beautiful platform." },
      { property: "og:title", content: "CivicPulse — Smart Civic Complaint Management" },
      { property: "og:description", content: "Report civic issues in 2 minutes. Track resolution in real-time." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <main id="main">
        <Hero />
        <StatsBar />
        <HowItWorks />
        <CategoryShowcase />
        <Testimonials />
        <Departments />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center"><Logo /></Link>
        <nav className="ml-6 hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground">How it Works</a>
          <a href="#stats" className="hover:text-foreground">Stats</a>
          <a href="#categories" className="hover:text-foreground">Departments</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login" className="hidden rounded-lg border bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent md:inline-block">Login</Link>
          <Link to="/register" className="hidden rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 md:inline-block">Register</Link>
          <button onClick={() => setOpen((o) => !o)} aria-label="Open menu" className="inline-flex size-9 items-center justify-center rounded-lg border md:hidden">
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            <a href="#how" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent">How it Works</a>
            <a href="#stats" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent">Stats</a>
            <a href="#categories" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent">Departments</a>
            <a href="#contact" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent">Contact</a>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link to="/login" className="rounded-lg border px-3 py-2 text-center text-sm font-medium">Login</Link>
              <Link to="/register" className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">Register</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 civic-grid opacity-40" aria-hidden />
      <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <div className="absolute -right-32 top-20 size-96 rounded-full bg-[var(--cat-water)]/15 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="animate-[fade-in_0.6s_ease-out]">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
            <Sparkles className="size-3.5 text-primary" />
            Now serving Vadodara, Surat & Ahmedabad
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Your Voice. Your City.{" "}
            <span className="bg-gradient-to-r from-primary to-[color-mix(in_oklab,var(--primary)_55%,var(--cat-water))] bg-clip-text text-transparent">
              Fixed Faster.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Report civic issues in 2 minutes. Track resolution in real-time. CivicPulse connects citizens, officers, and field workers through one accountable platform.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-pop transition hover:opacity-90">
              Report an Issue <ArrowRight className="size-4" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 rounded-xl border bg-background px-5 py-3 text-sm font-medium hover:bg-accent">
              See How It Works
            </a>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="size-4 text-[var(--success)]" />
            Free for all citizens · Multi-lingual · Anonymous reporting available
          </div>
        </div>

        <div className="relative animate-[fade-in_0.8s_ease-out]">
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}

function PhoneMock() {
  const sample = mockComplaints.slice(0, 2);
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* phone frame */}
      <div className="relative mx-auto aspect-[9/19] w-72 overflow-hidden rounded-[2.8rem] border-8 border-foreground/90 bg-card shadow-pop sm:w-80">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-foreground/90" aria-hidden />
        <div className="flex h-full flex-col bg-gradient-to-b from-primary/10 via-background to-background p-4 pt-10">
          <div className="flex items-center justify-between">
            <Logo />
            <span className="size-2.5 animate-pulse rounded-full bg-[var(--success)]" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Good morning, Priya 👋</p>
          <h3 className="text-base font-bold">8 active complaints</h3>
          <div className="mt-3 space-y-2">
            {sample.map((c) => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>
        </div>
      </div>
      {/* floating cards */}
      <div className="pointer-events-none absolute -left-6 top-12 hidden w-56 rotate-[-6deg] rounded-xl border bg-card p-3 shadow-pop sm:block">
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle2 className="size-4 text-[var(--success)]" />
          <span className="font-semibold">Resolved in 18h</span>
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">Pothole on RC Dutt Rd fixed</div>
      </div>
      <div className="pointer-events-none absolute -right-6 bottom-16 hidden w-52 rotate-[5deg] rounded-xl border bg-card p-3 shadow-pop sm:block">
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="size-4 text-primary" />
          <span className="font-semibold">23 issues near you</span>
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">Tap to view live map</div>
      </div>
    </div>
  );
}

function StatsBar() {
  const items = [
    { v: 12847, label: "Complaints Resolved" },
    { v: 4.2,  label: "Days Avg Resolution", suffix: "" },
    { v: 6,     label: "Departments Connected" },
    { v: 4.1,   label: "Citizen Satisfaction", suffix: "/5" },
  ];
  return (
    <section id="stats" className="border-y bg-card/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-none bg-border px-0 sm:grid-cols-4">
        {items.map((s) => (
          <div key={s.label} className="bg-card px-4 py-8 text-center">
            <CountUp value={s.v} />
            <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1500;
    const isFloat = !Number.isInteger(value);
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(isFloat ? +(value * eased).toFixed(1) : Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <div className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{typeof n === "number" ? n.toLocaleString("en-IN") : n}{suffix}</div>;
}

function HowItWorks() {
  const steps = [
    { icon: Camera,         t: "Submit",  d: "Take a photo, drop a pin. Our AI auto-classifies the issue and routes it to the right department." },
    { icon: ClipboardCheck, t: "Track",   d: "Real-time status updates from submission to resolution. SMS, push & email alerts at every step." },
    { icon: CheckCircle2,   t: "Resolved", d: "Before/after photo proof from field workers. Rate the resolution to keep officers accountable." },
  ];
  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Three steps. Faster cities.</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">From a single click to verified resolution — citizens stay informed, departments stay accountable.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.t} className="relative rounded-2xl border bg-card p-6 shadow-card transition hover:shadow-card-hover">
                <div className="absolute right-5 top-5 text-5xl font-extrabold text-primary/10">{i + 1}</div>
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-6" /></span>
                <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoryShowcase() {
  const counts: Record<string, number> = { roads: 412, water: 318, garbage: 287, electricity: 198, drainage: 141, safety: 86 };
  return (
    <section id="categories" className="border-y bg-card/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">6 Departments. One Platform.</h2>
            <p className="mt-2 text-muted-foreground">All city services connected through CivicPulse.</p>
          </div>
          <Link to="/register" className="text-sm font-medium text-primary hover:underline">Browse all categories →</Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.key} className="group rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="flex items-start justify-between">
                  <span className={cn("inline-flex size-12 items-center justify-center rounded-xl", c.bgClass, c.textClass)}>
                    <Icon className="size-6" />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{counts[c.key]} resolved</span>
                </div>
                <h3 className="mt-4 font-semibold">{c.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.example}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight">Citizens. Officers. Results.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {mockTestimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border bg-card p-6 shadow-card">
              <Quote className="size-5 text-primary/40" />
              <blockquote className="mt-3 text-sm leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {t.name.split(" ").map((s) => s[0]).join("")}
                </span>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground">{t.area} · {t.type}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Departments() {
  return (
    <section className="border-y bg-card/60 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">Powering municipal departments</p>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-6">
          {["Vadodara MC", "Surat MC", "Ahmedabad MC", "Roads Dept", "Water Works", "Sanitation"].map((d) => (
            <div key={d} className="flex items-center justify-center gap-2 rounded-xl border bg-card px-3 py-3 text-xs font-semibold text-muted-foreground">
              <Building2 className="size-4 text-primary" /> {d}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section id="contact" className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[color-mix(in_oklab,var(--primary)_55%,var(--cat-water))] p-10 text-primary-foreground shadow-pop sm:p-14">
          <div className="absolute inset-0 civic-grid opacity-20" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to fix your city?</h2>
            <p className="mt-3 max-w-xl text-primary-foreground/80">Join thousands of citizens taking back their streets. Your first complaint takes under 2 minutes.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground hover:opacity-90">
                Create your account <ArrowRight className="size-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 bg-transparent px-5 py-3 text-sm font-semibold hover:bg-primary-foreground/10">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Smart civic complaint management for modern cities.</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-[11px] font-medium">
            🇮🇳 Government of India · Digital India Initiative
          </div>
        </div>
        <FooterCol title="Product" links={["How it Works", "Departments", "Pricing", "Status"]} />
        <FooterCol title="Company" links={["About", "Press", "Careers", "Contact"]} />
        <FooterCol title="Legal" links={["Privacy", "Terms", "Accessibility", "Cookies"]} />
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>© 2026 CivicPulse. Built for citizens.</span>
          <span>Your voice. Your city. Fixed faster.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (<li key={l}><a href="#" className="hover:text-foreground">{l}</a></li>))}
      </ul>
    </div>
  );
}
