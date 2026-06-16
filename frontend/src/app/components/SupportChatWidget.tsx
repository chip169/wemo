import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Phone, MessageSquare, Sparkles, User, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  sender: "user" | "admin";
  text: string;
  timestamp: string;
}

export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState("");

  // Registration form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Session ID and user info from LocalStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("wemo_chat_user_name");
    const savedPhone = localStorage.getItem("wemo_chat_user_phone");
    const savedSessionId = localStorage.getItem("wemo_support_session_id");

    if (savedName && savedPhone && savedSessionId) {
      setName(savedName);
      setPhone(savedPhone);
      setSessionId(savedSessionId);
      setIsRegistered(true);
    }
  }, []);

  // Fetch messages history and connect to SSE stream
  useEffect(() => {
    if (!sessionId || !isOpen || !isRegistered) return;

    // Load initial message history (URL-encoded to handle spaces/special characters)
    fetch(`/api/support/messages?sessionId=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch(console.error);

    // Listen to real-time events via Server-Sent Events (SSE)
    const eventSource = new EventSource(`/api/support/stream?sessionId=${encodeURIComponent(sessionId)}`);

    eventSource.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg && msg.type !== "connected") {
          setMessages((prev) => {
            // Check for duplicates
            if (prev.some((m) => m.timestamp === msg.timestamp && m.text === msg.text)) {
              return prev;
            }
            return [...prev, msg];
          });
        }
      } catch (err) {
        console.error("SSE parsing error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed, closing connection:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId, isOpen, isRegistered]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    // Clean phone number: keep only digits
    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length === 10) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập từ 10 chữ số.");
      return;
    }

    const formattedSessionId = `${name.trim()} - ${cleanedPhone}`;
    localStorage.setItem("wemo_chat_user_name", name.trim());
    localStorage.setItem("wemo_chat_user_phone", cleanedPhone);
    localStorage.setItem("wemo_support_session_id", formattedSessionId);

    setSessionId(formattedSessionId);
    setIsRegistered(true);

    // Send an automatic initial system message to backend to register/alert the admin
    const body = {
      sessionId: formattedSessionId,
      sender: "user",
      text: `[Hệ thống] Khách hàng yêu cầu hỗ trợ. Họ tên: ${name.trim()} - SĐT: ${cleanedPhone}`,
    };

    fetch("/api/support/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.timestamp === newMsg.timestamp && m.text === newMsg.text)) {
            return prev;
          }
          return [...prev, newMsg];
        });
      })
      .catch(console.error);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const body = {
      sessionId,
      sender: "user",
      text: inputText.trim(),
    };

    fetch("/api/support/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.timestamp === newMsg.timestamp && m.text === newMsg.text)) {
            return prev;
          }
          return [...prev, newMsg];
        });
        setInputText("");
      })
      .catch(console.error);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="w-80 h-[420px] rounded-3xl bg-white/80 border border-white/40 shadow-2xl backdrop-blur-md flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-white/30" />
                <span className="text-xs font-black tracking-wide">WEMO Hỗ Trợ 24/7</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/15 rounded-full text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Links Section */}
            <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 flex justify-around gap-2">
              <a
                href="tel:0398768699"
                className="flex-1 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center gap-1.5 text-[9px] font-bold transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#E8B4A8]" /> Gọi Ngay
              </a>
              <a
                href="https://zalo.me/0398768699"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center gap-1.5 text-[9px] font-bold transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Chat Zalo
              </a>
            </div>

            {/* Registration Form OR Chat Interface */}
            {!isRegistered ? (
              <div className="flex-1 flex flex-col justify-center p-6 bg-stone-50/20 space-y-4">
                <div className="text-center space-y-1">
                  <Sparkles className="w-6 h-6 text-[#E8B4A8] mx-auto animate-bounce" />
                  <h3 className="text-xs font-black text-stone-800">Liên Hệ Trực Tuyến</h3>
                  <p className="text-[10px] text-stone-400">
                    Vui lòng cung cấp thông tin để chúng tôi hỗ trợ bạn tốt nhất
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-1 text-left">
                    <label className="block text-[9px] font-bold text-stone-700 uppercase tracking-wider pl-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-stone-400" /> Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập họ và tên của bạn..."
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-white text-stone-800"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-[9px] font-bold text-stone-700 uppercase tracking-wider pl-1 flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-stone-400" /> Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại liên hệ..."
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-white text-stone-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity active:scale-[0.98] mt-4"
                  >
                    Bắt đầu trò chuyện
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Messages body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/20">
                  {messages.length === 0 ? (
                    <div className="text-center p-6 text-stone-400">
                      <Sparkles className="w-8 h-8 text-[#E8B4A8] mx-auto mb-2 animate-bounce" />
                      <p className="text-[10px] font-bold text-stone-600">Xin chào {name}!</p>
                      <p className="text-[9px] text-stone-500 mt-1 leading-relaxed">
                        Tôi là trợ lý WEMO. Bạn cần hỗ trợ kích hoạt thẻ hay gặp vấn đề gì, hãy gửi tin nhắn cho chúng tôi nhé!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.sender === "user";
                      // Filter out initial system messages from displaying in user chat box to keep it clean
                      if (msg.text.startsWith("[Hệ thống]")) return null;

                      return (
                        <div
                          key={i}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-[11px] leading-relaxed shadow-sm ${isMe
                              ? "bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white rounded-tr-none"
                              : "bg-white text-stone-800 rounded-tl-none border"
                              }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input field */}
                <form
                  onSubmit={handleSend}
                  className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2 bg-[#E8B4A8] hover:bg-[#d8a498] text-white rounded-xl hover:opacity-95 disabled:opacity-50 transition-opacity flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E8B4A8] to-[#D4AF78] text-white flex items-center justify-center shadow-2xl relative border border-[#E8B4A8]/20"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        {/* Active badge */}
        <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center" />
      </motion.button>
    </div>
  );
}
