import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  {
    path: "/",
    label: "Home",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "#00ffff" : "rgba(0,200,220,0.5)"} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline strokeLinecap="round" strokeLinejoin="round" points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    path: "/speedtest",
    label: "Speed",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "#00ffff" : "rgba(0,200,220,0.5)"} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    path: "/portfolio",
    label: "Portfolio",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "#00ffff" : "rgba(0,200,220,0.5)"} strokeWidth={2}>
        <rect x="2" y="7" width="20" height="14" rx="2" strokeLinecap="round" />
        <path strokeLinecap="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
  },
  {
    path: "/community",
    label: "Community",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "#00ffff" : "rgba(0,200,220,0.5)"} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <div className="bottom-nav md:hidden" data-testid="bottom-nav">
      <div className="flex items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${
                  isActive ? "bg-cyan-400/15" : "hover:bg-cyan-400/8"
                }`}
                data-testid={`bottom-nav-${item.label.toLowerCase()}`}
              >
                {item.icon(isActive)}
                <span
                  className="text-xs font-medium"
                  style={{
                    color: isActive ? "#00ffff" : "rgba(0,200,220,0.5)",
                    textShadow: isActive ? "0 0 8px rgba(0,255,255,0.6)" : "none",
                  }}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
