import { useEffect, useRef, useState } from "react";

export default function UnderwaterMascot() {
  const mascotRef = useRef<SVGSVGElement>(null);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const el = mascotRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 4;
      const scale = Math.min(dist, 120) / 120;
      setEyePos({
        x: (dx / dist) * maxDist * scale || 0,
        y: (dy / dist) * maxDist * scale || 0,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <div
      className={`relative cursor-pointer select-none float-animation ${hovered ? "scale-110" : "scale-100"}`}
      style={{ transition: "transform 0.3s ease", display: "inline-block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      data-testid="mascot"
    >
      {clicked && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 10 }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 6, height: 6,
                background: "#00ffff",
                left: "50%", top: "50%",
                boxShadow: "0 0 6px rgba(0,255,255,0.8)",
                animation: "ripple 0.6s ease-out forwards",
                transform: `rotate(${i * 45}deg) translateX(${20 + Math.random() * 30}px)`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      <svg
        ref={mascotRef}
        viewBox="0 0 120 160"
        width={120}
        height={160}
        style={{
          filter: hovered
            ? "drop-shadow(0 0 20px rgba(0,255,255,0.9)) drop-shadow(0 0 40px rgba(0,200,220,0.5))"
            : "drop-shadow(0 0 10px rgba(0,255,255,0.4)) drop-shadow(0 0 20px rgba(0,200,220,0.2))",
          transition: "filter 0.3s ease",
        }}
        data-testid="mascot-svg"
      >
        {/* Tentacles */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M ${35 + i * 12} 130 Q ${30 + i * 13} ${145 + (i % 2 === 0 ? 10 : -5)} ${28 + i * 13} 155`}
            stroke="rgba(0,200,220,0.6)"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {/* Body */}
        <ellipse cx="60" cy="90" rx="42" ry="50"
          fill="url(#bodyGrad)"
          stroke="rgba(0,255,255,0.4)"
          strokeWidth={1}
        />

        {/* Head dome */}
        <ellipse cx="60" cy="60" rx="38" ry="42"
          fill="url(#headGrad)"
          stroke="rgba(0,255,255,0.3)"
          strokeWidth={1}
        />

        {/* Shimmer */}
        <ellipse cx="50" cy="38" rx="12" ry="18" fill="rgba(255,255,255,0.08)" />
        <ellipse cx="44" cy="34" rx="5" ry="8" fill="rgba(255,255,255,0.12)" />

        {/* Left eye */}
        <g transform={`translate(${42 + eyePos.x}, ${52 + eyePos.y})`}>
          <circle r="9" fill="rgba(0,30,40,0.9)" />
          <circle r="7" fill="url(#eyeGrad)" />
          <circle cx="2" cy="-2" r="3" fill="rgba(255,255,255,0.15)" />
          <circle cx="-3" cy="2" r="1.5" fill="rgba(255,255,255,0.1)" />
        </g>

        {/* Right eye */}
        <g transform={`translate(${78 + eyePos.x}, ${52 + eyePos.y})`}>
          <circle r="9" fill="rgba(0,30,40,0.9)" />
          <circle r="7" fill="url(#eyeGrad)" />
          <circle cx="2" cy="-2" r="3" fill="rgba(255,255,255,0.15)" />
          <circle cx="-3" cy="2" r="1.5" fill="rgba(255,255,255,0.1)" />
        </g>

        {/* Eyelids for blink */}
        <g style={{ animation: "blink 4s ease-in-out infinite" }}>
          <ellipse cx="42" cy="52" rx="10" ry="2" fill="rgba(0,180,220,0.7)" />
          <ellipse cx="78" cy="52" rx="10" ry="2" fill="rgba(0,180,220,0.7)" />
        </g>

        {/* Smile */}
        <path
          d={hovered ? "M 48 75 Q 60 85 72 75" : "M 48 72 Q 60 80 72 72"}
          stroke="rgba(0,255,255,0.6)"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          style={{ transition: "d 0.3s ease" }}
        />

        {/* Cheeks */}
        <ellipse cx="38" cy="74" rx="7" ry="4" fill="rgba(0,255,180,0.15)" />
        <ellipse cx="82" cy="74" rx="7" ry="4" fill="rgba(0,255,180,0.15)" />

        {/* Fins */}
        <path d="M 18 80 Q 5 70 15 60 Q 20 75 22 82 Z" fill="rgba(0,180,220,0.4)" stroke="rgba(0,255,255,0.3)" strokeWidth={0.5} />
        <path d="M 102 80 Q 115 70 105 60 Q 100 75 98 82 Z" fill="rgba(0,180,220,0.4)" stroke="rgba(0,255,255,0.3)" strokeWidth={0.5} />

        <defs>
          <radialGradient id="bodyGrad" cx="0.4" cy="0.3">
            <stop offset="0%" stopColor="rgba(0,180,220,0.5)" />
            <stop offset="60%" stopColor="rgba(0,120,180,0.35)" />
            <stop offset="100%" stopColor="rgba(0,80,140,0.2)" />
          </radialGradient>
          <radialGradient id="headGrad" cx="0.4" cy="0.3">
            <stop offset="0%" stopColor="rgba(0,210,240,0.55)" />
            <stop offset="50%" stopColor="rgba(0,150,200,0.4)" />
            <stop offset="100%" stopColor="rgba(0,100,160,0.25)" />
          </radialGradient>
          <radialGradient id="eyeGrad" cx="0.35" cy="0.35">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="40%" stopColor="#0080c0" />
            <stop offset="100%" stopColor="#003060" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
