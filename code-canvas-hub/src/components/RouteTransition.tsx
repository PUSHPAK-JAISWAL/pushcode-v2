import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import acLoader from "@/assets/ac-loader.png";
import acCharacter from "@/assets/ac-character.jpg";
import acLeap from "@/assets/ac-leap.jpg";
import acRooftop from "@/assets/ac-rooftop.jpg";
import acAnimusGlow from "@/assets/ac-animus-glow.png";
import chibiAltair from "@/assets/chibi-altair.png";
import chibiEzio from "@/assets/chibi-ezio.png";
import chibiConnor from "@/assets/chibi-connor.png";
import chibiEdward from "@/assets/chibi-edward.png";
import { useLoaderPrefs } from "@/lib/loader-prefs";

/* ------------------------------------------------------------------ *
 * Asset preloading — runs once on mount so the very first transition
 * doesn't pop in.
 * ------------------------------------------------------------------ */
const PRELOAD_URLS = [
  acLoader, acCharacter, acLeap, acRooftop, acAnimusGlow,
  chibiAltair, chibiEzio, chibiConnor, chibiEdward,
];
let preloaded = false;
function preloadOnce() {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;
  PRELOAD_URLS.forEach((src) => { const i = new Image(); i.src = src; });
}

/* ------------------------------------------------------------------ */

type Sequence = {
  name: string;
  caption: string;
  glyph: string;
  art: string;
  motion: "dive" | "strike" | "rise" | "cover";
};

const SPLASH_SEQUENCES: Sequence[] = [
  { name: "Air Assassination", caption: "Falling from the rooftops…", glyph: "↧", art: acLeap, motion: "dive" },
  { name: "Cover Assassination", caption: "Emerging from the shadows…", glyph: "▣", art: acCharacter, motion: "cover" },
  { name: "Leap of Faith", caption: "Nothing is true. Everything compiles.", glyph: "✦", art: acLeap, motion: "dive" },
  { name: "Hidden Blade", caption: "A whisper of steel…", glyph: "▾", art: acCharacter, motion: "strike" },
  { name: "Eagle Dive", caption: "Spirits of the sky guide you.", glyph: "✧", art: acRooftop, motion: "rise" },
  { name: "Synchronizing", caption: "Reliving the memory…", glyph: "◈", art: acRooftop, motion: "rise" },
];

const CHIBI_ROSTER = [
  { id: "altair", name: "Altaïr",  src: chibiAltair, line: "Safety and peace…" },
  { id: "ezio",   name: "Ezio",    src: chibiEzio,   line: "Requiescat in pace." },
  { id: "connor", name: "Connor",  src: chibiConnor, line: "I will not stop." },
  { id: "edward", name: "Edward",  src: chibiEdward, line: "May the wind be at your back." },
] as const;

function splashVariants(kind: Sequence["motion"]) {
  switch (kind) {
    case "dive":
      return {
        initial: { y: "-40%", scale: 1.15, opacity: 0, filter: "blur(8px)" },
        animate: { y: "0%", scale: 1, opacity: 1, filter: "blur(0px)" },
        exit:    { y: "30%", scale: 1.05, opacity: 0, filter: "blur(6px)" },
      };
    case "strike":
      return {
        initial: { x: "-25%", scale: 1.1, opacity: 0 },
        animate: { x: "0%", scale: 1, opacity: 1 },
        exit:    { x: "10%", opacity: 0 },
      };
    case "cover":
      return {
        initial: { clipPath: "inset(0 50% 0 50%)", opacity: 0.6 },
        animate: { clipPath: "inset(0 0% 0 0%)", opacity: 1 },
        exit:    { clipPath: "inset(0 50% 0 50%)", opacity: 0 },
      };
    case "rise":
    default:
      return {
        initial: { y: "30%", scale: 1.05, opacity: 0 },
        animate: { y: "0%", scale: 1, opacity: 1 },
        exit:    { y: "-15%", opacity: 0 },
      };
  }
}

