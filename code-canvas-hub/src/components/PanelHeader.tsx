import { ReactNode } from "react";
import { Minus, Square, ExternalLink, Plus } from "lucide-react";

interface Props {
  title: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
  collapsed: boolean;
  maximized: boolean;
  floating: boolean;
  onToggleCollapse: () => void;
  onToggleMaximize: () => void;
  onToggleFloat: () => void;
}

export function PanelHeader({
  title,
  icon,
  rightSlot,
  collapsed,
  maximized,
  floating,
  onToggleCollapse,
  onToggleMaximize,
  onToggleFloat,
}: Props) {
  return (
    <div className="flex h-8 shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        {rightSlot}
        <button
          onClick={onToggleFloat}
          title={floating ? "Dock" : "Float window"}
          className="rounded p-1 text-muted-foreground hover:bg-[rgba(255,255,255,0.06)] hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onToggleCollapse}
          title={collapsed ? "Expand" : "Minimize"}
          disabled={floating}
          className="rounded p-1 text-muted-foreground hover:bg-[rgba(255,255,255,0.06)] hover:text-foreground disabled:opacity-40"
        >
          {collapsed ? <Plus className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={onToggleMaximize}
          title={maximized ? "Restore" : "Maximize"}
          disabled={floating}
          className="rounded p-1 text-muted-foreground hover:bg-[rgba(255,255,255,0.06)] hover:text-foreground disabled:opacity-40"
        >
          <Square className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
