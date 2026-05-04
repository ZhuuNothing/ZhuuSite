import { useState, useRef, useEffect, useCallback } from "react";

interface Message { id: string; role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "Explain quantum entanglement simply 🔬",
  "Write a Python web scraper",
  "What's the latest in AI research?",
  "Give me a deep ocean fun fact 🌊",
  "Help me debug my JavaScript code",
  "Write a short poem about the sea",
];

function formatContent(text: string): React.ReactNode {
  if (!text) return null;
  const codeBlockRe = /```(\w+)?\n?([\s\S]*?)```/g;
  const inlineCodeRe = /`([^`]+)`/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const allMatches: Array<{ index: number; end: number; node: React.ReactNode }> = [];
  let match;
  while ((match = codeBlockRe.exec(text)) !== null) {
    allMatches.push({
      index: match.index, end: match.index + match[0].length,
      node: (
        <pre key={match.index} style={{ margin: "10px 0", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,255,0.15)", borderRadius: 8, padding: "12px 14px", overflowX: "auto" }}>
          {match[1] && <div style={{ color: "rgba(0,200,220,0.4)", fontSize: 11, marginBottom: 6, textTransform: "uppercase" }}>{match[1]}</div>}
          <code style={{ background: "none", padding: 0, color: "#b0e8f0", fontSize: 13, fontFamily: "Courier New, monospace" }}>{match[2].trim()}</code>
        </pre>
      ),
    });
  }
  for (const m of allMatches) {
    if (m.index > lastIndex) {
      const seg = text.slice(lastIndex, m.index);
      parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: seg.replace(inlineCodeRe, '<code style="background:rgba(0,255,255,0.1);padding:2px 5px;border-radius:4px;color:#00e5ff;font-size:0.9em">$1</code>').replace(/\n/g, "<br/>") }} />);
    }
    parts.push(m.node);
    lastIndex = m.end;
  }
  if (lastIndex < text.length) {
    const seg = text.slice(lastIndex);
    parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: seg.replace(inlineCodeRe, '<code style="background:rgba(0,255,255,0.1);padding:2px 5px;border-radius:4px;color:#00e5ff;font-size:0.9em">$1</code>').replace(/\n/g, "<br/>") }} />);
  }
  return parts;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hi! I'm **Zhuu AI** 🌊✨\n\nI'm your deep-sea AI companion powered by OpenAI. I can help you with:\n- **Coding** and debugging\n- **Questions** about anything\n- **Creative writing** and ideas\n- **Research** and explanations\n\nWhat would you like to explore today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingText, loading]);

  const sendMessage = useCallback(async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setStreamingText("");
    setShowSuggestions(false);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/openai/stream-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error("Failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const delta = JSON.parse(data).choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                full += delta;
                setStreamingText(full);
              }
            } catch { /* skip malformed chunks */ }
          }
        }
      }
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: full }]);
      setStreamingText("");
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Something went wrong in the deep sea... Please try again 🌊" }]);
      setStreamingText("");
    } finally { setLoading(false); }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="ocean-bg min-h-screen pt-16 pb-24 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 px-4 pt-8 pb-4" style={{ height: "calc(100vh - 64px - 96px)" }}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(150,100,255,0.5)", boxShadow: "0 0 20px rgba(150,100,255,0.3)", flexShrink: 0 }}>
            <img src="/zhuu-avatar.jpg" alt="Zhuu AI" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ fontFamily: "Poppins, sans-serif", color: "#c4b5fd" }}>Zhuu AI</h1>
            <p className="text-sm" style={{ color: "rgba(150,100,200,0.6)" }}>Powered by OpenAI · Deep sea intelligence</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.7)" }} />
            <span className="text-xs" style={{ color: "rgba(74,222,128,0.7)" }}>Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto glass-card p-4 mb-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
          {messages.map((msg) => (
            <div key={msg.id} className="msg-fade-in" style={{ display: "flex", alignItems: "flex-start", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              {msg.role === "assistant" && (
                <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(150,100,255,0.4)", flexShrink: 0 }}>
                  <img src="/zhuu-avatar.jpg" alt="Zhuu" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                </div>
              )}
              {msg.role === "user" && (
                <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, rgba(120,80,255,0.8), rgba(60,100,220,0.8))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                  👤
                </div>
              )}
              <div style={{
                maxWidth: "75%", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "12px 14px", fontSize: 14, lineHeight: 1.65,
                background: msg.role === "user"
                  ? "linear-gradient(135deg, rgba(120,80,255,0.8), rgba(60,100,220,0.8))"
                  : "rgba(0,15,30,0.7)",
                border: msg.role === "user" ? "1px solid rgba(150,100,255,0.4)" : "1px solid rgba(0,200,220,0.12)",
                color: msg.role === "user" ? "rgba(255,255,255,0.95)" : "rgba(180,240,255,0.9)",
              }}>
                {formatContent(msg.content)}
              </div>
            </div>
          ))}

          {loading && !streamingText && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(150,100,255,0.4)", flexShrink: 0 }}>
                <img src="/zhuu-avatar.jpg" alt="Zhuu" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <div style={{ padding: "14px 16px", background: "rgba(0,15,30,0.7)", borderRadius: "18px 18px 18px 4px", border: "1px solid rgba(0,200,220,0.12)", display: "flex", gap: 5, alignItems: "center" }}>
                <div className="typing-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(0,200,220,0.7)" }} />
                <div className="typing-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(0,200,220,0.7)" }} />
                <div className="typing-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(0,200,220,0.7)" }} />
              </div>
            </div>
          )}

          {streamingText && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(150,100,255,0.4)", flexShrink: 0 }}>
                <img src="/zhuu-avatar.jpg" alt="Zhuu" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <div style={{ maxWidth: "75%", padding: "12px 14px", background: "rgba(0,15,30,0.7)", borderRadius: "18px 18px 18px 4px", border: "1px solid rgba(0,200,220,0.12)", fontSize: 14, lineHeight: 1.65, color: "rgba(180,240,255,0.9)" }}>
                {formatContent(streamingText)}
                <span style={{ display: "inline-block", width: 8, height: 16, background: "rgba(0,200,220,0.7)", marginLeft: 2, animation: "typing-cursor 0.8s ease infinite", verticalAlign: "middle" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="mb-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => sendMessage(s)}
                className="text-xs px-3 py-2 rounded-full transition-all duration-200"
                style={{ background: "rgba(0,15,30,0.6)", border: "1px solid rgba(0,200,220,0.15)", color: "rgba(0,200,220,0.7)", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(0,200,220,0.35)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(0,200,220,0.15)")}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="glass-card p-3">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Zhuu AI anything... (Enter to send, Shift+Enter for newline)"
              rows={2}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "rgba(200,240,255,0.9)", fontSize: 14, resize: "none",
                fontFamily: "inherit", lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: input.trim() && !loading ? "linear-gradient(135deg, rgba(120,80,255,0.9), rgba(60,100,220,0.9))" : "rgba(0,15,30,0.5)",
                border: `1px solid ${input.trim() && !loading ? "rgba(150,100,255,0.5)" : "rgba(150,100,255,0.15)"}`,
                color: input.trim() && !loading ? "white" : "rgba(150,100,255,0.3)",
                cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}>
              <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes typing-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
