import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/civic/Logo";
import { ThemeToggle } from "@/components/civic/ThemeToggle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { register, login } from "@/lib/api/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account · CivicPulse" },
      { name: "description", content: "Create your CivicPulse account in 3 steps." },
    ],
  }),
  component: RegisterPage,
});

// Shared form state lifted to parent so all steps can access it
interface FormState {
  username: string;
  phone: string;
  email: string;
  password: string;
  preferred_language: string;
}

function RegisterPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    username: "",
    phone: "",
    email: "",
    password: "",
    preferred_language: "English",
  });
  const total = 3;

  async function finish(finalData: FormState) {
    try {
      await register({
        username: finalData.username,
        password: finalData.password,
        email: finalData.email || undefined,
        phone: finalData.phone || undefined,
        preferred_language: finalData.preferred_language,
      });

      // Auto-login after registration
      await login({ username: finalData.username, password: finalData.password });

      setDone(true);
      toast.success("Account created! Welcome to CivicPulse.");
      setTimeout(() => navigate({ to: "/citizen/dashboard" as never }), 1400);
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Registration failed. Please try again.";
      toast.error(msg);
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex h-16 items-center justify-between border-b px-5 sm:px-8">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>
      <div className="mx-auto max-w-md px-5 py-10">
        {!done ? (
          <>
            <ProgressBar step={step} total={total} />
            <div
              className="mt-6 rounded-2xl border bg-card p-6 shadow-card animate-[slide-up_0.3s_ease-out]"
              key={step}
            >
              {step === 1 && (
                <Step1
                  formData={formData}
                  onChange={(d) => setFormData((f) => ({ ...f, ...d }))}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <Step2
                  phone={formData.phone}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <Step3
                  formData={formData}
                  onChange={(d) => setFormData((f) => ({ ...f, ...d }))}
                  onFinish={finish}
                  onBack={() => setStep(2)}
                />
              )}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>
          </>
        ) : (
          <SuccessCard />
        )}
      </div>
    </div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-primary">Step {step} of {total}</span>
        <span className="text-muted-foreground">
          {["Personal info", "Verify OTP", "Set password"][step - 1]}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Step1({
  formData,
  onChange,
  onNext,
}: {
  formData: FormState;
  onChange: (d: Partial<FormState>) => void;
  onNext: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold">Tell us about you</h2>
      <p className="-mt-2 text-sm text-muted-foreground">
        We'll use this to keep you updated on your complaints.
      </p>
      <FormInput
        id="r-username"
        label="Username"
        icon={User}
        required
        placeholder="priya_sharma"
        value={formData.username}
        onChange={(e) => onChange({ username: e.target.value })}
      />
      <FormInput
        id="r-phone"
        label="Phone Number"
        icon={Phone}
        required
        placeholder="+91 98765 43210"
        type="tel"
        value={formData.phone}
        onChange={(e) => onChange({ phone: e.target.value })}
      />
      <FormInput
        id="r-email"
        label="Email (optional)"
        icon={Mail}
        placeholder="you@example.com"
        type="email"
        value={formData.email}
        onChange={(e) => onChange({ email: e.target.value })}
      />
      <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-pop hover:opacity-90">
        Continue <ArrowRight className="size-4" />
      </button>
    </form>
  );
}

function Step2({
  phone,
  onNext,
  onBack,
}: {
  phone: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resend, setResend] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resend <= 0) return;
    const t = setTimeout(() => setResend((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resend]);

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  }

  const full = otp.join("").length === 6;

  // OTP is mocked — backend doesn't have OTP yet, skip straight to next step
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (full) onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold">Verify your number</h2>
      <p className="-mt-2 text-sm text-muted-foreground">
        We sent a 6-digit code to <strong>{phone || "+91 XXXXX XXXXX"}</strong>
        <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
          (enter any 6 digits for now)
        </span>
      </p>
      <div className="flex justify-between gap-2">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus();
            }}
            aria-label={`Digit ${i + 1}`}
            className="h-14 w-12 rounded-lg border bg-background text-center text-xl font-bold focus:outline-2 focus:outline-ring"
          />
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        {resend > 0 ? (
          `Resend in ${resend}s`
        ) : (
          <button
            type="button"
            onClick={() => setResend(30)}
            className="font-semibold text-primary hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="h-11 flex-1 rounded-xl border bg-background text-sm font-medium hover:bg-accent"
        >
          Back
        </button>
        <button
          disabled={!full}
          className="inline-flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-pop hover:opacity-90 disabled:opacity-50"
        >
          Verify <ArrowRight className="size-4" />
        </button>
      </div>
    </form>
  );
}

