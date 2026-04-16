import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import UnderwaterMascot from "@/components/UnderwaterMascot";

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── HERO ─────────────────────────────────────────────────────────── */
function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" data-testid="hero-section">
      {/* Radial glow backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: "absolute", left: "50%", top: "40%",
          transform: "translate(-50%,-50%)",
          width: 700, height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,200,220,0.07) 0%, rgba(0,100,180,0.04) 50%, transparent 70%)",
        }} />
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.03 }}>
        <img src="https://i.ibb.co/pvFLGFcC/your-logo.png" alt=""
          style={{ width: "55vw", maxWidth: 560 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Tag */}
        <div className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{
            background: "rgba(0,200,220,0.08)", border: "1px solid rgba(0,255,255,0.2)",
            color: "rgba(0,220,240,0.8)", letterSpacing: "0.15em",
            transitionDelay: "0.1s",
          }}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Premium Digital Experience Platform
        </div>

        {/* Mascot */}
        <div className={`flex justify-center mb-8 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "0.25s" }}>
          <UnderwaterMascot />
        </div>

        {/* Headline */}
        <div className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "0.4s" }}>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.9] mb-6 tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            <span className="gradient-text">ZhuuVIP</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.65em", fontWeight: 700 }}>
              Digital Ocean
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-cyan-200/55 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            The world's most immersive underwater digital platform — blazing speed testing, 
            elite portfolio showcase, and the finest gaming community. 
            <span className="text-cyan-300/70 font-medium"> Where the deep meets the premium.</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-wrap justify-center gap-4 mb-16 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "0.6s" }}>
          <Link href="/speedtest">
            <button className="group relative px-8 py-4 rounded-full font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, rgba(0,200,220,0.85), rgba(0,120,200,0.8))",
                border: "1px solid rgba(0,255,255,0.5)",
                color: "white",
                boxShadow: "0 0 30px rgba(0,200,220,0.3), 0 4px 20px rgba(0,0,0,0.3)",
              }}
              data-testid="hero-btn-speedtest">
              <span className="relative z-10 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Run Speed Test
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(135deg, rgba(0,230,255,0.3), rgba(0,150,220,0.2))" }} />
            </button>
          </Link>
          <Link href="/portfolio">
            <button className="neon-btn px-8 py-4 rounded-full font-semibold text-base" data-testid="hero-btn-portfolio">
              View Portfolio
            </button>
          </Link>
          <Link href="/community">
            <button className="px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105"
              style={{ background: "rgba(255,100,50,0.12)", border: "1px solid rgba(255,100,50,0.35)", color: "rgba(255,150,80,0.9)" }}
              data-testid="hero-btn-community">
              Join Community
            </button>
          </Link>
        </div>

        {/* Trust bar */}
        <div className={`flex flex-wrap justify-center gap-6 sm:gap-10 transition-all duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "0.8s" }}>
          {[
            { icon: "⚡", label: "Real Speed Testing" },
            { icon: "🔒", label: "100% Secure" },
            { icon: "🌊", label: "60fps Animations" },
            { icon: "🎮", label: "Gaming Community" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-xs text-cyan-300/50">
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="text-xs text-cyan-400/40 tracking-widest uppercase">Scroll</div>
        <div className="w-px h-10 bg-gradient-to-b from-cyan-400/40 to-transparent" />
      </div>
    </section>
  );
}

/* ─── STATS BAR ─────────────────────────────────────────────────────── */
function StatsBar() {
  const { ref, visible } = useScrollReveal();
  const stats = [
    { value: "500+", label: "Active Users", icon: "👥" },
    { value: "∞", label: "Lines of Code", icon: "💻" },
    { value: "60fps", label: "Smooth Performance", icon: "⚡" },
    { value: "100%", label: "Passion Driven", icon: "🔥" },
    { value: "24/7", label: "Always Online", icon: "🌊" },
  ];
  return (
    <div ref={ref} className="relative z-10 py-6 px-4" data-testid="stats-bar">
      <div className="section-divider mb-8" />
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-6">
        {stats.map((s, i) => (
          <div key={s.label}
            className={`text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: `${i * 0.08}s` }}
            data-testid={`stat-${i}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</div>
            <div className="text-xs text-cyan-400/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="section-divider mt-8" />
    </div>
  );
}

/* ─── FEATURES ───────────────────────────────────────────────────────── */
function FeaturesSection() {
  const { ref, visible } = useScrollReveal();
  const features = [
    {
      icon: "⚡",
      title: "Blazing Speed Test",
      desc: "Real-time download, upload, and ping measurement with animated circular gauges, live graphs, and persistent history stored locally.",
      color: "#00c8dc", bg: "rgba(0,200,220,0.08)", border: "rgba(0,200,220,0.2)",
      link: "/speedtest", linkLabel: "Test Speed →",
    },
    {
      icon: "👨‍💻",
      title: "Elite Portfolio",
      desc: "A developer showcase built for impact. Animated skill bars, live project cards, tech stack icons — every section scroll-reveal animated.",
      color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)",
      link: "/portfolio", linkLabel: "View Portfolio →",
    },
    {
      icon: "🎮",
      title: "Gaming Community",
      desc: "Free Fire One Shoot challenge arena. Join scrims, test your aim, and grow alongside skilled players in an active, 500+ member community.",
      color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)",
      link: "/community", linkLabel: "Join Squad →",
    },
    {
      icon: "🌊",
      title: "Living Ocean World",
      desc: "A cinematic animated environment — interactive bubbles, schools of fish, parallax light rays, plankton particles, and cursor-reactive effects.",
      color: "#22d3ee", bg: "rgba(34,211,238,0.08)", border: "rgba(34,211,238,0.2)",
      link: "/", linkLabel: "Experience →",
    },
    {
      icon: "🎵",
      title: "Ambient Soundtrack",
      desc: "Immersive background music — Love Story by Indila plays softly as you explore. Toggle, adjust volume, and lose yourself in the ambiance.",
      color: "#e879f9", bg: "rgba(232,121,249,0.08)", border: "rgba(232,121,249,0.2)",
      link: "/", linkLabel: "Play Music →",
    },
    {
      icon: "📱",
      title: "Fully Responsive",
      desc: "Pixel-perfect on any screen. Desktop navbar, floating mobile bottom nav, and touch-optimized interactions throughout.",
      color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)",
      link: "/", linkLabel: "Explore →",
    },
  ];

  return (
    <section ref={ref} className="relative z-10 py-24 px-4" data-testid="features-section">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-sm font-semibold tracking-widest text-cyan-400/60 uppercase mb-4">What's Inside</div>
          <h2 className="text-4xl sm:text-5xl font-black gradient-text mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Everything. Premium.
          </h2>
          <p className="text-cyan-200/45 max-w-xl mx-auto">
            Every feature hand-crafted with obsessive attention to detail, performance, and visual elegance.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={f.title}
              className={`group glass-card p-7 flex flex-col transition-all duration-700 cursor-default ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                transitionDelay: `${i * 0.1}s`,
                background: f.bg, borderColor: f.border,
              }}
              data-testid={`feature-card-${i}`}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: f.bg, border: `1px solid ${f.border}`, boxShadow: `0 0 20px ${f.color}15` }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-cyan-200/45 leading-relaxed flex-1 mb-5">{f.desc}</p>
              <Link href={f.link}>
                <span className="text-sm font-semibold transition-all duration-200 hover:gap-2" style={{ color: f.color }}>
                  {f.linkLabel}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── EXPERIENCE PREVIEW ─────────────────────────────────────────────── */
function ExperienceSection() {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref} className="relative z-10 py-20 px-4" data-testid="experience-section">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0,150,200,0.1), rgba(100,0,200,0.06), rgba(0,200,180,0.08))",
            border: "1px solid rgba(0,255,255,0.18)",
          }}>
          <div className="grid sm:grid-cols-2 items-center gap-0">
            {/* Left */}
            <div className={`p-10 transition-all duration-800 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="text-sm font-semibold tracking-widest text-cyan-400/60 uppercase mb-4">Speed Test</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
                Know Your Real<br /><span className="gradient-text">Connection Speed</span>
              </h2>
              <p className="text-cyan-200/50 mb-6 text-sm leading-relaxed">
                Animated circular gauges, live real-time graphs, download/upload/ping stats — 
                and a history log so you track every test, forever.
              </p>
              <ul className="space-y-2 mb-8">
                {["Download & Upload gauges", "Ping / latency meter", "Live speed graph", "History in localStorage"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-cyan-200/60">
                    <span className="text-cyan-400 text-xs">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/speedtest">
                <button className="neon-btn-solid px-7 py-3 rounded-full font-semibold text-sm" data-testid="experience-speedtest-btn">
                  Try It Now →
                </button>
              </Link>
            </div>
            {/* Right — preview mockup */}
            <div className={`p-6 sm:p-10 transition-all duration-800 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`} style={{ transitionDelay: "0.2s" }}>
              <div className="glass-card p-6 text-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                {/* Mini gauge mockup */}
                <svg viewBox="0 0 180 180" width={180} height={180} className="mx-auto mb-4">
                  <circle cx={90} cy={90} r={70} fill="none" stroke="rgba(0,255,255,0.06)" strokeWidth={10}
                    strokeDasharray={`${440 * 0.75} ${440 * 0.25}`} strokeDashoffset={`${440 * 0.125}`}
                    strokeLinecap="round" transform="rotate(135,90,90)" />
                  <circle cx={90} cy={90} r={70} fill="none" stroke="url(#gm)" strokeWidth={10}
                    strokeDasharray={`${440 * 0.75 * 0.72} ${440 * (1 - 0.75 * 0.72)}`} strokeDashoffset={`${440 * 0.125}`}
                    strokeLinecap="round" transform="rotate(135,90,90)"
                    style={{ filter: "drop-shadow(0 0 6px rgba(0,255,255,0.4))" }} />
                  <text x={90} y={84} textAnchor="middle" fill="white" fontSize={22} fontWeight={800}>248</text>
                  <text x={90} y={100} textAnchor="middle" fill="#00c8dc" fontSize={11}>Mbps Download</text>
                  <defs>
                    <linearGradient id="gm" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00a0c0" /><stop offset="100%" stopColor="#00ffff" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[{ l: "↑ Upload", v: "121 Mb" }, { l: "◎ Ping", v: "12 ms" }, { l: "✓ Grade", v: "A+" }].map(s => (
                    <div key={s.l} className="rounded-lg py-2" style={{ background: "rgba(0,255,255,0.05)" }}>
                      <div className="text-xs font-bold text-white">{s.v}</div>
                      <div className="text-xs text-cyan-400/40">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PLANS / PRICING ────────────────────────────────────────────────── */
function PricingSection() {
  const { ref, visible } = useScrollReveal();
  const plans = [
    {
      name: "Explorer",
      price: "Free",
      badge: null,
      desc: "Perfect for getting started",
      features: ["Speed Test (unlimited)", "Portfolio view", "Community access", "Mobile + desktop"],
      cta: "Get Started",
      href: "/",
      style: { border: "rgba(0,255,255,0.15)", badge: "" },
    },
    {
      name: "Diver",
      price: "Premium",
      badge: "Most Popular",
      desc: "The full underwater experience",
      features: ["Everything in Explorer", "Ambient music player", "Advanced animations", "Priority support", "Custom mascot themes"],
      cta: "Go Premium",
      href: "/",
      style: { border: "rgba(0,255,255,0.4)", badge: "" },
      highlight: true,
    },
    {
      name: "Shark",
      price: "Elite",
      badge: "VIP",
      desc: "Exclusive access & custom builds",
      features: ["Everything in Diver", "Custom ocean theme", "Personal portfolio build", "Dedicated community channel", "1-on-1 coaching"],
      cta: "Contact VIP",
      href: "/community",
      style: { border: "rgba(255,100,50,0.3)", badge: "" },
    },
  ];

  return (
    <section ref={ref} className="relative z-10 py-24 px-4" data-testid="pricing-section">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-sm font-semibold tracking-widest text-cyan-400/60 uppercase mb-4">Plans</div>
          <h2 className="text-4xl sm:text-5xl font-black gradient-text mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Choose Your Depth
          </h2>
          <p className="text-cyan-200/45 max-w-md mx-auto">
            Start free, go deeper when you're ready. Every tier unlocks a richer underwater experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={plan.name}
              className={`glass-card p-7 flex flex-col relative transition-all duration-700 ${plan.highlight ? "scale-105" : ""} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                transitionDelay: `${i * 0.15}s`,
                borderColor: plan.style.border,
                boxShadow: plan.highlight ? "0 0 40px rgba(0,255,255,0.12), 0 20px 40px rgba(0,0,0,0.3)" : "none",
              }}
              data-testid={`plan-card-${plan.name}`}>

              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: plan.highlight ? "linear-gradient(135deg, #00c8dc, #0080ff)" : "rgba(255,100,50,0.2)",
                    color: plan.highlight ? "white" : "#ff8050",
                    border: plan.highlight ? "none" : "1px solid rgba(255,100,50,0.4)",
                  }}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className="text-xs text-cyan-400/50 uppercase tracking-wider mb-2">{plan.name}</div>
                <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{plan.price}</div>
                <div className="text-sm text-cyan-200/40">{plan.desc}</div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-cyan-200/55">
                    <span className="text-cyan-400 flex-shrink-0 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <button className={`w-full py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 ${plan.highlight ? "neon-btn-solid" : "neon-btn"}`}
                  data-testid={`plan-cta-${plan.name}`}>
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────────────────── */
function TestimonialsSection() {
  const { ref, visible } = useScrollReveal();
  const testimonials = [
    { name: "Rizky A.", role: "Competitive Gamer", text: "The community is fire. Best Free Fire group I've ever been in — active every day, real players, real skills.", avatar: "🎮", color: "#f97316" },
    { name: "Dimas F.", role: "Web Developer", text: "ZhuuVIP's portfolio site genuinely inspired my own. The animations are insane — feels like 2030 tech.", avatar: "💻", color: "#22d3ee" },
    { name: "Sari N.", role: "Content Creator", text: "I use the speed test every day before streaming. The gauge UI is beautiful, way better than any other tool.", avatar: "📡", color: "#a78bfa" },
    { name: "Budi K.", role: "Student", text: "Masuk komunitas ZhuuVIP terbaik! Banyak belajar skill FF dan dapat teman baru dari seluruh Indonesia.", avatar: "🏆", color: "#4ade80" },
  ];

  return (
    <section ref={ref} className="relative z-10 py-24 px-4" data-testid="testimonials-section">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-sm font-semibold tracking-widest text-cyan-400/60 uppercase mb-4">Voices</div>
          <h2 className="text-4xl sm:text-5xl font-black gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>
            The Squad Speaks
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div key={t.name}
              className={`glass-card p-7 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
              data-testid={`testimonial-${i}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ background: `${t.color}18`, border: `1px solid ${t.color}35` }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs" style={{ color: t.color + "99" }}>{t.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} viewBox="0 0 12 12" className="w-3 h-3" fill={t.color}><path d="M6 0l1.5 4H12L8.5 6.5 10 11 6 8.5 2 11l1.5-4.5L0 4h4.5z"/></svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-cyan-200/50 leading-relaxed italic">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA BANNER ─────────────────────────────────────────────────────── */
function CTABanner() {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref} className="relative z-10 py-20 px-4" data-testid="cta-banner">
      <div className="max-w-4xl mx-auto">
        <div
          className={`rounded-3xl p-10 sm:p-14 text-center transition-all duration-800 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          style={{
            background: "linear-gradient(135deg, rgba(0,160,200,0.15) 0%, rgba(0,80,160,0.1) 50%, rgba(0,200,180,0.12) 100%)",
            border: "1px solid rgba(0,255,255,0.2)",
            boxShadow: "0 0 80px rgba(0,200,220,0.08), 0 20px 60px rgba(0,0,0,0.3)",
          }}>
          <div className="text-4xl mb-4">🌊</div>
          <h2 className="text-3xl sm:text-5xl font-black gradient-text mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Ready to Dive In?
          </h2>
          <p className="text-cyan-200/50 mb-10 max-w-lg mx-auto text-base leading-relaxed">
            Join hundreds of users already living inside the ZhuuVIP ocean. 
            Test your speed, explore the portfolio, or join the gaming community — 
            the deep awaits.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/speedtest">
              <button className="neon-btn-solid px-10 py-4 rounded-full font-bold text-base hover:scale-105 transition-transform" data-testid="cta-speedtest">
                ⚡ Start Speed Test
              </button>
            </Link>
            <Link href="/community">
              <button className="neon-btn px-10 py-4 rounded-full font-bold text-base hover:scale-105 transition-transform" data-testid="cta-community">
                🎮 Join Community
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────── */
function Footer() {
  const links = [
    { label: "Home", href: "/" },
    { label: "Speed Test", href: "/speedtest" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Community", href: "/community" },
  ];
  return (
    <footer className="relative z-10 border-t px-4 py-14" style={{ borderColor: "rgba(0,255,255,0.08)" }} data-testid="footer">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="https://i.ibb.co/pvFLGFcC/your-logo.png" alt="ZhuuVIP" className="logo-glow"
              style={{ height: 40, width: "auto" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <div className="gradient-text font-bold text-lg leading-none">ZhuuVIP</div>
              <div className="text-xs text-cyan-400/40 mt-1">Digital Ocean Platform</div>
            </div>
          </div>
          {/* Nav */}
          <nav className="flex gap-6">
            {links.map(l => (
              <Link key={l.href} href={l.href}>
                <span className="text-sm text-cyan-400/50 hover:text-cyan-300 transition-colors cursor-pointer">{l.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="section-divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cyan-400/30">
          <div>© {new Date().getFullYear()} ZhuuVIP. All rights reserved.</div>
          <div className="italic">Built with precision and performance — from the depths of the ocean.</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="ocean-bg min-h-screen pb-24 md:pb-0" data-testid="home-page">
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <ExperienceSection />
      <PricingSection />
      <TestimonialsSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
