import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/speedtest", label: "Speed Test" },
  { path: "/portfolio", label: "Portfolio" },
  { path: "/community", label: "Community" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav
      className="navbar fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(2,10,18,0.92)" : "rgba(2,10,18,0.6)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${scrolled ? "rgba(0,255,255,0.14)" : "rgba(0,255,255,0.06)"}`,
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
      }}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" data-testid="nav-logo">
          <div className="flex items-center gap-3 cursor-pointer group">
            <img
              src="https://i.ibb.co/pvFLGFcC/your-logo.png"
              alt="ZhuuVIP"
              className="logo-glow"
              style={{ height: 34, width: "auto" }}
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = "none";
              }}
            />
            <span
              className="font-black text-xl gradient-text tracking-tight group-hover:opacity-90 transition-opacity"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              ZhuuVIP
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path} data-testid={`nav-link-${item.label.toLowerCase().replace(" ", "-")}`}>
                <span
                  className="relative px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200"
                  style={{
                    color: isActive ? "#00ffff" : "rgba(0,200,220,0.55)",
                    background: isActive ? "rgba(0,255,255,0.08)" : "transparent",
                    textShadow: isActive ? "0 0 12px rgba(0,255,255,0.6)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(0,230,240,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(0,200,220,0.55)";
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
                      style={{ boxShadow: "0 0 6px rgba(0,255,255,0.8)" }} />
                  )}
                </span>
              </Link>
            );
          })}

          {/* CTA button */}
          <Link href="/community">
            <button className="ml-4 neon-btn-solid px-5 py-2 rounded-full text-sm font-semibold" data-testid="nav-cta-btn">
              Join Now
            </button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-xl transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: menuOpen ? "rgba(0,255,255,0.08)" : "transparent", border: "1px solid rgba(0,255,255,0.12)" }}
          data-testid="nav-mobile-menu-btn"
        >
          <div className="space-y-1.5 w-5">
            <span className={`block h-0.5 bg-cyan-400 transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 bg-cyan-400 transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-0.5 bg-cyan-400 transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
        data-testid="nav-mobile-dropdown"
      >
        <div className="mx-4 mb-4 glass-card p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className="px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-between"
                  style={{
                    color: isActive ? "#00ffff" : "rgba(0,200,220,0.55)",
                    background: isActive ? "rgba(0,255,255,0.08)" : "transparent",
                    textShadow: isActive ? "0 0 12px rgba(0,255,255,0.5)" : "none",
                  }}
                  data-testid={`nav-mobile-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                  {isActive && <span className="text-cyan-400 text-xs">●</span>}
                </div>
              </Link>
            );
          })}
          <div className="px-2 pt-2">
            <Link href="/community">
              <button className="w-full neon-btn-solid py-2.5 rounded-xl text-sm font-semibold" data-testid="nav-mobile-cta">
                Join Community
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
