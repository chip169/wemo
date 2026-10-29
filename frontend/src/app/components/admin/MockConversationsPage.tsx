import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Phone,
  Image as ImageIcon,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Check
} from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "customer" | "admin";
  senderName?: string;
  text: string;
  time: string;
  imageUrl?: string;
}

export interface ConversationItem {
  id: string;
  customerName: string;
  phone: string;
  channel: "Web Chat" | "Zalo" | "Facebook" | "Instagram";
  status: "Đã chốt đơn" | "Đang tư vấn" | "Chờ cọc" | "Feedback 5 sao";
  orderPackage?: string;
  value?: string;
  createdAt: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = "wemo_mock_conversations_v1";

const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: "conv-1",
    customerName: "Nguyễn Thùy Trang",
    phone: "0912 458 923",
    channel: "Web Chat",
    status: "Đã chốt đơn",
    orderPackage: "Gói Couple Premium",
    value: "850.000đ",
    createdAt: "28/10/2026 - 14:15",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Shop ơi, mình muốn đặt làm mô hình Lego cặp đôi cho ngày kỷ niệm 2 năm yêu nhau ạ. Bên mình có gói nào phù hợp không shop?",
        time: "14:15",
      },
      {
        id: "m2",
        sender: "admin",
        text: "Dạ WEMO chào bạn Trang ạ! ❤️ Chúc mừng ngày kỷ niệm sắp tới của hai bạn nhé! Với dịp kỷ niệm ý nghĩa này, WEMO khuyên dùng gói Couple Premium (850.000đ) - thiết kế tỉ mỉ 2 nhân vật theo đúng trang phục & nét mặt ảnh thật của 2 bạn, kèm chip NFC ẩn dưới đế để chạm mở trang web kỷ niệm riêng đó ạ.",
        time: "14:16",
      },
      {
        id: "m3",
        sender: "customer",
        text: "Uầy có cả trang web chạm NFC luôn hả shop? Trang web đó mình tự chọn ảnh với nhạc nền được không?",
        time: "14:18",
      },
      {
        id: "m4",
        sender: "admin",
        text: "Dạ đúng rồi bạn ơi! Bạn có thể tự tải lên toàn bộ album ảnh kỷ niệm, chọn bài hát tình yêu của 2 bạn và lời nhắn bí mật. Khi bạn trai chạm điện thoại vào đế Lego là trang web sẽ tự động mở ra lung linh luôn ạ ✨ Hoàn toàn không cần cài app gì cả!",
        time: "14:19",
      },
      {
        id: "m5",
        sender: "customer",
        text: "Hay và độc lạ quá, cho mình chốt gói Couple Premium này nhé! Giờ mình gửi ảnh qua đâu shop?",
        time: "14:22",
      },
      {
        id: "m6",
        sender: "admin",
        text: "Dạ bạn gửi 1-2 bức ảnh chân dung rõ nét của 2 bạn ngay tại đây nhé ạ, nghệ nhân thiết kế WEMO sẽ phác thảo và gửi bạn duyệt mẫu trước khi tiến hành gia công lắp ráp hoàn thiện nha!",
        time: "14:23",
      },
      {
        id: "m7",
        sender: "customer",
        text: "Mình gửi ảnh 2 đứa đi Đà Lạt đợt rồi nha shop, làm tóc với áo đôi giống hình giúp mình nhé!",
        time: "14:25",
        imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80",
      },
      {
        id: "m8",
        sender: "admin",
        text: "Dạ ảnh 2 bạn đáng yêu và rõ nét lắm ạ! WEMO đã ghi nhận chi tiết trang phục và kiểu tóc rồi nhé. Bạn hỗ trợ chuyển khoản cọc 200.000đ để bên mình tiến hành dựng mô hình luôn nha.\n\n🏦 STK: 1903 8989 6868 (Techcombank) - DOANH NGHIEP WEMO\nNội dung: COC LEGO THUY TRANG",
        time: "14:27",
      },
      {
        id: "m9",
        sender: "customer",
        text: "Mình vừa chuyển cọc 200k thành công rồi nha shop ơi!",
        time: "14:31",
      },
      {
        id: "m10",
        sender: "admin",
        text: "Dạ WEMO đã nhận đủ 200.000đ tiền cọc của bạn Trang rồi ạ! 🎉 Đơn hàng của bạn đã được chuyển vào xưởng gia công hỏa tốc. Dự kiến trong 48h tới bên mình sẽ gửi ảnh mô hình hoàn thiện kèm link web thử nghiệm cho bạn xem trước nhé. Cảm ơn bạn rất nhiều! ❤️",
        time: "14:32",
      },
    ],
  },
  {
    id: "conv-2",
    customerName: "Trần Minh Hoàng",
    phone: "0988 312 774",
    channel: "Facebook",
    status: "Feedback 5 sao",
    orderPackage: "Gói Premium Đơn",
    value: "469.000đ",
    createdAt: "27/10/2026 - 10:20",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Shop ơi mình nhận được hàng rồi nha! Phải nhắn lại để khen shop ngay vì hộp quà đóng gói chỉn chu, nơ thắt đẹp dã man!",
        time: "10:20",
      },
      {
        id: "m2",
        sender: "admin",
        text: "Dạ WEMO cảm ơn anh Hoàng nhiều lắm ạ! 🧱❤️ Anh mở thử mô hình ra xem bạn nhà có thích không ạ?",
        time: "10:22",
      },
      {
        id: "m3",
        sender: "customer",
        text: "Mô hình làm chi tiết và giống ảnh thật lắm bạn ơi! Đặc biệt là cái tính năng chạm điện thoại vào đế hiện ra trang web nhạc với ảnh làm bạn gái mình bất ngờ suýt khóc luôn haha. 10/10 nhé!",
        time: "10:25",
      },
      {
        id: "m4",
        sender: "admin",
        text: "Đọc tin nhắn của anh mà cả team thiết kế WEMO vui cả ngày luôn ạ! 🥰 Chúc hai bạn luôn ngập tràn hạnh phúc nhé. Lần sau cần làm quà bạn cứ nhắn WEMO sẽ giảm 10% tri ân khách hàng thân thiết nha!",
        time: "10:26",
      },
    ],
  },
  {
    id: "conv-3",
    customerName: "Lê Hoàng Long",
    phone: "0904 771 290",
    channel: "Zalo",
    status: "Chờ cọc",
    orderPackage: "Gói Standard",
    value: "339.000đ",
    createdAt: "29/10/2026 - 09:40",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Mình cần làm gấp 1 mô hình bạn nam đeo kính, tóc xoăn để tặng sinh nhật thứ 7 này thì có kịp ship vào TP.HCM không shop?",
        time: "09:40",
      },
      {
        id: "m2",
        sender: "admin",
        text: "Dạ hoàn toàn kịp bạn nhé! WEMO có hỗ trợ gói hỏa tốc hoàn thiện trong 24h và gửi chuyển phát nhanh đường bay vào TP.HCM chỉ mất 1-2 ngày ạ. Bạn gửi ảnh bạn nam để shop lên mẫu ngay nhé!",
        time: "09:42",
      },
      {
        id: "m3",
        sender: "customer",
        text: "Ok shop để trưa nay mình lấy ảnh rõ nét rồi gửi cọc shop tiến hành luôn nhé!",
        time: "09:45",
      },
    ],
  },
];

