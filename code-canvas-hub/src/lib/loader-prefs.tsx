import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LoaderVariant = "auto" | "chibi" | "splash" | "minimal";
export type LoaderSpeed = "fast" | "normal" | "slow";

export interface LoaderPrefs {
  variant: LoaderVariant;
  speed: LoaderSpeed;
  reducedMotion: boolean;
  chibiCharacter: "random" | "altair" | "ezio" | "connor" | "edward";
}

const DEFAULTS: LoaderPrefs = {
  variant: "auto",
  speed: "normal",
  reducedMotion: false,
  chibiCharacter: "random",
};

const KEY = "pushcode_loader_prefs";

interface Ctx extends LoaderPrefs {
  durationMs: number;
  systemReducedMotion: boolean;
  effectiveReducedMotion: boolean;
  set: <K extends keyof LoaderPrefs>(k: K, v: LoaderPrefs[K]) => void;
  reset: () => void;
}

const LoaderPrefsContext = createContext<Ctx | null>(null);

export function LoaderPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<LoaderPrefs>(DEFAULTS);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setSystemReducedMotion(e.matches);
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);

  const set = useCallback(<K extends keyof LoaderPrefs>(k: K, v: LoaderPrefs[K]) => {
    setPrefs((p) => {
      const next = { ...p, [k]: v };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setPrefs(DEFAULTS);
    try { localStorage.removeItem(KEY); } catch {}
  }, []);

  const durationMs = useMemo(() => {
    const base = { fast: 900, normal: 1700, slow: 2600 }[prefs.speed];
    return prefs.reducedMotion || systemReducedMotion ? Math.min(450, base) : base;
  }, [prefs.speed, prefs.reducedMotion, systemReducedMotion]);

  const value: Ctx = {
    ...prefs,
    durationMs,
    systemReducedMotion,
    effectiveReducedMotion: prefs.reducedMotion || systemReducedMotion,
    set,
    reset,
  };

  return <LoaderPrefsContext.Provider value={value}>{children}</LoaderPrefsContext.Provider>;
}

export function useLoaderPrefs() {
  const ctx = useContext(LoaderPrefsContext);
  if (!ctx) throw new Error("useLoaderPrefs must be used inside LoaderPrefsProvider");
  return ctx;
}
