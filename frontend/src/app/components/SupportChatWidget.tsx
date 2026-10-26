import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Phone, MessageSquare, X, User, Smartphone, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router";
import { SplineBot3D } from "./3d/SplineBot3D";



// ─── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  _id?: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
}
type BotPose = "stand" | "curled" | "rolling" | "landed" | "wave" | "bow" | "think" | "excited";

// ─── Constants ─────────────────────────────────────────────────────────────────
const W = 66;
const EDGE = 20;
const POS_KEY = "wemo_pangolin_pos_v1";
const CHAT_KEYS = { name: "wemo_chat_name", phone: "wemo_chat_phone", session: "wemo_chat_session" };

function loadSide(): "left" | "right" {
  try { const s = localStorage.getItem(POS_KEY); if (s) return JSON.parse(s).side; } catch { }
  return "right";
}
function saveSide(s: "left" | "right") { localStorage.setItem(POS_KEY, JSON.stringify({ side: s })); }
function snapX(side: "left" | "right") {
  return side === "right" ? window.innerWidth - W - EDGE : EDGE;
}
function snapY() { return window.innerHeight - W - 24; }
function clampX(x: number) { return Math.max(EDGE, Math.min(window.innerWidth - W - EDGE, x)); }

// ─── URL context ───────────────────────────────────────────────────────────────
const URL_CTX: Record<string, string> = {
  "/": "homepage", "/features": "features", "/templates": "templates",
  "/pricing": "pricing", "/ai-chibi": "ai-chibi", "/order": "order",
  "/faq": "faq", "/about-us": "about-us", "/contact": "contact",
  "/track": "track-order", "/payment": "payment",
};
function getCtx(p: string) {
  if (URL_CTX[p]) return URL_CTX[p];
  for (const [k, v] of Object.entries(URL_CTX)) if (k !== "/" && p.startsWith(k)) return v;
  return "homepage";
}

// ─── AI replies — Butler personality ─────────────────────────────────────────────────────
const KB = [
  { kw: ["xin chào","hello","hi","chào"], r: "Chào mừng quý khách! 🎊 Tôi là trợ lý ảo WEMO 🧱. Tôi có thể hỗ trợ quý khách điều gì ạ?" },
  { kw: ["giá","bao nhiêu","tiền","phí"], r: "Thưa quý khách, WEMO có 4 gói LEGO cá nhân hóa chính hãng: 🎊\n• WEMO LEGO Standard: 339k (tóc & mặt theo ảnh)\n• WEMO LEGO Premium: 469k (Khuyên dùng - chi tiết cao tóc, trang phục, phụ kiện)\n• Couple Set Standard: 600k (2 nhân vật + 1 landing page)\n• Couple Set Premium: 850k (2 nhân vật chi tiết cao + hộp đôi)\n• Doanh nghiệp / Sự kiện: Chiết khấu lên đến 30%!\nQuý khách muốn chọn gói nào ạ? 💌" },
  { kw: ["nfc","chip","hoạt động","công nghệ"], r: "Công nghệ NFC thông minh của WEMO rất đơn giản thưa quý khách! 📱 Chỉ cần chạm nhẹ điện thoại vào đế mô hình LEGO, trang web kỷ niệm lập tức hiện ra — không cần cài ứng dụng!" },
  { kw: ["chibi","3d","ảnh","vẽ","avatar","lego"], r: "Dịch vụ LEGO cá nhân hóa độc đáo của WEMO 🧱 Chỉ cần 1-2 ảnh chân dung rõ nét, nghệ nhân sẽ thiết kế nhân vật LEGO độc bản dành riêng cho bạn trong 24-48 giờ!" },
  { kw: ["giao hàng","ship","bao lâu","nhận"], r: "Chúng tôi đảm bảo giao hàng nhanh chóng thưa quý khách 📦 Nội thành: 2-3 ngày • Tỉnh thành: 3-5 ngày • Có dịch vụ giao hỏa tốc!" },
  { kw: ["đặt","order","mua","đặt hàng"], r: "Tôi sấn lòng hỗ trợ quý khách đặt hàng! 🎊 Quý khách có thể gọi 0398 768 699 hoặc nhấn Zalo bên trên. Thiệp dành cho dịp gì ạ?" },
  { kw: ["cảm ơn","thanks","tuyệt","ok","được"], r: "Thưa quý khách, đó là vinh dự của tôi! 🎊 Hế tôi làm gì khác được cho quý khách không?" },
  { kw: ["mẫu","template","thiết kế","kiểu"], r: "WEMO có rất nhiều mẫu thiệp tinh tế ✨ Sinh nhật, lãng mạn, tốt nghiệp, cưới... Phong cách nào quý khách yêu thích ạ?" },
  { kw: ["liên hệ","hotline","số điện thoại","zalo"], r: "Thưa quý khách, quý khách có thể liên hệ WEMO qua: 📞 0398 768 699 hoặc 💬 Zalo cùng số đó. Tôi sẽ chuyển tiếp ngay!" },
];
const FALL = [
  "Thưa quý khách, để tôi chuyển quý khách đến chuyên viên tư vấn ngay nhé! 🎊",
  "Tôi đã ghi nhận yêu cầu! Trung bình chờ dưới 2 phút ⏰",
  "Thưa quý khách, quý khách có thể mô tả thêm không ạ? Hoặc gọi ngay 0398 768 699! 😊",
];
function aiReply(t: string) {
  const l = t.toLowerCase();
  for (const { kw, r } of KB) if (kw.some(k => l.includes(k))) return r;
  return FALL[Math.floor(Math.random() * FALL.length)];
}