export function MockConversationsPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CONVERSATIONS;
  });

  const [activeId, setActiveId] = useState<string>(() => conversations[0]?.id || "conv-1");
  const [presentationMode, setPresentationMode] = useState(false); // Chế độ show cho thầy (ẩn thanh công cụ nhập)
  
  // Form input states
  const [sender, setSender] = useState<"customer" | "admin">("customer");
  const [inputText, setInputText] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [inputImage, setInputImage] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  // New conversation modal / state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustChannel, setNewCustChannel] = useState<"Web Chat" | "Zalo" | "Facebook" | "Instagram">("Web Chat");
  const [newCustStatus, setNewCustStatus] = useState<"Đã chốt đơn" | "Đang tư vấn" | "Chờ cọc" | "Feedback 5 sao">("Đang tư vấn");
  const [newCustPkg, setNewCustPkg] = useState("Gói Couple Premium");
  const [newCustValue, setNewCustValue] = useState("850.000đ");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error("Failed to save conversations", e);
    }
  }, [conversations]);

  // Scroll to bottom on active change or message add
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, conversations]);

  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !inputImage.trim()) return;

    const currentTime = inputTime.trim() || new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender,
      text: inputText.trim(),
      time: currentTime,
      imageUrl: inputImage.trim() || undefined,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputText("");
    setInputImage("");
    setShowImageInput(false);
  };

  const handleDeleteMessage = (msgId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: c.messages.filter((m) => m.id !== msgId),
          };
        }
        return c;
      })
    );
  };

  const handleResetDefault = () => {
    if (window.confirm("Khôi phục danh sách hội thoại mẫu chuẩn ban đầu?")) {
      setConversations(INITIAL_CONVERSATIONS);
      setActiveId(INITIAL_CONVERSATIONS[0].id);
    }
  };

  const handleCreateConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const newConv: ConversationItem = {
      id: "conv-" + Date.now(),
      customerName: newCustName.trim(),
      phone: newCustPhone.trim() || "09" + Math.floor(10000000 + Math.random() * 90000000),
      channel: newCustChannel,
      status: newCustStatus,
      orderPackage: newCustPkg,
      value: newCustValue,
      createdAt: new Date().toLocaleDateString("vi-VN") + " - " + new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      messages: [
        {
          id: "m-first",
          sender: "customer",
          text: `Chào shop, mình quan tâm đến ${newCustPkg} của WEMO ạ.`,
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
        {
          id: "m-reply",
          sender: "admin",
          text: `Dạ chào bạn ${newCustName}! Cảm ơn bạn đã quan tâm đến mô hình Lego cá nhân hóa WEMO. Bạn cần tư vấn mẫu hay quy trình gửi ảnh để làm ạ?`,
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setShowNewModal(false);
    setNewCustName("");
    setNewCustPhone("");
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc muốn xóa hội thoại này?")) {
      const remaining = conversations.filter((c) => c.id !== id);
      setConversations(remaining);
      if (activeId === id && remaining.length > 0) {
        setActiveId(remaining[0].id);
      }
    }
  };

  const getStatusBadge = (status: ConversationItem["status"]) => {
    switch (status) {
      case "Đã chốt đơn":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Feedback 5 sao":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Chờ cọc":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-stone-500/10 text-stone-600 border-stone-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#D4AF78]" />
              Nhật Ký Tư Vấn Khách Hàng (CRM Live Log)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D4AF78]/20 text-[#a37f44] dark:text-[#E8CF9B]">
              Traction & Feedback
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Ghi nhận toàn bộ tiến trình tương tác, xác thực nhu cầu (Customer Discovery) và chuyển đổi chốt đơn thực tế của WEMO.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Toggle Chế độ Trình Chiếu / Show Cho Thầy */}
          <button
            onClick={() => setPresentationMode(!presentationMode)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              presentationMode
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200"
            }`}
            title="Bật/Tắt chế độ trình chiếu (Ẩn toàn bộ nút sửa/xóa/nhập dữ liệu để hiển thị như hệ thống chat thật 100%)"
          >
            {presentationMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                Đang ở Chế độ Show Thầy (Sạch 100%)
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Bật Chế độ Show Thầy
              </>
            )}
          </button>

          {!presentationMode && (
            <>
              <button
                onClick={() => setShowNewModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#D4AF78] hover:bg-[#c49e66] text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm Hội Thoại
              </button>
              <button
                onClick={handleResetDefault}
                className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-all"
                title="Khôi phục các kịch bản mẫu ban đầu"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Sidebar: Conversations List */}
        <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 flex flex-col shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Danh sách ghi nhận ({conversations.length})
            </span>
            <span className="text-[11px] text-stone-400">Tự động đồng bộ</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[580px] pr-1">
            {conversations.map((c) => {
              const isSelected = c.id === activeConv?.id;
              const lastMsg = c.messages[c.messages.length - 1];

              return (
                <div
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`group relative p-3.5 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-[#D4AF78]/10 dark:bg-[#D4AF78]/15 border-[#D4AF78]/40 shadow-sm"
                      : "bg-stone-50/50 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-700/50 hover:bg-stone-100/70 dark:hover:bg-stone-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF78] text-white flex items-center justify-center font-bold text-xs">
                        {c.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                          {c.customerName}
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-normal">
                            {c.channel}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-400">{c.phone}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="mt-2.5 text-xs text-stone-500 dark:text-stone-400 line-clamp-1 italic">
                    "{lastMsg?.text || "Chưa có tin nhắn"}"
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400 pt-2 border-t border-stone-200/40 dark:border-stone-700/40">
                    <span className="font-semibold text-[#D4AF78]">{c.orderPackage || "Tư vấn sản phẩm"}</span>
                    <span>{c.value || ""}</span>
                  </div>

                  {!presentationMode && conversations.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteConversation(c.id, e)}
                      className="absolute right-2 bottom-2 p-1 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Xóa hội thoại"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Chat Window & Controls */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col shadow-sm overflow-hidden">
          {/* Chat Header */}
          {activeConv ? (
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF78] to-[#eed7b0] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {activeConv.customerName.charAt(0)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900" />
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    {activeConv.customerName}
                    <span className="text-xs font-normal text-stone-400">({activeConv.phone})</span>
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5">
                    <span>Kênh: <strong>{activeConv.channel}</strong></span>
                    <span>•</span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-semibold border ${getStatusBadge(activeConv.status)}`}>
                      {activeConv.status}
                    </span>
                    {activeConv.value && (
                      <>
                        <span>•</span>
                        <span className="text-[#a37f44] dark:text-[#E8CF9B] font-bold">
                          {activeConv.orderPackage} - {activeConv.value}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-400 hidden sm:inline">
                  {activeConv.createdAt}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-stone-400">Chưa chọn cuộc hội thoại nào</div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto max-h-[500px] space-y-4 bg-stone-50/30 dark:bg-stone-950/20">
            {activeConv?.messages.map((m) => {
              const isCust = m.sender === "customer";
              return (
                <div
                  key={m.id}
                  className={`group relative flex flex-col ${isCust ? "items-start" : "items-end"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-stone-400">
                      {isCust ? activeConv.customerName : "WEMO Support Team"}
                    </span>
                    <span className="text-[10px] text-stone-300 dark:text-stone-600">• {m.time}</span>
                  </div>

                  <div className="relative max-w-[85%] sm:max-w-[70%]">
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
                        isCust
                          ? "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-tl-sm border border-stone-200/80 dark:border-stone-700/80"
                          : "bg-gradient-to-r from-[#C29B63] to-[#D4AF78] text-white rounded-tr-sm font-medium"
                      }`}
                    >
                      {m.text}

                      {m.imageUrl && (
                        <div className="mt-2.5 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 max-w-[260px]">
                          <img
                            src={m.imageUrl}
                            alt="Đính kèm"
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </div>

                    {!presentationMode && (
                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        className={`absolute -top-2 ${
                          isCust ? "-right-6" : "-left-6"
                        } p-1 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity`}
                        title="Xóa tin nhắn này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Controls (Ẩn hoàn toàn khi bật Chế độ Show Thầy) */}
          {!presentationMode ? (
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <form onSubmit={handleSendMessage} className="space-y-3">
                {/* Control bar: Switch Sender & Time */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSender("customer")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        sender === "customer"
                          ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm"
                          : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      Khách hàng ({activeConv?.customerName || "Khách"})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSender("admin")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        sender === "admin"
                          ? "bg-[#D4AF78] text-white shadow-sm"
                          : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      WEMO Admin
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Giờ (vd: 14:35)"
                      value={inputTime}
                      onChange={(e) => setInputTime(e.target.value)}
                      className="w-24 px-2.5 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowImageInput(!showImageInput)}
                      className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${
                        showImageInput || inputImage
                          ? "border-[#D4AF78] text-[#D4AF78] bg-[#D4AF78]/10"
                          : "border-stone-200 dark:border-stone-700 text-stone-500"
                      }`}
                      title="Chèn ảnh vào tin nhắn"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {showImageInput && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Nhập URL ảnh đính kèm (hoặc ảnh mẫu lego, ảnh bill chuyển khoản cọc)..."
                      value={inputImage}
                      onChange={(e) => setInputImage(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-100"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setInputImage(
                          "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80"
                        )
                      }
                      className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-[11px] rounded-lg text-stone-600 dark:text-stone-300"
                    >
                      Mẫu ảnh đôi
                    </button>
                  </div>
                )}

                {/* Input Textarea & Send button */}
                <div className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Gõ nội dung tin nhắn của [${
                      sender === "customer" ? activeConv?.customerName || "Khách" : "WEMO Admin"
                    }]... (Nhấn Enter để gửi)`}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#D4AF78] text-stone-900 dark:text-stone-100 resize-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-[#D4AF78] hover:bg-[#c49e66] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Gửi
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-3 bg-amber-500/10 border-t border-amber-500/20 text-center">
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Đang ở chế độ xem thực tế dành cho trình chiếu. Bấm nút
                "Đang ở Chế độ Show Thầy" phía trên để bật lại form chỉnh sửa khi cần.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Thêm cuộc hội thoại mới */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#D4AF78]" />
              Thêm Khách Hàng & Ghi Nhận Hội Thoại Mới
            </h3>

            <form onSubmit={handleCreateConversation} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Tên khách hàng
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Mai Chi"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    placeholder="0912 345 678"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Kênh tương tác
                  </label>
                  <select
                    value={newCustChannel}
                    onChange={(e) => setNewCustChannel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    <option value="Web Chat">Web Chat</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Zalo">Zalo</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Trạng thái chốt
                  </label>
                  <select
                    value={newCustStatus}
                    onChange={(e) => setNewCustStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    <option value="Đã chốt đơn">Đã chốt đơn</option>
                    <option value="Chờ cọc">Chờ cọc</option>
                    <option value="Đang tư vấn">Đang tư vấn</option>
                    <option value="Feedback 5 sao">Feedback 5 sao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Gói sản phẩm
                  </label>
                  <select
                    value={newCustPkg}
                    onChange={(e) => {
                      setNewCustPkg(e.target.value);
                      if (e.target.value.includes("Couple Premium")) setNewCustValue("850.000đ");
                      else if (e.target.value.includes("Couple Standard")) setNewCustValue("600.000đ");
                      else if (e.target.value.includes("Premium")) setNewCustValue("469.000đ");
                      else setNewCustValue("339.000đ");
                    }}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    <option value="Gói Couple Premium">Gói Couple Premium</option>
                    <option value="Gói Couple Standard">Gói Couple Standard</option>
                    <option value="Gói Premium">Gói Premium</option>
                    <option value="Gói Standard">Gói Standard</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#D4AF78] hover:bg-[#c49e66] text-white rounded-xl shadow-sm"
                >
                  Tạo Hội Thoại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

