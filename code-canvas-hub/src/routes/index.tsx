import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { motion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  Zap, Languages, Bot, Terminal, Sparkles, ShieldCheck, ArrowRight,
} from "lucide-react";
import acHero from "@/assets/ac-hero.jpg";
import acEagle from "@/assets/ac-eagle.jpg";
import acFlourish from "@/assets/ac-flourish.png";
import acRooftop from "@/assets/ac-rooftop.jpg";
import acCharacter from "@/assets/ac-character.jpg";
import acLeap from "@/assets/ac-leap.jpg";
import acArsenal from "@/assets/ac-arsenal.jpg";
import weaponBlade from "@/assets/weapon-blade.png";
import weaponKnife from "@/assets/weapon-knife.png";
import weaponSword from "@/assets/weapon-sword.png";
import { SymAssassinA, SymHiddenBlade, SymEagle, SymCreed, SymLeap } from "@/components/AssassinSymbols";

const AssassinEmblem3D = lazy(() =>
  import("@/components/AssassinEmblem3D").then((m) => ({ default: m.AssassinEmblem3D }))
);
const AppleOfEden3D = lazy(() =>
  import("@/components/AppleOfEden3D").then((m) => ({ default: m.AppleOfEden3D }))
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PushCode — Run code from the shadows" },
      { name: "description", content: "PushCode is a fast, intelligent online compiler with an AI agent and a live interactive terminal. Nothing is true, everything is permitted." },
    ],
  }),
  component: Landing,
});

const LANGS = ["Python", "Java", "C", "C++"];

