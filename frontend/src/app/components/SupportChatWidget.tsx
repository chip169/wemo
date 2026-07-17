import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Phone, MessageSquare, X, User, Smartphone, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router";



// ─── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  _id?: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
}
type BotPose = "stand" | "curled" | "rolling" | "landed" | "wave";

// ─── Constants ─────────────────────────────────────────────────────────────────
const W = 72;
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

// ─── AI replies ────────────────────────────────────────────────────────────────
const KB = [
  { kw: ["xin chào","hello","hi","chào"], r: "Xin chào! Tớ là Pangolin WEMO 🦔 Bạn cần tớ giúp gì?" },
  { kw: ["giá","bao nhiêu","tiền"], r: "WEMO có 3 gói:\n• Figure 9cm: 650k\n• Figure 12cm: 800k\n• Doanh nghiệp: Liên hệ\nGói nào phù hợp với bạn? 💝" },
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

// ─── PANGOLIN CHIBI — beautiful SVG illustration matching reference art ──────────
function PangolinBot({ pose, size = 72 }: { pose: BotPose; size?: number }) {
  const isRolling = pose === "rolling" || pose === "curled";

  // ── ROLLING / CURLED BALL ─────────────────────────────────────────────────
  if (isRolling) {
    return (
      <svg viewBox="0 0 120 120" width={size} height={size}
        style={{ display:"block", overflow:"visible" }}>
        <defs>
          <radialGradient id="rbG" cx="38%" cy="30%" r="68%">
            <stop offset="0%"   stopColor="#EFC070"/>
            <stop offset="55%"  stopColor="#D09848"/>
            <stop offset="100%" stopColor="#A87230"/>
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="116" rx="30" ry="5" fill="rgba(0,0,0,0.13)"/>
        <motion.g
          animate={pose === "rolling" ? { rotate: [0, 360] } : {}}
          transition={pose === "rolling" ? { duration:0.38, repeat:Infinity, ease:"linear" } : {}}
          style={{ originX:"60px", originY:"60px" }}
        >
          {/* Curl base body */}
          <circle cx="60" cy="60" r="48" fill="url(#rbG)"/>

          {/* Overlapping scales on the outer back shell */}
          <circle cx="94" cy="40" r="16" fill="#A87230" stroke="#8A5818" strokeWidth="1.5" />
          <circle cx="98" cy="60" r="17" fill="#A87230" stroke="#8A5818" strokeWidth="1.5" />
          <circle cx="90" cy="80" r="16" fill="#A87230" stroke="#8A5818" strokeWidth="1.5" />
          
          <circle cx="82" cy="30" r="15" fill="#D09848" stroke="#9A6B28" strokeWidth="1.5" />
          <circle cx="86" cy="50" r="16" fill="#D09848" stroke="#9A6B28" strokeWidth="1.5" />
          <circle cx="84" cy="70" r="16" fill="#D09848" stroke="#9A6B28" strokeWidth="1.5" />
          <circle cx="76" cy="88" r="15" fill="#D09848" stroke="#9A6B28" strokeWidth="1.5" />

          {/* Tucked head/face inside the curled posture */}
          <circle cx="50" cy="60" r="28" fill="#FFFAE8" />
          <circle cx="50" cy="60" r="26" fill="#EDBC68" />
          {/* Rosy cheeks */}
          <circle cx="36" cy="66" r="6" fill="#F4906A" opacity="0.7" />
          <circle cx="60" cy="66" r="6" fill="#F4906A" opacity="0.7" />
          {/* Happy closed eyes ^ ^ */}
          <path d="M34 56 Q39 51 44 56" stroke="#5A3010" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M52 56 Q57 51 62 56" stroke="#5A3010" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Cute mouth */}
          <path d="M44 68 Q47 72 50 68" stroke="#7A3810" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Tail wrapping around the bottom */}
          <path d="M30 85 C45 105 75 105 92 88" stroke="#C08A30" strokeWidth="11" fill="none" strokeLinecap="round" />
          {/* Tail scales */}
          <circle cx="50" cy="98" r="7" fill="#8A6018" />
          <circle cx="66" cy="99" r="7" fill="#8A6018" />
          <circle cx="80" cy="95" r="7" fill="#8A6018" />

          {/* Shine overlay */}
          <ellipse cx="44" cy="40" rx="14" ry="8" fill="white" opacity="0.18" transform="rotate(-15 44 40)" />
        </motion.g>
      </svg>
    );
  }

  // ── STANDING / IDLE — detailed chibi SVG ─────────────────────────────────
  // Scale factor: all coords designed for 200×230 viewBox
  return (
    <svg
      viewBox="0 0 200 230"
      width={size}
      height={size}
      style={{ display:"block", overflow:"visible" }}
    >
      <defs>
        {/* Body gradient — warm golden-brown */}
        <radialGradient id="bdG" cx="38%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#EDBC68"/>
          <stop offset="55%"  stopColor="#D09A45"/>
          <stop offset="100%" stopColor="#A87028"/>
        </radialGradient>
        {/* Scale gradient — darker golden */}
        <radialGradient id="scG" cx="50%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#C08A30"/>
          <stop offset="100%" stopColor="#8A6018"/>
        </radialGradient>
        {/* Belly gradient — cream */}
        <radialGradient id="blG" cx="50%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#FFFAE8"/>
          <stop offset="100%" stopColor="#EED4A0"/>
        </radialGradient>
        {/* Ear gradient */}
        <radialGradient id="erG" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#E0A848"/>
          <stop offset="100%" stopColor="#B88030"/>
        </radialGradient>
        {/* Drop shadow */}
        <filter id="pgDrp" x="-25%" y="-15%" width="150%" height="150%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="rgba(100,55,10,0.22)"/>
        </filter>
        {/* Soft glow on eyes */}
        <filter id="eyeGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse cx="100" cy="227" rx="46" ry="7" fill="rgba(0,0,0,0.13)"/>

      {/* ════════════ TAIL ════════════ */}
      {/* Base segments (back to front) */}
      <ellipse cx="148" cy="172" rx="20" ry="11" fill="url(#bdG)" transform="rotate(-18 148 172)"/>
      <ellipse cx="160" cy="158" rx="17" ry="10" fill="url(#bdG)" transform="rotate(-35 160 158)"/>
      <ellipse cx="165" cy="143" rx="14" ry="9" fill="url(#bdG)" transform="rotate(-50 165 143)"/>
      <ellipse cx="161" cy="130" rx="11" ry="7" fill="url(#bdG)" transform="rotate(-58 161 130)"/>
      {/* Scale overlay on tail */}
      <ellipse cx="148" cy="172" rx="16" ry="8" fill="url(#scG)" transform="rotate(-18 148 172)"/>
      <ellipse cx="160" cy="158" rx="13" ry="7" fill="url(#scG)" transform="rotate(-35 160 158)"/>
      <ellipse cx="165" cy="143" rx="10" ry="6" fill="url(#scG)" transform="rotate(-50 165 143)"/>
      <ellipse cx="161" cy="130" rx="8"  ry="5" fill="url(#scG)" transform="rotate(-58 161 130)"/>

      {/* ════════════ BODY ════════════ */}
      <ellipse cx="100" cy="170" rx="58" ry="52" fill="url(#bdG)" filter="url(#pgDrp)"/>

      {/* Body scale rows (back → front = low → high in SVG) */}
      {/* Row 4 lowest */}
      {[78,100,122].map((x,i)=>(
        <ellipse key={`b4${i}`} cx={x} cy={205} rx={23} ry={14} fill="url(#scG)"/>
      ))}
      {/* Row 3 */}
      {[70,92,114,134].map((x,i)=>(
        <ellipse key={`b3${i}`} cx={x} cy={192} rx={22} ry={14} fill="url(#scG)"/>
      ))}
      {/* Row 2 */}
      {[70,92,114,134].map((x,i)=>(
        <ellipse key={`b2${i}`} cx={x} cy={180} rx={22} ry={14} fill="url(#scG)"/>
      ))}
      {/* Row 1 */}
      {[74,96,118,138].map((x,i)=>(
        <ellipse key={`b1${i}`} cx={x} cy={167} rx={21} ry={13} fill="url(#scG)"/>
      ))}

      {/* ── Belly (smooth cream front) ── */}
      <ellipse cx="98" cy="180" rx="36" ry="32" fill="url(#blG)"/>

      {/* ── Legs / feet ── */}
      <ellipse cx="78"  cy="210" rx="17" ry="12" fill="url(#bdG)"/>
      <ellipse cx="122" cy="210" rx="17" ry="12" fill="url(#bdG)"/>
      {/* Toes left */}
      {[70,77,84].map((x,i)=>(
        <ellipse key={`tL${i}`} cx={x} cy={216} rx={4.5} ry={4} fill="#8A5818"/>
      ))}
      {/* Toes right */}
      {[116,123,130].map((x,i)=>(
        <ellipse key={`tR${i}`} cx={x} cy={216} rx={4.5} ry={4} fill="#8A5818"/>
      ))}

      {/* ── Arms & Hands (Pose conditional) ── */}
      {pose === "wave" ? (
        <>
          {/* Left arm resting on belly */}
          <ellipse cx="66" cy="180" rx="14" ry="24" fill="url(#bdG)" transform="rotate(-10 66 180)"/>
          <ellipse cx="78" cy="188" rx="8" ry="8" fill="url(#blG)"/>
          
          {/* Waving Right arm */}
          <motion.g
            animate={{ rotate: [0, -6, 4, -6, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "132px", originY: "165px" }}
          >
            {/* Arm stem */}
            <path d="M132 165 C142 144 150 128 152 116" stroke="url(#bdG)" strokeWidth="24" strokeLinecap="round" fill="none"/>
            
            {/* Waving hand/paw (wrist pivot at 152, 116) */}
            <motion.g
              animate={{ rotate: [-24, 24, -24, 24, -24] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ originX: "152px", originY: "116px" }}
            >
              {/* Hand pad */}
              <ellipse cx="152" cy="102" rx="12" ry="14" fill="url(#blG)" transform="rotate(10 152 102)"/>
              {/* Claws/fingers */}
              {[144, 152, 160].map((cx, i) => (
                <circle key={i} cx={cx} cy={93} r="2.8" fill="#8A5818" />
              ))}
            </motion.g>
          </motion.g>
        </>
      ) : (
        <>
          <ellipse cx="64"  cy="178" rx="15" ry="26" fill="url(#bdG)"/>
          <ellipse cx="136" cy="178" rx="15" ry="26" fill="url(#bdG)"/>
          {/* Clasped hands */}
          <ellipse cx="100" cy="198" rx="30" ry="14" fill="url(#bdG)"/>
          <ellipse cx="100" cy="196" rx="24" ry="11" fill="url(#blG)"/>
          {/* Paw knuckle hints */}
          {[86,93,100,107,114].map((x,i)=>(
            <circle key={`k${i}`} cx={x} cy={194} r={2.2} fill="#B07830" opacity="0.55"/>
          ))}
        </>
      )}

      {/* ════════════ HEAD (large chibi) ════════════ */}
      <ellipse cx="100" cy="86" rx="68" ry="66" fill="url(#bdG)" filter="url(#pgDrp)"/>

      {/* Head scale rows (top dome only) */}
      {/* Row 0 very tip */}
      {[88,112].map((x,i)=>(
        <ellipse key={`h0${i}`} cx={x} cy={30} rx={19} ry={13} fill="url(#scG)"/>
      ))}
      {/* Row 1 */}
      {[72,96,120,144].map((x,i)=>(
        <ellipse key={`h1${i}`} cx={x} cy={44} rx={20} ry={14} fill="url(#scG)"/>
      ))}
      {/* Row 2 */}
      {[66,90,114,138,156].map((x,i)=>(
        <ellipse key={`h2${i}`} cx={x} cy={59} rx={21} ry={14} fill="url(#scG)"/>
      ))}
      {/* Row 3 (shoulder line) */}
      {[62,86,110,134,152].map((x,i)=>(
        <ellipse key={`h3${i}`} cx={x} cy={74} rx={21} ry={13} fill="url(#scG)"/>
      ))}

      {/* ── Ears ── */}
      <ellipse cx="46"  cy="46" rx="20" ry="25" fill="url(#erG)"/>
      <ellipse cx="154" cy="46" rx="20" ry="25" fill="url(#erG)"/>
      {/* Inner ear highlight */}
      <ellipse cx="46"  cy="47" rx="11" ry="15" fill="url(#bdG)"/>
      <ellipse cx="154" cy="47" rx="11" ry="15" fill="url(#bdG)"/>

      {/* ── Cheeks (animated pulse) ── */}
      <motion.ellipse cx="55" cy="100" rx="22" ry="14" fill="#F4906A"
        animate={{ opacity: [0.38, 0.62, 0.38] }}
        transition={{ duration: 2.6, repeat: Infinity, ease:"easeInOut" }}
      />
      <motion.ellipse cx="145" cy="100" rx="22" ry="14" fill="#F4906A"
        animate={{ opacity: [0.38, 0.62, 0.38] }}
        transition={{ duration: 2.6, repeat: Infinity, ease:"easeInOut", delay:0.4 }}
      />

      {/* ── Snout ── */}
      <ellipse cx="100" cy="110" rx="24" ry="17" fill="#C0884C"/>
      {/* Bridge (lighter area above nostrils) */}
      <ellipse cx="100" cy="103" rx="18" ry="11" fill="url(#bdG)"/>
      {/* Nostrils */}
      <ellipse cx="93"  cy="110" rx="4" ry="3.5" fill="#5A3010"/>
      <ellipse cx="107" cy="110" rx="4" ry="3.5" fill="#5A3010"/>

      {/* ── Eyes (large chibi with sparkle highlights) ── */}
      {/* ─ Left eye ─ */}
      <motion.g
        animate={{ scaleY:[1,0.05,1] }}
        transition={{ duration:0.18, repeat:Infinity, repeatDelay:3.8, ease:"easeInOut" }}
        style={{ transformOrigin:"80px 91px" }}
      >
        {/* Sclera (tiny visible white rim for cute look) */}
        <ellipse cx="80" cy="90" rx="15" ry="16" fill="#FFF9F0"/>
        {/* Iris + pupil */}
        <ellipse cx="80" cy="91" rx="13" ry="14" fill="#1A0A02"/>
        {/* Main shine (top-left) */}
        <circle cx="74" cy="84" r="5.5" fill="white"/>
        {/* Secondary shine */}
        <circle cx="85" cy="87" r="3" fill="white" opacity="0.75"/>
        {/* Tiny bottom shine */}
        <circle cx="75" cy="97" r="1.8" fill="white" opacity="0.45"/>
      </motion.g>

      {/* ─ Right eye ─ */}
      <motion.g
        animate={{ scaleY:[1,0.05,1] }}
        transition={{ duration:0.18, repeat:Infinity, repeatDelay:3.8, ease:"easeInOut" }}
        style={{ transformOrigin:"120px 91px" }}
      >
        <ellipse cx="120" cy="90" rx="15" ry="16" fill="#FFF9F0"/>
        <ellipse cx="120" cy="91" rx="13" ry="14" fill="#1A0A02"/>
        <circle cx="114" cy="84" r="5.5" fill="white"/>
        <circle cx="125" cy="87" r="3" fill="white" opacity="0.75"/>
        <circle cx="115" cy="97" r="1.8" fill="white" opacity="0.45"/>
      </motion.g>

      {/* ── Eyebrow marks ── */}
      <path d="M68 72 Q80 66 92 72" stroke="#7A4818" strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.65"/>
      <path d="M108 72 Q120 66 132 72" stroke="#7A4818" strokeWidth="2.8" fill="none" strokeLinecap="round" opacity="0.65"/>

      {/* ── Smile + teeth ── */}
      {/* Teeth */}
      <ellipse cx="100" cy="121" rx="13" ry="8" fill="white"/>
      {/* Mouth curve (smile over teeth) */}
      <path d="M82 114 Q100 128 118 114" stroke="#7A3810" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      {/* Tooth divider */}
      <line x1="100" y1="115" x2="100" y2="126" stroke="#DDCCAA" strokeWidth="1.5" opacity="0.6"/>
    </svg>
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
  const [bubble, setBubble]         = useState("Cần tớ giúp gì không? ✨");
  const [showBubble, setShowBubble] = useState(false);
  const [rollDuration, setRollDuration] = useState(600);
  const [side, setSide]             = useState<"left"|"right">("right");
  const [isDragging, setIsDragging] = useState(false);

  // Bot free-floating position
  const [botPos, setBotPos]   = useState({ x: snapX("right"), y: snapY() });
  const botPosRef             = useRef({ x: snapX("right"), y: snapY() });
  const isAnimatingRef        = useRef(false);
  const rollDebounceRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef               = useRef<{ ptrX: number; startX: number } | null>(null);
  const hasMoved              = useRef(false);
  const contextRef            = useRef("homepage");
  const messagesEnd           = useRef<HTMLDivElement>(null);
  const bubbleTimeoutRef      = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Static Bubbles ───────────────────────────────────────────────────────
  const STATIC_BUBBLES: Record<string, string> = {
    homepage:     "Cần tớ giúp gì không? ✨",
    features:     "Khám phá tính năng đặc biệt của WEMO nhé! 📱",
    templates:    "Chọn mẫu thiệp cho ngày đặc biệt nào! 🎨",
    pricing:      "WEMO đang có ưu đãi lớn đó! 💰",
    "ai-chibi":   "Chỉ 1 ảnh chân dung để có chibi 3D độc bản! 🎨",
    order:        "Hỗ trợ điền thông tin đặt hàng không? 📦",
    faq:          "Hỏi thêm hoặc xem câu hỏi thường gặp nhé! 💬",
    "about-us":   "Câu chuyện sáng lập đầy cảm hứng của WEMO! 🌸",
    contact:      "Gọi ngay hotline hoặc chat zalo nhé! 📞",
    "track-order":"Nhập mã đơn để tớ kiểm tra vận chuyển! 🚚",
    payment:      "Hỗ trợ thanh toán hoặc quét mã QR không? 💳",
  };

  // ── Bot Guide Messages — cho từng điểm nhấn trang ───────────────────────
  const BOT_GUIDES: Record<string, string> = {
    "hero-cta":       "🚀 Bấm vào đây để thử Chibi AI miễn phí ngay!",
    "hero-pricing":   "💰 Xem bảng giá các gói thiệp NFC đẹp nào!",
    "how-it-works":   "📖 Chỉ 4 bước đơn giản là có thiệp NFC rồi!",
    "nfc-step":       "📱 Chạm điện thoại — trang web tự mở, không cần app!",
    "chibi-step":     "🎨 Tải 1-2 ảnh rõ mặt, tớ tạo chibi 3D trong 24h!",
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

    const speed = 0.6; // px/ms
    const duration = Math.min(Math.max(dist / speed, 280), 1600);

    isAnimatingRef.current = true;
    setRollDuration(duration);

    // Show guide bubble
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }

    if (guideKey && BOT_GUIDES[guideKey]) {
      setBubble(BOT_GUIDES[guideKey]);
      setShowBubble(false);
    }

    // 1. Curl up
    setPose("curled");

    setTimeout(() => {
      // 2. Roll
      setPose("rolling");
      setBotPos({ x: targetX, y: targetY });
      botPosRef.current = { x: targetX, y: targetY };

      setTimeout(() => {
        // 3. Land
        setPose("landed");
        isAnimatingRef.current = false;
        if (guideKey && BOT_GUIDES[guideKey]) {
          setShowBubble(true);
          if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
          bubbleTimeoutRef.current = setTimeout(() => {
            setShowBubble(false);
          }, 5000);
        }
        // 4. Return to stand
        setTimeout(() => setPose("stand"), 500);
      }, duration);
    }, 180);
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

  // ─── Context change (route) ────────────────────────────────────────────────
  useEffect(() => {
    const ctx = getCtx(location.pathname);
    contextRef.current = ctx;
    const msg = STATIC_BUBBLES[ctx] || "Cần tớ giúp gì không? ✨";
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

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

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
        fetch("/api/support/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ sessionId:sid, sender:"admin", text:`Xin chào ${name.trim()}! 🦔 Tớ là Pango. Tớ có thể giúp về thiệp NFC, chibi 3D, giá cả và đặt hàng. Bạn cần gì?` }) }).catch(console.error);
      }, 1800);
    }, 500);
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

  // ─── Chat popup position ───────────────────────────────────────────────────
  const getPopupStyle = (): React.CSSProperties => {
    const PW = 320;
    const px = botPos.x;
    const py = botPos.y;
    const base: React.CSSProperties = { position: "fixed", zIndex: 9998, width: PW };

    // Vertical: above or below bot
    if (py > window.innerHeight / 2) {
      base.bottom = window.innerHeight - py + 8;
    } else {
      base.top = py + W + 8;
    }
    // Horizontal
    if (px + W/2 + PW/2 > window.innerWidth - 8) {
      base.right = window.innerWidth - px - W;
    } else {
      base.left = Math.max(8, px - PW/2 + W/2);
    }
    return base;
  };

  // ─── Bubble position ───────────────────────────────────────────────────────
  const getBubbleStyle = (): React.CSSProperties => {
    const BW = 260;
    const px = botPos.x;
    const py = botPos.y;
    const style: React.CSSProperties = {
      position: "fixed",
      zIndex: 9997,
      width: BW,
    };
    if (py > window.innerHeight / 2) {
      style.bottom = window.innerHeight - py + 8;
    } else {
      style.top = py + W + 8;
    }
    if (px + W/2 + BW/2 > window.innerWidth - 8) {
      style.right = window.innerWidth - px - W;
    } else {
      style.left = Math.max(8, px - BW/2 + W/2);
    }
    return style;
  };

  return (
    <>
      <style>{`
        @keyframes pgBounce{0%,80%,100%{transform:translateY(0);opacity:.45}40%{transform:translateY(-5px);opacity:1}}
        @keyframes pgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pgLand{0%{transform:scaleY(0.78) scaleX(1.15)}55%{transform:scaleY(1.06) scaleX(0.96)}100%{transform:scaleY(1) scaleX(1)}}
        @keyframes pgIn{from{opacity:0;transform:translateY(8px) scale(.94)}to{opacity:1;transform:none}}
        .pg-msg{animation:pgIn .22s cubic-bezier(.16,1,.3,1) both}
        .pg-float{animation:pgFloat 2.6s ease-in-out infinite}
        .pg-land{animation:pgLand 0.4s ease-out}
      `}</style>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div key="pg-chat"
            initial={{ opacity:0, scale:0.88, y:20 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.88, y:20 }}
            transition={{ type:"spring", stiffness:320, damping:28 }}
            style={{ ...getPopupStyle(), height:460, borderRadius:24, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(20px)", border:"1.5px solid rgba(232,180,168,0.3)", boxShadow:"0 24px 56px rgba(0,0,0,0.15), 0 6px 20px rgba(232,180,168,0.3)", display:"flex", flexDirection:"column", overflow:"hidden", fontFamily:"'Inter',sans-serif" } as any}
          >
            {/* Header */}
            <div style={{ background:"linear-gradient(135deg, #FFF0EC 0%, #FCE1DA 100%)", padding:"13px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0, borderBottom:"1.5px solid rgba(232,180,168,0.25)" }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(232,180,168,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden" }}>
                <PangolinBot pose="stand" size={38} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:"#5C352E", fontWeight:800, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Pango 🦔</div>
                <div style={{ color:"#8C5D53", fontSize:9.5, display:"flex", flexDirection:"column", gap:2, marginTop:2 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:6, height:6, background:"#4ade80", borderRadius:"50%", display:"inline-block", flexShrink:0 }} />
                    <span style={{ fontWeight:500 }}>Trực tuyến</span>
                  </div>
                  <div style={{ opacity:0.8 }}>Phản hồi tức thì</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                <a href="tel:0398768699" data-action="c" style={{ width:32, height:32, borderRadius:10, background:"rgba(92,53,46,0.06)", display:"flex", alignItems:"center", justifyContent:"center", color:"#5C352E", textDecoration:"none" }}><Phone style={{ width:14, height:14 }} /></a>
                <a href="https://zalo.me/0398768699" target="_blank" rel="noopener noreferrer" data-action="z" style={{ width:32, height:32, borderRadius:10, background:"rgba(92,53,46,0.06)", display:"flex", alignItems:"center", justifyContent:"center", color:"#5C352E", textDecoration:"none" }}><MessageSquare style={{ width:14, height:14 }} /></a>
                <button data-action="x" onClick={() => setIsOpen(false)} style={{ width:32, height:32, borderRadius:10, background:"rgba(92,53,46,0.06)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#5C352E" }}><X style={{ width:15, height:15 }} /></button>
              </div>
            </div>

            {/* Content */}
            {!isRegistered ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"20px", gap:13, overflowY:"auto" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ width:64, height:64, margin:"0 auto 10px" }}><PangolinBot pose="stand" size={64} /></div>
                  <div style={{ fontWeight:800, fontSize:14, color:"#1A1818" }}>Xin chào! Tớ là Pango 🦔</div>
                  <div style={{ fontSize:11, color:"#a8a29e", marginTop:4, lineHeight:1.65 }}>Nhập thông tin để tớ hỗ trợ tốt hơn nhé!</div>
                </div>
                <form onSubmit={handleRegister} style={{ display:"flex", flexDirection:"column", gap:11 }}>
                  {[
                    { icon:<User style={{width:11,height:11}}/>, label:"Họ và tên *", type:"text", val:name, set:setName, ph:"Nhập họ và tên..." },
                    { icon:<Smartphone style={{width:11,height:11}}/>, label:"Số điện thoại *", type:"tel", val:phone, set:setPhone, ph:"Số điện thoại..." },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, fontWeight:700, color:"#8C5D53", textTransform:"uppercase" as const, letterSpacing:"0.07em", marginBottom:5 }}>{f.icon} {f.label}</label>
                      <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} required
                        style={{ width:"100%", padding:"10px 13px", borderRadius:13, border:"1.5px solid #F3D9D2", outline:"none", fontSize:12, color:"#5C352E", boxSizing:"border-box" as const }}
                        onFocus={e=>(e.target.style.borderColor="#E8B4A8")} onBlur={e=>(e.target.style.borderColor="#F3D9D2")} />
                    </div>
                  ))}
                  <button type="submit" style={{ padding:"12px", background:"linear-gradient(135deg, #E8B4A8, #D49D90)", color:"white", border:"none", borderRadius:14, fontWeight:800, fontSize:13, cursor:"pointer", boxShadow:"0 4px 14px rgba(232,180,168,0.35)" }}>Bắt đầu trò chuyện 🦔</button>
                </form>
              </div>
            ) : (
              <>
                <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10, background:"#FFF6F4" }}>
                  {messages.filter(m=>!m.text.startsWith("[Hệ thống]")).length===0 ? (
                    <div style={{ textAlign:"center", padding:"24px 12px" }}>
                      <Sparkles style={{ width:26, height:26, color:"#E8B4A8", margin:"0 auto 8px", display:"block" }} />
                      <div style={{ fontSize:12, fontWeight:700, color:"#8C5D53" }}>Xin chào {name}! 💕</div>
                      <div style={{ fontSize:11, marginTop:4, lineHeight:1.7, color:"#A47870" }}>Hỏi tớ về thiệp NFC, chibi 3D,<br/>giá cả hay đặt hàng nhé!</div>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      if (msg.text.startsWith("[Hệ thống]")) return null;
                      const me = msg.sender==="user";
                      return (
                        <div key={i} className="pg-msg" style={{ display:"flex", justifyContent:me?"flex-end":"flex-start", gap:7, alignItems:"flex-end" }}>
                          {!me && <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg, #E8B4A8, #D49D90)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Bot style={{width:12,height:12,color:"white"}}/></div>}
                          <div style={{ maxWidth:"72%", padding:"9px 13px", borderRadius:18, fontSize:12, lineHeight:1.65, whiteSpace:"pre-wrap" as const, wordBreak:"break-word" as const, ...(me?{background:"linear-gradient(135deg, #E8B4A8, #D49D90)",color:"white",borderBottomRightRadius:4,boxShadow:"0 2px 10px rgba(232,180,168,0.3)"}:{background:"white",color:"#5C352E",borderBottomLeftRadius:4,border:"1px solid #F3D9D2"}) }}>
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
                        style={{ padding:"5px 11px", borderRadius:20, border:"1.5px solid #E8B4A8", background:"white", color:"#C58B7E", fontSize:10, fontWeight:700, cursor:"pointer" }}>{q}</button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSend} style={{ padding:"10px 12px", borderTop:"1.5px solid #F3D9D2", display:"flex", gap:8, alignItems:"center", background:"white", flexShrink:0 }}>
                  <input type="text" value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="Nhập tin nhắn..."
                    style={{ flex:1, padding:"10px 15px", borderRadius:22, border:"1.5px solid #F3D9D2", outline:"none", fontSize:12, background:"#FFFDFD", color:"#5C352E" }}
                    onFocus={e=>(e.target.style.borderColor="#E8B4A8")} onBlur={e=>(e.target.style.borderColor="#F3D9D2")} />
                  <button type="submit" disabled={!inputText.trim()}
                    style={{ width:38, height:38, borderRadius:13, background:inputText.trim()?"linear-gradient(135deg, #E8B4A8, #D49D90)":"#e7e5e4", border:"none", cursor:inputText.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background 0.2s" }}>
                    <Send style={{width:15,height:15,color:inputText.trim()?"white":"#a8a29e"}} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bubble notification ── */}
      <AnimatePresence>
        {showBubble && !isOpen && bubble && (
          <motion.div
            key={bubble}
            initial={{ opacity:0, scale:0.85, y:12 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.85, y:8 }}
            transition={{ type:"spring", stiffness:300, damping:24 }}
            onClick={() => { setIsOpen(true); setShowBubble(false); }}
            style={{ ...getBubbleStyle(), background:"white", borderRadius:20, padding:"14px 16px", fontFamily:"'Inter',sans-serif", boxShadow:"0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.04)", border:"1px solid #f0ece8", cursor:"pointer", display:"flex", gap:12, alignItems:"flex-start" }}
          >
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(232,180,168,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden", marginTop:2 }}>
              <PangolinBot pose="stand" size={30} />
            </div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:3, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>
                <span style={{ fontWeight:700, fontSize:13, color:"#1C1917" }}>Pango 🦔</span>
                <button
                  data-action="dismiss-bubble"
                  onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
                  style={{ background:"none", border:"none", color:"#a8a29e", cursor:"pointer", padding:2, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:4 }}
                  onMouseEnter={e=>(e.currentTarget.style.background="#f5f5f4")}
                  onMouseLeave={e=>(e.currentTarget.style.background="none")}
                >
                  <X style={{ width:11, height:11 }} />
                </button>
              </div>
              <div style={{ fontSize:12, color:"#44403c", lineHeight:1.5, wordBreak:"break-word" as const }}>{bubble}</div>
              <div style={{ fontSize:10, color:"#a8a29e", marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
                <span>Pango</span><span>•</span><span>Vừa xong</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Pangolin Bot ── */}
      <motion.div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className={pose === "stand" && !isOpen && !isDragging ? "pg-float" : pose === "landed" ? "pg-land" : ""}
        style={{
          position: "fixed",
          left: botPos.x,
          top: botPos.y,
          zIndex: 9999,
          width: W,
          height: W,
          cursor: isDragging ? "grabbing" : "pointer",
          userSelect: "none",
          touchAction: "none",
          transition: isDragging ? "none" : pose === "rolling"
            ? `left ${rollDuration}ms cubic-bezier(.3,.6,.3,1), top ${rollDuration}ms cubic-bezier(.3,.6,.3,1)`
            : "left 0.35s cubic-bezier(.3,.8,.4,1), top 0.35s cubic-bezier(.3,.8,.4,1)",
        }}
        whileHover={{ scale: isDragging ? 1 : 1.1 }}
        whileTap={{ scale: 0.92 }}
      >
        {/* Rolling trail glow */}
        {pose === "rolling" && (
          <motion.div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(232,180,168,0.35) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
        )}

        <PangolinBot pose={pose} size={W} />

        {/* Online dot */}
        {!isOpen && (
          <span style={{ position:"absolute", top:6, right:4, width:11, height:11, background:"#4ade80", borderRadius:"50%", border:"2.5px solid white", boxShadow:"0 0 0 2px rgba(74,222,128,0.35)" }} />
        )}

        {/* Notification badge */}
        {showBubble && !isOpen && (
          <motion.span
            initial={{ scale:0 }}
            animate={{ scale:1 }}
            style={{ position:"absolute", top:2, right:-2, background:"#ef4444", color:"white", fontSize:9, fontWeight:800, width:17, height:17, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid white", boxShadow:"0 2px 6px rgba(239,68,68,0.3)" }}
          >1</motion.span>
        )}

        {/* Drag hint */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position:"absolute", top:-28, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,0.68)", color:"white", fontSize:9, fontWeight:700, padding:"3px 9px", borderRadius:8, whiteSpace:"nowrap" as const, pointerEvents:"none" }}
            >
              Thả để gắn vào lề
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
