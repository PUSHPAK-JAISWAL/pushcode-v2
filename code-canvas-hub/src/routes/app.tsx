import { createFileRoute, Outlet, redirect, Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { tokenStore } from "@/lib/api";
import { WorkspaceSidebar } from "@/components/WorkspaceSidebar";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (!tokenStore.get()) throw redirect({ to: "/login" });
  },
  component: AppLayout,
});

function AppLayout() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="font-mono text-sm text-muted-foreground">Loading workspace…</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <WorkspaceSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-11 items-center justify-between border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold tracking-wide">PushCode</span>
            <span className="text-xs text-muted-foreground">/ workspace</span>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <span className="rounded-md border border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.08)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#d4af37]">
                Admin
              </span>
            )}
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <Link
              to="/"
              title="Back to home"
              className="flex h-7 items-center gap-1.5 rounded-md border border-[rgba(255,255,255,0.12)] bg-transparent px-2.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-foreground"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
