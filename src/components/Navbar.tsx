import { Shield, Globe, Search, Eye, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/", label: "Live Threat Map", icon: Globe },
  { to: "/scanner", label: "Vulnerability Scanner", icon: Search, highlight: true },
  { to: "/darkweb", label: "Dark Web Intel", icon: Eye },
  { to: "/reports", label: "Reports Archive", icon: FileText },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-card/50 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <Shield className="w-7 h-7 text-accent animate-pulse-glow" />
          <div>
            <h1 className="text-lg font-bold font-mono tracking-wider leading-none">
              <span className="text-accent glow-red">V</span>
              <span className="text-foreground"> HUNTER</span>
            </h1>
            <p className="text-[9px] text-muted-foreground tracking-widest uppercase">
              AI Vulnerability Scanner
            </p>
          </div>
        </NavLink>

        {/* Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon: Icon, highlight }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all duration-200",
                  highlight
                    ? isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                      : "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 shadow-[0_0_10px_hsl(var(--primary)/0.15)]"
                    : isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
