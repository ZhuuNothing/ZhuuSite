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
    path: "/ai",
    label: "Zhuu AI",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "#a78bfa" : "rgba(150,100,220,0.5)"} strokeWidth={2}>
        <circle cx="12" cy="12" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    path: "/linktree",
    label: "Linktree",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "#c084fc" : "rgba(150,80,200,0.5)"} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
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
  {
    path: "/links",
    label: "Links",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "#00ffff" : "rgba(0,200,220,0.5)"} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    path: "/feedback",
    label: "Feedback",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "#00ffff" : "rgba(0,200,220,0.5)"} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <div className="bottom-nav md:hidden">
      <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          const isAI = item.path === "/ai";
          const isLinktree = item.path === "/linktree";
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-full cursor-pointer transition-all duration-300 flex-shrink-0 ${
                  isActive
                    ? isAI ? "bg-violet-400/15" : isLinktree ? "bg-purple-400/15" : "bg-cyan-400/15"
                    : "hover:bg-cyan-400/8"
                }`}
              >
                {item.icon(isActive)}
                <span
                  style={{
                    color: isActive
                      ? isAI ? "#a78bfa" : isLinktree ? "#c084fc" : "#00ffff"
                      : "rgba(0,200,220,0.5)",
                    textShadow: isActive
                      ? `0 0 8px rgba(${isAI ? "167,139,250" : isLinktree ? "192,132,252" : "0,255,255"},0.6)`
                      : "none",
                    fontSize: 10,
                    fontWeight: 500,
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
