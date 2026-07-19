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
type BotPose = "stand" | "curled" | "rolling" | "landed" | "wave" | "bow" | "think" | "excited";

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

// ─── AI replies — Butler personality ─────────────────────────────────────────────────────
const KB = [
  { kw: ["xin chào","hello","hi","chào"], r: "Chào mừng quý khách! 🎊 Tôi là Pango, quản gia của WEMO. Tôi có thể phục vụ quý khách điều gì ạ?" },
  { kw: ["giá","bao nhiêu","tiền","phí"], r: "Thưa quý khách, WEMO đang có 3 gói ưu đãi: 🎊\n• Thiệp Figure 9cm: 650k\n• Thiệp Figure 12cm: 800k\n• Gói Doanh nghiệp: Liên hệ để nhận báo giá\nGói nào phù hợp với nhu cầu của quý khách ạ? 💌" },
  { kw: ["nfc","chip","hoạt động","công nghệ"], r: "Công nghệ NFC thông minh của WEMO rất đơn giản thưa quý khách! 📱 Chỉ cần chạm nhẹ điện thoại vào thiệp, trang web kỷ niệm lập tức hiện ra — không cần cài ứng dụng!" },
  { kw: ["chibi","3d","ảnh","vẽ","avatar"], r: "Dịch vụ Chibi 3D độc đáo của chúng tôi 🎨 Chỉ cần 1-2 ảnh chân dung rõ nét, nghệ nhân WEMO sẽ tạo ra nhân vật chibi 3D độc bản trong 24-48 giờ!" },
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

// ─── PANGOLIN BUTLER — Premium SVG with tuxedo, bow-tie & interactive poses ───
function PangolinBot({ pose, size = 72, eyeOff = {x:0,y:0} }: {
  pose: BotPose;
  size?: number;
  eyeOff?: { x: number; y: number };
}) {
  const isRolling = pose === "rolling" || pose === "curled";
  const isThink   = pose === "think";
  const isExcited = pose === "excited";
  const isBow     = pose === "bow" || pose === "landed";
  const isWave    = pose === "wave";

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
        <motion.g animate={{}} transition={{}} style={{ originX:"60px", originY:"60px" }}>
          <circle cx="60" cy="60" r="48" fill="url(#rbG)"/>
          <circle cx="94" cy="40" r="16" fill="#A87230" stroke="#8A5818" strokeWidth="1.5" />
          <circle cx="98" cy="60" r="17" fill="#A87230" stroke="#8A5818" strokeWidth="1.5" />
          <circle cx="90" cy="80" r="16" fill="#A87230" stroke="#8A5818" strokeWidth="1.5" />
          <circle cx="82" cy="30" r="15" fill="#D09848" stroke="#9A6B28" strokeWidth="1.5" />
          <circle cx="86" cy="50" r="16" fill="#D09848" stroke="#9A6B28" strokeWidth="1.5" />
          <circle cx="84" cy="70" r="16" fill="#D09848" stroke="#9A6B28" strokeWidth="1.5" />
          <circle cx="76" cy="88" r="15" fill="#D09848" stroke="#9A6B28" strokeWidth="1.5" />
          <circle cx="50" cy="60" r="28" fill="#FFFAE8" />
          <circle cx="50" cy="60" r="26" fill="#EDBC68" />
          <circle cx="36" cy="66" r="6" fill="#F4906A" opacity="0.7" />
          <circle cx="60" cy="66" r="6" fill="#F4906A" opacity="0.7" />
          <path d="M34 56 Q39 51 44 56" stroke="#5A3010" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M52 56 Q57 51 62 56" stroke="#5A3010" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M44 68 Q47 72 50 68" stroke="#7A3810" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M30 85 C45 105 75 105 92 88" stroke="#C08A30" strokeWidth="11" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="98" r="7" fill="#8A6018" />
          <circle cx="66" cy="99" r="7" fill="#8A6018" />
          <circle cx="80" cy="95" r="7" fill="#8A6018" />
          <ellipse cx="44" cy="40" rx="14" ry="8" fill="white" opacity="0.18" transform="rotate(-15 44 40)" />
        </motion.g>
      </svg>
    );
  }

  // ── STANDING BUTLER — tuxedo, bow-tie, eye-tracking, conditional poses ──────
  return (
    <svg
      viewBox="0 0 200 230"
      width={size}
      height={size}
      style={{
        display: "block",
        overflow: "visible",
        transform: isBow ? "perspective(400px) rotateX(22deg)" : undefined,
        transformOrigin: "center bottom",
        transition: "transform 0.4s ease",
      }}
    >
      <defs>
        <radialGradient id="bdG" cx="38%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#EDBC68"/>
          <stop offset="55%"  stopColor="#D09A45"/>
          <stop offset="100%" stopColor="#A87028"/>
        </radialGradient>
        <radialGradient id="scG" cx="50%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#C08A30"/>
          <stop offset="100%" stopColor="#8A6018"/>
        </radialGradient>
        <radialGradient id="blG" cx="50%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#FFFAE8"/>
          <stop offset="100%" stopColor="#EED4A0"/>
        </radialGradient>
        <radialGradient id="erG" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#E0A848"/>
          <stop offset="100%" stopColor="#B88030"/>
        </radialGradient>
        {/* 3D specular highlight gradient — top-left bright spot on head */}
        <radialGradient id="specG" cx="32%" cy="22%" r="55%">
          <stop offset="0%"   stopColor="rgba(255,255,230,0.55)"/>
          <stop offset="40%"  stopColor="rgba(255,240,200,0.18)"/>
          <stop offset="100%" stopColor="rgba(255,220,150,0)"/>
        </radialGradient>
        {/* Soft blur filter for glow effects */}
        <filter id="softBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
        {/* Stronger blur for rim light */}
        <filter id="rimBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6"/>
        </filter>
        <filter id="pgDrp" x="-25%" y="-15%" width="150%" height="150%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="rgba(100,55,10,0.22)"/>
        </filter>
      </defs>

      <ellipse cx="100" cy="227" rx="46" ry="7" fill="rgba(0,0,0,0.13)"/>

      <ellipse cx="148" cy="172" rx="20" ry="11" fill="url(#bdG)" transform="rotate(-18 148 172)"/>
      <ellipse cx="160" cy="158" rx="17" ry="10" fill="url(#bdG)" transform="rotate(-35 160 158)"/>
      <ellipse cx="165" cy="143" rx="14" ry="9"  fill="url(#bdG)" transform="rotate(-50 165 143)"/>
      <ellipse cx="161" cy="130" rx="11" ry="7"  fill="url(#bdG)" transform="rotate(-58 161 130)"/>
      <ellipse cx="148" cy="172" rx="16" ry="8"  fill="url(#scG)" transform="rotate(-18 148 172)"/>
      <ellipse cx="160" cy="158" rx="13" ry="7"  fill="url(#scG)" transform="rotate(-35 160 158)"/>
      <ellipse cx="165" cy="143" rx="10" ry="6"  fill="url(#scG)" transform="rotate(-50 165 143)"/>
      <ellipse cx="161" cy="130" rx="8"  ry="5"  fill="url(#scG)" transform="rotate(-58 161 130)"/>

      <ellipse cx="100" cy="170" rx="58" ry="52" fill="url(#bdG)" filter="url(#pgDrp)"/>
      {[78,100,122].map((x,i)  => <ellipse key={`b4${i}`} cx={x} cy={205} rx={23} ry={14} fill="url(#scG)"/>)}
      {[70,92,114,134].map((x,i)=> <ellipse key={`b3${i}`} cx={x} cy={192} rx={22} ry={14} fill="url(#scG)"/>)}
      {[70,92,114,134].map((x,i)=> <ellipse key={`b2${i}`} cx={x} cy={180} rx={22} ry={14} fill="url(#scG)"/>)}
      {[74,96,118,138].map((x,i)=> <ellipse key={`b1${i}`} cx={x} cy={167} rx={21} ry={13} fill="url(#scG)"/>)}
      {/* Belly — breathing animation when standing */}
      <motion.ellipse cx="98" cy="181" rx="36" ry="32" fill="url(#blG)"
        animate={pose==="stand" ? {ry:[32,35,32], cy:[181,179,181]} : {ry:32, cy:181}}
        transition={{duration:3.2, repeat:Infinity, ease:"easeInOut"}}/>
      {/* Body AO shadow — dark crescent at top where head meets body */}
      <ellipse cx="100" cy="148" rx="40" ry="10" fill="rgba(70,35,0,0.18)" filter="url(#softBlur)"/>


      <ellipse cx="78"  cy="210" rx="17" ry="12" fill="url(#bdG)"/>
      <ellipse cx="122" cy="210" rx="17" ry="12" fill="url(#bdG)"/>
      {[70,77,84].map((x,i)   => <ellipse key={`tL${i}`} cx={x} cy={216} rx={4.5} ry={4} fill="#8A5818"/>)}
      {[116,123,130].map((x,i) => <ellipse key={`tR${i}`} cx={x} cy={216} rx={4.5} ry={4} fill="#8A5818"/>)}

      {isWave ? (
        <>
          {/* Left arm resting */}
          <ellipse cx="66" cy="180" rx="14" ry="24" fill="url(#bdG)" transform="rotate(-10 66 180)"/>
          <ellipse cx="78" cy="188" rx="8" ry="8" fill="url(#blG)"/>
          {/* Right waving arm */}
          <motion.g animate={{rotate:[0,-6,4,-6,4,0]}} transition={{duration:1.5,repeat:Infinity,ease:"easeInOut"}} style={{originX:"132px",originY:"165px"}}>
            <path d="M132 165 C142 144 150 128 152 116" stroke="url(#bdG)" strokeWidth="24" strokeLinecap="round" fill="none"/>
            <motion.g animate={{rotate:[-24,24,-24,24,-24]}} transition={{duration:0.8,repeat:Infinity,ease:"easeInOut"}} style={{originX:"152px",originY:"116px"}}>
              <ellipse cx="152" cy="102" rx="12" ry="14" fill="#F0EBE0" transform="rotate(10 152 102)"/>
              {[144,152,160].map((cx,i) => <circle key={i} cx={cx} cy={93} r="2.8" fill="#8A5818"/>)}
            </motion.g>
          </motion.g>
          {/* Ear follow-through on wave — left ear wiggles slightly */}
          <motion.ellipse cx="46" cy="46" rx="20" ry="25" fill="url(#erG)"
            animate={{rotate:[-4,2,-4]}} transition={{duration:1.6,repeat:Infinity,ease:"easeInOut"}}
            style={{originX:"46px",originY:"72px"}}/>
        </>
      ) : isThink ? (
        <>
          <ellipse cx="64" cy="180" rx="14" ry="25" fill="url(#bdG)" transform="rotate(-5 64 180)"/>
          <ellipse cx="70" cy="200" rx="11" ry="9" fill="url(#blG)"/>
          <path d="M136 170 C150 156 158 142 152 128" stroke="url(#bdG)" strokeWidth="22" strokeLinecap="round" fill="none"/>
          <ellipse cx="152" cy="125" rx="14" ry="11" fill="url(#blG)" transform="rotate(-18 152 125)"/>
          <path d="M143 120 Q148 115 154 118" stroke="#C0A880" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      ) : isExcited ? (
        <>
          <path d="M70 168 C52 148 44 128 56 114" stroke="url(#bdG)" strokeWidth="22" strokeLinecap="round" fill="none"/>
          <ellipse cx="56" cy="110" rx="13" ry="12" fill="url(#blG)" transform="rotate(18 56 110)"/>
          <path d="M130 168 C148 148 156 128 144 114" stroke="url(#bdG)" strokeWidth="22" strokeLinecap="round" fill="none"/>
          <ellipse cx="144" cy="110" rx="13" ry="12" fill="url(#blG)" transform="rotate(-18 144 110)"/>
        </>
      ) : (
        <>
          <ellipse cx="64"  cy="178" rx="15" ry="26" fill="url(#bdG)"/>
          <ellipse cx="136" cy="178" rx="15" ry="26" fill="url(#bdG)"/>
          <ellipse cx="100" cy="198" rx="30" ry="14" fill="url(#bdG)"/>
          <ellipse cx="100" cy="196" rx="24" ry="11" fill="url(#blG)"/>
          {[86,93,100,107,114].map((x,i) => <circle key={`k${i}`} cx={x} cy={194} r={2.2} fill="#B07830" opacity="0.55"/>)}
        </>
      )}

      <ellipse cx="100" cy="86" rx="68" ry="66" fill="url(#bdG)" filter="url(#pgDrp)"/>
      {[88,112].map((x,i)         => <ellipse key={`h0${i}`} cx={x} cy={30} rx={19} ry={13} fill="url(#scG)"/>)}
      {[72,96,120,144].map((x,i)  => <ellipse key={`h1${i}`} cx={x} cy={44} rx={20} ry={14} fill="url(#scG)"/>)}
      {[66,90,114,138,156].map((x,i)=> <ellipse key={`h2${i}`} cx={x} cy={59} rx={21} ry={14} fill="url(#scG)"/>)}
      {[62,86,110,134,152].map((x,i)=> <ellipse key={`h3${i}`} cx={x} cy={74} rx={21} ry={13} fill="url(#scG)"/>)}

      <ellipse cx="46"  cy="46" rx="20" ry="25" fill="url(#erG)"/>
      <ellipse cx="154" cy="46" rx="20" ry="25" fill="url(#erG)"/>
      {/* Ear AO shadow — depth at base of ears */}
      <ellipse cx="46"  cy="68" rx="10" ry="5" fill="rgba(60,28,0,0.22)" filter="url(#softBlur)"/>
      <ellipse cx="154" cy="68" rx="10" ry="5" fill="rgba(60,28,0,0.22)" filter="url(#softBlur)"/>
      <ellipse cx="46"  cy="47" rx="11" ry="15" fill="url(#bdG)"/>
      <ellipse cx="154" cy="47" rx="11" ry="15" fill="url(#bdG)"/>
      {/* Ear inner highlight */}
      <ellipse cx="43"  cy="40" rx="5" ry="7" fill="rgba(255,220,150,0.25)"/>
      <ellipse cx="157" cy="40" rx="5" ry="7" fill="rgba(255,220,150,0.25)"/>

      {/* ═ RIM LIGHT — warm backlight fringe around head = key 3D cue */}
      <circle cx="100" cy="82" r="74" fill="none"
        stroke="rgba(255,210,120,0.28)" strokeWidth="12"
        filter="url(#rimBlur)"/>

      {/* ═ SPECULAR HIGHLIGHT — glossy bright spot top-left of head */}
      <ellipse cx="72" cy="52" rx="32" ry="22"
        fill="url(#specG)" transform="rotate(-20 72 52)"/>
      {/* Tighter bright core */}
      <ellipse cx="66" cy="46" rx="14" ry="9"
        fill="rgba(255,252,220,0.38)" transform="rotate(-25 66 46)"/>

      {/* ═ AMBIENT OCCLUSION — subtle shadow under head base */}
      <ellipse cx="100" cy="148" rx="46" ry="8" fill="rgba(70,35,0,0.16)" filter="url(#softBlur)"/>

      {/* Face glow highlight — makes head look rounder and cuter */}
      <ellipse cx="88" cy="72" rx="30" ry="22" fill="white" opacity="0.09" transform="rotate(-12 88 72)"/>

      {/* Cheeks — softer, larger, more blush */}
      <motion.ellipse cx="52" cy="102" rx={isExcited?30:25} ry={isExcited?18:15} fill="#F4906A"
        animate={{opacity:[0.32,0.58,0.32]}} transition={{duration:2.8,repeat:Infinity,ease:"easeInOut"}}/>
      <motion.ellipse cx="148" cy="102" rx={isExcited?30:25} ry={isExcited?18:15} fill="#F4906A"
        animate={{opacity:[0.32,0.58,0.32]}} transition={{duration:2.8,repeat:Infinity,ease:"easeInOut",delay:0.4}}/>

      {/* Think: monocle stays; also add thought bubbles */}
      {isThink && (
        <g opacity="0.92">
          <circle cx="80" cy="90" r="20" fill="none" stroke="#C8A84B" strokeWidth="2.4"/>
          <path d="M96 102 Q101 114 98 126" stroke="#C8A84B" strokeWidth="1.6" fill="none"/>
          <circle cx="98" cy="128" r="2.2" fill="#C8A84B"/>
        </g>
      )}
      {/* Thought bubbles — float up from head-right when thinking */}
      {isThink && (
        <>
          <motion.circle cx="168" cy="88" r="5" fill="white"
            animate={{cy:[88,70,50], opacity:[0,0.85,0], scale:[0.5,1,0]}}
            transition={{duration:2.2, repeat:Infinity, ease:"easeOut"}}/>
          <motion.circle cx="178" cy="68" r="8" fill="white"
            animate={{cy:[68,48,28], opacity:[0,0.7,0], scale:[0.4,1,0]}}
            transition={{duration:2.2, repeat:Infinity, ease:"easeOut", delay:0.5}}/>
          <motion.circle cx="170" cy="44" r="12" fill="white"
            animate={{cy:[44,22,2], opacity:[0,0.6,0], scale:[0.3,1,0]}}
            transition={{duration:2.2, repeat:Infinity, ease:"easeOut", delay:1.0}}/>
        </>
      )}

      {/* Snout — rounder, cuter */}
      <ellipse cx="100" cy="112" rx="26" ry="18" fill="#C8904E"/>
      <ellipse cx="100" cy="104" rx="20" ry="12" fill="url(#bdG)"/>
      {/* Rounder cute nostrils */}
      <ellipse cx="92"  cy="113" rx="4.5" ry="4" fill="#5A3010"/>
      <ellipse cx="108" cy="113" rx="4.5" ry="4" fill="#5A3010"/>
      {/* Snout highlight */}
      <ellipse cx="100" cy="108" rx="10" ry="5" fill="white" opacity="0.12"/>

      {/* Eyelashes — left eye */}
      <path d="M68 78 Q72 73 76 76" stroke="#5A3010" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M77 75 Q80 69 84 72" stroke="#5A3010" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M85 74 Q89 70 92 74" stroke="#5A3010" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>

      {/* Left eye */}
      <motion.g
        animate={{ scaleY: isBow ? [0.08,0.08] : [1,0.05,1] }}
        transition={isBow ? {duration:0.1} : {duration:0.18,repeat:Infinity,repeatDelay:3.8,ease:"easeInOut"}}
        style={{ transformOrigin:"80px 91px" }}
      >
        <ellipse cx="80" cy="90" rx="15" ry={isExcited?19:16} fill="#FFF9F0"/>
        {/* Iris color ring — warm amber for depth */}
        <ellipse cx={80+eyeOff.x} cy={91+eyeOff.y} rx="13" ry={isExcited?17:14} fill="#2C1A06"/>
        <ellipse cx={80+eyeOff.x} cy={91+eyeOff.y} rx="10" ry={isExcited?13:11} fill="#4A2010"/>
        <ellipse cx={80+eyeOff.x} cy={92+eyeOff.y} rx="7"  ry={isExcited?9:8}   fill="#0E0604"/>
        {/* Main sparkle */}
        <circle cx={74+eyeOff.x*0.6} cy={84+eyeOff.y*0.6} r="5.5" fill="white"/>
        <circle cx={85+eyeOff.x*0.6} cy={87+eyeOff.y*0.6} r="3"   fill="white" opacity="0.75"/>
        <circle cx={75+eyeOff.x*0.6} cy={97+eyeOff.y*0.6} r="1.8" fill="white" opacity="0.45"/>
      </motion.g>

      {/* Eyelashes — right eye (hidden when squinting for think) */}
      {!isThink && (
        <>
          <path d="M108 74 Q112 70 115 74" stroke="#5A3010" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M116 72 Q120 67 123 71" stroke="#5A3010" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M124 74 Q128 70 132 75" stroke="#5A3010" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
        </>
      )}

      {isThink ? (
        <path d="M108 91 Q120 84 132 91" stroke="#5A3010" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      ) : (
        <motion.g
          animate={{ scaleY: isBow ? [0.08,0.08] : [1,0.05,1] }}
          transition={isBow ? {duration:0.1} : {duration:0.18,repeat:Infinity,repeatDelay:3.8,ease:"easeInOut"}}
          style={{ transformOrigin:"120px 91px" }}
        >
          <ellipse cx="120" cy="90" rx="15" ry={isExcited?19:16} fill="#FFF9F0"/>
          {/* Iris color ring */}
          <ellipse cx={120+eyeOff.x} cy={91+eyeOff.y} rx="13" ry={isExcited?17:14} fill="#2C1A06"/>
          <ellipse cx={120+eyeOff.x} cy={91+eyeOff.y} rx="10" ry={isExcited?13:11} fill="#4A2010"/>
          <ellipse cx={120+eyeOff.x} cy={92+eyeOff.y} rx="7"  ry={isExcited?9:8}   fill="#0E0604"/>
          <circle cx={114+eyeOff.x*0.6} cy={84+eyeOff.y*0.6} r="5.5" fill="white"/>
          <circle cx={125+eyeOff.x*0.6} cy={87+eyeOff.y*0.6} r="3"   fill="white" opacity="0.75"/>
          <circle cx={115+eyeOff.x*0.6} cy={97+eyeOff.y*0.6} r="1.8" fill="white" opacity="0.45"/>
        </motion.g>
      )}

      {/* Eyebrows — softer, more expressive */}
      <path d="M67 70 Q80 63 93 70" stroke="#7A4818" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path
        d={isThink ? "M107 63 Q120 56 133 63" : "M107 70 Q120 63 133 70"}
        stroke="#7A4818" strokeWidth="3" fill="none" strokeLinecap="round"
        opacity={isThink ? 0.8 : 0.6}
      />

      {isExcited ? (
        <>
          <ellipse cx="100" cy="122" rx="17" ry="11" fill="white"/>
          <path d="M77 112 Q100 136 123 112" stroke="#7A3810" strokeWidth="3.6" fill="none" strokeLinecap="round"/>
          <line x1="100" y1="113" x2="100" y2="130" stroke="#DDCCAA" strokeWidth="1.5" opacity="0.6"/>
        </>
      ) : isBow ? (
        <path d="M84 116 Q100 132 116 116" stroke="#7A3810" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      ) : isThink ? (
        <path d="M90 119 Q100 125 110 119" stroke="#7A3810" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
      ) : (
        <>
          <ellipse cx="100" cy="121" rx="13" ry="8" fill="white"/>
          <path d="M82 114 Q100 128 118 114" stroke="#7A3810" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
          <line x1="100" y1="115" x2="100" y2="126" stroke="#DDCCAA" strokeWidth="1.5" opacity="0.6"/>
        </>
      )}

      {isExcited && (
        <>
          {/* Multi-color burst particles */}
          <motion.circle cx="28" cy="68" r="5" fill="#FF6B6B"
            animate={{x:[-8,8,-5,0],y:[0,-28,-48,-60],opacity:[1,1,0.5,0],scale:[1,1.4,0.8,0]}}
            transition={{duration:0.9,repeat:Infinity,ease:"easeOut"}}/>
          <motion.circle cx="45" cy="55" r="3.5" fill="#FFD700"
            animate={{x:[0,-12,-18],y:[0,-20,-38],opacity:[1,1,0],scale:[1,1.2,0]}}
            transition={{duration:0.75,repeat:Infinity,ease:"easeOut",delay:0.15}}/>
          <motion.circle cx="172" cy="60" r="4" fill="#4ECDC4"
            animate={{x:[8,-5,12],y:[0,-25,-45],opacity:[1,1,0],scale:[1,1.3,0]}}
            transition={{duration:0.85,repeat:Infinity,ease:"easeOut",delay:0.3}}/>
          <motion.circle cx="158" cy="52" r="3" fill="#FF9F43"
            animate={{x:[-5,10,5],y:[0,-18,-35],opacity:[1,0.9,0],scale:[1,1,0]}}
            transition={{duration:0.7,repeat:Infinity,ease:"easeOut",delay:0.1}}/>
          {/* Stars */}
          <motion.g animate={{scale:[1,1.35,1],rotate:[0,20,0]}} transition={{duration:0.55,repeat:Infinity}}>
            <path d="M18 68 L21 76 L29 79 L21 82 L18 90 L15 82 L7 79 L15 76 Z" fill="#FFD700" opacity="0.92"/>
          </motion.g>
          <motion.g animate={{scale:[1,1.2,1],rotate:[0,-15,0]}} transition={{duration:0.7,repeat:Infinity,delay:0.25}}>
            <path d="M163 42 L165 50 L173 52 L165 54 L163 62 L161 54 L153 52 L161 50 Z" fill="#FF6B6B" opacity="0.9"/>
          </motion.g>
          <motion.g animate={{scale:[1,1.1,1]}} transition={{duration:0.9,repeat:Infinity,delay:0.5}}>
            <path d="M175 80 L177 86 L183 88 L177 90 L175 96 L173 90 L167 88 L173 86 Z" fill="#4ECDC4" opacity="0.8"/>
          </motion.g>
        </>
      )}
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
  const [bubble, setBubble]         = useState("Chào mừng quý khách! Tôi có thể phục vụ gì ạ? 🎩");
  const [showBubble, setShowBubble] = useState(false);
  const [rollDuration, setRollDuration] = useState(600);
  const [rollDir, setRollDir]           = useState<'cw'|'ccw'>('cw'); // clockwise/counter-clockwise
  const [eyeOff, setEyeOff]            = useState({ x: 0, y: 0 }); // eye tracking offset
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
  const messagesContainerRef  = useRef<HTMLDivElement>(null);
  const bubbleTimeoutRef      = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Static Bubbles ───────────────────────────────────────────────────────
  const STATIC_BUBBLES: Record<string, string> = {
    homepage:     "Chào mừng quý khách đến WEMO! Tôi có thể phục vụ gì ạ? 🎩",
    features:     "Kính mời quý khách khám phá tính năng cao cấp của WEMO! 📱",
    templates:    "Để tôi giới thiệu các mẫu thiệp tinh tế nhất! 🎨",
    pricing:      "Thưa quý khách, WEMO đang có ưu đãi đặc biệt! 💰",
    "ai-chibi":   "Chỉ 1 ảnh, tôi sẽ tạo chibi 3D độc quyền cho quý khách! 🎨",
    order:        "Tôi sẵn lòng hỗ trợ quý khách đặt hàng ngay! 📦",
    faq:          "Mọi thắc mắc tôi đều sẵn sàng giải đáp! 💬",
    "about-us":   "Câu chuyện cảm hứng đằng sau sứ mệnh của WEMO! 🌸",
    contact:      "Quý khách cần liên hệ? Tôi kết nối ngay! 📞",
    "track-order":"Nhập mã đơn để tôi tra cứu tình trạng vận chuyển! 🚚",
    payment:      "Để tôi hỗ trợ quý khách hoàn tất thanh toán! 💳",
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

  // ─── Chat popup position — always above the bot icon, centered on it ────────
  const getPopupStyle = (): React.CSSProperties => {
    const PW = 340;
    const px = botPos.x;
    const py = botPos.y;

    // Sit 10px above the top of the bot icon
    const bottomOffset = window.innerHeight - py + 10;

    // Center horizontally on the bot icon, clamp to screen bounds
    let leftOffset = px + W / 2 - PW / 2;
    if (leftOffset + PW > window.innerWidth - 8) leftOffset = window.innerWidth - PW - 8;
    if (leftOffset < 8) leftOffset = 8;

    return {
      position: "fixed",
      zIndex: 9998,
      width: PW,
      bottom: bottomOffset,
      left: leftOffset,
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
                <div
                  ref={messagesContainerRef}
                  style={{ flex:1, overflowY:"auto", padding:"14px 14px", display:"flex", flexDirection:"column", gap:10, background:"#FFF6F4", scrollBehavior:"smooth" }}
                >
                  {messages.filter(m=>!m.text.startsWith("[Hệ thống]")).length===0 ? (
                    <div style={{ textAlign:"center", padding:"28px 12px" }}>
                      <Sparkles style={{ width:28, height:28, color:"#E8B4A8", margin:"0 auto 10px", display:"block" }} />
                      <div style={{ fontSize:13, fontWeight:800, color:"#8C5D53" }}>Xin chào {name}! 💕</div>
                      <div style={{ fontSize:11.5, marginTop:5, lineHeight:1.75, color:"#A47870" }}>Hỏi tớ về thiệp NFC, chibi 3D,<br/>giá cả hay đặt hàng nhé!</div>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      if (msg.text.startsWith("[Hệ thống]")) return null;
                      const me = msg.sender==="user";
                      return (
                        <div key={i} className="pg-msg" style={{ display:"flex", justifyContent:me?"flex-end":"flex-start", gap:7, alignItems:"flex-end" }}>
                          {!me && (
                            <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg, #E8B4A8, #D49D90)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 6px rgba(232,180,168,0.4)" }}>
                              <Bot style={{width:13,height:13,color:"white"}}/>
                            </div>
                          )}
                          <div style={{ maxWidth:"74%", padding:"10px 14px", borderRadius:18, fontSize:12.5, lineHeight:1.68, whiteSpace:"pre-wrap" as const, wordBreak:"break-word" as const, ...(me?{background:"linear-gradient(135deg, #E8B4A8, #D49D90)",color:"white",borderBottomRightRadius:4,boxShadow:"0 3px 12px rgba(232,180,168,0.35)"}:{background:"white",color:"#5C352E",borderBottomLeftRadius:4,border:"1px solid #F3D9D2",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}) }}>
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
        animate={idleAnimate}
        transition={isDragging ? { type: "spring", stiffness: 320, damping: 28 } : idleTransition}
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
        {/* Animation wrapper — rolling / landed / idle float */}
        <div
          className={
            pose === "rolling"
              ? (rollDir === 'cw' ? "pg-roll-cw" : "pg-roll-ccw")
              : pose === "landed"
                ? "pg-land"
                : (isIdle && !isDragging ? "pg-float" : "")
          }
          style={{
            width: "100%", height: "100%", position: "relative",
            // CSS variable drives roll duration
            ...(pose === "rolling" ? { ['--roll-dur' as string]: `${rollDuration}ms` } : {}),
          }}
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

          <PangolinBot pose={pose} size={W} eyeOff={eyeOff} />

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
        </div>
      </motion.div>
    </>
  );
}
