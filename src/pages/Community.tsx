import { useEffect, useState, useRef } from "react";

const WA_LINKS = [
  {
    label: "Personal Contact",
    url: "https://wa.me/62882005730502",
    desc: "Direct chat with ZhuuVIP",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#25d366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: "#25d366",
    bg: "rgba(37,211,102,0.1)",
    border: "rgba(37,211,102,0.3)",
  },
  {
    label: "Official Channel",
    url: "https://whatsapp.com/channel/0029VaXLuPM002TGAkbWtb3G",
    desc: "Follow for updates & announcements",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#25d366">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
      </svg>
    ),
    color: "#00e5ff",
    bg: "rgba(0,229,255,0.1)",
    border: "rgba(0,229,255,0.3)",
  },
  {
    label: "Vendetta Noire Area",
    url: "https://chat.whatsapp.com/CUaCIYrQsu2IvL31LsV6RE?mode=gi_t",
    desc: "Join the International Circle OneShoot",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#25d366">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    color: "#ff6b35",
    bg: "rgba(255,107,53,0.1)",
    border: "rgba(255,107,53,0.3)",
  },
];

const STATS = [
  { value: "500+", label: "Members", icon: "👥" },
  { value: "Daily", label: "Active Scrims", icon: "🔥" },
  { value: "Top 100", label: "Ranked Players", icon: "🏆" },
  { value: "24/7", label: "Community", icon: "⚡" },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function Community() {
  const [pageVisible, setPageVisible] = useState(false);
  const linksSection = useScrollReveal();
  const statsSection = useScrollReveal();

  useEffect(() => { setTimeout(() => setPageVisible(true), 100); }, []);

  return (
    <div className="ocean-bg min-h-screen pt-16 pb-32 md:pb-16" data-testid="community-page">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        {/* Background effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,100,50,0.06) 0%, transparent 70%)",
          }} />
        </div>

        <div className={`relative z-10 transition-all duration-1000 ${pageVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-sm font-medium tracking-widest text-orange-400/70 uppercase mb-4">🔥 Gaming</div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            <span style={{
              background: "linear-gradient(135deg, #ff6b35, #ff0080, #00ffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Community
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/70 mb-3 font-semibold">Free Fire One Shoot Skill Test</p>
          <p className="text-cyan-200/50 max-w-2xl mx-auto text-base leading-relaxed">
            Gabung untuk uji skill, sparing, dan berkembang bersama! 
            Join the elite squad — where precision meets passion.
          </p>

          {/* Active badge */}
          <div className={`inline-flex items-center gap-2 badge-active px-5 py-2.5 rounded-full mt-6 text-sm font-bold transition-all duration-1000 ${pageVisible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "0.4s" }} data-testid="community-active-badge">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            ACTIVE COMMUNITY
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsSection.ref} className="py-8 px-4" data-testid="community-stats">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`glass-card p-5 text-center transition-all duration-700 ${statsSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
              data-testid={`community-stat-${i}`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-xl font-black gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>{stat.value}</div>
              <div className="text-xs text-cyan-400/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider mx-4 my-8" />

      {/* Game feature */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className={`glass-card p-8 text-center transition-all duration-700 ${pageVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "0.3s" }} data-testid="community-game-card">
            {/* Fire Fire icon */}
            <div className="flex justify-center mb-6">
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,100,30,0.3), rgba(255,30,80,0.15))",
                border: "2px solid rgba(255,100,30,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                animation: "pulse-glow 2s ease-in-out infinite",
                boxShadow: "0 0 30px rgba(255,80,0,0.3), 0 0 60px rgba(255,30,50,0.15)",
              }}>
                🔥
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
              Free Fire One Shoot Challenge
            </h2>
            <p className="text-cyan-200/60 mb-6 leading-relaxed max-w-lg mx-auto">
              Prove your precision. Master the one-shot mechanics, compete in daily scrims, 
              and climb the community ranks with skilled players who push the meta forward.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: "🎯", label: "Skill Tests", desc: "Daily precision challenges" },
                { icon: "⚔️", label: "Scrims", desc: "Competitive custom matches" },
                { icon: "📈", label: "Grow", desc: "Track your progress" },
              ].map((feat) => (
                <div key={feat.label} className="text-center" data-testid={`community-feature-${feat.label}`}>
                  <div className="text-2xl mb-2">{feat.icon}</div>
                  <div className="text-sm font-bold text-white/80">{feat.label}</div>
                  <div className="text-xs text-cyan-400/40 mt-1">{feat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section ref={linksSection.ref} className="py-8 px-4" data-testid="community-links">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-8 transition-all duration-700 ${linksSection.visible ? "opacity-100" : "opacity-0"}`}>
            <h2 className="text-2xl font-bold gradient-text mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Join the Squad</h2>
            <p className="text-cyan-400/50 text-sm">Pick your entry point — we're active everywhere</p>
          </div>

          <div className="grid gap-4">
            {WA_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block glass-card p-5 cursor-pointer transition-all duration-700 ${linksSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  transitionDelay: `${i * 0.15}s`,
                  borderColor: link.border,
                  background: link.bg,
                }}
                data-testid={`community-link-${i}`}
              >
                <div className="flex items-center gap-4 group">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: link.bg,
                      border: `1px solid ${link.border}`,
                      boxShadow: `0 0 20px ${link.color}22`,
                    }}
                  >
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white mb-1">{link.label}</div>
                    <div className="text-sm" style={{ color: link.color + "99" }}>{link.desc}</div>
                  </div>
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                    style={{ background: link.bg, border: `1px solid ${link.border}`, color: link.color }}
                  >
                    →
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Rules / About */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-6" data-testid="community-rules">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span> Community Guidelines
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: "🤝", rule: "Respect all members — everyone's here to grow" },
                { icon: "🎮", rule: "Fair play only — no hacks, cheats, or exploits" },
                { icon: "💬", rule: "Keep discussions positive and constructive" },
                { icon: "🏆", rule: "Share skills, strategies, and help others improve" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3" data-testid={`community-rule-${i}`}>
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="text-sm text-cyan-200/60 leading-relaxed">{item.rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 text-center border-t border-cyan-400/10 mt-8" data-testid="community-footer">
        <img
          src="https://i.ibb.co/pvFLGFcC/your-logo.png"
          alt="ZhuuVIP"
          className="logo-glow mx-auto mb-4"
          style={{ height: 40, width: "auto" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="gradient-text font-bold text-lg mb-2">ZhuuVIP</div>
        <div className="text-cyan-400/40 text-sm mb-1">Built with precision and performance</div>
        <div className="text-cyan-400/30 text-xs">© {new Date().getFullYear()} ZhuuVIP. All rights reserved.</div>
      </footer>
    </div>
  );
}
