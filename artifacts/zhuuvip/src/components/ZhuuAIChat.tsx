import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const AI_ICON = () => (
  <div style={{
    width: 30, height: 30, borderRadius: "50%", overflow: "hidden",
    border: "2px solid rgba(150,100,255,0.5)", flexShrink: 0,
    boxShadow: "0 0 10px rgba(150,100,255,0.3)",
  }}>
    <img src="/zhuu-avatar.jpg" alt="Zhuu AI" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
  </div>
);

function formatContent(text: string) {
  const inlineCodeRegex = /`([^`]+)`/g;
  const codeBlockRe = /```(\w+)?\n?([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const allMatches: Array<{ index: number; end: number; node: React.ReactNode }> = [];
  let match;
  while ((match = codeBlockRe.exec(text)) !== null) {
    allMatches.push({
      index: match.index, end: match.index + match[0].length,
      node: (
        <pre key={match.index} style={{ margin: "8px 0" }}>
          <code style={{ display: "block" }}>{match[2].trim()}</code>
        </pre>
      ),
    });
  }
  allMatches.sort((a, b) => a.index - b.index);
  for (const m of allMatches) {
    if (m.index > lastIndex) {
      const segment = text.slice(lastIndex, m.index);
      parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: segment.replace(inlineCodeRegex, '<code>$1</code>').replace(/\n/g, '<br/>') }} />);
    }
    parts.push(m.node);
    lastIndex = m.end;
  }
  if (lastIndex < text.length) {
    const segment = text.slice(lastIndex);
    parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: segment.replace(inlineCodeRegex, '<code>$1</code>').replace(/\n/g, '<br/>') }} />);
  }
  return parts;
}

export default function ZhuuAIChat() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", role: "assistant", content: "Hey! I'm Zhuu AI 🌊 Ask me anything — code, questions, creative ideas!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, loading]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setStreamingText("");

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
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              full += delta;
              setStreamingText(full);
            } catch { full += data; setStreamingText(full); }
          }
        }
      }
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: full };
      setMessages(prev => [...prev, aiMsg]);
      setStreamingText("");
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Something went wrong. Try again?" }]);
      setStreamingText("");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Hide on the dedicated AI page — all hooks are called above this point
  if (location === "/ai") return null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 80, left: 20, zIndex: 150,
          width: 52, height: 52, borderRadius: "50%",
          background: open ? "rgba(100,60,200,0.9)" : "linear-gradient(135deg, rgba(120,80,255,0.85), rgba(60,100,220,0.85))",
          border: "2px solid rgba(150,100,255,0.6)",
          boxShadow: "0 0 20px rgba(150,100,255,0.4), 0 0 40px rgba(100,60,200,0.2)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease",
          fontSize: 22,
        }}
        title="Zhuu AI Chat"
      >
        {open ? "✕" : "✨"}
      </button>

      {open && (
        <div style={{
          position: "fixed", bottom: 148, left: 16, zIndex: 150,
          width: 340, maxWidth: "calc(100vw - 32px)", height: 480,
          background: "rgba(2,10,22,0.97)", border: "1px solid rgba(150,100,255,0.3)",
          borderRadius: 20, boxShadow: "0 0 40px rgba(100,60,200,0.2)",
          backdropFilter: "blur(20px)", display: "flex", flexDirection: "column",
          overflow: "hidden", animation: "page-enter 0.3s ease forwards",
        }}>
          <div style={{
            padding: "14px 16px", display: "flex", alignItems: "center", gap: 10,
            background: "linear-gradient(90deg, rgba(120,80,255,0.15), rgba(60,100,220,0.1))",
            borderBottom: "1px solid rgba(150,100,255,0.2)", flexShrink: 0,
          }}>
            <AI_ICON />
            <div>
              <div style={{ fontWeight: 700, color: "#c4b5fd", fontSize: 14, fontFamily: "Poppins, sans-serif" }}>Zhuu AI</div>
              <div style={{ fontSize: 11, color: "rgba(150,100,255,0.6)" }}>Powered by OpenAI</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.6)" }} />
              <span style={{ fontSize: 10, color: "rgba(74,222,128,0.7)" }}>Online</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg) => (
              <div key={msg.id} className="msg-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                  {msg.role === "assistant" && <AI_ICON />}
                  <div style={{
                    maxWidth: "80%", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: "10px 12px", fontSize: 13, lineHeight: 1.55,
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, rgba(120,80,255,0.8), rgba(60,100,220,0.8))"
                      : "rgba(0,20,40,0.8)",
                    border: msg.role === "user" ? "1px solid rgba(150,100,255,0.4)" : "1px solid rgba(0,200,220,0.15)",
                    color: msg.role === "user" ? "rgba(255,255,255,0.95)" : "rgba(180,240,255,0.9)",
                  }}>
                    {formatContent(msg.content)}
                  </div>
                </div>
              </div>
            ))}
            {loading && !streamingText && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <AI_ICON />
                <div style={{ padding: "12px 14px", background: "rgba(0,20,40,0.8)", borderRadius: "16px 16px 16px 4px", border: "1px solid rgba(0,200,220,0.15)", display: "flex", gap: 4, alignItems: "center" }}>
                  <div className="typing-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(0,200,220,0.7)" }} />
                  <div className="typing-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(0,200,220,0.7)" }} />
                  <div className="typing-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(0,200,220,0.7)" }} />
                </div>
              </div>
            )}
            {streamingText && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <AI_ICON />
                <div style={{ maxWidth: "80%", padding: "10px 12px", background: "rgba(0,20,40,0.8)", borderRadius: "16px 16px 16px 4px", border: "1px solid rgba(0,200,220,0.15)", fontSize: 13, lineHeight: 1.55, color: "rgba(180,240,255,0.9)" }}>
                  {formatContent(streamingText)}
                  <span style={{ display: "inline-block", width: 7, height: 14, background: "rgba(0,200,220,0.7)", marginLeft: 2, animation: "typing-cursor 0.8s ease infinite" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(150,100,255,0.15)", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Zhuu AI anything..."
                rows={1}
                style={{
                  flex: 1, background: "rgba(0,20,40,0.7)", border: "1px solid rgba(150,100,255,0.25)",
                  borderRadius: 12, padding: "9px 12px", color: "rgba(200,230,255,0.9)", fontSize: 13,
                  resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.4,
                  maxHeight: 80, overflowY: "auto",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                style={{
                  width: 38, height: 38, borderRadius: 10, cursor: input.trim() && !loading ? "pointer" : "default",
                  background: input.trim() && !loading ? "linear-gradient(135deg, rgba(120,80,255,0.9), rgba(60,100,220,0.9))" : "rgba(0,20,40,0.5)",
                  border: `1px solid ${input.trim() && !loading ? "rgba(150,100,255,0.5)" : "rgba(150,100,255,0.15)"}`,
                  color: input.trim() && !loading ? "white" : "rgba(150,100,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease", flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes typing-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </>
  );
}
