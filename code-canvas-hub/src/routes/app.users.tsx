import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Trash2, ShieldCheck, ShieldOff } from "lucide-react";

export const Route = createFileRoute("/app/users")({
  component: UsersPage,
});

const ADMIN_ROLE = "ROLE_ADMIN";

// Spring + MongoDB can serialize ObjectId as a string, as { $oid }, or as a
// rich { timestamp, date, ... } object. Reach into all common shapes.
function extractId(u: any): string {
  const raw = u?.id ?? u?._id;
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object") {
    if (typeof raw.$oid === "string") return raw.$oid;
    if (typeof raw.oid === "string") return raw.oid;
    if (typeof raw.hex === "string") return raw.hex;
    if (typeof raw.toHexString === "function") return raw.toHexString();
  }
  return "";
}

function UsersPage() {
  const { isAdmin, loading, user: me } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/app" });
  }, [loading, isAdmin, navigate]);

  const load = async () => {
    try {
      const list = await api.listUsers();
      setUsers(list);
    } catch (e: any) {
      setErr(e.message || "Failed to load users");
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    setBusy(id);
    try { await api.deleteUser(id); await load(); }
    catch (e: any) { setErr(e.message); }
    finally { setBusy(null); }
  };

  const toggleAdmin = async (u: any) => {
    const id = extractId(u);
    if (!id) {
      setErr("Could not read user id — backend should serialize ObjectId as a string.");
      return;
    }
    const current: string[] = u.roles ?? [];
    const hasAdmin = current.includes(ADMIN_ROLE);
    const nextRoles = hasAdmin
      ? current.filter((r) => r !== ADMIN_ROLE)
      : Array.from(new Set([...current, ADMIN_ROLE]));
    // Send the full user object back so the backend update method preserves all fields.
    const payload = { ...u, roles: nextRoles };
    delete payload.password; // never round-trip the password
    setBusy(id);
    try { await api.updateUser(id, payload); await load(); }
    catch (e: any) { setErr(e.message); }
    finally { setBusy(null); }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Admin-only — manage PushCode accounts and roles.</p>

        {err && <p className="mt-6 text-sm text-[#F14C4C]">{err}</p>}

        <div className="glass-panel mt-6 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[rgba(255,255,255,0.03)] text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!users && !err && (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {users?.map((u: any, idx: number) => {
                const id = extractId(u);
                const rowKey = id || u.email || `row-${idx}`;
                const roles: string[] = u.roles ?? [];
                const hasAdmin = roles.includes(ADMIN_ROLE);
                const isSelf = me?.email === u.email;
                return (
                  <tr key={rowKey} className="border-t border-[rgba(255,255,255,0.06)]">
                    <td className="px-4 py-3">
                      {u.email}
                      {isSelf && <span className="ml-2 font-mono text-[10px] text-muted-foreground">(you)</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {roles.map((r) => (
                          <span key={r} className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase ${
                            r === ADMIN_ROLE
                              ? "border-[rgba(220,38,38,0.5)] bg-[rgba(220,38,38,0.08)] text-[#ef4444]"
                              : "border-[rgba(255,255,255,0.12)]"
                          }`}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          disabled={busy === id || isSelf}
                          onClick={() => toggleAdmin(u)}
                          className="inline-flex items-center gap-1 rounded-md border border-[rgba(212,175,55,0.4)] px-2 py-1 text-xs text-[#d4af37] hover:bg-[rgba(212,175,55,0.08)] disabled:opacity-40"
                          title={isSelf ? "Can't change your own role" : hasAdmin ? "Demote" : "Promote to admin"}
                        >
                          {hasAdmin
                            ? (<><ShieldOff className="h-3 w-3" /> Demote</>)
                            : (<><ShieldCheck className="h-3 w-3" /> Promote</>)}
                        </button>
                        <button
                          disabled={busy === id || isSelf}
                          onClick={() => onDelete(id)}
                          className="inline-flex items-center gap-1 rounded-md border border-[rgba(241,76,76,0.4)] px-2 py-1 text-xs text-[#F14C4C] hover:bg-[rgba(241,76,76,0.08)] disabled:opacity-40"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
