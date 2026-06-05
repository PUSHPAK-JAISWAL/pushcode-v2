import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLoaderPrefs, type LoaderVariant, type LoaderSpeed } from "@/lib/loader-prefs";
import { SymAnimus } from "@/components/AssassinSymbols";

/**
 * Compact loader-customization popover. Triggered by the gear in TopNav.
 * Uses a portal + fixed positioning so it can never be clipped or stacked
 * behind another panel.
 */
export function LoaderSettings() {
  const prefs = useLoaderPrefs();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll while open (optional, but keeps focus on the popover)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Animus settings"
        aria-label="Animus settings"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.05)] text-[#d4af37] transition-colors hover:border-[#dc2626] hover:text-[#dc2626]"
      >
        <SymAnimus className="h-4 w-4" />
      </button>

      {mounted && open && createPortal(
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label="Animus settings"
            className="fixed right-6 top-20 z-[9999] w-[300px] rounded-lg border border-[rgba(220,38,38,0.45)] bg-[#0c0608]/98 p-4 shadow-[0_20px_60px_-10px_rgba(220,38,38,0.5)] backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">
                <SymAnimus className="h-3.5 w-3.5" /> Animus Settings
              </div>
              <button
                onClick={() => setOpen(false)}
                className="font-mono text-[10px] text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <Field label="Sequence Style">
              <SegBtns<LoaderVariant>
                value={prefs.variant}
                onChange={(v) => prefs.set("variant", v)}
                options={[
                  { v: "auto", label: "Auto" },
                  { v: "chibi", label: "Chibi" },
                  { v: "splash", label: "Splash" },
                  { v: "minimal", label: "Sigil" },
                ]}
              />
            </Field>

            <Field label="Timing">
              <SegBtns<LoaderSpeed>
                value={prefs.speed}
                onChange={(v) => prefs.set("speed", v)}
                options={[
                  { v: "fast", label: "Fast" },
                  { v: "normal", label: "Normal" },
                  { v: "slow", label: "Slow" },
                ]}
              />
            </Field>

            <Field label="Chibi Hero">
              <SegBtns
                value={prefs.chibiCharacter}
                onChange={(v) => prefs.set("chibiCharacter", v as any)}
                options={[
                  { v: "random", label: "All" },
                  { v: "altair", label: "Altaïr" },
                  { v: "ezio", label: "Ezio" },
                  { v: "connor", label: "Connor" },
                  { v: "edward", label: "Edward" },
                ]}
              />
            </Field>

            <label className="mt-3 flex cursor-pointer items-center justify-between rounded-md border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-xs">
              <span>
                Reduced motion
                {prefs.systemReducedMotion && (
                  <span className="ml-2 font-mono text-[10px] text-[#d4af37]">(system)</span>
                )}
              </span>
              <input
                type="checkbox"
                checked={prefs.reducedMotion}
                onChange={(e) => prefs.set("reducedMotion", e.target.checked)}
                className="accent-[#dc2626]"
              />
            </label>

            <button
              onClick={prefs.reset}
              className="mt-3 w-full rounded-md border border-[rgba(255,255,255,0.08)] py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:border-[#dc2626] hover:text-[#dc2626]"
            >
              Reset to defaults
            </button>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function SegBtns<T extends string>({
  value, onChange, options,
}: { value: T; onChange: (v: T) => void; options: { v: T; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={`rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
            value === o.v
              ? "border-[#dc2626] bg-[rgba(220,38,38,0.18)] text-foreground"
              : "border-[rgba(255,255,255,0.08)] text-muted-foreground hover:border-[#d4af37] hover:text-[#d4af37]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