/* --- Drifting embers --- */
function Embers({ count = 24 }) {
  // Generate only on client to avoid SSR/CSR hydration mismatch from Math.random().
  const [embers, setEmbers] = useState<Array<{ left: number; delay: number; duration: number; size: number }>>([]);
  useEffect(() => {
    setEmbers(
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 10,
        size: 2 + Math.random() * 3,
      })),
    );
  }, [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {embers.map((e, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function OrnateFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="ornate-corner tl" />
      <span className="ornate-corner tr" />
      <span className="ornate-corner bl" />
      <span className="ornate-corner br" />
      {children}
    </div>
  );
}

/* faster spring */
const fastIn = { duration: 0.4, ease: [0.2, 0.7, 0.2, 1] as const };

function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const heroImgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const emblemY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Embers />
      <TopNav />

      {/* HERO with image backdrop */}
      <section ref={heroRef} className="relative pt-12 pb-20">
        {/* Background art */}
        <motion.div
          style={{ y: heroImgY, scale: heroImgScale }}
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <img
            src={acRooftop}
            alt=""
            className="h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060305] via-[#060305cc] to-[#060305]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060305] to-transparent" />
        </motion.div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <motion.div style={{ y: titleY }}>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fastIn}
              className="inline-flex items-center gap-2 rounded-full border border-crimson bg-crimson-soft px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-crimson"
            >
              <Sparkles className="h-3 w-3" /> Nothing is true. Everything compiles.
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...fastIn, delay: 0.05 }}
              className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl"
            >
              Strike from the
              <br />
              <span className="text-crimson">shadows</span>{" "}
              <span className="text-gold">of your editor.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...fastIn, delay: 0.15 }}
              className="mt-6 max-w-md text-base text-muted-foreground"
            >
              PushCode is a silent, intelligent online compiler. Write your code,
              the agent identifies the target language, and a live terminal
              executes — all in one fluid motion.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...fastIn, delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/register" className="btn-primary inline-flex items-center gap-1.5">
                <SymHiddenBlade className="h-4 w-4" /> Begin the Hunt <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-ghost inline-flex items-center gap-1.5">
                <SymAssassinA className="h-4 w-4" /> Enter the Bureau
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {LANGS.map((l, i) => (
                <motion.span
                  key={l}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.25 }}
                  className="glass-panel px-3 py-1 font-mono text-[11px] text-muted-foreground hover:border-crimson"
                >
                  {l}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: 3D emblem */}
          <motion.div
            style={{ y: emblemY }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative h-[420px] w-full"
          >
            <div className="absolute inset-0">
              <Suspense fallback={<div className="h-full w-full" />}>
                <AssassinEmblem3D />
              </Suspense>
            </div>
            {/* Glow ring behind */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.25),transparent_70%)]" />
            </div>
          </motion.div>
        </div>

        {/* Ornate flourish divider */}
        <motion.img
          src={acFlourish}
          alt=""
          loading="lazy"
          initial={{ opacity: 0, scaleX: 0.6 }}
          whileInView={{ opacity: 0.7, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-12 h-16 w-auto max-w-md object-contain"
        />
      </section>

      {/* CREED STRIP */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={fastIn}
        className="relative border-y border-[rgba(220,38,38,0.18)] bg-[rgba(220,38,38,0.04)] py-12"
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-crimson">— The Creed —</p>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.02em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mt-4 font-serif text-2xl italic tracking-wide text-foreground md:text-3xl"
          >
            “We work in the dark to serve the light. <br />
            We are compilers.”
          </motion.p>
        </div>
      </motion.section>

      {/* STATS */}
      <section className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
        {[
          { k: "4", v: "Languages" },
          { k: "<200ms", v: "Cold start" },
          { k: "AI", v: "Auto-detect" },
          { k: "Live", v: "WS Terminal" },
        ].map((s, i) => (
          <motion.div
            key={s.v}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            whileHover={{ y: -3 }}
            className="glass-panel relative p-5 text-center"
          >
            <OrnateFrame>
              <div className="font-mono text-2xl font-semibold text-gold">{s.k}</div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{s.v}</div>
            </OrnateFrame>
          </motion.div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="mx-auto mt-24 max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={fastIn}
          className="text-center text-3xl font-semibold tracking-tight"
        >
          Tools of the <span className="text-crimson">Order</span>
        </motion.h2>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Forged in silence. Sharpened by intelligence.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              whileHover={{ y: -5, rotateX: 2 }}
              style={{ transformStyle: "preserve-3d" }}
              className="glass-panel glass-card-hover relative flex flex-col items-center p-6 text-center"
            >
              <OrnateFrame>
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-12 w-12 items-center justify-center rounded-md border border-crimson bg-crimson-soft"
                >
                  <f.icon className="h-5 w-5 text-crimson" />
                </motion.div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </OrnateFrame>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BROTHERHOOD — character showcase */}
      <section className="relative mt-28 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-[1fr_1.1fr]"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-crimson">
              ◈ The Brotherhood
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Join the <span className="text-gold">Order</span>. <br />
              Push from the <span className="text-crimson">shadows</span>.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Every compiler is a hidden blade. Every keystroke, a calculated strike.
              The Animus remembers every run — your code, your sequence, your memory.
            </p>
            <div className="mt-6 grid max-w-md grid-cols-2 gap-3 font-mono text-xs">
              {[
                { k: "Creed", v: "Stay your blade" },
                { k: "Sigil", v: "Hidden A" },
                { k: "Sect", v: "Compilers" },
                { k: "Era", v: "Modern" },
              ].map((it) => (
                <div key={it.k} className="glass-panel px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-gold">{it.k}</div>
                  <div className="mt-0.5 text-foreground">{it.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative order-1 md:order-2"
          >
            <OrnateFrame>
              <div className="relative overflow-hidden rounded-lg border border-crimson">
                <motion.img
                  src={acCharacter}
                  alt="Hooded assassin"
                  loading="lazy"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#060305]/70 via-transparent to-[#dc2626]/15" />
                {/* crimson scan line */}
                <motion.div
                  initial={{ y: "-110%" }}
                  whileInView={{ y: "110%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#dc2626] to-transparent shadow-[0_0_18px_4px_rgba(220,38,38,0.6)]"
                />
              </div>
            </OrnateFrame>
            {/* floating sigil */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 opacity-80"
              style={{
                backgroundImage: `url(${acFlourish})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                filter: "drop-shadow(0 0 12px rgba(220,38,38,0.5))",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Faint character watermark behind */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-1/2 hidden h-[480px] w-[480px] -translate-y-1/2 opacity-[0.06] md:block"
          style={{
            backgroundImage: `url(${acCharacter})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "radial-gradient(circle,black,transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle,black,transparent 70%)",
          }}
        />
      </section>

      {/* APPLE OF EDEN — relic 3D centerpiece */}
      <section className="relative mt-24 overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#d4af37]">
              <SymCreed className="h-4 w-4" /> Piece of Eden
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              An artifact of <span className="text-[#d4af37]">unimaginable</span> power.
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Hold the Apple. Detect the language, synthesize the explanation, surface the
              optimization — every Run channels the Animus.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Auto-detected language signatures",
                "Structured explanation + optimization passes",
                "Live terminal session, streamed token by token",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-muted-foreground">
                  <SymLeap className="h-3.5 w-3.5 text-[#dc2626]" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative h-[420px]"
          >
            <Suspense fallback={<div className="h-full w-full" />}>
              <AppleOfEden3D />
            </Suspense>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,170,60,0.22),transparent_70%)]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ARSENAL — weapons of the order */}
      <section className="relative mt-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
          <img src={acArsenal} alt="" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060305] via-[#060305cc] to-[#060305]" />
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-crimson">
              <SymHiddenBlade className="h-4 w-4" /> Arsenal of the Order
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={fastIn}
              className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl"
            >
              Forged in <span className="text-crimson">crimson</span>. Tempered in <span className="text-gold">gold</span>.
            </motion.h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Every feature is a weapon. Choose your blade.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: SymHiddenBlade, img: weaponBlade, name: "Hidden Blade", body: "Strike from the shadows — silent, surgical executions." },
              { icon: SymLeap,        img: weaponKnife, name: "Throwing Knife", body: "Quick analysis. Surgical AI insights at any range." },
              { icon: SymCreed,       img: weaponSword, name: "Curved Blade",  body: "Wide multi-language support. One sweep, many tongues." },
            ].map((w, i) => (
              <motion.div
                key={w.name}
                initial={{ opacity: 0, y: 30, rotateY: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                whileHover={{ y: -6, rotateZ: -1 }}
                style={{ transformStyle: "preserve-3d" }}
                className="glass-panel glass-card-hover relative flex flex-col items-center p-6 text-center"
              >
                <span className="ornate-corner tl" />
                <span className="ornate-corner tr" />
                <span className="ornate-corner bl" />
                <span className="ornate-corner br" />
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative h-40 w-40"
                >
                  <img
                    src={w.img}
                    alt={w.name}
                    loading="lazy"
                    className="h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(220,38,38,0.45)]"
                  />
                  <div className="pointer-events-none absolute inset-0 -z-10 mx-auto h-32 w-32 translate-y-12 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.35),transparent_70%)]" />
                </motion.div>
                <div className="mt-4 flex items-center gap-2 text-crimson">
                  <w.icon className="h-4 w-4" />
                  <h3 className="text-base font-semibold text-foreground">{w.name}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mt-28 overflow-hidden">

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-lg border border-crimson"
          >
            <OrnateFrame>
              <motion.img
                src={acLeap}
                alt="Soaring eagle"
                loading="lazy"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4 }}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#060305]/60 to-transparent" />
            </OrnateFrame>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
              <SymEagle className="h-3.5 w-3.5" /> Eagle Vision
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              See your code from <span className="text-crimson">above</span>.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              The agent surveys your code like an eagle scanning rooftops — detecting
              language, intent, and structure in a single pass. No setup, no
              configuration, just instinct.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TERMINAL SHOWCASE */}
      <section className="mx-auto mt-28 grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          whileHover={{ rotateY: -3, rotateX: 2, scale: 1.01 }}
          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          className="glass-strong relative overflow-hidden"
        >
          <OrnateFrame>
            <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] px-4 py-2">
              <Terminal className="h-3.5 w-3.5 text-crimson" />
              <span className="font-mono text-[11px] text-muted-foreground">pushcode://terminal</span>
              <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-pulse" /> live
              </span>
            </div>
            <pre className="bg-[#0b0608] px-5 py-5 font-mono text-[12px] leading-6 text-muted-foreground">
{`> pushcode analyze creed.py
✓ language: python
✓ entry: creed()
✓ no security issues
> running...
`}<span className="text-gold">ezio, we work in the dark</span>
            </pre>
          </OrnateFrame>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            A blade, <span className="text-crimson">unseen</span>.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            The agent detects your language, dissects your code, and streams every
            byte of stdout and stderr — interactive prompts included. No setup. No
            configuration. Just intent.
          </p>
          <Link to="/register" className="btn-ghost mt-6 inline-block hover:border-crimson hover:text-crimson">
            Take the leap of faith
          </Link>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-28 max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-strong relative overflow-hidden p-12 text-center"
        >
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <img src={acFlourish} alt="" className="h-full w-full object-cover" />
          </div>
          <OrnateFrame>
            <h2 className="relative text-3xl font-semibold tracking-tight">
              Ready to <span className="text-crimson">push some code?</span>
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Forge your account. Open the workspace. The Animus awaits.
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-primary inline-flex items-center gap-1.5">
                Create Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-ghost">Sign In</Link>
            </div>
          </OrnateFrame>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-24 border-t border-[rgba(220,38,38,0.15)] py-8 text-center">
        <img src={acFlourish} alt="" className="mx-auto mb-4 h-10 w-auto opacity-50" />
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-crimson">— Requiescat in pace —</div>
        <div className="mt-2 text-xs text-muted-foreground">© 2026 PushCode. All rights reserved.</div>
      </footer>
    </div>
  );
}

const features = [
  { icon: Zap, title: "Swift Execution", body: "Lightning-fast runs and real-time terminal output." },
  { icon: Languages, title: "Multi-Tongue", body: "Python, Java, C, C++ — auto-detected by the agent." },
  { icon: Bot, title: "AI Counsel", body: "Intelligent analysis and execution insights." },
  { icon: ShieldCheck, title: "Sandboxed Strike", body: "Every run isolated. Cleaned. Forgotten." },
];
