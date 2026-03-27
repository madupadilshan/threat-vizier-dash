import { useState, useEffect } from "react";
import { AlertTriangle, Activity, TrendingUp, Clock } from "lucide-react";

interface ThreatFeed {
  id: number;
  time: string;
  source: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
}

interface AttackerData {
  country: string;
  attacks: number;
  pct: number;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-cyber-red",
  high: "bg-cyber-orange",
  medium: "bg-cyber-yellow",
  low: "bg-cyber-blue",
};

const SEVERITY_TEXT: Record<string, string> = {
  critical: "text-cyber-red",
  high: "text-cyber-orange",
  medium: "text-cyber-yellow",
  low: "text-cyber-blue",
};

const TOP_ATTACKERS: AttackerData[] = [
  { country: "China", attacks: 45892, pct: 92 },
  { country: "Russia", attacks: 38210, pct: 78 },
  { country: "USA", attacks: 25130, pct: 54 },
  { country: "Iran", attacks: 18940, pct: 40 },
  { country: "N. Korea", attacks: 12380, pct: 28 },
];

const INITIAL_FEED: ThreatFeed[] = [
  { id: 1, time: "00:02:14", source: "103.24.77.x", type: "SQL Injection", severity: "critical" },
  { id: 2, time: "00:01:58", source: "45.155.205.x", type: "Brute Force SSH", severity: "high" },
  { id: 3, time: "00:01:32", source: "185.220.101.x", type: "Port Scan", severity: "medium" },
  { id: 4, time: "00:01:10", source: "91.219.236.x", type: "XSS Attempt", severity: "high" },
  { id: 5, time: "00:00:45", source: "77.247.181.x", type: "DNS Tunneling", severity: "low" },
];

const SEVERITY_COUNTS = { critical: 12, high: 34, medium: 67, low: 128 };

export default function RightPanel() {
  const [feed, setFeed] = useState<ThreatFeed[]>(INITIAL_FEED);

  // Simulate live feed
  useEffect(() => {
    const types = ["SQL Injection", "RCE", "XSS", "DDoS", "Brute Force", "Phishing", "Malware C2"];
    const sevs: ThreatFeed["severity"][] = ["critical", "high", "medium", "low"];
    const interval = setInterval(() => {
      const item: ThreatFeed = {
        id: Date.now(),
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.x`,
        type: types[Math.floor(Math.random() * types.length)],
        severity: sevs[Math.floor(Math.random() * sevs.length)],
      };
      setFeed((prev) => [item, ...prev.slice(0, 8)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-24 right-6 z-40 w-80 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto cyber-scrollbar">
      {/* Severity Alerts */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 text-sm font-mono text-primary mb-3">
          <AlertTriangle className="w-4 h-4" />
          <span className="tracking-wider uppercase">Severity Overview</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SEVERITY_COUNTS).map(([sev, count]) => (
            <div key={sev} className="bg-muted/50 rounded-lg p-3 text-center">
              <div className={`text-2xl font-bold font-mono ${SEVERITY_TEXT[sev]}`}>
                {count}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                {sev}
              </div>
              <div className={`h-1 rounded-full mt-2 ${SEVERITY_COLORS[sev]} opacity-60`} />
            </div>
          ))}
        </div>
      </div>

      {/* Top Attackers */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 text-sm font-mono text-primary mb-3">
          <TrendingUp className="w-4 h-4" />
          <span className="tracking-wider uppercase">Top Attackers</span>
        </div>
        <div className="space-y-3">
          {TOP_ATTACKERS.map((a) => (
            <div key={a.country} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-foreground">{a.country}</span>
                <span className="text-muted-foreground">{a.attacks.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyber-red/80 transition-all duration-1000"
                  style={{ width: `${a.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Detections */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 text-sm font-mono text-primary mb-3">
          <Activity className="w-4 h-4" />
          <span className="tracking-wider uppercase">Live Feed</span>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-cyber-green">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse-glow" />
            LIVE
          </span>
        </div>
        <div className="space-y-2 max-h-56 overflow-y-auto cyber-scrollbar">
          {feed.map((t) => (
            <div key={t.id} className="flex items-start gap-2 bg-muted/30 rounded-md px-3 py-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_COLORS[t.severity]}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-foreground truncate">{t.type}</span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {t.time}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{t.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
