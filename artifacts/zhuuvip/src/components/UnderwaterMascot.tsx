import { useState } from "react";

interface Props {
  size?: number;
  message?: string;
  blinking?: boolean;
  className?: string;
}

export default function UnderwaterMascot({ size = 120, message, blinking = true, className = "" }: Props) {
  const [blink, setBlink] = useState(false);

  return (
    <div
      className={`float-animation ${className}`}
      style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}
      onMouseEnter={() => setBlink(true)}
      onMouseLeave={() => setBlink(false)}
    >
      {message && (
        <div style={{
          position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,30,50,0.95)", border: "1px solid rgba(0,255,255,0.3)",
          borderRadius: 12, padding: "8px 12px", whiteSpace: "nowrap",
          color: "#00ffff", fontSize: 13, fontWeight: 500,
          boxShadow: "0 0 15px rgba(0,255,255,0.2)",
          animation: "msg-fade-in 0.4s ease forwards",
        }}>
          {message}
          <div style={{
            position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0, borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent", borderTop: "6px solid rgba(0,255,255,0.3)",
          }} />
        </div>
      )}
      <div style={{
        width: size, height: size, borderRadius: "50%", overflow: "hidden",
        border: "3px solid rgba(0,255,255,0.4)",
        boxShadow: "0 0 30px rgba(0,255,255,0.3), 0 0 60px rgba(0,200,220,0.15)",
        cursor: "pointer",
      }}>
        <img
          src="/zhuu-avatar.jpg"
          alt="Zhuu"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
      </div>
      {(blinking || blink) && (
        <div style={{
          position: "absolute", top: 8, right: 8, width: 10, height: 10,
          background: "#00ffff", borderRadius: "50%",
          animation: "pulse-glow 2s ease-in-out infinite",
        }} />
      )}
    </div>
  );
}
