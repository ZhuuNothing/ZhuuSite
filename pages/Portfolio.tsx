import { useEffect, useRef, useState } from "react";

const SKILLS = [
  { name: "JavaScript / TypeScript", level: 95, color: "#f7df1e" },
  { name: "React / Next.js", level: 92, color: "#61dafb" },
  { name: "Node.js / Express", level: 88, color: "#68a063" },
  { name: "Python", level: 82, color: "#3776ab" },
  { name: "CSS / Tailwind / SASS", level: 90, color: "#38bdf8" },
  { name: "SQL / PostgreSQL", level: 80, color: "#336791" },
  { name: "Docker / DevOps", level: 75, color: "#2496ed" },
  { name: "C++ / System Programming", level: 70, color: "#00599c" },
];

const PROJECTS = [
  {
    title: "OceanNet Speed Platform",
    desc: "Full-stack internet speed testing platform with real-time graphs, history tracking, and performance analytics.",
    tags: ["React", "Node.js", "WebSockets", "Chart.js"],
    color: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30",
    icon: "⚡",
    status: "Live",
  },
  {
    title: "ZhuuVIP Portfolio System",
    desc: "Cinematic underwater-themed portfolio with advanced CSS animations, SVG characters, and interactive particle systems.",
    tags: ["React", "Framer Motion", "Canvas API", "GSAP"],
    color: "from-teal-500/20 to-cyan-600/20",
    border: "border-teal-500/30",
    icon: "🌊",
    status: "Live",
  },
  {
    title: "Free Fire Skill Tracker",
    desc: "Gaming performance tracker for mobile FPS games with stat analysis and community leaderboards.",
    tags: ["React", "Firebase", "Express", "TypeScript"],
    color: "from-purple-500/20 to-pink-600/20",
    border: "border-purple-500/30",
    icon: "🎮",
    status: "Beta",
  },
  {
    title: "DeepData Analytics",
    desc: "Real-time data visualization dashboard processing millions of events per day with sub-second query response.",
    tags: ["PostgreSQL", "Redis", "React", "D3.js"],
    color: "from-orange-500/20 to-red-600/20",
    border: "border-orange-500/30",
    icon: "📊",
    status: "In Dev",
  },
  {
    title: "AutoBot Framework",
    desc: "Intelligent automation framework for web scraping, task scheduling, and workflow orchestration.",
    tags: ["Python", "Selenium", "Redis", "FastAPI"],
    color: "from-green-500/20 to-teal-600/20",
    border: "border-green-500/30",
    icon: "🤖",
    status: "Live",
  },
  {
    title: "CipherVault Security",
    desc: "Enterprise-grade password manager with end-to-end encryption and zero-knowledge architecture.",
    tags: ["Rust", "Cryptography", "React", "WebAssembly"],
    color: "from-indigo-500/20 to-purple-600/20",
    border: "border-indigo-500/30",
    icon: "🔐",
    status: "Alpha",
  },
];

const TECH_ICONS = [
  { name: "React", bg: "#61dafb22", color: "#61dafb" },
  { name: "TS", bg: "#3178c622", color: "#3178c6" },
  { name: "Node", bg: "#68a06322", color: "#68a063" },
  { name: "Python", bg: "#3776ab22", color: "#3776ab" },
  { name: "Docker", bg: "#2496ed22", color: "#2496ed" },
  { name: "Git", bg: "#f0502422", color: "#f05024" },
  { name: "SQL", bg: "#33679122", color: "#336791" },
  { name: "Redis", bg: "#dc382d22", color: "#dc382d" },
  { name: "AWS", bg: "#ff990022", color: "#ff9900" },
  { name: "Linux", bg: "#fcc62422", color: "#fcc624" },
];

function SkillBar({ skill, visible }: { skill: typeof SKILLS[0]; visible: boolean }) {
  return (
    <div className="mb-5" data-testid={`skill-bar-${skill.name.replace(/\s+/g, "-").toLowerCase()}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white/80">{skill.name}</span>
        <span className="text-sm font-bold" style={{ color: skill.color }}>{skill.level}%</span>
      </div>
      <div className="h-2 bg-cyan-400/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all ease-out"
          style={{
            width: visible ? `${skill.level}%` : "0%",
            background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`,
            boxShadow: `0 0 8px ${skill.color}60`,
            transitionDuration: "1.5s",
            transitionDelay: "0.3s",
          }}
        />
      </div>
    </div>
  );
}

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

