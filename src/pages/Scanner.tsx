import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload, Globe, Search, Loader2, CheckCircle, FileWarning,
  Terminal, Shield, Bug, Code, ShieldCheck, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ScanPhase = "idle" | "uploading" | "static" | "dynamic" | "ai" | "complete";

const PHASE_LABELS: Record<ScanPhase, string> = {
  idle: "Awaiting target...",
  uploading: "Uploading file...",
  static: "Static Analysis in progress...",
  dynamic: "Dynamic Analysis running...",
  ai: "Connecting to AI engine...",
  complete: "Scan Complete",
};

const TERMINAL_LINES: Record<ScanPhase, string[]> = {
  idle: [],
  uploading: ["[UPLOAD] Receiving file data...", "[UPLOAD] Verifying checksum... OK"],
  static: [
    "[STATIC] Extracting metadata...",
    "[STATIC] Decompiling binary...",
    "[STATIC] Analyzing control flow graph...",
    "[STATIC] Scanning for hardcoded secrets...",
    "[STATIC] Checking dependency versions...",
  ],
  dynamic: [
    "[DYNAMIC] Spawning sandboxed environment...",
    "[DYNAMIC] Hooking syscalls...",
    "[DYNAMIC] Monitoring network activity...",
    "[DYNAMIC] Fuzzing input vectors...",
  ],
  ai: [
    "[AI] Connecting to Gemini AI engine...",
    "[AI] Reasoning over findings...",
    "[AI] Classifying severity levels...",
    "[AI] Generating proof-of-concept...",
    "[AI] Building mitigation report...",
  ],
  complete: ["[DONE] Scan complete. 3 vulnerabilities found."],
};

const MOCK_REPORT = [
  {
    name: "SQL Injection in Authentication Module",
    severity: "critical",
    description:
      "The login endpoint does not sanitize user input, allowing direct SQL injection via the 'username' parameter.",
    poc: `curl -X POST https://target.com/api/auth/login \\
  -d "username=admin' OR '1'='1'--&password=anything"`,
    mitigation:
      "Use parameterized queries. Implement input validation with allowlists. Deploy a WAF.",
  },
  {
    name: "Cross-Site Scripting (Reflected)",
    severity: "high",
    description:
      "The search parameter reflects user input without encoding, enabling script execution.",
    poc: `https://target.com/search?q=<script>alert(1)</script>`,
    mitigation:
      "Encode output using context-appropriate encoding. Implement CSP headers.",
  },
  {
    name: "CORS Misconfiguration",
    severity: "medium",
    description: "Wildcard origin is allowed on sensitive API endpoints.",
    poc: `fetch('https://target.com/api/user', {credentials:'include'})`,
    mitigation: "Restrict CORS origins to trusted domains only.",
  },
];

const SEV_STYLE: Record<string, string> = {
  critical: "text-accent border-accent/30 bg-accent/10",
  high: "text-cyber-orange border-cyber-orange/30 bg-cyber-orange/10",
  medium: "text-cyber-yellow border-cyber-yellow/30 bg-cyber-yellow/10",
  low: "text-cyber-blue border-cyber-blue/30 bg-cyber-blue/10",
};