export function RouteTransition() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const prefs = useLoaderPrefs();
  const [show, setShow] = useState(false);
  const [seed, setSeed] = useState(0);
  const prevPath = useRef(path);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { preloadOnce(); }, []);

  // Decide which mode actually runs this round
  const variant = prefs.variant === "auto"
    ? (Math.random() < 0.5 ? "chibi" : "splash")
    : prefs.variant;

  const [activeVariant, setActiveVariant] = useState<typeof variant>("splash");

  useEffect(() => {
    if (prevPath.current === path) return;
    prevPath.current = path;
    setSeed((s) => s + 1);
    setActiveVariant(
      prefs.variant === "auto"
        ? (Math.random() < 0.5 ? "chibi" : "splash")
        : prefs.variant,
    );
    setShow(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShow(false), prefs.durationMs);
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [path, prefs.durationMs, prefs.variant]);

  if (prefs.effectiveReducedMotion) {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            key={`rt-min-${seed}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-[#060305]"
            aria-hidden
          >
            <div className="font-mono text-xs uppercase tracking-[0.4em] text-[#d4af37]">
              ◈ Loading
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (activeVariant === "minimal") {
    return <MinimalLoader show={show} seed={seed} durationMs={prefs.durationMs} />;
  }

  if (activeVariant === "chibi") {
    return <ChibiRaceLoader show={show} seed={seed} durationMs={prefs.durationMs} characterPref={prefs.chibiCharacter} />;
  }

  return <SplashLoader show={show} seed={seed} durationMs={prefs.durationMs} />;
}

/* =========================== Variants =========================== */

function MinimalLoader({ show, seed, durationMs }: { show: boolean; seed: number; durationMs: number }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`rt-min-${seed}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-[#060305]/95 backdrop-blur"
          aria-hidden
        >
          <div className="relative h-20 w-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${acAnimusGlow})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                filter: "drop-shadow(0 0 14px rgba(220,38,38,0.7))",
              }}
            />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 180 }}
            transition={{ duration: durationMs / 1000 - 0.2, ease: "easeInOut" }}
            className="absolute bottom-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#dc2626] to-[#d4af37]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChibiRaceLoader({
  show, seed, durationMs, characterPref,
}: { show: boolean; seed: number; durationMs: number; characterPref: string }) {
  // Pick characters: either all 4 in a race, or just the chosen one (still 4 of them).
  const roster = characterPref === "random"
    ? CHIBI_ROSTER
    : CHIBI_ROSTER.filter((c) => c.id === characterPref);
  const running = roster.length > 0 ? roster : CHIBI_ROSTER;
  // For solo character, repeat to make a small parade.
  const lanes = running.length === 1
    ? [running[0], running[0], running[0]]
    : running;

  const featured = lanes[seed % lanes.length];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`rt-chibi-${seed}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-[#060305]"
          aria-hidden
        >
          {/* Rooftop silhouette backdrop */}
          <div className="absolute inset-0 opacity-40">
            <img src={acRooftop} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060305]/70 via-[#060305]/60 to-[#060305]" />
          </div>

          {/* Crimson scan-line wipe */}
          <motion.div
            initial={{ x: "-120%", skewX: -22 }}
            animate={{ x: "120%", skewX: -22 }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
            className="absolute top-1/3 h-[3px] w-[160%] bg-gradient-to-r from-transparent via-[#dc2626] to-transparent shadow-[0_0_40px_8px_rgba(220,38,38,0.6)]"
          />

          {/* Race track with running chibis */}
          <div className="absolute inset-x-0 bottom-24 flex flex-col gap-2">
            {lanes.map((c, idx) => (
              <motion.div
                key={`${c.id}-${idx}`}
                initial={{ x: "-25%" }}
                animate={{ x: "115%" }}
                transition={{
                  duration: durationMs / 1000 + 0.2,
                  ease: "linear",
                  delay: idx * 0.12,
                }}
                className="relative h-20"
              >
                <motion.img
                  src={c.src}
                  alt={c.name}
                  loading="eager"
                  animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute h-20 w-20 drop-shadow-[0_8px_18px_rgba(220,38,38,0.45)]"
                  style={{ filter: idx === seed % lanes.length ? "none" : "brightness(0.7)" }}
                />
                {/* Dust trail */}
                <motion.span
                  initial={{ opacity: 0.6, scaleX: 0.4 }}
                  animate={{ opacity: 0, scaleX: 1.4 }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="absolute left-0 top-16 h-1 w-16 origin-left rounded-full bg-[rgba(212,175,55,0.4)] blur-sm"
                />
              </motion.div>
            ))}
          </div>

          {/* Ground line */}
          <div className="absolute inset-x-0 bottom-24 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.5)] to-transparent" />

          {/* Caption */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="absolute inset-x-0 top-1/4 text-center"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#d4af37]">
              ◈ Synchronizing Memory ◈
            </div>
            <div className="mt-2 font-serif text-xl italic tracking-wide text-foreground">
              {featured.name} is on the rooftops…
            </div>
            <div className="mt-1 font-mono text-[11px] text-muted-foreground">
              “{featured.line}”
            </div>
          </motion.div>

          {/* Sync progress bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 260 }}
            transition={{ duration: durationMs / 1000 - 0.2, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 h-[2px] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#dc2626] to-[#d4af37] shadow-[0_0_12px_rgba(220,38,38,0.7)]"
          />

          {/* Corner ornaments */}
          {(["tl", "tr", "bl", "br"] as const).map((c) => (
            <span
              key={c}
              className={`absolute h-10 w-10 border-[#dc2626]/60 ${
                c === "tl" ? "left-6 top-6 border-l border-t" :
                c === "tr" ? "right-6 top-6 border-r border-t" :
                c === "bl" ? "bottom-6 left-6 border-b border-l" :
                             "bottom-6 right-6 border-b border-r"
              }`}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SplashLoader({ show, seed, durationMs }: { show: boolean; seed: number; durationMs: number }) {
  const seq = SPLASH_SEQUENCES[seed % SPLASH_SEQUENCES.length];
  const variants = splashVariants(seq.motion);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`rt-splash-${seed}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-[#060305]"
          aria-hidden
        >
          <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute inset-0"
          >
            <img src={seq.art} alt="" className="h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060305]/40 via-[#060305]/55 to-[#060305]/90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#060305_85%)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ duration: 0.45, times: [0, 0.3, 1] }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.6),transparent_60%)]"
          />

          <motion.div
            initial={{ x: "-120%", skewX: -22 }}
            animate={{ x: "120%", skewX: -22 }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1], delay: 0.05 }}
            className="absolute top-1/2 h-[3px] w-[160%] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#f5f5f5] to-transparent shadow-[0_0_60px_12px_rgba(220,38,38,0.7)]"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
              className="relative h-32 w-32"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3.2, ease: "linear", repeat: Infinity }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${acLoader})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  filter: "drop-shadow(0 0 18px rgba(212,175,55,0.55))",
                }}
              />
              <motion.svg
                viewBox="0 0 100 100"
                animate={{ rotate: -360 }}
                transition={{ duration: 4.5, ease: "linear", repeat: Infinity }}
                className="absolute inset-3"
              >
                <circle cx="50" cy="50" r="42" fill="none" stroke="#dc2626" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.7" />
              </motion.svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ delay: 0.35, duration: 0.35 }}
              className="mt-6 text-center"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#d4af37]">
                {seq.glyph}&nbsp;&nbsp;Sequence Loaded&nbsp;&nbsp;{seq.glyph}
              </div>
              <div className="mt-2 font-serif text-xl italic tracking-wide text-foreground">
                {seq.name}
              </div>
              <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                {seq.caption}
              </div>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 240 }}
              transition={{ duration: durationMs / 1000 - 0.3, ease: "easeInOut" }}
              className="mt-6 h-[2px] bg-gradient-to-r from-transparent via-[#dc2626] to-[#d4af37] shadow-[0_0_12px_rgba(220,38,38,0.7)]"
            />
          </div>

          {(["tl", "tr", "bl", "br"] as const).map((c) => (
            <span
              key={c}
              className={`absolute h-10 w-10 border-[#dc2626]/60 ${
                c === "tl" ? "left-6 top-6 border-l border-t" :
                c === "tr" ? "right-6 top-6 border-r border-t" :
                c === "bl" ? "bottom-6 left-6 border-b border-l" :
                             "bottom-6 right-6 border-b border-r"
              }`}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
