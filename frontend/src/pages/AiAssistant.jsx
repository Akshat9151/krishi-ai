import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Volume2, VolumeX, Sparkles, RefreshCw } from "lucide-react";
import { coreApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AiAssistant() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "नमस्ते किसान भाई! मैं कृषि AI हूँ। आप मुझसे फसल रोग, खाद की मात्रा, मौसम, या मंडी भाव के बारे में हिंदी, हिंग्लिश या इंग्लिश में पूछ सकते हैं।",
      time: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    "गेहूं में पीलापन आ रहा है, क्या करें?",
    "1 एकड़ में यूरिया और DAP की सही मात्रा?",
    "मौसम को देखते हुए सिंचाई कब करनी चाहिए?",
    "सरसों में माहू (कीट) से बचाव का तरीका?",
  ];

  const handleSend = async (messageToSend) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || loading) return;

    // Add user message
    const userMsg = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await coreApi.askAiAssistant(text);
      const botReply = res.reply || "माफ़ कीजिए, अभी जवाब नहीं मिल पाया। कृपया दोबारा प्रयास करें।";

      const botMsg = {
        sender: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);

      // Speech synthesis if supported and enabled
      if (soundEnabled && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(botReply);
          utterance.lang = "hi-IN";
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore speech error
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "सर्वर से कनेक्ट करने में परेशानी हुई। कृपया कुछ समय बाद पुनः प्रयास करें।",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "नमस्ते किसान भाई! बातचीत रीसेट हो चुकी है। नया सवाल पूछिए।",
        time: "Just now",
      },
    ]);
  };

  return (
    <div className="page-container" style={{ maxWidth: "800px", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div
        className="ka-card"
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--marigold-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bot size={20} color="var(--terracotta)" />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", margin: 0 }}>
              Krishi AI Assistant (कृषि मित्र)
            </h3>
            <p style={{ fontSize: "12px", color: "var(--growth-green)", margin: 0, fontWeight: "600" }}>
              ● 24/7 Smart Agriculture Expert
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              background: "transparent",
              border: "1px solid var(--card-border)",
              borderRadius: "var(--radius-sm)",
              padding: "6px 10px",
              cursor: "pointer",
              color: soundEnabled ? "var(--growth-green)" : "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
            }}
            title={soundEnabled ? "Audio Enabled" : "Audio Muted"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hide-on-compact">{soundEnabled ? "Voice On" : "Voice Off"}</span>
          </button>

          <button
            onClick={handleClearChat}
            style={{
              background: "transparent",
              border: "1px solid var(--card-border)",
              borderRadius: "var(--radius-sm)",
              padding: "6px 10px",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
            }}
            title="Reset Chat"
          >
            <RefreshCw size={14} />
            <span className="hide-on-compact">Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        className="ka-card"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          backgroundColor: "#FFFFFF",
        }}
      >
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isUser ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "82%",
                  padding: "12px 16px",
                  borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  backgroundColor: isUser ? "var(--terracotta)" : "var(--bg-cream)",
                  color: isUser ? "#FFFFFF" : "var(--text-primary)",
                  border: isUser ? "none" : "1px solid var(--card-border)",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", padding: "0 4px" }}>
                {msg.time}
              </span>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px" }}>
            <Sparkles size={16} color="var(--marigold)" />
            <span>Krishi AI is formulating farming advice...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "10px 0" }}>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            className="chip"
            style={{ fontSize: "11.5px", padding: "4px 10px" }}
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{ display: "flex", gap: "8px" }}
      >
        <input
          type="text"
          className="input-field"
          placeholder="अपना कृषि सवाल पूछें... (Ask any farming question)"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: "0 20px" }}
          disabled={loading || !inputMessage.trim()}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
