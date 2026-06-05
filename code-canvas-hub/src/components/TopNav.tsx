import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { LoaderSettings } from "@/components/LoaderSettings";
import { SymAssassinA } from "@/components/AssassinSymbols";

export function TopNav() {
  const { user, isAdmin, logout } = useAuth();
  return (
    <header className="glass-panel mx-4 mt-4 flex items-center justify-between px-5 py-3">
      <Link to="/" className="flex items-center gap-2">
        <Logo />
        <span className="font-mono text-sm font-semibold tracking-wide">PushCode</span>
      </Link>
      <nav className="flex items-center gap-2">
        <LoaderSettings />
        {user ? (
          <>
            {isAdmin && (
              <span className="rounded-md border border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.08)] px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[#d4af37]">
                Admin
              </span>
            )}
            <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
            <Link to="/app" className="btn-ghost text-sm">Workspace</Link>
            <button className="btn-ghost text-sm" onClick={logout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost text-sm inline-flex items-center gap-1.5">
              <SymAssassinA className="h-3.5 w-3.5" /> Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm">Get started</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="#d4af37" strokeWidth="1.5" />
      <path d="M7 9l3 3-3 3" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 15h4" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
