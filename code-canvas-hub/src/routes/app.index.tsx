import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Sparkles, TerminalSquare, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
  type PanelImperativeHandle as ImperativePanelHandle,
} from "react-resizable-panels";
import { LiveTerminal, type TerminalHandle } from "@/components/LiveTerminal";
import { FloatingWindow } from "@/components/FloatingWindow";
import { PanelHeader } from "@/components/PanelHeader";
import { api, type AnalysisResponse } from "@/lib/api";

export const Route = createFileRoute("/app/")({
  component: WorkspacePage,
});

const STARTER = `# Welcome to PushCode
# Just hit Run — the agent will detect the language and start a session.

def filter_even(nums):
    return [n for n in nums if n % 2 == 0]

if __name__ == "__main__":
    data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    name = input("what's your name? ")
    print(f"hi {name} 👋")
    print("evens:", filter_even(data))
`;

interface AiEntry {
  at: number;
  response: AnalysisResponse;
}

function WorkspacePage() {
  const [code, setCode] = useState(STARTER);
  const [detectedLang, setDetectedLang] = useState<string>("python");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "CONNECTED" | "DISCONNECTED">("IDLE");
  const [aiHistory, setAiHistory] = useState<AiEntry[]>([]);
  const termRef = useRef<TerminalHandle>(null);

  // panel refs for collapse / maximize
  const termPanelRef = useRef<ImperativePanelHandle>(null);
  const aiPanelRef = useRef<ImperativePanelHandle>(null);

  const [termCollapsed, setTermCollapsed] = useState(false);
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [termMax, setTermMax] = useState(false);
  const [aiMax, setAiMax] = useState(false);
  const [termFloat, setTermFloat] = useState(false);
  const [aiFloat, setAiFloat] = useState(false);

  // Stable hosts so LiveTerminal never unmounts while docking / floating.
  const termHost = useMemo(
    () => (typeof document === "undefined" ? null : document.createElement("div")),
    [],
  );
  useEffect(() => {
    if (termHost) {
      termHost.style.height = "100%";
      termHost.style.width = "100%";
    }
  }, [termHost]);

  const attachTerm = (el: HTMLDivElement | null) => {
    if (!el || !termHost) return;
    if (termHost.parentElement !== el) el.appendChild(termHost);
  };

  const onRun = async () => {
    if (!termRef.current) return;
    setRunning(true);
    termRef.current.clear();
    termRef.current.writeln("\x1b[33m[*] Sending to agent…\x1b[0m");
    try {
      const analysis = await api.agentProcess(code);
      setAiHistory((h) => [{ at: Date.now(), response: analysis }, ...h].slice(0, 20));
      if (analysis.language) setDetectedLang(analysis.language.toLowerCase());
      if (analysis.explanation) {
        termRef.current.writeln(
          `\x1b[36m[ai]\x1b[0m ${analysis.explanation.split("\n")[0].slice(0, 200)}…`,
        );
      }
      if (!analysis.sessionId) {
        termRef.current.writeln("\x1b[31m[!] agent returned no sessionId\x1b[0m");
        return;
      }
      termRef.current.writeln(`\x1b[90m[*] session ${analysis.sessionId}\x1b[0m`);
      termRef.current.connect(analysis.sessionId);
    } catch (err: any) {
      termRef.current.writeln("\x1b[31m[!] " + (err.message || "request failed") + "\x1b[0m");
    } finally {
      setRunning(false);
    }
  };

  // ---- panel control helpers ----
  const toggleCollapse = (
    ref: React.RefObject<ImperativePanelHandle | null>,
    collapsed: boolean,
    setCollapsed: (b: boolean) => void,
  ) => {
    const p = ref.current;
    if (!p) return;
    if (collapsed) {
      p.expand();
      setCollapsed(false);
    } else {
      p.collapse();
      setCollapsed(true);
    }
  };

  const toggleMax = (
    ref: React.RefObject<ImperativePanelHandle | null>,
    max: boolean,
    setMax: (b: boolean) => void,
    defaultSize: number,
  ) => {
    const p = ref.current;
    if (!p) return;
    if (max) {
      p.resize(defaultSize);
      setMax(false);
    } else {
      p.resize(90);
      setMax(true);
    }
  };

  const monacoLang = (() => {
    const l = detectedLang.toLowerCase();
    if (["py", "python"].includes(l)) return "python";
    if (["js", "javascript"].includes(l)) return "javascript";
    if (["ts", "typescript"].includes(l)) return "typescript";
    return l;
  })();

  const statusColor =
    status === "CONNECTED" ? "#23D18B" : status === "DISCONNECTED" ? "#F14C4C" : "#888";

  // Terminal body — used in both docked & floating slots (the host moves, not the React tree).
  const terminalBody = (
    <div className="flex h-full flex-col">
      <div className="flex h-8 shrink-0 items-center justify-end gap-2 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3">
        <span className="h-2 w-2 rounded-full" style={{ background: statusColor }} />
        <span className="font-mono text-[11px] text-muted-foreground">{status}</span>
      </div>
      <div ref={attachTerm} className="min-h-0 flex-1" />
    </div>
  );

  const aiBody = (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {aiHistory.length === 0 ? (
          <p className="px-2 pt-4 text-xs text-muted-foreground">
            Hit <span className="font-mono text-[#d4af37]">Run</span> — the agent's analysis will land here.
          </p>
        ) : (
          aiHistory.map((e) => <AiCard key={e.at} entry={e} />)
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Workspace toolbar — no language dropdown, no Ask AI; just Run */}
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3">
        <span className="rounded-md border border-[rgba(255,255,255,0.12)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          detected: <span className="text-[#d4af37]">{detectedLang}</span>
        </span>
        <div className="flex-1" />
        <button
          onClick={onRun}
          disabled={running}
          className="btn-primary flex items-center gap-1.5 text-xs"
        >
          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          Run
        </button>
      </div>

      {/* Main resizable layout */}
      <div className="min-h-0 flex-1">
        <PanelGroup orientation="horizontal">
          <Panel defaultSize={62} minSize={25}>
            <PanelGroup orientation="vertical">
              {/* Editor */}
              <Panel defaultSize={60} minSize={20}>
                <div className="h-full overflow-hidden">
                  <Editor
                    height="100%"
                    language={monacoLang}
                    value={code}
                    onChange={(v) => setCode(v ?? "")}
                    theme="vs-dark"
                    options={{
                      fontFamily: '"Fira Code", ui-monospace, monospace',
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      padding: { top: 10 },
                    }}
                  />
                </div>
              </Panel>

              <PanelResizeHandle className="h-px bg-[rgba(255,255,255,0.08)] hover:bg-[#d4af37]/40 data-[resize-handle-state=drag]:bg-[#d4af37]" />

              {/* Terminal panel — docked target */}
              <Panel
                panelRef={termPanelRef}
                defaultSize={40}
                minSize={6}
                collapsible
                collapsedSize={6}
              >
                <div className="flex h-full flex-col">
                  <PanelHeader
                    title="Terminal"
                    icon={<TerminalSquare className="h-3.5 w-3.5 text-[#d4af37]" />}
                    collapsed={termCollapsed}
                    maximized={termMax}
                    floating={termFloat}
                    onToggleCollapse={() =>
                      toggleCollapse(termPanelRef, termCollapsed, setTermCollapsed)
                    }
                    onToggleMaximize={() => toggleMax(termPanelRef, termMax, setTermMax, 40)}
                    onToggleFloat={() => setTermFloat((f) => !f)}
                  />
                  {!termCollapsed && !termFloat && (
                    <div className="min-h-0 flex-1">{terminalBody}</div>
                  )}
                  {termFloat && (
                    <div className="flex min-h-0 flex-1 items-center justify-center text-xs text-muted-foreground">
                      Terminal is floating — drag header to move, corner to resize.
                    </div>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-px bg-[rgba(255,255,255,0.08)] hover:bg-[#d4af37]/40 data-[resize-handle-state=drag]:bg-[#d4af37]" />

          {/* AI sidebar */}
          <Panel
            panelRef={aiPanelRef}
            defaultSize={38}
            minSize={6}
            collapsible
            collapsedSize={6}
          >
            <div className="flex h-full flex-col">
              <PanelHeader
                title="AI Analysis"
                icon={<Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />}
                collapsed={aiCollapsed}
                maximized={aiMax}
                floating={aiFloat}
                onToggleCollapse={() => toggleCollapse(aiPanelRef, aiCollapsed, setAiCollapsed)}
                onToggleMaximize={() => toggleMax(aiPanelRef, aiMax, setAiMax, 38)}
                onToggleFloat={() => setAiFloat((f) => !f)}
              />
              {!aiCollapsed && !aiFloat && (
                <div className="min-h-0 flex-1">{aiBody}</div>
              )}
              {aiFloat && (
                <div className="flex min-h-0 flex-1 items-center justify-center text-xs text-muted-foreground">
                  Analysis is floating.
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Floating windows */}
      {termFloat && (
        <FloatingWindow
          title="Terminal"
          icon={<TerminalSquare className="h-3.5 w-3.5 text-[#d4af37]" />}
          onDock={() => setTermFloat(false)}
          initial={{ x: 160, y: 160, w: 760, h: 420 }}
        >
          {terminalBody}
        </FloatingWindow>
      )}
      {aiFloat && (
        <FloatingWindow
          title="AI Analysis"
          icon={<Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />}
          onDock={() => setAiFloat(false)}
          initial={{ x: 220, y: 200, w: 520, h: 480 }}
        >
          {aiBody}
        </FloatingWindow>
      )}

      {/* Stable LiveTerminal — always mounted, host div is moved between docked/floating slots */}
      {termHost && createPortal(<LiveTerminal ref={termRef} onStatusChange={setStatus} />, termHost)}
    </div>
  );
}

/* ----------------------- AI Analysis Card ----------------------- */

function AiCard({ entry }: { entry: AiEntry }) {
  const { response } = entry;
  const [showOpt, setShowOpt] = useState(true);
  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] px-3 py-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-[#d4af37]" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#d4af37]">
            {response.language || "—"}
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {new Date(entry.at).toLocaleTimeString()}
        </span>
      </div>

      {/* Explanation */}
      {response.explanation && (
        <div className="border-b border-[rgba(255,255,255,0.05)] px-3 py-3">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            ◈ Explanation
          </div>
          <div className="markdown-body text-xs leading-relaxed text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {response.explanation}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Optimization */}
      {response.optimization && (
        <div className="px-3 py-3">
          <button
            onClick={() => setShowOpt((s) => !s)}
            className="mb-2 flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#dc2626] hover:text-[#d4af37]"
          >
            <span>▾ Optimization</span>
            <span className="text-muted-foreground">{showOpt ? "hide" : "show"}</span>
          </button>
          {showOpt && (
            <div className="markdown-body text-xs leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {response.optimization}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {response.sessionId && (
        <div className="border-t border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
          session: {response.sessionId.slice(0, 8)}…
        </div>
      )}
    </div>
  );
}

// Suppress unused import warnings for icons used in future iterations
void Copy; void Check;

