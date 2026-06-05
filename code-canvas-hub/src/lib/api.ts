// PushCode API client — talks to 3 separate microservices.
//
//   security-service   :8082  → /auth/*, /admin/users
//   agentic-service    :8081  → /api/agent/*
//   execution-service  :8080  → /api/execute, ws://…/terminal
//
// Override any of these via Vite env vars (VITE_SECURITY_BASE, etc).

const env = (import.meta as any).env ?? {};

export const SECURITY_BASE: string =
  env.VITE_SECURITY_BASE ?? "http://localhost:8082";
export const AGENT_BASE: string =
  env.VITE_AGENT_BASE ?? "http://localhost:8081";
export const EXECUTION_BASE: string =
  env.VITE_EXECUTION_BASE ?? "http://localhost:8080";
export const WS_BASE: string =
  env.VITE_WS_BASE ?? EXECUTION_BASE.replace(/^http/, "ws");

// Back-compat: some older code may still import API_BASE.
export const API_BASE = SECURITY_BASE;

const TOKEN_KEY = "pushcode_token";

export const tokenStore = {
  get: () =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(
  base: string,
  path: string,
  opts: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((opts.headers as Record<string, string>) ?? {}),
  };
  if (opts.auth !== false) {
    const t = tokenStore.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${base}${path}`, { ...opts, headers });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      msg = body.error || body.message || msg;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type AuthResponse = { token: string };
export type UserDto = { id: string; email: string; roles: string[] };
export type MeResponse = { user: UserDto; isAdmin: boolean };
export type AnalysisResponse = {
  language?: string;
  explanation?: string;
  optimization?: string;
  sessionId?: string;
};

export const api = {
  // ---- security-service (8082) ----
  register: (email: string, password: string) =>
    request<UserDto>(SECURITY_BASE, "/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<AuthResponse>(SECURITY_BASE, "/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<MeResponse>(SECURITY_BASE, "/auth/me"),
  listUsers: () => request<any[]>(SECURITY_BASE, "/admin/users"),
  deleteUser: (id: string) =>
    request<void>(SECURITY_BASE, `/admin/users/${id}`, { method: "DELETE" }),
  updateUser: (id: string, user: Record<string, any>) =>
    request<any>(SECURITY_BASE, `/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    }),

  // ---- agentic-service (8081) ----
  // Agent internally calls execution-service and returns a sessionId
  // we then plug into the websocket terminal.
  agentProcess: (code: string) =>
    request<AnalysisResponse>(AGENT_BASE, "/api/agent/process", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  // ---- execution-service (8080) ----
  // Direct execution path (used by the Run button as a fallback / shortcut).
  execute: (language: string, code: string) =>
    request<{ sessionId: string }>(EXECUTION_BASE, "/api/execute", {
      method: "POST",
      body: JSON.stringify({ language, code }),
    }),
};
