import { Link, useRouterState } from "@tanstack/react-router";
import { Code2, Users, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/TopNav";

export function WorkspaceSidebar() {
  const { isAdmin, logout } = useAuth();
  const path = useRouterState({ select: (r) => r.location.pathname });

  const items = [
    { to: "/app", icon: Code2, label: "Editor", exact: true },
  ];
  if (isAdmin) items.push({ to: "/app/users", icon: Users, label: "Users", exact: false } as any);

  return (
    <aside className="flex h-full w-[56px] flex-col items-center justify-between border-r border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-3">
      <div className="flex flex-col items-center gap-1">
        <Link to="/" className="mb-3" title="Home">
          <Logo size={24} />
        </Link>
        {items.map((it: any) => {
          const active = it.exact ? path === it.to : path.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              title={it.label}
              className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
                active
                  ? "bg-[rgba(212,175,55,0.15)] text-[#d4af37]"
                  : "text-muted-foreground hover:bg-[rgba(255,255,255,0.05)] hover:text-foreground"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </Link>
          );
        })}
      </div>
      <button
        onClick={logout}
        title="Sign out"
        className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-[rgba(255,255,255,0.05)] hover:text-foreground"
      >
        <LogOut className="h-[18px] w-[18px]" />
      </button>
    </aside>
  );
}
