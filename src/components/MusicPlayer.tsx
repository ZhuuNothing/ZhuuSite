import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: {
      Player: new (id: string, config: object) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(v: number): void;
  getVolume(): number;
  destroy(): void;
  getPlayerState(): number;
}

const VIDEO_ID = "R7_e7YOFKJE";
const SONG = { title: "Love Story", artist: "Indila" };

export default function MusicPlayer() {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(40);
  const [showToast, setShowToast] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const initPlayer = () => {
      if (!mountedRef.current) return;
      try {
        playerRef.current = new window.YT.Player("yt-music-container", {
          height: "1",
          width: "1",
          videoId: VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            loop: 1,
            playlist: VIDEO_ID,
            playsinline: 1,
            fs: 0,
            disablekb: 1,
          },
          events: {
            onReady: () => {
              if (!mountedRef.current) return;
              playerRef.current?.setVolume(volume);
              setReady(true);
              setTimeout(() => {
                if (mountedRef.current) setShowToast(true);
              }, 2500);
            },
            onStateChange: (event: { data: number }) => {
              if (!mountedRef.current) return;
              const isPlaying = window.YT?.PlayerState &&
                event.data === window.YT.PlayerState.PLAYING;
              setPlaying(!!isPlaying);
            },
          },
        });
      } catch {
        // Player init failed silently
      }
    };

    if (!document.getElementById("yt-iframe-api")) {
      const script = document.createElement("script");
      script.id = "yt-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        initPlayer();
      };
    }

    return () => {
      mountedRef.current = false;
      try { playerRef.current?.destroy(); } catch { /* ignore */ }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 5500);
    return () => clearTimeout(t);
  }, [showToast]);

  const togglePlay = () => {
    if (!playerRef.current || !ready) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    playerRef.current?.setVolume(v);
  };

  return (
    <>
      {/* YouTube player mounts here — hidden off-screen */}
      <div
        id="yt-music-container"
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -100,
        }}
      />

      {/* Toast */}
      {showToast && (
        <div
          className="fixed glass-card flex items-center gap-3 cursor-pointer"
          style={{
            top: 76,
            right: 16,
            zIndex: 1050,
            maxWidth: 290,
            padding: "10px 14px",
            border: "1px solid rgba(0,255,255,0.22)",
            background: "rgba(4,16,26,0.95)",
            backdropFilter: "blur(20px)",
            animation: "slide-in-up 0.4s ease forwards",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,255,255,0.08)",
          }}
          onClick={() => { setShowToast(false); setExpanded(true); }}
          data-testid="music-toast"
        >
          <div
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base"
            style={{ background: "rgba(0,200,220,0.12)", border: "1px solid rgba(0,255,255,0.25)" }}
          >
            🎵
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-cyan-400/60 mb-0.5">Background Music</div>
            <div className="text-sm font-semibold text-white truncate">{SONG.title} — {SONG.artist}</div>
          </div>
          <button
            className="flex-shrink-0 text-cyan-400/40 hover:text-cyan-300 text-xs ml-1 transition-colors"
            onClick={(e) => { e.stopPropagation(); setShowToast(false); }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating music player */}
      <div
        className="fixed"
        style={{ bottom: 24, right: 16, zIndex: 1001 }}
        data-testid="music-player"
      >
        {/* Expanded panel */}
        {expanded && (
          <div
            className="mb-3"
            style={{
              width: 256,
              borderRadius: 20,
              background: "rgba(3,14,22,0.96)",
              border: "1px solid rgba(0,255,255,0.2)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 40px rgba(0,200,220,0.06)",
              animation: "slide-in-up 0.3s ease forwards",
              overflow: "hidden",
            }}
          >
            {/* Vinyl art */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(0,120,180,0.15), rgba(150,0,200,0.08))",
                padding: "24px 16px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Spinning disc */}
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 38% 35%, #1e4060, #08141e)",
                  border: "3px solid rgba(0,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: playing
                    ? "0 0 24px rgba(0,255,255,0.3), 0 0 60px rgba(0,180,220,0.15)"
                    : "0 0 10px rgba(0,0,0,0.4)",
                  animation: playing ? "float-gentle 4s ease-in-out infinite" : "none",
                  transition: "box-shadow 0.5s ease",
                }}
              >
                {/* Rings */}
                {[38, 54, 70].map((r) => (
                  <div
                    key={r}
                    style={{
                      position: "absolute",
                      width: r, height: r,
                      borderRadius: "50%",
                      border: "0.5px solid rgba(0,255,255,0.07)",
                      left: "50%", top: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  />
                ))}
                <span style={{ fontSize: 22, position: "relative", zIndex: 1 }}>🎵</span>
              </div>

              {/* Song info */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "white", fontSize: 14, marginBottom: 2 }}>{SONG.title}</div>
                <div style={{ fontSize: 12, color: "rgba(0,220,240,0.55)" }}>{SONG.artist}</div>
              </div>

              {/* Wave visualizer */}
              {playing && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 20 }}>
                  {[10, 16, 8, 20, 12, 18, 9, 15].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: 3,
                        borderRadius: 3,
                        background: "linear-gradient(to top, #00c8dc, #00ffff)",
                        height: h,
                        animation: `wave-bar ${0.5 + i * 0.07}s ease-in-out ${i * 0.06}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div style={{ padding: "14px 20px 18px" }}>
              {/* Play/Pause */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <button
                  onClick={togglePlay}
                  disabled={!ready}
                  style={{
                    width: 48, height: 48,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,255,255,0.4)",
                    background: playing
                      ? "rgba(0,255,255,0.12)"
                      : "linear-gradient(135deg, rgba(0,200,220,0.7), rgba(0,120,200,0.6))",
                    cursor: ready ? "pointer" : "wait",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: playing ? "0 0 20px rgba(0,255,255,0.35)" : "none",
                    transition: "all 0.3s ease",
                    transform: "scale(1)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                  data-testid="music-play-btn"
                >
                  {!ready ? (
                    <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(0,255,255,0.5)", borderTopColor: "#00ffff", animation: "spin 1s linear infinite" }} />
                  ) : playing ? (
                    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }} fill="#00ffff">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, marginLeft: 2 }} fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Volume */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, flexShrink: 0 }} fill="rgba(0,220,240,0.45)">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <div style={{ flex: 1, position: "relative", height: 6 }}>
                  <div style={{ height: "100%", borderRadius: 3, background: "rgba(0,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ width: `${volume}%`, height: "100%", background: "linear-gradient(90deg, #00a8c0, #00ffff)", borderRadius: 3, transition: "width 0.1s" }} />
                  </div>
                  <input
                    type="range"
                    min={0} max={100} value={volume}
                    onChange={(e) => handleVolume(Number(e.target.value))}
                    style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "100%" }}
                    data-testid="music-volume"
                  />
                </div>
                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, flexShrink: 0 }} fill="rgba(0,220,240,0.45)">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </div>

              {!ready && (
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "rgba(0,200,220,0.4)" }}>
                  Loading player…
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAB */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: 52, height: 52,
              borderRadius: "50%",
              border: "1px solid rgba(0,255,255,0.45)",
              background: playing
                ? "linear-gradient(135deg, rgba(0,210,230,0.9), rgba(0,120,200,0.8))"
                : "linear-gradient(135deg, rgba(0,180,210,0.75), rgba(0,100,180,0.65))",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
              boxShadow: playing
                ? "0 0 24px rgba(0,255,255,0.5), 0 0 48px rgba(0,200,220,0.25), 0 4px 20px rgba(0,0,0,0.4)"
                : "0 0 14px rgba(0,200,220,0.2), 0 4px 20px rgba(0,0,0,0.4)",
              transition: "all 0.3s ease",
              position: "relative",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            data-testid="music-fab"
          >
            {playing && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "rgba(0,255,255,0.15)",
                  animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>
              {playing ? "🎵" : "🎶"}
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
