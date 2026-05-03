import { useState, useEffect, useRef, useCallback } from "react";

const AUDIO_SRC = "/bgm.mp3";
const SONG = { title: "Love Story", artist: "Indila" };

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(60);
  const [blocked, setBlocked] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0.6;
    audio.preload = "auto";
    audioRef.current = audio;

    const onCanPlay = () => {
      setReady(true);
      audio.play().then(() => { setPlaying(true); setBlocked(false); }).catch(() => { setBlocked(true); });
    };
    const onPlaying = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);

    return () => { audio.pause(); audio.src = ""; audioRef.current = null; };
  }, []);

  useEffect(() => {
    if (!blocked) return;
    const unlock = () => {
      const audio = audioRef.current;
      if (!audio || !blocked) return;
      audio.play().then(() => { setPlaying(true); setBlocked(false); }).catch(() => {});
    };
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };
  }, [blocked]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !ready) return;
    if (playing) audio.pause();
    else audio.play().catch(() => {});
  }, [playing, ready]);

  const handleVolume = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
  }, []);

  const showOverlay = blocked && !dismissed;

  return (
    <>
      {showOverlay && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,6,14,0.72)", backdropFilter: "blur(14px)",
        }}
          onClick={() => { const a = audioRef.current; if (a) a.play().then(() => { setPlaying(true); setBlocked(false); }).catch(() => { setBlocked(false); setDismissed(true); }); }}>
          <div style={{
            maxWidth: 340, width: "90%", borderRadius: 24, background: "rgba(3,14,28,0.98)",
            border: "1px solid rgba(0,255,255,0.3)", boxShadow: "0 0 60px rgba(0,200,220,0.25)",
            padding: "36px 28px 28px", textAlign: "center", position: "relative",
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setBlocked(false); setDismissed(true); }}
              style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", color: "rgba(0,200,220,0.5)", cursor: "pointer", fontSize: 18 }}>×</button>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
            <h3 style={{ color: "#00ffff", fontWeight: 700, marginBottom: 8, fontFamily: "Poppins, sans-serif" }}>Enable Background Music?</h3>
            <p style={{ color: "rgba(0,200,220,0.6)", fontSize: 14, marginBottom: 24 }}>
              <strong style={{ color: "rgba(0,220,240,0.8)" }}>{SONG.title}</strong> — {SONG.artist}
            </p>
            <button
              onClick={() => { const a = audioRef.current; if (a) a.play().then(() => { setPlaying(true); setBlocked(false); }).catch(() => { setBlocked(false); setDismissed(true); }); }}
              className="neon-btn-solid w-full py-3 rounded-full font-semibold">
              ▶ Play Music
            </button>
            <button onClick={() => { setBlocked(false); setDismissed(true); }}
              className="w-full py-2.5 rounded-full text-sm mt-3" style={{ color: "rgba(0,200,220,0.4)", background: "none", border: "none", cursor: "pointer" }}>
              Continue without music
            </button>
          </div>
        </div>
      )}

      <div style={{
        position: "fixed", bottom: 80, right: 20, zIndex: 200,
        display: "flex", flexDirection: "column", alignItems: "flex-end",
      }}>
        {expanded && (
          <div style={{
            marginBottom: 12, background: "rgba(3,14,28,0.96)", border: "1px solid rgba(0,255,255,0.2)",
            borderRadius: 16, padding: "14px 16px", minWidth: 200,
            backdropFilter: "blur(20px)", boxShadow: "0 0 30px rgba(0,200,220,0.1)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,220,240,0.8)", marginBottom: 4 }}>{SONG.title}</div>
            <div style={{ fontSize: 11, color: "rgba(0,200,220,0.5)", marginBottom: 12 }}>{SONG.artist}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, flexShrink: 0, color: "rgba(0,200,220,0.6)" }} fill="currentColor">
                <path d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.05 17.95a8 8 0 010-11.9M8.464 15.536a5 5 0 010-7.072" stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <input type="range" min={0} max={100} value={volume} onChange={(e) => handleVolume(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#00ffff", height: 4 }} />
              <span style={{ fontSize: 11, color: "rgba(0,200,220,0.5)", minWidth: 28 }}>{volume}%</span>
            </div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {playing && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 20, padding: "0 4px" }}>
              {[1, 1.5, 0.8, 1.3, 1].map((h, i) => (
                <div key={i} style={{
                  width: 3, background: "#00ffff", borderRadius: 2, opacity: 0.7,
                  animation: `playing-bar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                  height: `${h * 10}px`,
                  boxShadow: "0 0 6px rgba(0,255,255,0.5)",
                }} />
              ))}
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(3,14,28,0.9)", border: "1px solid rgba(0,255,255,0.25)",
              cursor: "pointer", color: "rgba(0,200,220,0.6)",
            }}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
              <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
            </svg>
          </button>
          <button
            onClick={togglePlay}
            style={{
              width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: playing ? "linear-gradient(135deg, rgba(0,200,220,0.8), rgba(0,150,200,0.8))" : "rgba(3,14,28,0.9)",
              border: `1px solid ${playing ? "rgba(0,255,255,0.6)" : "rgba(0,255,255,0.25)"}`,
              cursor: "pointer", fontSize: 16, color: "white",
              boxShadow: playing ? "0 0 15px rgba(0,255,255,0.3)" : "none",
            }}>
            {playing ? "⏸" : "▶"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes playing-bar {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}
