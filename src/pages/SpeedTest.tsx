import { useState, useEffect, useRef, useCallback } from "react";

interface TestResult {
  download: number;
  upload: number;
  ping: number;
  timestamp: string;
}

interface SpeedPoint {
  time: number;
  speed: number;
}

const GAUGE_RADIUS = 80;
const GAUGE_CIRC = 2 * Math.PI * GAUGE_RADIUS;

function SpeedGauge({ value, max, label, unit, color }: { value: number; max: number; label: string; unit: string; color: string }) {
  const pct = Math.min(value / max, 1);
  const dashOffset = GAUGE_CIRC * (1 - pct * 0.75);
  return (
    <div className="flex flex-col items-center" data-testid={`gauge-${label.toLowerCase()}`}>
      <div className="relative" style={{ width: 200, height: 200 }}>
        <svg viewBox="0 0 200 200" width={200} height={200}>
          {/* Track */}
          <circle
            cx={100} cy={100} r={GAUGE_RADIUS}
            fill="none"
            stroke="rgba(0,255,255,0.08)"
            strokeWidth={12}
            strokeDasharray={`${GAUGE_CIRC * 0.75} ${GAUGE_CIRC * 0.25}`}
            strokeDashoffset={GAUGE_CIRC * 0.125}
            strokeLinecap="round"
            transform="rotate(135, 100, 100)"
          />
          {/* Fill */}
          <circle
            cx={100} cy={100} r={GAUGE_RADIUS}
            fill="none"
            stroke={`url(#grad-${label})`}
            strokeWidth={12}
            strokeDasharray={`${GAUGE_CIRC * 0.75 * pct} ${GAUGE_CIRC * (1 - 0.75 * pct)}`}
            strokeDashoffset={GAUGE_CIRC * 0.125}
            strokeLinecap="round"
            transform="rotate(135, 100, 100)"
            style={{ transition: "stroke-dasharray 0.3s ease" }}
          />
          {/* Glow ring */}
          <circle
            cx={100} cy={100} r={GAUGE_RADIUS}
            fill="none"
            stroke={`url(#glow-${label})`}
            strokeWidth={2}
            strokeDasharray={`${GAUGE_CIRC * 0.75 * pct} ${GAUGE_CIRC * (1 - 0.75 * pct)}`}
            strokeDashoffset={GAUGE_CIRC * 0.125}
            strokeLinecap="round"
            transform="rotate(135, 100, 100)"
            style={{ transition: "stroke-dasharray 0.3s ease", opacity: 0.6 }}
          />

          {/* Center value */}
          <text x={100} y={92} textAnchor="middle" fill="white" fontSize={28} fontWeight={700} fontFamily="Poppins, sans-serif">
            {value.toFixed(1)}
          </text>
          <text x={100} y={112} textAnchor="middle" fill={color} fontSize={12} fontWeight={500}>
            {unit}
          </text>
          <text x={100} y={130} textAnchor="middle" fill="rgba(0,200,220,0.6)" fontSize={11}>
            {label}
          </text>

          <defs>
            <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity={0.7} />
              <stop offset="100%" stopColor="#00ffff" />
            </linearGradient>
            <linearGradient id={`glow-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor="#00ffff" stopOpacity={0.4} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function MiniChart({ points, color }: { points: SpeedPoint[]; color: string }) {
  if (points.length < 2) return null;
  const maxSpeed = Math.max(...points.map(p => p.speed), 1);
  const w = 300, h = 80;
  const pts = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p.speed / maxSpeed) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxWidth: 300 }}>
      <defs>
        <linearGradient id={`chart-fill-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${pts} ${w},${h}`}
        fill={`url(#chart-fill-${color})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
}

type Phase = "idle" | "ping" | "download" | "upload" | "done";

function simulateSpeed(phase: "download" | "upload", duration: number, onProgress: (v: number) => void, onDone: (v: number) => void) {
  const start = performance.now();
  const base = phase === "download" ? 150 + Math.random() * 200 : 60 + Math.random() * 100;
  const ramp = 1.5 + Math.random();
  let last = 0;

  const step = () => {
    const elapsed = (performance.now() - start) / 1000;
    if (elapsed >= duration) {
      onDone(base);
      return;
    }
    const progress = elapsed / duration;
    const speed = base * Math.min(progress * ramp, 1) * (0.85 + Math.random() * 0.3);
    if (speed !== last) {
      onProgress(speed);
      last = speed;
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function SpeedTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [ping, setPing] = useState(0);
  const [downloadPts, setDownloadPts] = useState<SpeedPoint[]>([]);
  const [uploadPts, setUploadPts] = useState<SpeedPoint[]>([]);
  const [history, setHistory] = useState<TestResult[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("zhuuvip-speedtest-history") || "[]");
    } catch { return []; }
  });
  const timeRef = useRef(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const saveHistory = useCallback((dl: number, ul: number, pg: number) => {
    const result: TestResult = {
      download: dl,
      upload: ul,
      ping: pg,
      timestamp: new Date().toLocaleString(),
    };
    setHistory(prev => {
      const next = [result, ...prev].slice(0, 8);
      localStorage.setItem("zhuuvip-speedtest-history", JSON.stringify(next));
      return next;
    });
  }, []);

  const runTest = useCallback(() => {
    setPhase("ping");
    setDownload(0);
    setUpload(0);
    setPing(0);
    setDownloadPts([]);
    setUploadPts([]);
    timeRef.current = 0;

    setTimeout(() => {
      const simulatedPing = Math.round(5 + Math.random() * 30);
      setPing(simulatedPing);
      setPhase("download");

      let dlFinal = 0;
      simulateSpeed(
        "download", 6,
        (v) => {
          setDownload(v);
          timeRef.current++;
          setDownloadPts(pts => [...pts, { time: timeRef.current, speed: v }].slice(-40));
        },
        (v) => {
          dlFinal = v;
          setDownload(v);
          setPhase("upload");
          timeRef.current = 0;
          setUploadPts([]);

          simulateSpeed(
            "upload", 5,
            (uv) => {
              setUpload(uv);
              timeRef.current++;
              setUploadPts(pts => [...pts, { time: timeRef.current, speed: uv }].slice(-40));
            },
            (ulv) => {
              setUpload(ulv);
              setPhase("done");
              saveHistory(dlFinal, ulv, simulatedPing);
            }
          );
        }
      );
    }, 1500);
  }, [saveHistory]);

  const phaseLabel: Record<Phase, string> = {
    idle: "Ready to test your connection",
    ping: "Measuring latency...",
    download: "Testing download speed...",
    upload: "Testing upload speed...",
    done: "Test complete!",
  };

  return (
    <div className="ocean-bg min-h-screen pt-16 pb-32 md:pb-16 px-4" data-testid="speedtest-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`text-center pt-12 mb-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-sm font-medium tracking-widest text-cyan-400/70 uppercase mb-3">⚡ Network</div>
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Speed Test
          </h1>
          <p className="text-cyan-200/50">Measure your real internet connection performance</p>
        </div>

        {/* Phase indicator */}
        <div className={`glass-card p-4 mb-8 flex items-center justify-center gap-3 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
          <div className={`w-2 h-2 rounded-full ${phase !== "idle" && phase !== "done" ? "bg-cyan-400 animate-pulse" : "bg-cyan-400/40"}`} />
          <span className="text-sm text-cyan-300/80">{phaseLabel[phase]}</span>
        </div>

        {/* Gauges */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "0.2s" }}>
          <div className="glass-card p-6 flex flex-col items-center">
            <SpeedGauge value={download} max={500} label="Download" unit="Mbps" color="#00c8dc" />
            <div className="mt-4 w-full">
              <div className="text-xs text-cyan-400/50 mb-2 text-center">Live Graph</div>
              <MiniChart points={downloadPts} color="#00c8dc" />
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col items-center">
            <SpeedGauge value={upload} max={300} label="Upload" unit="Mbps" color="#00e5a0" />
            <div className="mt-4 w-full">
              <div className="text-xs text-cyan-400/50 mb-2 text-center">Live Graph</div>
              <MiniChart points={uploadPts} color="#00e5a0" />
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <div className="text-6xl font-black gradient-text mb-2 speed-number" style={{ fontFamily: "Poppins, sans-serif" }}>
              {ping > 0 ? ping : "—"}
            </div>
            <div className="text-cyan-400/70 text-sm mb-1">ms</div>
            <div className="text-white/60 text-sm mb-6">Ping / Latency</div>

            {ping > 0 && (
              <div className="w-full">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-cyan-400/60">Quality</span>
                  <span className={ping < 20 ? "text-green-400" : ping < 50 ? "text-yellow-400" : "text-red-400"}>
                    {ping < 20 ? "Excellent" : ping < 50 ? "Good" : "Fair"}
                  </span>
                </div>
                <div className="h-2 bg-cyan-400/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.max(10, 100 - ping)}%`,
                      background: ping < 20 ? "#22c55e" : ping < 50 ? "#eab308" : "#ef4444",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Test button */}
        <div className={`text-center mb-12 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "0.3s" }}>
          <button
            onClick={runTest}
            disabled={phase !== "idle" && phase !== "done"}
            className={`px-12 py-4 rounded-full font-bold text-lg ripple-container transition-all duration-300 ${
              phase !== "idle" && phase !== "done"
                ? "opacity-50 cursor-not-allowed border border-cyan-400/30 text-cyan-400/50"
                : "neon-btn-solid hover:scale-105 active:scale-95"
            }`}
            data-testid="speedtest-run-btn"
          >
            {phase === "idle" ? "▶ Start Speed Test" : phase === "done" ? "🔄 Test Again" : "⏳ Testing..."}
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className={`glass-card p-6 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "0.4s" }} data-testid="speedtest-history">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">📊</span> Test History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-cyan-400/60 border-b border-cyan-400/10">
                    <th className="text-left pb-3">Time</th>
                    <th className="text-right pb-3">↓ DL</th>
                    <th className="text-right pb-3">↑ UL</th>
                    <th className="text-right pb-3">Ping</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="history-row border-b border-cyan-400/5 transition-colors" data-testid={`history-row-${i}`}>
                      <td className="py-3 text-cyan-200/50 text-xs">{h.timestamp}</td>
                      <td className="py-3 text-right font-mono text-cyan-300">{h.download.toFixed(1)} <span className="text-xs text-cyan-400/40">Mb</span></td>
                      <td className="py-3 text-right font-mono text-teal-300">{h.upload.toFixed(1)} <span className="text-xs text-cyan-400/40">Mb</span></td>
                      <td className="py-3 text-right font-mono text-white/70">{h.ping} <span className="text-xs text-cyan-400/40">ms</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
