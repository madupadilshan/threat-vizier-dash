import { FileText, Download, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_REPORTS = [
  { id: 1, name: "target-app-v2.apk", date: "2026-03-26", vulns: 7, critical: 2, status: "Complete" },
  { id: 2, name: "https://example.com", date: "2026-03-25", vulns: 3, critical: 0, status: "Complete" },
  { id: 3, name: "internal-tool.exe", date: "2026-03-24", vulns: 12, critical: 5, status: "Complete" },
  { id: 4, name: "https://api.staging.io", date: "2026-03-22", vulns: 1, critical: 0, status: "Complete" },
];

export default function Reports() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-6" style={{ backgroundColor: "#050511" }}>
      <div className="fixed inset-0 z-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-mono font-bold text-foreground tracking-wider">
            <span className="text-primary glow-cyan">REPORTS</span> ARCHIVE
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            Browse and download past vulnerability scan reports
          </p>
        </div>

        <div className="glass-panel overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_120px_80px_80px_100px] gap-4 px-5 py-3 border-b border-border/50 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <span>Target</span>
            <span>Date</span>
            <span>Vulns</span>
            <span>Critical</span>
            <span className="text-right">Actions</span>
          </div>
          {MOCK_REPORTS.map((r) => (
            <div key={r.id} className="grid grid-cols-[1fr_120px_80px_80px_100px] gap-4 items-center px-5 py-4 border-b border-border/20 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-mono text-foreground truncate">{r.name}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {r.date}
              </div>
              <span className="text-sm font-mono text-foreground">{r.vulns}</span>
              <span className={`text-sm font-mono ${r.critical > 0 ? "text-accent" : "text-cyber-green"}`}>
                {r.critical}
              </span>
              <div className="text-right">
                <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10 font-mono text-[10px] gap-1">
                  <Download className="w-3 h-3" />
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
