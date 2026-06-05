import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { tokenStore } from "@/lib/api";
import { Logo } from "@/components/TopNav";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    if (tokenStore.get()) throw redirect({ to: "/app" });
  },
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await register(email, password);
      navigate({ to: "/app" });
    } catch (e: any) {
      setErr(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <Logo size={28} />
        <span className="font-mono text-base font-semibold tracking-wide">PushCode</span>
      </Link>

      <div className="glass-strong w-full max-w-md p-8">
        <h1 className="text-center text-2xl font-semibold">Create Your Account</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Join PushCode and start coding</p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Email</label>
            <input className="glass-input mt-1" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} autoComplete="email"
              placeholder="Enter your email" />
          </div>
          <div>
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Password</label>
            <input className="glass-input mt-1" type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"
              placeholder="Create a password (min 6 chars)" />
          </div>
          {err && <p className="text-sm text-[#F14C4C]">{err}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-[#d4af37] hover:underline">Sign In</Link>
        </p>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        © 2026 PushCode. All rights reserved.
      </p>
    </div>
  );
}
