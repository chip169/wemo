import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Phone, MessageSquare, Sparkles, User, Smartphone, Bot, X } from "lucide-react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "motion/react";
import { useLocation } from "react-router";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  _id?: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
}
type BotState = "idle" | "thinking" | "talking" | "happy" | "waving";

// ─── Constants ─────────────────────────────────────────────────────────────────
const W = 68;
const EDGE = 20;
const POS_KEY = "wemo_drop_pos_v5";
const CHAT_KEYS = { name: "wemo_chat_name", phone: "wemo_chat_phone", session: "wemo_chat_session" };

function loadSide(): "left" | "right" {
  try { const s = localStorage.getItem(POS_KEY); if (s) return JSON.parse(s).side; } catch { }
  return "right";
}
function saveSide(s: "left" | "right") { localStorage.setItem(POS_KEY, JSON.stringify({ side: s })); }
function snapX(side: "left" | "right") {
  return side === "right" ? window.innerWidth - W - EDGE : EDGE;
}
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

// ─── AI fallback replies ───────────────────────────────────────────────────────
const KB = [
  { kw: ["xin chào","hello","hi","chào"], r: "Xin chào! Tớ là trợ lý WEMO 🌸 Bạn cần tớ giúp gì?" },
  { kw: ["giá","bao nhiêu","tiền"], r: "WEMO có 3 gói:\n• Cơ Bản: 199k\n• Nâng Cao: 299k (+ chibi 3D)\n• Cao Cấp: 449k\nGói nào phù hợp với bạn? 💝" },
  { kw: ["nfc","chip","hoạt động"], r: "Chỉ đặt điện thoại vào thiệp — trang web tự mở, không cần app! 📱" },
  { kw: ["chibi","3d","ảnh","vẽ"], r: "Chibi 3D từ ảnh thật của bạn! 1-2 ảnh rõ mặt → 24-48h có nhân vật! 🎨" },
  { kw: ["giao hàng","ship","bao lâu"], r: "Nội thành 2-3 ngày, tỉnh thành 3-5 ngày. Có giao nhanh! 📦" },
  { kw: ["đặt","order","mua"], r: "Gọi 0398 768 699 hoặc nhấn Đặt ngay. Bạn cần thiệp cho dịp gì? 🎁" },
  { kw: ["cảm ơn","thanks","tuyệt","ok"], r: "Không có gì! Hỏi thêm bất cứ lúc nào nhé! 💕" },
  { kw: ["mẫu","template","thiết kế"], r: "Nhiều mẫu đẹp: sinh nhật, lãng mạn, tốt nghiệp... Phong cách nào bạn thích? ✨" },
];
const FALL = ["Để tớ kết nối bạn với tư vấn viên nhé! 💬", "Mình đã ghi nhận! Trung bình chờ dưới 2 phút ⏰", "Bạn nói rõ hơn được không? Hoặc gọi 0398 768 699! 😊"];
function aiReply(t: string) {
  const l = t.toLowerCase();
  for (const { kw, r } of KB) if (kw.some(k => l.includes(k))) return r;
  return FALL[Math.floor(Math.random() * FALL.length)];
}

