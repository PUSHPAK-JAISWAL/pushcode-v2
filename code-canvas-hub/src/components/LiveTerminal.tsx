import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WS_BASE, tokenStore } from "@/lib/api";

export interface TerminalHandle {
  connect: (sessionId: string) => void;
  writeln: (msg: string) => void;
  clear: () => void;
}

interface Props {
  onStatusChange?: (status: "IDLE" | "CONNECTED" | "DISCONNECTED") => void;
}

export const LiveTerminal = forwardRef<TerminalHandle, Props>(function LiveTerminal(
  { onStatusChange },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const inputBufferRef = useRef<string>("");

  // FIX 1 — Initialize the terminal exactly once.
  useEffect(() => {
    if (!containerRef.current || termRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      theme: { background: "#0b0e14", foreground: "#ffffff", cursor: "#528bff" },
      fontFamily: '"Fira Code", ui-monospace, monospace',
      fontSize: 13,
      convertEol: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();
    term.writeln("\x1b[90mPushCode terminal ready. Click \x1b[36mRun\x1b[90m or \x1b[36mAsk AI\x1b[90m to start a session.\x1b[0m");

    // FIX 1 cont. — onData registered ONCE (no stacking listeners).
    term.onData((data) => {
      const socket = socketRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN) return;

      if (data === "\r") {
        socket.send(inputBufferRef.current + "\n");
        inputBufferRef.current = "";
        term.write("\r\n");
      } else if (data === "\u007f") {
        if (inputBufferRef.current.length > 0) {
          inputBufferRef.current = inputBufferRef.current.slice(0, -1);
          term.write("\b \b");
        }
      } else {
        inputBufferRef.current += data;
        term.write(data); // local echo
      }
    });

    termRef.current = term;
    fitRef.current = fit;

    const onResize = () => fit.fit();
    window.addEventListener("resize", onResize);

    // Use ResizeObserver for panel resizes too
    const ro = new ResizeObserver(() => fit.fit());
    ro.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      socketRef.current?.close();
      term.dispose();
      termRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    connect(sessionId: string) {
      const term = termRef.current;
      if (!term) return;

      // FIX 2 — null handlers BEFORE close so the old onclose
      // doesn't fire after the new socket is assigned.
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.onerror = null;
        socketRef.current.onmessage = null;
        socketRef.current.close();
        socketRef.current = null;
      }
      inputBufferRef.current = "";

      // Match reference exactly — backend expects only sessionId query param.
      const socket = new WebSocket(`${WS_BASE}/terminal?sessionId=${encodeURIComponent(sessionId)}`);
      socketRef.current = socket;

      socket.onopen = () => {
        onStatusChange?.("CONNECTED");
        term.focus();
      };
      socket.onmessage = (e) => {
        term.write(typeof e.data === "string" ? e.data : "");
      };
      socket.onclose = () => {
        onStatusChange?.("DISCONNECTED");
        socketRef.current = null;
        inputBufferRef.current = "";
        term.writeln("\r\n\x1b[90m[session closed]\x1b[0m");
      };
      socket.onerror = () => {
        term.writeln("\r\n\x1b[31m[!] WebSocket error\x1b[0m");
      };
    },
    writeln(msg: string) {
      termRef.current?.writeln(msg);
    },
    clear() {
      termRef.current?.clear();
    },
  }));

  return (
    <div
      ref={containerRef}
      id="terminal-container"
      className="h-full w-full"
      style={{ background: "#0b0e14", padding: "10px" }}
    />
  );
});
