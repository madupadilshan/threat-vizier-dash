import { Shield } from "lucide-react";

export default function Branding() {
  return (
    <div className="fixed top-6 left-6 z-50 flex items-center gap-3">
      <div className="glass-panel px-5 py-3 flex items-center gap-3">
        <Shield className="w-8 h-8 text-cyber-red animate-pulse-glow" />
        <div>
          <h1 className="text-xl font-bold font-mono tracking-wider">
            <span className="text-cyber-red glow-red">V</span>
            <span className="text-foreground"> HUNTER</span>
          </h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
            AI-Driven Universal Vulnerability Scanner
          </p>
        </div>
      </div>
    </div>
  );
}