export default function Scanner() {
  const [target, setTarget] = useState("");
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [terminalLog, setTerminalLog] = useState<string[]>([
    "[SYS] V HUNTER Scanner v2.0 initialized",
    "[SYS] Awaiting scan target...",
  ]);
  const [showReport, setShowReport] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLog]);

  const runScan = useCallback(async (scanTarget: string) => {
    setShowReport(false);
    const phases: ScanPhase[] = ["uploading", "static", "dynamic", "ai", "complete"];
    for (let i = 0; i < phases.length; i++) {
      const p = phases[i];
      setPhase(p);
      setProgress(((i + 1) / phases.length) * 100);
      const lines = TERMINAL_LINES[p];
      for (const line of lines) {
        await new Promise((r) => setTimeout(r, 400));
        setTerminalLog((prev) => [...prev, line]);
      }
      if (p !== "complete") await new Promise((r) => setTimeout(r, 600));
    }
    setShowReport(true);
  }, []);

  const onDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        setFileName(files[0].name);
        setTerminalLog((prev) => [...prev, `[INPUT] File received: ${files[0].name}`]);
        runScan(files[0].name);
      }
    },
    [runScan]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.android.package-archive": [".apk"],
      "application/x-msdownload": [".exe"],
      "application/pdf": [".pdf"],
      "application/octet-stream": [".bin"],
    },
    maxFiles: 1,
  });

  const handleUrlScan = () => {
    if (target.trim()) {
      setFileName(null);
      setTerminalLog((prev) => [...prev, `[INPUT] Target URL: ${target.trim()}`]);
      runScan(target.trim());
    }
  };

  const isScanning = phase !== "idle" && phase !== "complete";

  return (
    <div className="min-h-screen pt-20 pb-10 px-6" style={{ backgroundColor: "#050511" }}>
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h2 className="text-2xl font-mono font-bold text-foreground tracking-wider">
            <span className="text-primary glow-cyan">VULNERABILITY</span> SCANNER
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            Upload a file or enter a URL to initiate AI-powered analysis
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Scanner Input */}
          <div className="space-y-5">
            <div className="glass-panel p-6 space-y-5">
              <div className="flex items-center gap-2 text-sm font-mono text-primary">
                <Search className="w-4 h-4" />
                <span className="tracking-wider uppercase">Scan Target</span>
              </div>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? "Drop file here..." : "Drag & drop APK, EXE, or document"}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">or click to browse</p>
              </div>

              {fileName && (
                <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 px-3 py-2 rounded-md">
                  <FileWarning className="w-3 h-3" />
                  {fileName}
                </div>
              )}

              {/* URL Input */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUrlScan()}
                    placeholder="URL or IP address..."
                    className="w-full bg-input/50 border border-border/50 rounded-md pl-9 pr-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <Button
                  onClick={handleUrlScan}
                  disabled={isScanning || !target.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/80 font-mono text-xs tracking-wider px-6 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                >
                  {isScanning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      INITIATE SCAN
                    </>
                  )}
                </Button>
              </div>

              {/* Progress */}
              {phase !== "idle" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-muted-foreground">{PHASE_LABELS[phase]}</span>
                    {phase === "complete" && <CheckCircle className="w-4 h-4 text-cyber-green" />}
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${progress}%`,
                        background:
                          phase === "complete"
                            ? "hsl(var(--cyber-green))"
                            : "linear-gradient(90deg, hsl(var(--cyber-cyan)), hsl(var(--cyber-blue)))",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Terminal */}
          <div className="glass-panel p-5 flex flex-col">
            <div className="flex items-center gap-2 text-sm font-mono text-primary mb-3">
              <Terminal className="w-4 h-4" />
              <span className="tracking-wider uppercase">AI Reasoning & Status</span>
              {isScanning && (
                <span className="ml-auto flex items-center gap-1 text-[10px] text-cyber-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse-glow" />
                  ACTIVE
                </span>
              )}
            </div>
            <div
              ref={terminalRef}
              className="flex-1 min-h-[320px] max-h-[420px] bg-background/80 rounded-lg p-4 overflow-y-auto cyber-scrollbar font-mono text-xs leading-relaxed"
            >
              {terminalLog.map((line, i) => (
                <div
                  key={i}
                  className={`${
                    line.startsWith("[DONE]")
                      ? "text-cyber-green"
                      : line.startsWith("[AI]")
                        ? "text-primary"
                        : line.startsWith("[INPUT]")
                          ? "text-cyber-yellow"
                          : "text-muted-foreground"
                  }`}
                >
                  {line}
                </div>
              ))}
              {isScanning && (
                <span className="inline-block w-2 h-4 bg-primary animate-pulse-glow ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Report Section */}
        {showReport && (
          <div className="mt-8 glass-panel p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono text-primary">
                <ShieldCheck className="w-5 h-5" />
                <span className="tracking-wider uppercase">AI Vulnerability Report</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-primary/10 text-primary hover:bg-primary/20 font-mono text-[10px] tracking-wider gap-1"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(MOCK_REPORT, null, 2)], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "vhunter-report.json";
                    a.click();
                  }}
                >
                  <Download className="w-3 h-3" />
                  EXPORT JSON
                </Button>
                <Button
                  size="sm"
                  className="bg-primary/10 text-primary hover:bg-primary/20 font-mono text-[10px] tracking-wider gap-1"
                  onClick={() => {
                    const md = MOCK_REPORT.map(
                      (v) =>
                        `## ${v.name} [${v.severity}]\n\n${v.description}\n\n### PoC\n\`\`\`\n${v.poc}\n\`\`\`\n\n### Mitigation\n${v.mitigation}`
                    ).join("\n\n---\n\n");
                    const blob = new Blob([md], { type: "text/markdown" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "vhunter-report.md";
                    a.click();
                  }}
                >
                  <Download className="w-3 h-3" />
                  EXPORT MD
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              {MOCK_REPORT.map((vuln, i) => (
                <div key={i} className="bg-muted/30 rounded-lg p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Bug className="w-4 h-4 text-accent flex-shrink-0" />
                      <h3 className="font-mono text-sm text-foreground">{vuln.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${SEV_STYLE[vuln.severity]}`}
                    >
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{vuln.description}</p>
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-primary font-mono uppercase mb-2">
                      <Code className="w-3 h-3" />
                      Proof of Concept
                    </div>
                    <pre className="bg-background/80 rounded-md p-3 text-[11px] font-mono text-primary/90 overflow-x-auto whitespace-pre-wrap">
                      {vuln.poc}
                    </pre>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-cyber-green font-mono uppercase mb-2">
                      <ShieldCheck className="w-3 h-3" />
                      Mitigation
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{vuln.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