// ─── 3D LEGO MASCOT BOT — Luxury Circular 3D Avatar Pod ───────────────────
function PangolinBot({ pose, size = 66 }: {
  pose: BotPose;
  size?: number;
  eyeOff?: { x: number; y: number };
}) {
  const isRolling = pose === "rolling" || pose === "curled";
  const isThink   = pose === "think";
  const isExcited = pose === "excited";
  const isWave    = pose === "wave";

  return (
    <motion.div
      animate={
        isRolling
          ? { rotate: 360 }
          : isWave
          ? { rotate: [-4, 6, -4, 6, 0], y: [0, -3, 0] }
          : isThink
          ? { rotate: -6, y: -2, scale: 1.02 }
          : isExcited
          ? { y: [0, -6, 0, -3, 0], scale: [1, 1.05, 1] }
          : { y: [0, -2, 0] }
      }
      transition={
        isRolling
          ? { duration: 0.8, repeat: Infinity, ease: "linear" }
          : isWave
          ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
          : isThink
          ? { duration: 0.4 }
          : isExcited
          ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
          : { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Luxury Gradient Ring Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          padding: size > 45 ? 2.5 : 1.5,
          background: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 50%, #E8B4A8 100%)",
          boxShadow: size > 45
            ? "0 10px 24px -2px rgba(232, 180, 168, 0.45), 0 4px 10px rgba(92, 53, 46, 0.12)"
            : "0 2px 8px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Inner Clean White Pod with HD Avatar */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            overflow: "hidden",
            background: "radial-gradient(circle at 50% 30%, #FFFFFF 0%, #FFF7F4 100%)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={legoAvatarHd}
            alt="WEMO 3D LEGO Mascot"
            style={{
              width: "118%",
              height: "118%",
              objectFit: "cover",
              objectPosition: "center 10%",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />

          {/* Glossy Glass Specular Arc */}
          <div
            style={{
              position: "absolute",
              top: 1,
              left: "15%",
              width: "70%",
              height: "40%",
              borderRadius: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Sparkles when excited */}
      {isExcited && (
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ position: "absolute", top: -6, right: -4, fontSize: 16, pointerEvents: "none" }}
        >
          ✨
        </motion.div>
      )}

      {/* Thought bubble icon when thinking */}
      {isThink && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{ position: "absolute", top: -8, right: 0, fontSize: 14, pointerEvents: "none" }}
        >
          💭
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "9px 13px", background: "white", borderRadius: 14, borderBottomLeftRadius: 3, border: "1px solid #f0ece8", width: "fit-content", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#D9A566", display: "block", animation: `pgBounce 1.1s ease-in-out ${i*0.18}s infinite` }} />)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN WIDGET
// ─────────────────────────────────────────────────────────────────────────────
export function SupportChatWidget() {
  const location = useLocation();

  const [isOpen, setIsOpen]         = useState(false);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [inputText, setInputText]   = useState("");
  const [sessionId, setSessionId]   = useState("");
  const [isTyping, setIsTyping]     = useState(false);
  const [name, setName]             = useState("");
  const [phone, setPhone]           = useState("");
  const [isRegistered, setIsReg]    = useState(false);
  const [pose, setPose]             = useState<BotPose>("stand");
  const [bubble, setBubble]         = useState("Chào mừng quý khách! Tôi có thể phục vụ gì ạ? 🎩");
  const [showBubble, setShowBubble] = useState(false);
  const [rollDuration, setRollDuration] = useState(600);
  const [rollDir, setRollDir]           = useState<'cw'|'ccw'>('cw'); // clockwise/counter-clockwise
  const [eyeOff, setEyeOff]            = useState({ x: 0, y: 0 }); // eye tracking offset
  const [side, setSide]             = useState<"left"|"right">("right");
  const [isDragging, setIsDragging] = useState(false);
  const [botMode, setBotMode]       = useState<"walking" | "badge">("badge");

  // Bot free-floating position
  const [botPos, setBotPos]   = useState({ x: snapX("right"), y: snapY() });
  const botPosRef             = useRef({ x: snapX("right"), y: snapY() });
  const isAnimatingRef        = useRef(false);
  const rollDebounceRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef               = useRef<{ ptrX: number; startX: number } | null>(null);
  const hasMoved              = useRef(false);
  const contextRef            = useRef("homepage");
  const messagesEnd           = useRef<HTMLDivElement>(null);
  const messagesContainerRef  = useRef<HTMLDivElement>(null);
  const bubbleTimeoutRef      = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Static Bubbles ───────────────────────────────────────────────────────
  const STATIC_BUBBLES: Record<string, string> = {
    homepage:     "Chào mừng quý khách đến WEMO! Tôi có thể phục vụ gì ạ? 🎩",
    features:     "Kính mời quý khách khám phá tính năng cao cấp của WEMO! 📱",
    templates:    "Để tôi giới thiệu các mẫu thiệp tinh tế nhất! 🎨",
    pricing:      "Thưa quý khách, WEMO đang có ưu đãi đặc biệt! 💰",
    "ai-chibi":   "Chỉ 1 ảnh, tôi sẽ tạo mô hình LEGO cá nhân hóa độc quyền cho quý khách! 🧱",
    order:        "Tôi sẵn lòng hỗ trợ quý khách đặt hàng ngay! 📦",
    faq:          "Mọi thắc mắc tôi đều sẵn sàng giải đáp! 💬",
    "about-us":   "Câu chuyện cảm hứng đằng sau sứ mệnh của WEMO! 🌸",
    contact:      "Quý khách cần liên hệ? Tôi kết nối ngay! 📞",
    "track-order":"Nhập mã đơn để tôi tra cứu tình trạng vận chuyển! 🚚",
    payment:      "Để tôi hỗ trợ quý khách hoàn tất thanh toán! 💳",
  };

  // ── Bot Guide Messages — cho từng điểm nhấn trang ───────────────────────
  const BOT_GUIDES: Record<string, string> = {
    "hero-cta":       "🚀 Bấm vào đây để đặt LEGO cá nhân hóa ngay!",
    "hero-pricing":   "💰 Xem bảng giá các gói mô hình LEGO nào!",
    "how-it-works":   "📖 Chỉ 4 bước đơn giản là có quà tặng độc đáo!",
    "nfc-step":       "📱 Chạm điện thoại vào đế LEGO — trang web tự mở!",
    "chibi-step":     "🧱 Tải 1-2 ảnh rõ mặt, tớ thiết kế mô hình LEGO trong 24h!",
    "upload-step":    "⬆️ Thêm ảnh kỷ niệm, video và lời chúc của bạn nhé!",
    "why-wemo":       "💝 Thiệp WEMO đáng nhớ hơn quà thông thường 10 lần!",
    "pricing-card":   "🛒 Chọn gói phù hợp và đặt ngay để nhận ưu đãi!",
    "testimonials":   "⭐ Hàng ngàn khách hàng đã yêu thích WEMO rồi đó!",
    "final-cta":      "🎁 Đặt ngay hôm nay — giao hàng toàn quốc nhanh chóng!",
    "contact-btn":    "📞 Cần tư vấn? Gọi hoặc Zalo ngay cho tớ nha!",
    "template-card":  "✨ Nhấp vào mẫu này để bắt đầu thiết kế thiệp bạn nhé!",
    "chibi-style":    "✨ Chọn phong cách vẽ (Đất sét 3D, Anime, Hoàng gia...) rồi bấm Tạo ảnh ở dưới nha!",
    "chibi-generate": "⚡ Bấm nút này để AI bắt đầu quét chân dung và vẽ chibi cho bạn!",
  };

  // ─── Roll animation engine ─────────────────────────────────────────────────
  const rollTo = useCallback((targetX: number, targetY: number, guideKey?: string) => {
    if (isAnimatingRef.current || isOpen) return;

    const cur = botPosRef.current;
    const dx = targetX - cur.x;
    const dy = targetY - cur.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 60) return; // already close enough

    const speed = 0.55; // px/ms
    const duration = Math.min(Math.max(dist / speed, 300), 1800);

    isAnimatingRef.current = true;
    setRollDuration(duration);
    // Direction: rolling right = clockwise, left = counter-clockwise
    setRollDir(dx >= 0 ? 'cw' : 'ccw');

    // Show guide bubble
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }

    if (guideKey && BOT_GUIDES[guideKey]) {
      setBubble(BOT_GUIDES[guideKey]);
      setShowBubble(false);
    }

    // 1. ROLL to target — set rolling pose (curled ball) and move
    setPose("rolling");
    setBotPos({ x: targetX, y: targetY });
    botPosRef.current = { x: targetX, y: targetY };

    setTimeout(() => {
      // 2. Arrive — bounce landing
      setPose("landed");
      isAnimatingRef.current = false;
      if (guideKey && BOT_GUIDES[guideKey]) {
        setShowBubble(true);
        if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
        bubbleTimeoutRef.current = setTimeout(() => {
          setShowBubble(false);
        }, 5000);
      }
      // 3. Unfurl back to standing pose
      setTimeout(() => setPose("stand"), 420);
    }, duration);
  }, [isOpen]);

  // ─── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const n = localStorage.getItem(CHAT_KEYS.name);
    const p = localStorage.getItem(CHAT_KEYS.phone);
    const sid = localStorage.getItem(CHAT_KEYS.session);
    if (n && p && sid) { setName(n); setPhone(p); setSessionId(sid); setIsReg(true); }

    // Load saved side and position
    const savedSide = loadSide();
    setSide(savedSide);
    const initX = snapX(savedSide);
    const initY = snapY();
    setBotPos({ x: initX, y: initY });
    botPosRef.current = { x: initX, y: initY };

    setTimeout(() => { setShowBubble(true); }, 1800);
    setTimeout(() => setShowBubble(false), 9000);

    const onResize = () => {
      if (!isAnimatingRef.current) {
        const nx = snapX(side);
        const ny = snapY();
        setBotPos({ x: nx, y: ny });
        botPosRef.current = { x: nx, y: ny };
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Snap to side when side changes (after drag)
  useEffect(() => {
    if (!isDragging && !isAnimatingRef.current) {
      const nx = snapX(side);
      const ny = snapY();
      setBotPos({ x: nx, y: ny });
      botPosRef.current = { x: nx, y: ny };
    }
  }, [side, isDragging]);

  // ─── Drag handlers ─────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (isAnimatingRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    hasMoved.current = false;
    dragRef.current = { ptrX: e.clientX, startX: botPosRef.current.x };
    setIsDragging(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.ptrX;
    if (Math.abs(dx) > 6) hasMoved.current = true;
    const nx = clampX(dragRef.current.startX + dx);
    const ny = snapY();
    setBotPos({ x: nx, y: ny });
    botPosRef.current = { x: nx, y: ny };
  }, [isDragging]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current) return;
    setIsDragging(false);
    const fx = clampX(dragRef.current.startX + (e.clientX - dragRef.current.ptrX));
    // Snap to nearest edge
    const ns: "left" | "right" = fx + W / 2 > window.innerWidth / 2 ? "right" : "left";
    setSide(ns);
    saveSide(ns);
    dragRef.current = null;
    if (!hasMoved.current) {
      // It was a click, not a drag
      setIsOpen(o => !o);
      setShowBubble(false);
    }
  }, [isDragging]);

  // ─── Eye tracking: pupils follow the mouse ────────────────────────────────
  useEffect(() => {
    if (isOpen) { setEyeOff({ x: 0, y: 0 }); return; }
    const onMove = (e: MouseEvent) => {
      // Eye center is roughly at top-left area of bot icon
      const eyeCX = botPos.x + W * 0.40;
      const eyeCY = botPos.y + W * 0.38;
      const dx = e.clientX - eyeCX;
      const dy = e.clientY - eyeCY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxD = 3.5;
      const scale = Math.min(1, 70 / Math.max(dist, 1)) * maxD;
      setEyeOff({
        x: dist > 0 ? (dx / dist) * scale : 0,
        y: dist > 0 ? (dy / dist) * scale : 0,
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [botPos, isOpen]);

  // ─── Bow when chat opens ───────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setPose("bow");
      const t = setTimeout(() => setPose("stand"), 1100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ─── Think while bot is typing ────────────────────────────────────────────
  useEffect(() => {
    if (isTyping && !isAnimatingRef.current) {
      setPose("think");
    } else if (!isTyping && pose === "think") {
      setPose("stand");
    }
  }, [isTyping]);

  // ─── Get excited when admin sends a new message ───────────────────────────
  const prevMsgCountRef = useRef(0);
  useEffect(() => {
    const adminMsgs = messages.filter(m => m.sender === "admin" && !m.text.startsWith("[Hệ thống]"));
    if (adminMsgs.length > prevMsgCountRef.current && prevMsgCountRef.current > 0 && isOpen) {
      setPose("excited");
      const t = setTimeout(() => setPose("stand"), 1200);
      return () => clearTimeout(t);
    }
    prevMsgCountRef.current = adminMsgs.length;
  }, [messages, isOpen]);

  // ─── Context change (route) ────────────────────────────────────────────────
  useEffect(() => {
    const ctx = getCtx(location.pathname);
    contextRef.current = ctx;
    const msg = STATIC_BUBBLES[ctx] || "Chào mừng quý khách! Tôi có thể phục vụ gì ạ? 🎩";
    setBubble(msg);
    if (!isOpen) {
      setShowBubble(false);
      const t = setTimeout(() => setShowBubble(true), 400);

      // If homepage, wave hand to welcome!
      if (ctx === "homepage") {
        setPose("wave");
        const waveT = setTimeout(() => {
          setPose(p => p === "wave" ? "stand" : p);
        }, 5000); // wave for 5 seconds
        return () => {
          clearTimeout(t);
          clearTimeout(waveT);
        };
      }

      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  // ─── Intersection Observer for scroll context ──────────────────────────────
  useEffect(() => {
    const secs = document.querySelectorAll("[data-context]");
    if (!secs.length) return;
    const obs = new IntersectionObserver(entries => {
      const vis = entries
        .filter(e => e.isIntersecting && e.intersectionRatio > 0.35)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (vis.length) {
        const ctx = (vis[0].target as HTMLElement).dataset.context ?? "";
        if (ctx && ctx !== contextRef.current) {
          contextRef.current = ctx;
          const msg = STATIC_BUBBLES[ctx] || "Cần tớ giúp gì không? ✨";
          setBubble(msg);
          if (!isOpen) {
            setShowBubble(false);
            const t = setTimeout(() => setShowBubble(true), 150);
            return () => clearTimeout(t);
          }
        }
      }
    }, { threshold: [0.35, 0.6] });
    secs.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [location.pathname, isOpen]);

  // ─── Mouse guide: roll to [data-bot-guide] elements ───────────────────────
  useEffect(() => {
    const onMouseEnter = (e: Event) => {
      if (isOpen || isAnimatingRef.current) return;
      const el = e.currentTarget as HTMLElement;
      const guideKey = el.dataset.botGuide;
      if (!guideKey) return;

      if (rollDebounceRef.current) clearTimeout(rollDebounceRef.current);
      rollDebounceRef.current = setTimeout(() => {
        const rect = el.getBoundingClientRect();
        // Target position: near the element, offset so bot doesn't cover it
        const targetX = Math.max(W/2, Math.min(
          rect.left + rect.width / 2 - W / 2,
          window.innerWidth - W - 8
        ));
        const targetY = Math.max(W/2, Math.min(
          rect.top + rect.height + 12,
          window.innerHeight - W - 8
        ));
        // Smooth scroll element into view
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        rollTo(targetX, targetY, guideKey);
      }, 300);
    };

    // Attach to all bot-guide elements
    const guides = document.querySelectorAll("[data-bot-guide]");
    guides.forEach(g => g.addEventListener("mouseenter", onMouseEnter));
    return () => {
      if (rollDebounceRef.current) clearTimeout(rollDebounceRef.current);
      guides.forEach(g => g.removeEventListener("mouseenter", onMouseEnter));
    };
  }, [location.pathname, isOpen, rollTo]);

  // ─── SSE ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId || !isOpen || !isRegistered) return;
    fetch(`/api/support/messages?sessionId=${encodeURIComponent(sessionId)}`).then(r=>r.json()).then(d=>setMessages(d)).catch(console.error);
    const es = new EventSource(`/api/support/stream?sessionId=${encodeURIComponent(sessionId)}`);
    es.onmessage = ev => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg && msg.type !== "connected") {
          setMessages(prev => {
            const i = prev.findIndex(m => m.sender===msg.sender && m.text===msg.text && !("_id" in m));
            if (i !== -1) { const u=[...prev]; u[i]=msg; return u; }
            if (prev.some(m => m.timestamp===msg.timestamp && m.text===msg.text)) return prev;
            return [...prev, msg];
          });
        }
      } catch { }
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [sessionId, isOpen, isRegistered]);

  // Scroll only the messages container, not the whole page
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    // Use requestAnimationFrame to ensure DOM has updated before scrolling
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages, isTyping]);

  // ─── Register ──────────────────────────────────────────────────────────────
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    const sid = `${name.trim()} - ${cleanPhone}`;
    localStorage.setItem(CHAT_KEYS.name, name.trim());
    localStorage.setItem(CHAT_KEYS.phone, cleanPhone);
    localStorage.setItem(CHAT_KEYS.session, sid);
    setSessionId(sid); setIsReg(true);
    fetch("/api/support/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ sessionId:sid, sender:"user", text:`[Hệ thống] Khách: ${name.trim()} - ${cleanPhone}` }) }).catch(console.error);
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        fetch("/api/support/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid,
            sender: "admin",
            text: `Kính chào ${name.trim()}! 🎩✨ Tôi là Quản gia WEMO LEGO. Tôi có thể hỗ trợ bạn về mô hình LEGO cá nhân hóa theo ảnh thật, chip ký ức NFC, bảng giá và đặt hàng độc bản. Bạn đang quan tâm gói quà nào ạ?`,
          }),
        }).catch(console.error);
      }, 1400);
    }, 400);
  };

  // ─── Send ──────────────────────────────────────────────────────────────────
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim(); setInputText("");
    setMessages(prev => [...prev, { sender:"user", text, timestamp: new Date().toISOString() }]);
    fetch("/api/support/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ sessionId, sender:"user", text }) }).catch(console.error);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const r = aiReply(text);
      fetch("/api/support/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ sessionId, sender:"admin", text: r }) }).catch(console.error);
    }, 900 + Math.random()*600);
  };

  // ─── Chat popup position ────────
  const getPopupStyle = (): React.CSSProperties => {
    return {
      position: "fixed",
      zIndex: 9999,
      width: 360,
      maxWidth: "calc(100vw - 32px)",
      bottom: 24,
      right: 24,
    };
  };

  // ─── Bubble position — anchored above the bot icon ────────────────────────
  const getBubbleStyle = (): React.CSSProperties => {
    const BW = 280;
    const px = botPos.x;
    const py = botPos.y;
    const style: React.CSSProperties = {
      position: "fixed",
      zIndex: 9997,
      width: BW,
    };
    // Always show above the bot icon
    style.bottom = window.innerHeight - py + 8;
    // Horizontal: align with bot, clamp to screen
    if (px + W/2 + BW/2 > window.innerWidth - 8) {
      style.right = window.innerWidth - px - W;
    } else {
      style.left = Math.max(8, px - BW/2 + W/2);
    }
    return style;
  };

  // ─── 3D Spin animation when idle ─────────────────────────────────────────────
  const isIdle = (pose === "stand" || pose === "wave") && !isOpen && !isDragging && !isAnimatingRef.current;
  // When idle we delegate to CSS keyframe pg3dSpin; framer-motion just keeps position stable
  const idleAnimate = isIdle
    ? { x: 0, y: 0 }
    : { x: 0, y: 0, scaleX: side === "left" ? 1 : -1 };
  const idleTransition = { type: "spring" as const, stiffness: 320, damping: 28 };

  return (
    <>
      <style>{`
        @keyframes pgBounce{0%,80%,100%{transform:translateY(0);opacity:.45}40%{transform:translateY(-5px);opacity:1}}
        @keyframes pgFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-9px) scale(1.03)}}
        /* Squash & Stretch landing — Disney style physics */
        @keyframes pgLand{
          0%   { transform: scaleY(0.55) scaleX(1.38); }  /* squash on impact */
          30%  { transform: scaleY(1.22) scaleX(0.84); }  /* stretch overshoot up */
          55%  { transform: scaleY(0.92) scaleX(1.07); }  /* settle bounce */
          75%  { transform: scaleY(1.04) scaleX(0.97); }  /* tiny second bounce */
          100% { transform: scaleY(1)    scaleX(1); }      /* rest */
        }
        /* Bow anticipation — lean back first, then bow forward */
        @keyframes pgBowIn{
          0%   { transform: perspective(400px) rotateX(0deg); }
          20%  { transform: perspective(400px) rotateX(-7deg); } /* lean back */
          100% { transform: perspective(400px) rotateX(22deg); } /* bow */
        }
        @keyframes pgIn{from{opacity:0;transform:translateY(8px) scale(.94)}to{opacity:1;transform:none}}
        /* Rolling keyframes — clockwise & counter-clockwise */
        @keyframes pgRollCW  { from { transform: rotate(0deg);    } to { transform: rotate(1440deg);  } }
        @keyframes pgRollCCW { from { transform: rotate(0deg);    } to { transform: rotate(-1440deg); } }
        /* Idle float */
        @keyframes pg3dSpin{
          0%   { transform: perspective(200px) rotateY(0deg)   translateY(0px);   filter: brightness(1) drop-shadow(0 8px 16px rgba(180,120,50,0.35)); }
          10%  { transform: perspective(200px) rotateY(36deg)  translateY(-3px);  filter: brightness(0.92) drop-shadow(4px 8px 18px rgba(100,60,10,0.4)); }
          20%  { transform: perspective(200px) rotateY(72deg)  translateY(-5px);  filter: brightness(0.78) drop-shadow(6px 6px 20px rgba(80,40,5,0.45)); }
          30%  { transform: perspective(200px) rotateY(108deg) translateY(-4px);  filter: brightness(0.65) drop-shadow(4px 5px 18px rgba(60,30,5,0.45)); }
          40%  { transform: perspective(200px) rotateY(144deg) translateY(-2px);  filter: brightness(0.55) drop-shadow(2px 8px 16px rgba(50,25,5,0.4)); }
          50%  { transform: perspective(200px) rotateY(180deg) translateY(0px);   filter: brightness(0.5)  drop-shadow(0 8px 14px rgba(40,20,5,0.38)); }
          60%  { transform: perspective(200px) rotateY(216deg) translateY(-2px);  filter: brightness(0.6)  drop-shadow(-2px 8px 16px rgba(50,25,5,0.4)); }
          70%  { transform: perspective(200px) rotateY(252deg) translateY(-4px);  filter: brightness(0.72) drop-shadow(-5px 6px 18px rgba(70,35,5,0.42)); }
          80%  { transform: perspective(200px) rotateY(288deg) translateY(-5px);  filter: brightness(0.85) drop-shadow(-6px 6px 18px rgba(100,55,10,0.42)); }
          90%  { transform: perspective(200px) rotateY(324deg) translateY(-3px);  filter: brightness(0.96) drop-shadow(-3px 7px 16px rgba(140,80,20,0.38)); }
          100% { transform: perspective(200px) rotateY(360deg) translateY(0px);   filter: brightness(1)    drop-shadow(0 8px 16px rgba(180,120,50,0.35)); }
        }
        @keyframes pg3dShinePulse{
          0%,100%{ opacity:0; }
          45%,55%{ opacity:0; }
          48%    { opacity:0.35; }
          50%    { opacity:0.55; }
          52%    { opacity:0.35; }
        }
        .pg-msg{animation:pgIn .22s cubic-bezier(.16,1,.3,1) both}
        .pg-float{animation:pgFloat 2.8s ease-in-out infinite}
        .pg-land{animation:pgLand 0.6s cubic-bezier(.2,1.4,.4,1)}
        .pg-bow-in{animation:pgBowIn 0.7s cubic-bezier(.25,.46,.45,.94) forwards}
        .pg-3d-spin{animation:pg3dSpin 3.6s cubic-bezier(0.4,0,0.6,1) infinite; transform-style:preserve-3d;}
        .pg-3d-shine{animation:pg3dShinePulse 3.6s ease-in-out infinite; pointer-events:none; position:absolute; inset:0; border-radius:50%; background:radial-gradient(circle at 40% 35%, rgba(255,255,255,0.7) 0%, transparent 60%);}
        .pg-roll-cw  { animation: pgRollCW  var(--roll-dur, 1s) linear both; }
        .pg-roll-ccw { animation: pgRollCCW var(--roll-dur, 1s) linear both; }
      `}</style>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div key="pg-chat"
            initial={{ opacity:0, scale:0.92, y:16 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.92, y:16 }}
            transition={{ type:"spring", stiffness:340, damping:30 }}
            style={{ ...getPopupStyle(), height:500, borderRadius:24, background:"rgba(255,255,255,0.98)", backdropFilter:"blur(24px)", border:"1.5px solid rgba(232,180,168,0.35)", boxShadow:"0 28px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(232,180,168,0.25)", display:"flex", flexDirection:"column", overflow:"hidden", fontFamily:"'Inter',sans-serif" } as any}
          >
            {/* Header */}
            <div style={{ background:"linear-gradient(135deg, #FFF0EC 0%, #FCE7F3 100%)", padding:"13px 16px", display:"flex", alignItems:"center", gap:11, flexShrink:0, borderBottom:"1.5px solid rgba(244,114,182,0.25)" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg, #F472B6, #FB7185)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 3px 10px rgba(244,114,182,0.35)", position:"relative" }}>
                <span style={{ fontSize: 20 }}>🎩</span>
                <span style={{ position:"absolute", bottom:0, right:0, width:10, height:10, background:"#22c55e", borderRadius:"50%", border:"2px solid white" }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:"#4A1D24", fontWeight:800, fontSize:13.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Quản Gia WEMO 🧱✨</div>
                <div style={{ color:"#9D174D", fontSize:10, display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                  <span style={{ width:6, height:6, background:"#22c55e", borderRadius:"50%", display:"inline-block", flexShrink:0 }} />
                  <span style={{ fontWeight:600 }}>Trực tuyến • Tư vấn 1-1 tức thì</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                <a href="tel:0398768699" data-action="c" style={{ width:32, height:32, borderRadius:10, background:"rgba(244,114,182,0.12)", display:"flex", alignItems:"center", justifyContent:"center", color:"#9D174D", textDecoration:"none" }}><Phone style={{ width:14, height:14 }} /></a>
                <a href="https://zalo.me/0398768699" target="_blank" rel="noopener noreferrer" data-action="z" style={{ width:32, height:32, borderRadius:10, background:"rgba(244,114,182,0.12)", display:"flex", alignItems:"center", justifyContent:"center", color:"#9D174D", textDecoration:"none" }}><MessageSquare style={{ width:14, height:14 }} /></a>
                <button data-action="x" onClick={() => setIsOpen(false)} style={{ width:32, height:32, borderRadius:10, background:"rgba(244,114,182,0.12)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#9D174D" }}><X style={{ width:15, height:15 }} /></button>
              </div>
            </div>

            {/* Content */}
            {!isRegistered ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"22px 20px", gap:14, overflowY:"auto", background:"linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ width: 56, height: 56, margin:"0 auto 10px", borderRadius: 20, background: "linear-gradient(135deg, #FFF1F2, #FCE7F3)", border: "2px solid rgba(244,114,182,0.35)", display: "flex", alignItems:"center", justifyContent: "center", boxShadow: "0 8px 20px rgba(244,114,182,0.22)" }}>
                    <span style={{ fontSize: 28 }}>🎩</span>
                  </div>
                  <div style={{ fontWeight:800, fontSize:15.5, color:"#2E1015" }}>Quản Gia WEMO LEGO 🧱</div>
                  <div style={{ fontSize:11.5, color:"#9D174D", marginTop:4, lineHeight:1.55 }}>
                    Vui lòng để lại tên và số điện thoại để Quản Gia tư vấn mô hình LEGO cá nhân hóa & chip ký ức riêng cho bạn!
                  </div>
                </div>
                <form onSubmit={handleRegister} style={{ display:"flex", flexDirection:"column", gap:11 }}>
                  {[
                    { icon:<User style={{width:11,height:11}}/>, label:"Họ và tên *", type:"text", val:name, set:setName, ph:"Ví dụ: Nguyễn Minh Anh..." },
                    { icon:<Smartphone style={{width:11,height:11}}/>, label:"Số điện thoại *", type:"tel", val:phone, set:setPhone, ph:"Ví dụ: 0912 345 678..." },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:10.5, fontWeight:700, color:"#9D174D", textTransform:"uppercase" as const, letterSpacing:"0.06em", marginBottom:5 }}>{f.icon} {f.label}</label>
                      <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} required
                        style={{ width:"100%", padding:"11px 14px", borderRadius:14, border:"1.5px solid #FBCFE8", outline:"none", fontSize:12.5, color:"#4A1D24", boxSizing:"border-box" as const, transition:"border-color 0.2s" }}
                        onFocus={e=>(e.target.style.borderColor="#F472B6")} onBlur={e=>(e.target.style.borderColor="#FBCFE8")} />
                    </div>
                  ))}
                  <button type="submit" style={{ padding:"12px", background:"linear-gradient(135deg, #F472B6 0%, #FB7185 50%, #E11D48 100%)", color:"white", border:"none", borderRadius:14, fontWeight:800, fontSize:13, cursor:"pointer", boxShadow:"0 6px 18px rgba(244,114,182,0.4)", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    Bắt đầu trò chuyện cùng Quản Gia 🎩✨
                  </button>
                  <div style={{ textAlign:"center", fontSize:10, color:"#9E777F", marginTop:2 }}>
                    🔒 Thông tin được bảo mật 100% để tư vấn đơn hàng
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div
                  ref={messagesContainerRef}
                  style={{ flex:1, overflowY:"auto", padding:"14px 14px", display:"flex", flexDirection:"column", gap:10, background:"#FFF8FA", scrollBehavior:"smooth" }}
                >
                  {messages.filter(m=>!m.text.startsWith("[Hệ thống]")).length===0 ? (
                    <div style={{ textAlign:"center", padding:"28px 12px" }}>
                      <Sparkles style={{ width:28, height:28, color:"#F472B6", margin:"0 auto 10px", display:"block" }} />
                      <div style={{ fontSize:13.5, fontWeight:800, color:"#831843" }}>Xin chào {name}! 💖</div>
                      <div style={{ fontSize:11.5, marginTop:5, lineHeight:1.75, color:"#9D174D" }}>Hỏi tôi về các gói LEGO cá nhân hóa, chip NFC,<br/>bảng giá hay đặt hàng nhé!</div>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      if (msg.text.startsWith("[Hệ thống]")) return null;
                      const me = msg.sender==="user";
                      return (
                        <div key={i} className="pg-msg" style={{ display:"flex", justifyContent:me?"flex-end":"flex-start", gap:7, alignItems:"flex-end" }}>
                          {!me && (
                            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg, #F472B6, #FB7185)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 6px rgba(244,114,182,0.4)" }}>
                              <span style={{ fontSize: 14 }}>🎩</span>
                            </div>
                          )}
                          <div style={{ maxWidth:"74%", padding:"10px 14px", borderRadius:18, fontSize:12.5, lineHeight:1.68, whiteSpace:"pre-wrap" as const, wordBreak:"break-word" as const, ...(me?{background:"linear-gradient(135deg, #F472B6, #E11D48)",color:"white",borderBottomRightRadius:4,boxShadow:"0 3px 12px rgba(244,114,182,0.35)"}:{background:"white",color:"#4A1D24",borderBottomLeftRadius:4,border:"1px solid #FCE7F3",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}) }}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  {isTyping && <TypingDots />}
                  <div ref={messagesEnd} style={{ height: 4 }} />
                </div>

                {messages.filter(m=>!m.text.startsWith("[Hệ thống]")).length===0 && (
                  <div style={{ padding:"0 14px 10px", display:"flex", gap:6, flexWrap:"wrap" as const }}>
                    {["💰 Bảng giá LEGO","📦 Cách đặt hàng","📱 Chip NFC là gì?","💑 Gói Couple Set"].map(q=>(
                      <button key={q} data-action="q" onClick={()=>setInputText(q.split(" ").slice(1).join(" "))}
                        style={{ padding:"5px 11px", borderRadius:20, border:"1.5px solid #F472B6", background:"white", color:"#BE185D", fontSize:10.5, fontWeight:700, cursor:"pointer" }}>{q}</button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSend} style={{ padding:"10px 12px", borderTop:"1.5px solid #FCE7F3", display:"flex", gap:8, alignItems:"center", background:"white", flexShrink:0 }}>
                  <input type="text" value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="Nhập tin nhắn..."
                    style={{ flex:1, padding:"10px 15px", borderRadius:22, border:"1.5px solid #FBCFE8", outline:"none", fontSize:12, background:"#FFFDFD", color:"#4A1D24" }}
                    onFocus={e=>(e.target.style.borderColor="#F472B6")} onBlur={e=>(e.target.style.borderColor="#FBCFE8")} />
                  <button type="submit" disabled={!inputText.trim()}
                    style={{ width:38, height:38, borderRadius:13, background:inputText.trim()?"linear-gradient(135deg, #F472B6, #E11D48)":"#e7e5e4", border:"none", cursor:inputText.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background 0.2s" }}>
                    <Send style={{width:15,height:15,color:inputText.trim()?"white":"#a8a29e"}} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Realistic 3D Animated LEGO Character on Page (Spline 3D Ready) ── */}
      {!isOpen && (
        <SplineBot3D
          onOpenChat={() => setIsOpen(true)}
        />
      )}
    </>
  );
}
