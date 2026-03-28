import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Globe, Search, Loader2, CheckCircle, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanResult {
  status: string;
  vulnerabilities: { severity: string; name: string; description: string }[];
}

// Mock scan function
async function mockScan(target: string): Promise<ScanResult> {
  await new Promise((r) => setTimeout(r, 4000));
  return {
    status: "complete",
    vulnerabilities: [
      { severity: "critical", name: "SQL Injection", description: "Unsanitized input in login form" },
      { severity: "high", name: "XSS Reflected", description: "Script injection via search parameter" },
      { severity: "medium", name: "CORS Misconfiguration", description: "Wildcard origin allowed" },
      { severity: "low", name: "Missing X-Frame-Options", description: "Clickjacking possible" },
    ],
  };
}

type ScanPhase = "idle" | "uploading" | "static" | "dynamic" | "ai" | "complete";

const PHASE_LABELS: Record<ScanPhase, string> = {
  idle: "Ready to scan",
  uploading: "Uploading file...",
  static: "Static Analysis in progress...",
  dynamic: "Dynamic Analysis running...",
  ai: "AI Reasoning & Classification...",
  complete: "Scan Complete",
};

export default function LeftPanel({ onScanComplete }: { onScanComplete?: (r: ScanResult) => void }) {
  const [target, setTarget] = useState("");
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const runScan = useCallback(async (scanTarget: string) => {
    const phases: ScanPhase[] = ["uploading", "static", "dynamic", "ai", "complete"];
    for (let i = 0; i < phases.length; i++) {
      setPhase(phases[i]);
      setProgress(((i + 1) / phases.length) * 100);
      if (phases[i] !== "complete") await new Promise((r) => setTimeout(r, 1200));
    }
    const result = await mockScan(scanTarget);
    onScanComplete?.(result);
  }, [onScanComplete]);

  const onDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFileName(files[0].name);
      runScan(files[0].name);
    }
  }, [runScan]);

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
      runScan(target.trim());
    }
  };

  const isScanning = phase !== "idle" && phase !== "complete";

  return (
    <div className="fixed top-24 left-6 z-40 w-80">
      <div className="glass-panel p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm font-mono text-primary">
          <Search className="w-4 h-4" />
          <span className="tracking-wider uppercase">Scan Target</span>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
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
              className="w-full bg-input/50 border border-border/50 rounded-md pl-9 pr-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <Button
            onClick={handleUrlScan}
            disabled={isScanning || !target.trim()}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/80 font-mono text-xs"
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : "SCAN"}
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
                  background: phase === "complete"
                    ? "hsl(var(--cyber-green))"
                    : "linear-gradient(90deg, hsl(var(--cyber-cyan)), hsl(var(--cyber-blue)))",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