export default function Portfolio() {
  const [pageVisible, setPageVisible] = useState(false);
  const skillsSection = useScrollReveal();
  const projectsSection = useScrollReveal();
  const techSection = useScrollReveal();

  useEffect(() => { setTimeout(() => setPageVisible(true), 100); }, []);

  return (
    <div className="ocean-bg min-h-screen pt-16 pb-32 md:pb-16" data-testid="portfolio-page">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div
          className={`transition-all duration-1000 ${pageVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-sm font-medium tracking-widest text-cyan-400/70 uppercase mb-4">👨‍💻 Developer</div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            <span className="gradient-text">ZhuuVIP</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/70 mb-3 font-semibold">Computer Language Specialist</p>
          <p className="text-cyan-200/50 max-w-2xl mx-auto text-base leading-relaxed">
            Crafting digital experiences from the depths of code. Specializing in full-stack web development, 
            system programming, and building tools that push the boundaries of performance.
          </p>
        </div>

        {/* Floating badges */}
        <div
          className={`flex flex-wrap justify-center gap-3 mt-8 transition-all duration-1000 ${pageVisible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "0.4s" }}
        >
          {["Full-Stack Dev", "System Engineer", "Open Source", "Performance Optimizer"].map((badge) => (
            <span key={badge} className="glass-card px-4 py-2 text-sm font-medium text-cyan-300" data-testid={`portfolio-badge-${badge}`}>
              {badge}
            </span>
          ))}
        </div>
      </section>

      <div className="section-divider mx-4" />

      {/* About */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div className={`transition-all duration-700 ${pageVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`} style={{ transitionDelay: "0.2s" }}>
              <h2 className="text-3xl font-bold gradient-text mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>About Me</h2>
              <p className="text-cyan-200/60 leading-relaxed mb-4">
                I'm a dedicated software engineer with deep expertise across multiple programming paradigms and languages. 
                My passion lies in building systems that are not just functional, but exceptional — fast, elegant, and maintainable.
              </p>
              <p className="text-cyan-200/60 leading-relaxed mb-4">
                From low-level system programming in C++ to crafting immersive web experiences with React, 
                I navigate the full spectrum of modern software development with confidence and precision.
              </p>
              <p className="text-cyan-200/60 leading-relaxed">
                Every project is an opportunity to push boundaries, optimize performance, and create something that genuinely matters.
              </p>
            </div>

            <div className={`grid grid-cols-2 gap-4 transition-all duration-700 ${pageVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`} style={{ transitionDelay: "0.4s" }}>
              {[
                { label: "Years Experience", value: "5+" },
                { label: "Projects Shipped", value: "100+" },
                { label: "Languages Known", value: "12+" },
                { label: "Coffee Consumed", value: "∞" },
              ].map((item) => (
                <div key={item.label} className="glass-card p-4 text-center" data-testid={`about-stat-${item.label}`}>
                  <div className="text-2xl font-black gradient-text mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{item.value}</div>
                  <div className="text-xs text-cyan-200/40">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider mx-4" />

      {/* Skills */}
      <section ref={skillsSection.ref} className="py-16 px-4" data-testid="portfolio-skills-section">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${skillsSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-sm font-medium tracking-widest text-cyan-400/70 uppercase mb-3">Expertise</div>
            <h2 className="text-3xl font-bold gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>Technical Skills</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-12">
            {SKILLS.map((skill, i) => (
              <div
                key={skill.name}
                className={`transition-all duration-700 ${skillsSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <SkillBar skill={skill} visible={skillsSection.visible} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Icons */}
      <section ref={techSection.ref} className="py-8 px-4" data-testid="portfolio-tech-section">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {TECH_ICONS.map((tech, i) => (
              <div
                key={tech.name}
                className={`glass-card glass-card-hover w-16 h-16 flex items-center justify-center font-bold text-xs cursor-default transition-all duration-700 ${techSection.visible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                style={{
                  transitionDelay: `${i * 0.06}s`,
                  background: tech.bg,
                  borderColor: tech.color + "44",
                  color: tech.color,
                  textShadow: `0 0 10px ${tech.color}`,
                }}
                data-testid={`tech-icon-${tech.name}`}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-4" />

      {/* Projects */}
      <section ref={projectsSection.ref} className="py-16 px-4" data-testid="portfolio-projects-section">
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${projectsSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="text-sm font-medium tracking-widest text-cyan-400/70 uppercase mb-3">Work</div>
            <h2 className="text-3xl font-bold gradient-text" style={{ fontFamily: "Poppins, sans-serif" }}>Featured Projects</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((proj, i) => (
              <div
                key={proj.title}
                className={`glass-card glass-card-hover p-6 flex flex-col transition-all duration-700 ${projectsSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
                data-testid={`project-card-${i}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${proj.color} ${proj.border} border flex items-center justify-center text-xl`}>
                    {proj.icon}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    proj.status === "Live" ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : proj.status === "Beta" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : proj.status === "Alpha" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}>
                    {proj.status}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mb-2">{proj.title}</h3>
                <p className="text-sm text-cyan-200/50 leading-relaxed flex-1 mb-4">{proj.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {proj.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-cyan-400/8 text-cyan-400/70 border border-cyan-400/15">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 text-center border-t border-cyan-400/10 mt-8" data-testid="portfolio-footer">
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
