import { Eye, Lock, AlertTriangle, Search } from "lucide-react";

const MOCK_LEAKS = [
  { source: "Dark Forum X", type: "Credential Dump", records: "2.4M", date: "2026-03-26", severity: "critical" },
  { source: "Paste Site", type: "API Keys Exposed", records: "340", date: "2026-03-25", severity: "high" },
  { source: "Tor Marketplace", type: "Ransomware Kit", records: "N/A", date: "2026-03-24", severity: "critical" },
  { source: "IRC Channel", type: "Zero-Day Exploit", records: "1", date: "2026-03-23", severity: "high" },
  { source: "Telegram Group", type: "Database Leak", records: "890K", date: "2026-03-22", severity: "medium" },
];

const SEV_DOT: Record<string, string> = {
  critical: "bg-accent",
  high: "bg-cyber-orange",
  medium: "bg-cyber-yellow",
};

export default function DarkWeb() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-6" style={{ backgroundColor: "#050511" }}>
      <div className="fixed inset-0 z-0 opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(hsl(var(--accent)) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-mono font-bold text-foreground tracking-wider">
            <span className="text-accent glow-red">DARK WEB</span> INTEL
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            Monitoring underground channels for leaked data and emerging threats
          </p>
        </div>

        {/* Search */}
        <div className="glass-panel p-4 mb-6">
          <div className="flex gap-3 items-center">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search leaked domains, emails, keywords..."
              className="flex-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Feed */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-mono text-accent mb-4">
            <Eye className="w-4 h-4" />
            <span className="tracking-wider uppercase">Recent Dark Web Activity</span>
          </div>
          {MOCK_LEAKS.map((leak, i) => (
            <div key={i} className="flex items-center gap-4 bg-muted/30 rounded-lg px-4 py-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${SEV_DOT[leak.severity]}`} />
              <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-foreground">{leak.type}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{leak.date}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground">{leak.source}</span>
                  <span className="text-xs font-mono text-primary">{leak.records} records</span>
                </div>
              </div>
              <AlertTriangle className="w-4 h-4 text-accent/60 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
