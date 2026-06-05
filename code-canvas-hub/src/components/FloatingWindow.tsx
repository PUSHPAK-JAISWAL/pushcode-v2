import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { PanelBottomClose, X } from "lucide-react";

interface Props {
  title: string;
  icon?: ReactNode;
  onDock: () => void;
  children: ReactNode;
  initial?: { x: number; y: number; w: number; h: number };
}

export function FloatingWindow({ title, icon, onDock, children, initial }: Props) {
  const [pos, setPos] = useState(() => initial ?? { x: 120, y: 120, w: 720, h: 420 });
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const resizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const d = dragRef.current;
        setPos((p) => ({ ...p, x: d.px + (e.clientX - d.x), y: Math.max(0, d.py + (e.clientY - d.y)) }));
      } else if (resizeRef.current) {
        const r = resizeRef.current;
        setPos((p) => ({
          ...p,
          w: Math.max(280, r.w + (e.clientX - r.x)),
          h: Math.max(160, r.h + (e.clientY - r.y)),
        }));
      }
    };
    const onUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    document.body.style.userSelect = "none";
  };
  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizeRef.current = { x: e.clientX, y: e.clientY, w: pos.w, h: pos.h };
    document.body.style.userSelect = "none";
  };

  return createPortal(
    <div
      className="glass-strong fixed z-50 flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
      style={{ left: pos.x, top: pos.y, width: pos.w, height: pos.h }}
    >
      <header
        onMouseDown={startDrag}
        className="flex h-9 shrink-0 cursor-move select-none items-center justify-between border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {title} <span className="ml-1 text-[9px] text-[#d4af37]">floating</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onDock}
            title="Dock back"
            className="rounded p-1 text-muted-foreground hover:bg-[rgba(255,255,255,0.06)] hover:text-foreground"
          >
            <PanelBottomClose className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDock}
            title="Close"
            className="rounded p-1 text-muted-foreground hover:bg-[rgba(255,255,255,0.06)] hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      <div
        onMouseDown={startResize}
        className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
        style={{
          background:
            "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.25) 60%, transparent 60%, transparent 70%, rgba(255,255,255,0.25) 70%, rgba(255,255,255,0.25) 80%, transparent 80%)",
        }}
      />
    </div>,
    document.body,
  );
}
