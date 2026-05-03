import { useState } from "react";
import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/speedtest", label: "Speed Test" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/community", label: "Community" },
  { path: "/links", label: "Links" },
  { path: "/linktree", label: "Linktree", highlight: "purple" },
  { path: "/feedback", label: "Feedback" },
  { path: "/ai", label: "Zhuu AI", highlight: "ai" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(1,10,20,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,255,255,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div style={{
              width: 36, height: 36, borderRadius: "50%", overflow: "hidden",
              border: "2px solid rgba(0,255,255,0.5)",
              boxShadow: "0 0 12px rgba(0,255,255,0.3)",
            }}>
              <img src="/zhuu-avatar.jpg" alt="ZhuuVIP" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            </div>
            <span className="gradient-text font-bold text-lg tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>ZhuuVIP</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path;
            if (item.highlight === "ai") {
              return (
                <Link key={item.path} href={item.path}>
                  <button className="ml-1 px-4 py-2 rounded-full text-sm font-semibold neon-btn-solid transition-all duration-300"
                    style={{ background: "linear-gradient(135deg, rgba(120,80,255,0.8), rgba(0,150,255,0.8))", border: "1px solid rgba(150,100,255,0.6)" }}>
                    {item.label}
                  </button>
                </Link>
              );
            }
            if (item.highlight === "purple") {
              return (
                <Link key={item.path} href={item.path}>
                  <button className="ml-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                    style={{
                      background: isActive ? "rgba(120,60,200,0.25)" : "rgba(120,60,200,0.1)",
                      border: "1px solid rgba(150,80,255,0.4)",
                      color: "#c084fc",
                    }}>
                    🔗 {item.label}
                  </button>
                </Link>
              );
            }
            return (
              <Link key={item.path} href={item.path}>
                <div className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "text-cyan-300 bg-cyan-400/10"
                    : "text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-400/8"
                }`}
                  style={isActive ? { boxShadow: "0 0 12px rgba(0,255,255,0.15)" } : {}}>
                  {item.label}
                  {isActive && <div className="w-1 h-1 rounded-full bg-cyan-400 mx-auto mt-1" />}
                </div>
              </Link>
            );
          })}
          <Link href="/community">
            <button className="ml-2 neon-btn-solid px-5 py-2 rounded-full text-sm font-semibold">
              Join Now
            </button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ background: "rgba(0,255,255,0.05)", border: "1px solid rgba(0,255,255,0.15)" }}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="rgba(0,220,240,0.8)" strokeWidth={2}>
            {open ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4" style={{ background: "rgba(1,10,20,0.97)", borderBottom: "1px solid rgba(0,255,255,0.08)" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className="px-4 py-3 rounded-xl cursor-pointer my-1 text-sm font-medium"
                  style={{
                    color: isActive ? "#00ffff" : "rgba(0,200,220,0.65)",
                    background: isActive ? "rgba(0,255,255,0.08)" : "transparent",
                    ...(item.highlight === "ai" ? { color: "rgba(150,100,255,0.9)" } : {}),
                    ...(item.highlight === "purple" ? { color: "rgba(192,132,252,0.9)" } : {}),
                  }}
                  onClick={() => setOpen(false)}
                >
                  {item.highlight === "purple" ? "🔗 " : ""}{item.label}
                </div>
              </Link>
            );
          })}
          <div className="px-2 pt-2">
            <Link href="/community">
              <button className="w-full neon-btn-solid py-2.5 rounded-xl text-sm font-semibold" onClick={() => setOpen(false)}>
                Join Community
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
