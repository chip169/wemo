import { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageSquare,
  User,
  Trash2,
  Plus,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  X
} from "lucide-react";
import { adminFetch } from "../../utils/api";
import { toast } from "sonner";

interface Session {
  sessionId: string;
  lastMessage: string;
  sender: string;
  timestamp: string;
}

interface Message {
  _id?: string;
  sessionId: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
}

export function SupportChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Vai trò gửi tin nhắn: admin hoặc user (khách hàng)
  const [sendAs, setSendAs] = useState<"admin" | "user">("admin");
  // Chế độ trình chiếu cho thầy (ẩn thanh chọn vai trò và nút kịch bản)
  const [presentationMode, setPresentationMode] = useState(false);

  // Modal tạo cuộc hội thoại mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newFirstMsg, setNewFirstMsg] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<"custom" | "couple_order" | "feedback" | "urgent">("couple_order");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSessionRef = useRef<string | null>(null);

  // Sync activeSession to Ref for SSE listener closure
  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  // Fetch sessions list and setup EventSource listener
  useEffect(() => {
    const fetchSessions = () => {
      adminFetch("/api/support/sessions")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSessions(data);
          }
          setLoadingSessions(false);
        })
        .catch(console.error);
    };

    fetchSessions();

    const eventSource = new EventSource("/api/support/stream?isAdmin=true");

    eventSource.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg && msg.type !== "connected") {
          // If the message is for the currently open session, append it
          const currentActive = activeSessionRef.current;
          if (msg.sessionId === currentActive) {
            setMessages((prev) => {
              if (prev.some((m) => m.timestamp === msg.timestamp && m.text === msg.text)) {
                return prev;
              }
              return [...prev, msg];
            });
          }

          // Show Toast pop-up for user messages
          if (msg.sender === "user") {
            toast.message(`Tin nhắn mới từ ${msg.sessionId}`, {
              description: msg.text,
              icon: "💬",
            });
          }

          // Update the session's preview in the sidebar
          setSessions((prevSessions) => {
            const index = prevSessions.findIndex((s) => s.sessionId === msg.sessionId);
            const updatedSession = {
              sessionId: msg.sessionId,
              lastMessage: msg.text,
              sender: msg.sender,
              timestamp: msg.timestamp,
            };
            const newSessions = [...prevSessions];
            if (index !== -1) {
              newSessions.splice(index, 1);
            }
            return [updatedSession, ...newSessions];
          });
        }
      } catch (err) {
        console.error("Admin SSE parsing error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Admin EventSource error, closing connection:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Fetch messages for active session once when activeSession changes
  useEffect(() => {
    if (!activeSession) {
      setMessages([]);
      return;
    }

    const fetchMessages = () => {
      adminFetch(`/api/support/messages?sessionId=${encodeURIComponent(activeSession)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMessages(data);
          }
        })
        .catch(console.error);
    };

    fetchMessages();
  }, [activeSession]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSession) return;

    const textToSend = inputText.trim();
    const roleToSend = sendAs;

    const body = {
      sessionId: activeSession,
      sender: roleToSend,
      text: textToSend,
    };

    adminFetch("/api/support/messages", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then(() => {
        setInputText("");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Không thể gửi tin nhắn");
      });
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa toàn bộ cuộc trò chuyện ${sessionId}?`)) {
      adminFetch(`/api/support/sessions/${encodeURIComponent(sessionId)}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
          if (activeSession === sessionId) {
            setActiveSession(null);
          }
          toast.success(`Đã xóa cuộc hội thoại ${sessionId}`);
        })
        .catch(console.error);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) {
      adminFetch(`/api/support/messages/${encodeURIComponent(messageId)}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          setMessages((prev) => prev.filter((m) => m._id !== messageId && m.timestamp !== messageId));
          adminFetch("/api/support/sessions")
            .then((res) => res.json())
            .then((data) => {
              if (Array.isArray(data)) setSessions(data);
            })
            .catch(console.error);
          toast.success("Đã xóa tin nhắn");
        })
        .catch(console.error);
    }
  };

  // Kịch bản tạo hội thoại
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCustName.trim() || "Khách Hàng Mới";
    const phone = newCustPhone.trim() || ("09" + Math.floor(10000000 + Math.random() * 90000000));
    const sessionId = `${name} - ${phone}`;

    setIsSubmitting(true);

    try {
      if (selectedTemplate === "couple_order") {
        // Kịch bản chốt đơn Couple Premium hoàn chỉnh
        const script: { sender: "user" | "admin"; text: string }[] = [
          { sender: "user", text: "Shop ơi, mình muốn đặt làm mô hình Lego cặp đôi cho ngày kỷ niệm 2 năm yêu nhau ạ. Bên mình có gói nào phù hợp không shop?" },
          { sender: "admin", text: "Dạ WEMO chào bạn Trang ạ! ❤️ Chúc mừng ngày kỷ niệm của 2 bạn nhé! Với dịp kỷ niệm ý nghĩa này, WEMO khuyên dùng gói Couple Premium (850.000đ) - thiết kế 2 nhân vật theo đúng ảnh thật, kèm chip NFC ẩn dưới đế chạm mở trang web tình yêu riêng ạ." },
          { sender: "user", text: "Uầy có cả trang web chạm NFC luôn hả shop? Trang web đó mình tự chọn ảnh với nhạc nền được không?" },
          { sender: "admin", text: "Dạ đúng rồi bạn ơi! Bạn có thể tải album ảnh kỷ niệm, chọn bài hát của 2 bạn và lời nhắn gửi. Khi bạn trai chạm điện thoại vào đế Lego là trang web sẽ tự mở ra lung linh luôn ạ ✨" },
          { sender: "user", text: "Hay và độc lạ quá, cho mình chốt gói Couple Premium này nhé! Giờ mình gửi ảnh qua đâu shop?" },
          { sender: "admin", text: "Dạ bạn gửi ảnh rõ nét của 2 bạn ngay tại đây nhé ạ, bên mình lên bản phác thảo gửi bạn duyệt trước khi lắp ráp nha!" },
          { sender: "user", text: "Mình gửi ảnh 2 đứa đi du lịch đợt rồi nha shop, làm tóc với áo đôi giống hình giúp mình nhé!" },
          { sender: "admin", text: "Dạ ảnh nét và đẹp lắm bạn ơi! Bạn chuyển khoản cọc giúp shop 200.000đ để bên mình tiến hành làm luôn nhé.\n\n🏦 STK: 1903 8989 6868 (Techcombank) - WEMO" },
          { sender: "user", text: "Mình vừa chuyển cọc 200k rồi nha shop ơi, kiểm tra giúp mình nhé." },
          { sender: "admin", text: "Dạ WEMO đã nhận được 200.000đ cọc của bạn rồi ạ! 🎉 Đơn của bạn đã chuyển xưởng gia công hỏa tốc. Trong 48h tới bên mình sẽ gửi ảnh mô hình hoàn thiện cho bạn duyệt trước khi đóng hộp giao nhé. Cảm ơn bạn rất nhiều! ❤️" }
        ];

        for (const msg of script) {
          await adminFetch("/api/support/messages", {
            method: "POST",
            body: JSON.stringify({ sessionId, sender: msg.sender, text: msg.text })
          });
          // delay nhẹ để thứ tự timestamp chuẩn
          await new Promise((r) => setTimeout(r, 100));
        }
      } else if (selectedTemplate === "feedback") {
        // Kịch bản feedback 5 sao
        const script: { sender: "user" | "admin"; text: string }[] = [
          { sender: "user", text: "Shop ơi mình nhận được hàng rồi nha! Phải nhắn lại để khen shop ngay vì hộp quà đóng gói chỉn chu, nơ thắt đẹp dã man!" },
          { sender: "admin", text: "Dạ WEMO cảm ơn bạn nhiều lắm ạ! 🧱❤️ Bạn mở thử mô hình ra xem bạn nhà có thích không ạ?" },
          { sender: "user", text: "Mô hình làm chi tiết và giống ảnh thật lắm bạn ơi! Đặc biệt là cái tính năng chạm điện thoại vào đế hiện ra trang web nhạc với ảnh làm bạn gái mình bất ngờ suýt khóc luôn haha. Đánh giá 10/10 nhé!" },
          { sender: "admin", text: "Đọc tin nhắn của bạn mà cả team WEMO vui cả ngày luôn ạ! 🥰 Lần sau đặt quà bạn cứ nhắn WEMO sẽ giảm 10% tri ân khách hàng thân thiết nha!" }
        ];

        for (const msg of script) {
          await adminFetch("/api/support/messages", {
            method: "POST",
            body: JSON.stringify({ sessionId, sender: msg.sender, text: msg.text })
          });
          await new Promise((r) => setTimeout(r, 100));
        }
      } else if (selectedTemplate === "urgent") {
        // Kịch bản tư vấn quà gấp
        const script: { sender: "user" | "admin"; text: string }[] = [
          { sender: "user", text: "Mình cần làm gấp 1 mô hình nam đeo kính để tặng sinh nhật thứ 7 này thì có kịp ship vào TP.HCM không shop?" },
          { sender: "admin", text: "Dạ hoàn toàn kịp bạn nhé! WEMO có gói hỏa tốc hoàn thiện trong 24h và gửi chuyển phát nhanh đường bay vào TP.HCM chỉ mất 1-2 ngày ạ. Bạn gửi ảnh bạn nam để shop lên mẫu ngay nhé!" },
          { sender: "user", text: "Ok shop để mình gửi ảnh chân dung rồi cọc shop tiến hành luôn nhé!" }
        ];

        for (const msg of script) {
          await adminFetch("/api/support/messages", {
            method: "POST",
            body: JSON.stringify({ sessionId, sender: msg.sender, text: msg.text })
          });
          await new Promise((r) => setTimeout(r, 100));
        }
      } else {
        // Kịch bản tự nhập
        const text = newFirstMsg.trim() || "Chào shop, mình cần tư vấn mô hình Lego cá nhân hóa của WEMO ạ.";
        await adminFetch("/api/support/messages", {
          method: "POST",
          body: JSON.stringify({ sessionId, sender: "user", text })
        });
      }

      // Refresh sessions
      const res = await adminFetch("/api/support/sessions");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSessions(data);
      }

      setActiveSession(sessionId);
      setShowAddModal(false);
      setNewCustName("");
      setNewCustPhone("");
      setNewFirstMsg("");
      toast.success("Đã tạo cuộc hội thoại mới thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tạo cuộc hội thoại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm"
      style={{ height: "calc(100vh - 170px)" }}
    >
      {/* Left pane: sessions list */}
      <div className="w-80 border-r border-stone-200 flex flex-col bg-white">
        {/* Header cột trái: Tiêu đề + Nút thêm cuộc hội thoại */}
        <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#E8B4A8]" /> Hộp Thoại Hỗ Trợ
          </h2>

          <div className="flex items-center gap-1.5">
            {/* Nút bật/tắt chế độ Show Thầy */}
            <button
              onClick={() => setPresentationMode(!presentationMode)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                presentationMode
                  ? "bg-amber-100 text-amber-700"
                  : "text-stone-400 hover:text-stone-700 hover:bg-stone-200"
              }`}
              title={presentationMode ? "Tắt chế độ Show Thầy" : "Bật chế độ Show Thầy (Ẩn nút chỉnh sửa/tạo)"}
            >
              {presentationMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            {/* Nút Thêm Hội Thoại */}
            {!presentationMode && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm"
                title="Tạo thêm cuộc hội thoại mới"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {loadingSessions ? (
            <p className="p-4 text-xs text-stone-400 text-center animate-pulse">
              Đang tải danh sách chat...
            </p>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-center text-stone-400">
              <p className="text-xs mb-3">Chưa có phiên chat nào hoạt động.</p>
              {!presentationMode && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 bg-[#E8B4A8] text-white rounded-lg text-xs font-medium hover:opacity-90"
                >
                  Tạo cuộc hội thoại đầu tiên
                </button>
              )}
            </div>
          ) : (
            sessions.map((session) => {
              const active = activeSession === session.sessionId;
              return (
                <div
                  key={session.sessionId}
                  className={`group w-full flex items-center p-3.5 hover:bg-stone-50 transition-colors gap-3 relative cursor-pointer ${
                    active ? "bg-orange-50/40 border-l-4 border-[#E8B4A8] pl-3" : ""
                  }`}
                  onClick={() => setActiveSession(session.sessionId)}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF78] to-[#eed7b0] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
                    {session.sessionId.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 truncate">
                        {session.sessionId}
                      </span>
                      <span className="text-[9px] text-stone-400">
                        {new Date(session.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p
                        className={`text-xs truncate flex-1 ${
                          session.sender === "user"
                            ? "font-bold text-stone-900"
                            : "text-stone-500"
                        }`}
                      >
                        {session.sender === "admin" ? "Bạn: " : ""}{session.lastMessage}
                      </p>
                      {session.sender === "user" && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#E8B4A8] text-white text-[8px] font-black flex-shrink-0">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete Session Button (Ẩn khi bật chế độ Show Thầy) */}
                  {!presentationMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.sessionId);
                      }}
                      className="p-1.5 hover:bg-rose-50 text-rose-500 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-1 z-10"
                      title="Xóa cuộc hội thoại"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right pane: message detail window */}
      <div className="flex-1 flex flex-col bg-stone-50/50">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-800">
                    {activeSession}
                  </h3>
                  <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Đang trực tuyến
                  </p>
                </div>
              </div>

              {!presentationMode && (
                <div className="text-[11px] text-stone-400 bg-stone-100 px-2.5 py-1 rounded-lg">
                  Đang chọn gửi với tư cách: <strong className={sendAs === "user" ? "text-amber-600" : "text-stone-800"}>{sendAs === "user" ? "Khách hàng" : "Admin (Bạn)"}</strong>
                </div>
              )}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => {
                const isAdmin = msg.sender === "admin";
                if (isAdmin) {
                  return (
                    <div
                      key={msg._id || i}
                      className="flex items-center justify-end gap-2 group w-full"
                    >
                      {!presentationMode && (
                        <button
                          onClick={() => handleDeleteMessage(msg._id || msg.timestamp)}
                          className="p-1 hover:bg-rose-50 text-rose-500 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          title="Xóa tin nhắn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm bg-stone-900 text-white rounded-tr-none relative flex-shrink-0 whitespace-pre-wrap">
                        <p>{msg.text}</p>
                        <span className="text-[8px] mt-1 block text-right text-stone-300">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={msg._id || i}
                      className="flex items-center justify-start gap-2 group w-full"
                    >
                      <div className="max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm bg-white text-stone-800 rounded-tl-none border border-stone-200/80 relative flex-shrink-0 whitespace-pre-wrap">
                        <p>{msg.text}</p>
                        <span className="text-[8px] mt-1 block text-right text-stone-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {!presentationMode && (
                        <button
                          onClick={() => handleDeleteMessage(msg._id || msg.timestamp)}
                          className="p-1 hover:bg-rose-50 text-rose-500 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          title="Xóa tin nhắn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                }
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 space-y-2.5">
              {/* Thanh chọn vai trò người gửi (Ẩn hoàn toàn khi ở chế độ Show Thầy) */}
              {!presentationMode && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSendAs("admin")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        sendAs === "admin"
                          ? "bg-stone-900 text-white shadow-sm"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Bạn (Admin)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendAs("user")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        sendAs === "user"
                          ? "bg-amber-600 text-white shadow-sm"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      Khách ({activeSession.split(" - ")[0] || "Khách"})
                    </button>
                  </div>

                  {/* Gợi ý câu trả lời nhanh */}
                  <div className="flex items-center gap-1 text-[11px] overflow-x-auto">
                    {sendAs === "user" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setInputText("Dạ mình chốt gói Couple Premium 850k này nha shop!")}
                          className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600"
                        >
                          + Chốt đơn
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputText("Mình vừa chuyển khoản cọc 200k rồi nha shop ơi, check giúp mình nhé.")}
                          className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600"
                        >
                          + Báo cọc
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputText("Hàng đẹp và tinh tế lắm shop ơi, bạn gái mình thích mê luôn! 10/10 ❤️")}
                          className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600"
                        >
                          + Khen 5 sao
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setInputText("Dạ WEMO chào bạn ạ! Bạn gửi ảnh chân dung rõ mặt để bên mình phác thảo mẫu gửi bạn duyệt nhé ❤️")}
                          className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600"
                        >
                          + Xin ảnh
                        </button>
                        <button
                          type="button"
                          onClick={() => setInputText("Dạ WEMO đã nhận đủ 200k tiền cọc rồi ạ! Đơn của bạn đã chuyển xưởng gia công hỏa tốc nha 🎉")}
                          className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600"
                        >
                          + Xác nhận cọc
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Input text & Send */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    sendAs === "admin"
                      ? "Nhập nội dung phản hồi từ Admin..."
                      : `Gõ tin nhắn giả lập của khách (${activeSession.split(" - ")[0] || "Khách"})...`
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50 text-stone-900"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2.5 rounded-xl text-white transition-all flex items-center justify-center shadow-sm ${
                    sendAs === "user"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-stone-900 hover:opacity-95"
                  } disabled:opacity-50`}
                  title={sendAs === "user" ? "Gửi dưới vai trò Khách hàng" : "Gửi dưới vai trò Admin"}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400">
            <MessageSquare className="w-12 h-12 mb-3 stroke-1 animate-bounce" />
            <h3 className="font-bold text-stone-700 text-sm">Chưa Chọn Phiên Chat</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs leading-relaxed">
              Chọn một hội thoại bên cột trái hoặc bấm nút "Thêm" để bắt đầu phiên hỗ trợ khách hàng.
            </p>
          </div>
        )}
      </div>

      {/* Modal: Thêm cuộc hội thoại mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#D4AF78]" />
                Thêm Cuộc Hội Thoại Mới
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Thùy Trang"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF78]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 0912 458 923"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF78]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Chọn kịch bản hội thoại mẫu (Nạp tự động)
                </label>
                <div className="space-y-2">
                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplate === "couple_order" ? "border-[#D4AF78] bg-[#D4AF78]/10" : "border-stone-200 hover:bg-stone-50"
                  }`}>
                    <input
                      type="radio"
                      name="template"
                      checked={selectedTemplate === "couple_order"}
                      onChange={() => setSelectedTemplate("couple_order")}
                      className="mt-0.5 text-[#D4AF78]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF78]" />
                        Kịch bản: Khách chốt đơn Couple Premium (850k)
                      </span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Hỏi kỷ niệm 2 năm $\rightarrow$ Shop tư vấn chip NFC $\rightarrow$ Gửi ảnh $\rightarrow$ Chuyển cọc 200k $\rightarrow$ Xác nhận.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplate === "feedback" ? "border-[#D4AF78] bg-[#D4AF78]/10" : "border-stone-200 hover:bg-stone-50"
                  }`}>
                    <input
                      type="radio"
                      name="template"
                      checked={selectedTemplate === "feedback"}
                      onChange={() => setSelectedTemplate("feedback")}
                      className="mt-0.5 text-[#D4AF78]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900">
                        Kịch bản: Feedback 5 sao khen quà tặng
                      </span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Khách nhận hàng khen mô hình đẹp, giống thật và bạn gái bất ngờ khi chạm NFC.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplate === "urgent" ? "border-[#D4AF78] bg-[#D4AF78]/10" : "border-stone-200 hover:bg-stone-50"
                  }`}>
                    <input
                      type="radio"
                      name="template"
                      checked={selectedTemplate === "urgent"}
                      onChange={() => setSelectedTemplate("urgent")}
                      className="mt-0.5 text-[#D4AF78]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900">
                        Kịch bản: Tư vấn hỏa tốc ship sinh nhật
                      </span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Khách hỏi thời gian làm gấp trong 24h ship vào TP.HCM.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplate === "custom" ? "border-[#D4AF78] bg-[#D4AF78]/10" : "border-stone-200 hover:bg-stone-50"
                  }`}>
                    <input
                      type="radio"
                      name="template"
                      checked={selectedTemplate === "custom"}
                      onChange={() => setSelectedTemplate("custom")}
                      className="mt-0.5 text-[#D4AF78]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900">
                        Tự nhập tin nhắn mở đầu
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {selectedTemplate === "custom" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tin nhắn mở đầu của khách
                  </label>
                  <textarea
                    rows={2}
                    value={newFirstMsg}
                    onChange={(e) => setNewFirstMsg(e.target.value)}
                    placeholder="VD: Shop ơi tư vấn giúp mình mẫu Lego này với..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-[#D4AF78] resize-none"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-500 hover:text-stone-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Đang tạo..." : "Tạo Hội Thoại"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