function Step3({
  formData,
  onChange,
  onFinish,
  onBack,
}: {
  formData: FormState;
  onChange: (d: Partial<FormState>) => void;
  onFinish: (data: FormState) => Promise<void>;
  onBack: () => void;
}) {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const score = strength(formData.password);
  const tones = [
    "bg-destructive",
    "bg-[var(--warning)]",
    "bg-[var(--status-in-progress)]",
    "bg-[var(--success)]",
  ];
  const labels = ["Too weak", "Weak", "Good", "Strong"];

  async function go(e: React.FormEvent) {
    e.preventDefault();
    if (formData.password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    await onFinish(formData);
    setLoading(false);
  }

  return (
    <form onSubmit={go} className="space-y-4">
      <h2 className="text-xl font-bold">Secure your account</h2>
      <p className="-mt-2 text-sm text-muted-foreground">Pick a password you'll remember.</p>
      <FormInput
        id="r-pw"
        label="Password"
        icon={ShieldCheck}
        required
        type="password"
        placeholder="At least 8 characters"
        value={formData.password}
        onChange={(e) => onChange({ password: e.target.value })}
      />
      {formData.password && (
        <div>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i < score ? tones[score - 1] : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {labels[Math.max(0, score - 1)]}
          </p>
        </div>
      )}
      <FormInput
        id="r-pw2"
        label="Confirm Password"
        icon={ShieldCheck}
        required
        type="password"
        placeholder="Type again"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <div>
        <label htmlFor="r-lang" className="mb-1.5 block text-sm font-medium">
          Language
        </label>
        <select
          id="r-lang"
          className="h-11 w-full rounded-lg border bg-background px-3 text-sm"
          value={formData.preferred_language}
          onChange={(e) => onChange({ preferred_language: e.target.value })}
        >
          <option>English</option>
          <option>हिंदी (Hindi)</option>
          <option>ગુજરાતી (Gujarati)</option>
          <option>தமிழ் (Tamil)</option>
          <option>తెలుగు (Telugu)</option>
        </select>
      </div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input type="checkbox" required className="mt-0.5 size-4 rounded border" />I agree to the{" "}
        <a href="#" className="text-primary hover:underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="h-11 flex-1 rounded-xl border bg-background text-sm font-medium hover:bg-accent"
        >
          Back
        </button>
        <button
          disabled={loading}
          className="inline-flex h-11 flex-[2] items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-pop hover:opacity-90 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />} Create account
        </button>
      </div>
    </form>
  );
}

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

function FormInput({
  id,
  label,
  icon: Icon,
  ...props
}: {
  id: string;
  label: string;
  icon: React.ElementType;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          {...props}
          className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm focus:outline-2 focus:outline-ring"
        />
      </div>
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="rounded-2xl border bg-card p-10 text-center shadow-card animate-[scale-in_0.3s_ease-out]">
      <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[var(--success)]">
        <CheckCircle2 className="size-8" />
      </div>
      <h2 className="mt-4 text-xl font-bold">Account created! 🎉</h2>
      <p className="mt-1 text-sm text-muted-foreground">Redirecting to your dashboard…</p>
      <Loader2 className="mx-auto mt-4 size-5 animate-spin text-muted-foreground" />
    </div>
  );
}
