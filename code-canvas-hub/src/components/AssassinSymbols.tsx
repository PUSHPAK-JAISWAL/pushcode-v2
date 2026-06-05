/**
 * Inline AC-inspired symbol set. Tiny, pure-SVG, currentColor friendly.
 * Use to garnish buttons and headings instead of generic icons.
 */
import type { SVGProps } from "react";

type S = SVGProps<SVGSVGElement>;

export function SymAssassinA(props: S) {
  // Stylized "A" inside a ring — the Brotherhood sigil
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" opacity="0.6" />
      <path d="M7 18 12 5l5 13" />
      <path d="M9 14h6" />
    </svg>
  );
}

export function SymHiddenBlade(props: S) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 13 L18 8 L21 11 L6 16 Z" />
      <path d="M6 16 L7 19" />
      <path d="M18 8 L17 5" />
    </svg>
  );
}

export function SymEagle(props: S) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 14 L12 9 L22 14" />
      <path d="M6 13 L10 16 L12 14 L14 16 L18 13" />
      <path d="M12 9 V6" />
    </svg>
  );
}

export function SymAnimus(props: S) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="10" opacity="0.4" />
      <circle cx="12" cy="12" r="6" opacity="0.7" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22" />
    </svg>
  );
}

export function SymCreed(props: S) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2 L20 6 V12 C20 17 16 21 12 22 C8 21 4 17 4 12 V6 Z" />
      <path d="M9 12 L11 14 L15 10" />
    </svg>
  );
}

export function SymLeap(props: S) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21 L9 15 L13 19 L21 11" />
      <path d="M15 11 H21 V17" />
    </svg>
  );
}