// ─────────────────────────────────────────────────────────────────────────────
//  CUTE DROP CHARACTER SVG
// ─────────────────────────────────────────────────────────────────────────────
function DropBot({ state, size = 64 }: { state: BotState; size?: number }) {
  const blink = state === "thinking";
  const happy = state === "happy";
  const wave  = state === "waving";

  return (
    <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size * 1.1, display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id="dBody" cx="38%" cy="30%" r="68%">
          <stop offset="0%"   stopColor="#F9BFB0" />
          <stop offset="55%"  stopColor="#EF9A86" />
          <stop offset="100%" stopColor="#D97060" />
        </radialGradient>
        <radialGradient id="dArm" cx="40%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#F0A898" />
          <stop offset="100%" stopColor="#D97060" />
        </radialGradient>
        <radialGradient id="dBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#F07080" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F07080" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dShine" cx="35%" cy="25%" r="55%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="dShadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(200,80,60,0.25)" />
        </filter>
      </defs>

      {/* Shadow */}
      <ellipse cx="40" cy="88" rx="20" ry="4" fill="rgba(0,0,0,0.12)" />

      {/* Left arm */}
      <motion.ellipse
        cx="9" cy="60" rx="9" ry="7"
        fill="url(#dArm)"
        transform="rotate(-25, 9, 60)"
        animate={wave ? { rotate: ["-25deg","15deg","-25deg","10deg","-25deg"] } : {}}
        transition={wave ? { duration: 1.1, repeat: 2, ease: "easeInOut" } : {}}
        style={{ originX: "18px", originY: "60px" }}
      />

      {/* Right arm */}
      <ellipse cx="71" cy="60" rx="9" ry="7" fill="url(#dArm)" transform="rotate(25, 71, 60)" />

      {/* Body — teardrop */}
      <path
        d="M40 4 C58 4 74 22 74 46 C74 68 59 84 40 84 C21 84 6 68 6 46 C6 22 22 4 40 4Z"
        fill="url(#dBody)" filter="url(#dShadow)"
      />
      {/* Shine overlay */}
      <path
        d="M40 4 C58 4 74 22 74 46 C74 68 59 84 40 84 C21 84 6 68 6 46 C6 22 22 4 40 4Z"
        fill="url(#dShine)"
      />

      {/* Eyes */}
      {blink ? (
        <>
          <line x1="27" y1="46" x2="34" y2="46" stroke="#2A1208" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="46" y1="46" x2="53" y2="46" stroke="#2A1208" strokeWidth="2.8" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Left eye */}
          <ellipse cx="30" cy="46" rx="6" ry="7" fill="#2A1208" />
          <circle cx="27.5" cy="43.5" r="2.5" fill="white" />
          <circle cx="32" cy="45" r="1.2" fill="white" opacity="0.65" />
          {/* Right eye */}
          <ellipse cx="50" cy="46" rx="6" ry="7" fill="#2A1208" />
          <circle cx="47.5" cy="43.5" r="2.5" fill="white" />
          <circle cx="52" cy="45" r="1.2" fill="white" opacity="0.65" />
        </>
      )}

      {/* Cheeks */}
      <ellipse cx="18" cy="56" rx="10" ry="6" fill="url(#dBlush)" />
      <ellipse cx="62" cy="56" rx="10" ry="6" fill="url(#dBlush)" />

      {/* Mouth */}
      {happy ? (
        <path d="M31 63 Q40 73 49 63" stroke="#C05040" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M32 63 Q40 69 48 63" stroke="#C05040" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}

      {/* Happy sparkles */}
      {happy && (
        <>
          <motion.text animate={{ opacity: [0,1,0], y: [0,-10,-18] }} transition={{ duration: 0.7, repeat: 3, delay: 0 }} x="54" y="30" fontSize="10">✨</motion.text>
          <motion.text animate={{ opacity: [0,1,0], y: [0,-9,-16] }} transition={{ duration: 0.7, repeat: 3, delay: 0.3 }} x="10" y="32" fontSize="9">⭐</motion.text>
        </>
      )}

      {/* Thinking dots */}
      {state === "thinking" && (
        <g>
          {[0,1,2].map(i => (
            <motion.circle key={i} cx={30 + i * 10} cy={72} r="3.5" fill="#E8B4A8"
              animate={{ opacity: [0.3,1,0.3], cy: [72,66,72] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i*0.22, ease: "easeInOut" }} />
          ))}
        </g>
      )}
    </svg>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "9px 13px", background: "white", borderRadius: 14, borderBottomLeftRadius: 3, border: "1px solid #f0ece8", width: "fit-content", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF9A86", display: "block", animation: `wdBounce 1.1s ease-in-out ${i*0.18}s infinite` }} />)}
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
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
  const [botState, setBotState]     = useState<BotState>("idle");
  const [side, setSide]             = useState<"left"|"right">("right");
  const [isDragging, setIsDragging] = useState(false);
  const [bubble, setBubble]         = useState("Cần tớ giúp gì không? ✨");
  const [showBubble, setShowBubble] = useState(false);

  const contextRef    = useRef("homepage");
  const qCacheRef     = useRef<Map<string,string>>(new Map());
  const debRef        = useRef<ReturnType<typeof setTimeout>|null>(null);
  const dragRef       = useRef<{ptrX:number; startX:number}|null>(null);
  const hasMoved      = useRef(false);
  const messagesEnd   = useRef<HTMLDivElement>(null);

  const motionX = useMotionValue(snapX("right"));
  const springX = useSpring(motionX, { stiffness: 220, damping: 32 });

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const s = loadSide();
    setSide(s);
    motionX.set(snapX(s));

    const n = localStorage.getItem(CHAT_KEYS.name);
    const p = localStorage.getItem(CHAT_KEYS.phone);
    const sid = localStorage.getItem(CHAT_KEYS.session);
    if (n && p && sid) { setName(n); setPhone(p); setSessionId(sid); setIsReg(true); }

    // Show initial bubble after 1.5s
    setTimeout(() => { setShowBubble(true); setBotState("waving"); setTimeout(() => { setBotState("idle"); }, 2400); }, 1500);
    setTimeout(() => setShowBubble(false), 9000);

    const onResize = () => motionX.set(snapX(side));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => { if (!isDragging) motionX.set(snapX(side)); }, [side, isDragging]);

  // ── Static Bubbles Mapping ────────────────────────────────────────────────────
  const STATIC_BUBBLES: Record<string, string> = {
    homepage: "Cần tớ giúp gì không? ✨",
    features: "Khám phá các tính năng đặc biệt của thiệp WEMO nhé! 📱",
    templates: "Chọn mẫu thiệp phù hợp với ngày đặc biệt của bạn nhé! 🎨",
    pricing: "WEMO đang có ưu đãi lớn cho các gói thiệp đó! 💰",
    "ai-chibi": "Chỉ cần 1 bức ảnh chân dung để tạo chibi 3D độc bản! 🎨",
    order: "Bạn cần tớ hỗ trợ điền thông tin đặt hàng không? 📦",
    faq: "Xem các câu hỏi thường gặp hoặc nhắn trực tiếp cho tớ! 💬",
    "about-us": "Tìm hiểu câu chuyện sáng lập đầy cảm hứng của WEMO! 🌸",
    contact: "Cần hỗ trợ gấp? Gọi ngay hotline hoặc chat zalo nhé! 📞",
    "track-order": "Nhập mã đơn hàng để tớ kiểm tra hành trình vận chuyển! 🚚",
    payment: "Bạn cần hỗ trợ thanh toán hoặc quét mã QR không? 💳",
  };

  // ── Context & Bubble Change Trigger ──────────────────────────────────────────
  useEffect(() => {
    const ctx = getCtx(location.pathname);
    contextRef.current = ctx;
    
    // Set static message and display instantly
    const msg = STATIC_BUBBLES[ctx] || "Cần tớ giúp gì không? ✨";
    setBubble(msg);
    
    if (!isOpen) {
      setShowBubble(false);
      // Tiny 350ms delay for natural entrance transition right after page renders
      const t = setTimeout(() => {
        setShowBubble(true);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  // ── Scroll/Section Context Trigger ──────────────────────────────────────────
  useEffect(() => {
    const secs = document.querySelectorAll("[data-context]");
    if (!secs.length) return;
    const obs = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting && e.intersectionRatio > 0.35).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
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

  // ── SSE ───────────────────────────────────────────────────────────────────
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
          if (msg.sender==="user") {
            const l = msg.text.toLowerCase();
            if (["tốt","tuyệt","cảm ơn","ok","được","thích"].some(k=>l.includes(k))) {
              setBotState("happy"); setTimeout(()=>setBotState("idle"), 3000);
            }
          }
        }
      } catch { }
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [sessionId, isOpen, isRegistered]);

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  // ── Register ──────────────────────────────────────────────────────────────
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
      setBotState("talking"); setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false); setBotState("idle");
        fetch("/api/support/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ sessionId:sid, sender:"admin", text:`Xin chào ${name.trim()}! 🌸 Tớ là trợ lý WEMO. Tớ có thể giúp về thiệp NFC, chibi 3D, giá cả và đặt hàng. Bạn cần gì?` }) }).catch(console.error);
      }, 1800);
    }, 500);
  };

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim(); setInputText("");
    setMessages(prev => [...prev, { sender:"user", text, timestamp: new Date().toISOString() }]);
    fetch("/api/support/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ sessionId, sender:"user", text }) }).catch(console.error);
    setBotState("thinking"); setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false); setBotState("talking");
      const r = aiReply(text);
      fetch("/api/support/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ sessionId, sender:"admin", text: r }) }).catch(console.error);
      setTimeout(() => setBotState("idle"), 2000);
    }, 900 + Math.random()*600);
  };

  // ── Drag ──────────────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-action]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    hasMoved.current = false;
    dragRef.current = { ptrX: e.clientX, startX: springX.get() };
    setIsDragging(true);
  }, []);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.ptrX;
    if (Math.abs(dx) > 6) hasMoved.current = true;
    motionX.set(clampX(dragRef.current.startX + dx));
  }, [isDragging]);
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current) return;
    setIsDragging(false);
    const fx = clampX(dragRef.current.startX + (e.clientX - dragRef.current.ptrX));
    const ns: "left"|"right" = fx + W/2 > window.innerWidth/2 ? "right" : "left";
    setSide(ns); saveSide(ns); dragRef.current = null;
    if (!hasMoved.current) { setIsOpen(o => !o); setShowBubble(false); }
  }, [isDragging]);

  // ── Popup position ────────────────────────────────────────────────────────
  const getPopup = (): React.CSSProperties => {
    const PW = 320, wx = springX.get();
    const base: React.CSSProperties = { position:"fixed", zIndex:9998, width:PW, bottom: W + 16 };
    if (side==="right") {
      const r = window.innerWidth - wx - W;
      if (r + PW < window.innerWidth - 8) base.right = r;
      else base.right = 8;
    } else {
      const l = wx;
      if (l + PW < window.innerWidth - 8) base.left = l;
      else base.left = 8;
    }
    return base;
  };

  return (
    <>
      <style>{`
        @keyframes wdBounce{0%,80%,100%{transform:translateY(0);opacity:.45}40%{transform:translateY(-5px);opacity:1}}
        @keyframes wdFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes wdIn{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1;transform:none}}
        .wd-msg{animation:wdIn .24s cubic-bezier(.16,1,.3,1) both}
        .wd-float{animation:wdFloat 2.8s ease-in-out infinite}
      `}</style>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div key="wd-chat"
            initial={{ opacity:0, scale:0.88, y:20 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.88, y:20 }}
            transition={{ type:"spring", stiffness:320, damping:28 }}
            style={{ ...getPopup(), height:460, borderRadius:24, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(20px)", border:"1.5px solid rgba(239,154,134,0.2)", boxShadow:"0 24px 56px rgba(0,0,0,0.16), 0 6px 20px rgba(239,154,134,0.2)", display:"flex", flexDirection:"column", overflow:"hidden", fontFamily:"'Inter',sans-serif" } as any}
          >
            {/* Header */}
            <div style={{ background:"linear-gradient(135deg,#EF9A86 0%,#D4AF78 100%)", padding:"13px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,255,255,0.22)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <DropBot state={botState} size={32} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:"white", fontWeight:800, fontSize:13 }}>WEMO Trợ Lý AI</div>
                <div style={{ color:"rgba(255,255,255,0.85)", fontSize:10, display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                  <span style={{ width:6, height:6, background:"#4ade80", borderRadius:"50%", display:"inline-block" }} />
                  {botState==="thinking"?"Đang suy nghĩ...":botState==="talking"?"Đang trả lời...":"Trực tuyến • Phản hồi tức thì"}
                </div>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                <a href="tel:0398768699" data-action="c" style={{ width:32, height:32, borderRadius:10, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", textDecoration:"none" }}><Phone style={{ width:14, height:14 }} /></a>
                <a href="https://zalo.me/0398768699" target="_blank" rel="noopener noreferrer" data-action="z" style={{ width:32, height:32, borderRadius:10, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", textDecoration:"none" }}><MessageSquare style={{ width:14, height:14 }} /></a>
                <button data-action="x" onClick={()=>setIsOpen(false)} style={{ width:32, height:32, borderRadius:10, background:"rgba(255,255,255,0.18)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}><X style={{ width:15, height:15 }} /></button>
              </div>
            </div>

            {/* Content */}
            {!isRegistered ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"20px", gap:13, overflowY:"auto" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ width:56, height:56, margin:"0 auto 10px" }}><DropBot state="idle" size={56} /></div>
                  <div style={{ fontWeight:800, fontSize:14, color:"#1A1818" }}>Xin chào! Tớ là trợ lý WEMO 👋</div>
                  <div style={{ fontSize:11, color:"#a8a29e", marginTop:4, lineHeight:1.65 }}>Nhập thông tin để tớ hỗ trợ tốt hơn nhé!</div>
                </div>
                <form onSubmit={handleRegister} style={{ display:"flex", flexDirection:"column", gap:11 }}>
                  {[
                    { icon:<User style={{width:11,height:11}}/>, label:"Họ và tên *", type:"text", val:name, set:setName, ph:"Nhập họ và tên..." },
                    { icon:<Smartphone style={{width:11,height:11}}/>, label:"Số điện thoại *", type:"tel", val:phone, set:setPhone, ph:"Số điện thoại..." },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, fontWeight:700, color:"#78716c", textTransform:"uppercase" as const, letterSpacing:"0.07em", marginBottom:5 }}>{f.icon} {f.label}</label>
                      <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} required
                        style={{ width:"100%", padding:"10px 13px", borderRadius:13, border:"1.5px solid #e7e5e4", outline:"none", fontSize:12, color:"#1A1818", boxSizing:"border-box" as const }}
                        onFocus={e=>(e.target.style.borderColor="#EF9A86")} onBlur={e=>(e.target.style.borderColor="#e7e5e4")} />
                    </div>
                  ))}
                  <button type="submit" style={{ padding:"12px", background:"linear-gradient(135deg,#EF9A86,#D4AF78)", color:"white", border:"none", borderRadius:14, fontWeight:800, fontSize:13, cursor:"pointer" }}>Bắt đầu trò chuyện ✨</button>
                </form>
              </div>
            ) : (
              <>
                <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10, background:"#fafaf9" }}>
                  {messages.filter(m=>!m.text.startsWith("[Hệ thống]")).length===0 ? (
                    <div style={{ textAlign:"center", padding:"24px 12px" }}>
                      <Sparkles style={{ width:26, height:26, color:"#EF9A86", margin:"0 auto 8px", display:"block" }} />
                      <div style={{ fontSize:12, fontWeight:700, color:"#57534e" }}>Xin chào {name}! 💕</div>
                      <div style={{ fontSize:11, marginTop:4, lineHeight:1.7, color:"#78716c" }}>Hỏi tớ về thiệp NFC, chibi 3D,<br/>giá cả hay đặt hàng nhé!</div>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      if (msg.text.startsWith("[Hệ thống]")) return null;
                      const me = msg.sender==="user";
                      return (
                        <div key={i} className="wd-msg" style={{ display:"flex", justifyContent:me?"flex-end":"flex-start", gap:7, alignItems:"flex-end" }}>
                          {!me && <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#EF9A86,#D4AF78)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Bot style={{width:12,height:12,color:"white"}}/></div>}
                          <div style={{ maxWidth:"72%", padding:"9px 13px", borderRadius:18, fontSize:12, lineHeight:1.65, whiteSpace:"pre-wrap" as const, wordBreak:"break-word" as const, ...(me?{background:"linear-gradient(135deg,#EF9A86,#D4AF78)",color:"white",borderBottomRightRadius:4,boxShadow:"0 2px 10px rgba(239,154,134,0.35)"}:{background:"white",color:"#1A1818",borderBottomLeftRadius:4,border:"1px solid #f0ece8"}) }}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  {isTyping && <TypingDots />}
                  <div ref={messagesEnd} />
                </div>

                {messages.filter(m=>!m.text.startsWith("[Hệ thống]")).length===0 && (
                  <div style={{ padding:"0 14px 10px", display:"flex", gap:6, flexWrap:"wrap" as const }}>
                    {["💰 Giá cả","📦 Đặt hàng","📱 NFC là gì?","🎨 Chibi 3D"].map(q=>(
                      <button key={q} data-action="q" onClick={()=>setInputText(q.split(" ").slice(1).join(" "))}
                        style={{ padding:"5px 11px", borderRadius:20, border:"1.5px solid #EF9A86", background:"white", color:"#EF9A86", fontSize:10, fontWeight:700, cursor:"pointer" }}>{q}</button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSend} style={{ padding:"10px 12px", borderTop:"1px solid #f0ece8", display:"flex", gap:8, alignItems:"center", background:"white", flexShrink:0 }}>
                  <input type="text" value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="Nhập tin nhắn..."
                    style={{ flex:1, padding:"10px 15px", borderRadius:22, border:"1.5px solid #e7e5e4", outline:"none", fontSize:12, background:"#fafaf9", color:"#1A1818" }}
                    onFocus={e=>(e.target.style.borderColor="#EF9A86")} onBlur={e=>(e.target.style.borderColor="#e7e5e4")} />
                  <button type="submit" disabled={!inputText.trim()}
                    style={{ width:38, height:38, borderRadius:13, background:inputText.trim()?"linear-gradient(135deg,#EF9A86,#D4AF78)":"#e7e5e4", border:"none", cursor:inputText.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background 0.2s" }}>
                    <Send style={{width:15,height:15,color:inputText.trim()?"white":"#a8a29e"}} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Bot Widget ── */}
      <motion.div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ position:"fixed", bottom:24, left:0, zIndex:9999, x:springX, width:W, userSelect:"none", touchAction:"none" }}
      >
        {/* Intercom-style Notification Popover */}
        <AnimatePresence>
          {showBubble && !isOpen && bubble && (
            <motion.div
              key={bubble}
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={() => { setIsOpen(true); setShowBubble(false); }}
              style={{
                position: "absolute",
                bottom: W + 12,
                [side === "right" ? "right" : "left"]: 0,
                width: 290,
                background: "white",
                borderRadius: 20,
                padding: "14px 16px",
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.04)",
                border: "1px solid #f0ece8",
                cursor: "pointer",
                zIndex: 9997,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              {/* Left Side: Logo/Avatar container */}
              <div style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(239, 154, 134, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
                marginTop: 2
              }}>
                <DropBot state="idle" size={26} />
              </div>

              {/* Right Side: Text content */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#1C1917" }}>Xin chào! 👋</span>
                  {/* Small X button to dismiss bubble without opening chat */}
                  <button
                    data-action="dismiss-bubble"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBubble(false);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#a8a29e",
                      cursor: "pointer",
                      padding: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f4")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <X style={{ width: 11, height: 11 }} />
                  </button>
                </div>
                <div style={{ fontSize: 12, color: "#44403c", lineHeight: 1.5, wordBreak: "break-word" as const }}>
                  {bubble}
                </div>
                <div style={{ fontSize: 10, color: "#a8a29e", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <span>WEMO AI</span>
                  <span>•</span>
                  <span>Vừa xong</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bot icon */}
        <motion.div
          whileHover={{ scale: isDragging ? 1 : 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={!isDragging ? () => { setIsOpen(o=>!o); setShowBubble(false); } : undefined}
          className={!isDragging && botState==="idle" ? "wd-float" : ""}
          style={{ position:"relative", width:W, cursor: isDragging?"grabbing":"pointer" }}
        >
          <DropBot state={isOpen ? "talking" : botState} size={W} />
          {/* Online status green dot */}
          {!isOpen && (
            <span style={{ position:"absolute", top:6, right:4, width:11, height:11, background:"#4ade80", borderRadius:"50%", border:"2.5px solid white", boxShadow:"0 0 0 2px rgba(74,222,128,0.35)" }} />
          )}
          {/* Red notification badge (looks like "1" in the screenshot) */}
          {showBubble && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: "absolute",
                top: 2,
                right: -2,
                background: "#ef4444",
                color: "white",
                fontSize: 9,
                fontWeight: 800,
                width: 17,
                height: 17,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid white",
                boxShadow: "0 2px 6px rgba(239,68,68,0.3)"
              }}
            >
              1
            </motion.span>
          )}
        </motion.div>

        {/* Drag hint */}
        <AnimatePresence>
          {isDragging && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              style={{ position:"absolute", top:-28, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,0.68)", color:"white", fontSize:9, fontWeight:700, padding:"3px 9px", borderRadius:8, whiteSpace:"nowrap" as const, pointerEvents:"none" }}>
              Thả để gắn vào cạnh
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
