import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  Check,
  Music,
  Mic,
  Video,
  Image,
  Gift,
  Copy,
  QrCode,
  Wifi,
  Play,
  Pause,
  X,
  Star,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";

// ─── Types ────────────────────────────────────────────────────────────────────

type GiftData = {
  templateId: string;
  photos: string[];
  hasVideo: boolean;
  hasVoice: boolean;
  recipientName: string;
  title: string;
  message: string;
  music: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = ["Mẫu Thiệp", "Ký Ức", "Tin Nhắn", "Xem Trước", "Hoàn Thành"];

const TEMPLATES = [
  {
    id: "sinh-nhat",
    name: "Sinh Nhật Rực Rỡ",
    emoji: "🎂",
    color: "#FF6B8A",
    light: "#FFE8ED",
    bg: "linear-gradient(135deg,#FF9A9E,#FECFEF)",
    img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80",
  },
  {
    id: "lang-man",
    name: "Ký Ức Lãng Mạn",
    emoji: "💕",
    color: "#C4776A",
    light: "#FDECEA",
    bg: "linear-gradient(135deg,#E8B4A8,#D4AF78)",
    img: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=400&q=80",
  },
  {
    id: "ky-niem",
    name: "Dòng Thời Gian",
    emoji: "💍",
    color: "#8B7355",
    light: "#F5EDE4",
    bg: "linear-gradient(135deg,#D4C4A8,#C4B498)",
    img: "https://images.unsplash.com/photo-1523521803700-b3bcaeab0150?w=400&q=80",
  },
  {
    id: "giang-sinh",
    name: "Giáng Sinh Diệu Kỳ",
    emoji: "🎄",
    color: "#2D6A0E",
    light: "#E8F5E3",
    bg: "linear-gradient(135deg,#56ab2f,#a8e063)",
    img: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&q=80",
  },
  {
    id: "tot-nghiep",
    name: "Ngày Tốt Nghiệp",
    emoji: "🎓",
    color: "#6B4FA0",
    light: "#EEE8F8",
    bg: "linear-gradient(135deg,#B8A4D4,#9B87C4)",
    img: "https://images.unsplash.com/photo-1623461487986-9400110de28e?w=400&q=80",
  },
  {
    id: "tinh-ban",
    name: "Tình Bạn Mãi Mãi",
    emoji: "🌸",
    color: "#C4606A",
    light: "#FDECEA",
    bg: "linear-gradient(135deg,#f093fb,#f5576c)",
    img: "https://images.unsplash.com/photo-1543342384-1f1350e27861?w=400&q=80",
  },
];

const MUSIC = [
  { id: "none", name: "Không nhạc", emoji: "🔇" },
  { id: "piano", name: "Piano nhẹ nhàng", emoji: "🎹" },
  { id: "romantic", name: "Lãng mạn", emoji: "🎻" },
  { id: "birthday", name: "Chúc sinh nhật", emoji: "🎂" },
  { id: "christmas", name: "Giáng Sinh", emoji: "🎄" },
];

const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80",
  "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=300&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&q=80",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Particle({
  delay,
  x,
  color,
}: {
  delay: number;
  x: number;
  color: string;
}) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: "-10px", background: color, opacity: 0.7 }}
      animate={{ y: ["0vh", "110vh"], rotate: [0, 360], opacity: [0.8, 0] }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function PhonePreview({ gift }: { gift: GiftData }) {
  const tpl = TEMPLATES.find((t) => t.id === gift.templateId) || TEMPLATES[0];
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative mx-auto" style={{ width: 230, height: 460 }}>
      {/* Phone shell */}
      <div
        className="absolute inset-0 rounded-[2.5rem] shadow-2xl"
        style={{ background: "#1A1818", border: "3px solid #333" }}
      >
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-10" />
        {/* Screen */}
        <div
          className="absolute inset-[3px] rounded-[2.2rem] overflow-hidden"
          style={{ background: tpl.bg }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${gift.templateId}-${gift.photos.length}-${gift.message.slice(0, 8)}-${gift.recipientName}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex flex-col"
            >
              {/* Header bar */}
              <div className="pt-8 pb-3 px-4 text-center">
                <div className="text-3xl mb-1">{tpl.emoji}</div>
                <div
                  className="text-white font-bold text-sm truncate"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                >
                  {gift.recipientName || "Người nhận"}
                </div>
              </div>

              {/* Photo strip */}
              {gift.photos.length > 0 ? (
                <div
                  className="mx-3 rounded-xl overflow-hidden flex-1 relative"
                  style={{ maxHeight: 140 }}
                >
                  <img
                    src={gift.photos[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {gift.photos.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                      +{gift.photos.length - 1}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="mx-3 rounded-xl flex-1 flex items-center justify-center"
                  style={{
                    maxHeight: 140,
                    background: "rgba(255,255,255,0.15)",
                  }}
                >
                  <Image className="w-8 h-8 text-white/50" />
                </div>
              )}

              {/* Message */}
              <div
                className="mx-3 mt-3 p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <p
                  className="text-white text-xs leading-relaxed line-clamp-3"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                >
                  {gift.message || "Lời nhắn yêu thương sẽ hiện ở đây..."}
                </p>
              </div>

              {/* Controls */}
              <div className="mx-3 mt-3 mb-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {gift.hasVideo && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Video className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {gift.hasVoice && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Mic className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {gift.music !== "none" && gift.music && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Music className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"
                >
                  {playing ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              {i === step && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "rgba(232,180,168,0.4)" }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all duration-300"
                style={{
                  background:
                    i < step
                      ? "linear-gradient(135deg, #E8B4A8, #D4AF78)"
                      : i === step
                        ? "#E8B4A8"
                        : "rgba(255,255,255,0.3)",
                  color: i <= step ? "white" : "#999",
                  border:
                    i === step ? "2px solid #E8B4A8" : "2px solid transparent",
                }}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
            </div>
            <span
              className="text-xs hidden sm:block"
              style={{ color: i === step ? "#E8B4A8" : "#999" }}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="w-8 sm:w-16 h-0.5 mb-4 transition-all duration-500"
              style={{
                background:
                  i < step
                    ? "linear-gradient(90deg, #E8B4A8, #D4AF78)"
                    : "rgba(0,0,0,0.1)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({
  gift,
  setGift,
}: {
  gift: GiftData;
  setGift: (g: GiftData) => void;
}) {
  return (
    <div>
      <h2
        className="mb-2"
        style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1A1818" }}
      >
        Chọn Mẫu Thiệp
      </h2>
      <p className="mb-8" style={{ color: "#6B6B6B" }}>
        Chọn mẫu phù hợp với dịp đặc biệt của bạn
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {TEMPLATES.map((tpl) => {
          const selected = gift.templateId === tpl.id;
          return (
            <motion.button
              key={tpl.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setGift({ ...gift, templateId: tpl.id })}
              className="relative rounded-2xl overflow-hidden text-left transition-all"
              style={{
                border: selected
                  ? `2.5px solid ${tpl.color}`
                  : "2.5px solid transparent",
                boxShadow: selected
                  ? `0 0 0 4px ${tpl.color}30, 0 8px 30px ${tpl.color}30`
                  : "0 2px 16px rgba(0,0,0,0.08)",
              }}
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={tpl.img}
                  alt={tpl.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))",
                  }}
                />
                <div className="absolute bottom-2 left-2 text-2xl">
                  {tpl.emoji}
                </div>
                {selected && (
                  <div
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: tpl.color }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <div
                className="p-3"
                style={{ background: selected ? tpl.light : "white" }}
              >
                <p
                  className="font-semibold text-sm"
                  style={{ color: "#1A1818" }}
                >
                  {tpl.name}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({
  gift,
  setGift,
}: {
  gift: GiftData;
  setGift: (g: GiftData) => void;
}) {
  const addPhoto = () => {
    const next = DEMO_PHOTOS[gift.photos.length % DEMO_PHOTOS.length];
    setGift({ ...gift, photos: [...gift.photos, next] });
  };
  const removePhoto = (i: number) => {
    const updated = gift.photos.filter((_, idx) => idx !== i);
    setGift({ ...gift, photos: updated });
  };

  return (
    <div>
      <h2
        className="mb-2"
        style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1A1818" }}
      >
        Thêm Ký Ức
      </h2>
      <p className="mb-8" style={{ color: "#6B6B6B" }}>
        Ảnh, video và giọng nói sẽ làm món quà trở nên sống động
      </p>

      {/* Photos */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3" style={{ color: "#1A1818" }}>
          📸 Ảnh ({gift.photos.length})
        </h3>
        <div className="flex flex-wrap gap-3">
          {gift.photos.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: ((i % 3) - 1) * 3 }}
              className="relative rounded-xl overflow-hidden shadow-md"
              style={{ width: 80, height: 80 }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </motion.div>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addPhoto}
            className="rounded-xl flex flex-col items-center justify-center gap-1 border-2 border-dashed transition-all"
            style={{
              width: 80,
              height: 80,
              borderColor: "#E8B4A8",
              background: "rgba(232,180,168,0.06)",
              color: "#E8B4A8",
            }}
          >
            <Image className="w-5 h-5" />
            <span className="text-xs font-medium">Thêm</span>
          </motion.button>
        </div>
      </div>

      {/* Video & Voice */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setGift({ ...gift, hasVideo: !gift.hasVideo })}
          className="p-5 rounded-2xl flex flex-col items-center gap-3 border-2 transition-all"
          style={{
            borderColor: gift.hasVideo ? "#E8B4A8" : "rgba(0,0,0,0.1)",
            background: gift.hasVideo ? "rgba(232,180,168,0.08)" : "white",
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: gift.hasVideo
                ? "rgba(232,180,168,0.15)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <Video
              className="w-6 h-6"
              style={{ color: gift.hasVideo ? "#E8B4A8" : "#999" }}
            />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#1A1818" }}>
              Video Clip
            </p>
            <p className="text-xs" style={{ color: "#999" }}>
              Tối đa 60 giây
            </p>
          </div>
          {gift.hasVideo && (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#E8B4A8" }}
            >
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setGift({ ...gift, hasVoice: !gift.hasVoice })}
          className="p-5 rounded-2xl flex flex-col items-center gap-3 border-2 transition-all"
          style={{
            borderColor: gift.hasVoice ? "#D4AF78" : "rgba(0,0,0,0.1)",
            background: gift.hasVoice ? "rgba(212,175,120,0.08)" : "white",
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: gift.hasVoice
                ? "rgba(212,175,120,0.15)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <Mic
              className="w-6 h-6"
              style={{ color: gift.hasVoice ? "#D4AF78" : "#999" }}
            />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#1A1818" }}>
              Giọng Nói
            </p>
            <p className="text-xs" style={{ color: "#999" }}>
              Ghi âm trực tiếp
            </p>
          </div>
          {gift.hasVoice && (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#D4AF78" }}
            >
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
}

function Step3({
  gift,
  setGift,
}: {
  gift: GiftData;
  setGift: (g: GiftData) => void;
}) {
  return (
    <div>
      <h2
        className="mb-2"
        style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1A1818" }}
      >
        Viết Lời Nhắn
      </h2>
      <p className="mb-8" style={{ color: "#6B6B6B" }}>
        Những lời từ trái tim sẽ là phần ý nghĩa nhất
      </p>

      <div className="space-y-5">
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "#1A1818" }}
          >
            Tên người nhận *
          </label>
          <input
            type="text"
            value={gift.recipientName}
            onChange={(e) =>
              setGift({ ...gift, recipientName: e.target.value })
            }
            placeholder="Ví dụ: Mẹ, Anh Nam, Linh..."
            className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all"
            style={{
              border: "2px solid rgba(0,0,0,0.1)",
              background: "white",
              color: "#1A1818",
              fontSize: "1rem",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#E8B4A8";
              e.target.style.boxShadow = "0 0 0 4px rgba(232,180,168,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0,0,0,0.1)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "#1A1818" }}
          >
            Tiêu đề thiệp
          </label>
          <input
            type="text"
            value={gift.title}
            onChange={(e) => setGift({ ...gift, title: e.target.value })}
            placeholder="Ví dụ: Happy Birthday 🎂"
            className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all"
            style={{
              border: "2px solid rgba(0,0,0,0.1)",
              background: "white",
              color: "#1A1818",
              fontSize: "1rem",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#E8B4A8";
              e.target.style.boxShadow = "0 0 0 4px rgba(232,180,168,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0,0,0,0.1)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "#1A1818" }}
          >
            Lời nhắn yêu thương *
          </label>
          <textarea
            value={gift.message}
            onChange={(e) => setGift({ ...gift, message: e.target.value })}
            rows={5}
            placeholder="Viết từ trái tim... mỗi chữ đều là ký ức đẹp."
            className="w-full px-4 py-3.5 rounded-2xl outline-none transition-all resize-none"
            style={{
              border: "2px solid rgba(0,0,0,0.1)",
              background: "white",
              color: "#1A1818",
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#E8B4A8";
              e.target.style.boxShadow = "0 0 0 4px rgba(232,180,168,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0,0,0,0.1)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-3"
            style={{ color: "#1A1818" }}
          >
            🎵 Nhạc nền
          </label>
          <div className="flex flex-wrap gap-2">
            {MUSIC.map((m) => (
              <button
                key={m.id}
                onClick={() => setGift({ ...gift, music: m.id })}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background:
                    gift.music === m.id
                      ? "linear-gradient(135deg, #E8B4A8, #D4AF78)"
                      : "rgba(0,0,0,0.05)",
                  color: gift.music === m.id ? "white" : "#1A1818",
                  border: "none",
                }}
              >
                {m.emoji} {m.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4({ gift }: { gift: GiftData }) {
  const tpl = TEMPLATES.find((t) => t.id === gift.templateId) || TEMPLATES[0];
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <h2
        className="mb-2"
        style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1A1818" }}
      >
        Xem Trước
      </h2>
      <p className="mb-8" style={{ color: "#6B6B6B" }}>
        Đây là giao diện người nhận sẽ thấy khi chạm NFC
      </p>

      <div
        className="rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: tpl.bg }}
      >
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">{tpl.emoji}</div>
          <h3
            className="mb-2 text-white"
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {gift.title || "Món Quà Của Bạn"}
          </h3>
          <p className="text-white/80 mb-6" style={{ fontSize: "1rem" }}>
            Dành cho {gift.recipientName || "người đặc biệt"}
          </p>

          {gift.photos.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2 mb-6 justify-center">
              {gift.photos.map((src, i) => (
                <motion.div
                  key={i}
                  className="flex-shrink-0 rounded-2xl overflow-hidden shadow-lg"
                  style={{
                    width: 120,
                    height: 120,
                    transform: `rotate(${((i % 3) - 1) * 4}deg)`,
                  }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}

          <div
            className="mx-auto max-w-sm p-5 rounded-2xl mb-6"
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              className="text-white leading-relaxed"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            >
              {gift.message || "Lời nhắn yêu thương sẽ hiện ở đây..."}
            </p>
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            {gift.hasVideo && (
              <div
                className="px-4 py-2 rounded-full flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Video className="w-4 h-4" /> Video
              </div>
            )}
            {gift.hasVoice && (
              <div
                className="px-4 py-2 rounded-full flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Mic className="w-4 h-4" /> Giọng nói
              </div>
            )}
            {gift.music && gift.music !== "none" && (
              <button
                onClick={() => setPlaying(!playing)}
                className="px-4 py-2 rounded-full flex items-center gap-2"
                style={{
                  background: "rgba(255,255,255,0.25)",
                  color: "white",
                  backdropFilter: "blur(8px)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {playing ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {MUSIC.find((m) => m.id === gift.music)?.name}
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="mt-6 p-4 rounded-2xl"
        style={{
          background: "rgba(232,180,168,0.08)",
          border: "1px solid rgba(232,180,168,0.2)",
        }}
      >
        <p className="text-sm" style={{ color: "#6B6B6B" }}>
          ✨ Nhìn tốt chứ? Bước tiếp theo sẽ tạo link và mã NFC cho thiệp của
          bạn.
        </p>
      </div>
    </div>
  );
}

function Step5({ gift }: { gift: GiftData }) {
  const tpl = TEMPLATES.find((t) => t.id === gift.templateId) || TEMPLATES[0];
  const rows = [
    { label: "Mẫu thiệp", value: `${tpl.emoji} ${tpl.name}` },
    { label: "Người nhận", value: gift.recipientName || "—" },
    { label: "Ảnh", value: `${gift.photos.length} ảnh` },
    { label: "Video", value: gift.hasVideo ? "✅ Có" : "Không" },
    { label: "Giọng nói", value: gift.hasVoice ? "✅ Có" : "Không" },
    {
      label: "Nhạc nền",
      value: MUSIC.find((m) => m.id === gift.music)?.name || "Không",
    },
  ];

  return (
    <div>
      <h2
        className="mb-2"
        style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1A1818" }}
      >
        Tóm Tắt
      </h2>
      <p className="mb-8" style={{ color: "#6B6B6B" }}>
        Kiểm tra lại trước khi hoàn thành
      </p>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.08)", background: "white" }}
      >
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderBottom:
                i < rows.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
            }}
          >
            <span style={{ color: "#6B6B6B", fontSize: "0.9375rem" }}>
              {row.label}
            </span>
            <span
              style={{
                color: "#1A1818",
                fontWeight: 600,
                fontSize: "0.9375rem",
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div
        className="mt-6 p-5 rounded-2xl"
        style={{
          background: "rgba(232,180,168,0.08)",
          border: "1px solid rgba(232,180,168,0.2)",
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "#6B6B6B" }}>
          🎁 Sau khi hoàn thành, bạn sẽ nhận được{" "}
          <strong style={{ color: "#1A1818" }}>link chia sẻ</strong>,{" "}
          <strong style={{ color: "#1A1818" }}>mã QR</strong> và hướng dẫn gắn
          chip <strong style={{ color: "#1A1818" }}>NFC</strong> vào vật phẩm
          bất kỳ.
        </p>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  "#FF6B8A",
  "#E8B4A8",
  "#D4AF78",
  "#FFD4D4",
  "#B8A4D4",
  "#A8D4E8",
  "#FFE066",
];
const GIFT_URL = "https://wemo.vn/gift/x8h2a1";

function SuccessScreen({
  gift,
  onReset,
}: {
  gift: GiftData;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const tpl = TEMPLATES.find((t) => t.id === gift.templateId) || TEMPLATES[0];
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

  const copy = () => {
    navigator.clipboard.writeText(GIFT_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
      style={{ background: "#FAF8F5" }}
    >
      {/* Confetti */}
      {particles.map((p) => (
        <Particle key={p.id} x={p.x} delay={p.delay} color={p.color} />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative z-10 w-full max-w-lg mx-4 rounded-3xl p-8 text-center"
        style={{
          background: "white",
          boxShadow: "0 40px 100px rgba(0,0,0,0.12)",
        }}
      >
        {/* Celebration icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-7xl mb-4"
        >
          🎉
        </motion.div>

        <h2
          className="mb-2"
          style={{ fontSize: "2rem", fontWeight: 800, color: "#1A1818" }}
        >
          Thiệp Đã Sẵn Sàng!
        </h2>
        <p className="mb-6" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>
          Mẫu <strong style={{ color: tpl.color }}>{tpl.name}</strong> dành cho{" "}
          <strong style={{ color: "#1A1818" }}>
            {gift.recipientName || "người thân yêu"}
          </strong>{" "}
          đã được tạo thành công.
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <Star
                className="w-5 h-5"
                style={{ color: "#FFD700", fill: "#FFD700" }}
              />
            </motion.div>
          ))}
        </div>

        {/* URL */}
        <div
          className="flex items-center gap-2 p-3 rounded-2xl mb-6"
          style={{
            background: "#FAF8F5",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <span
            className="flex-1 text-sm truncate text-left"
            style={{ color: "#1A1818", fontFamily: "monospace" }}
          >
            {GIFT_URL}
          </span>
          <button
            onClick={copy}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            style={{
              background: copied
                ? "#4CAF50"
                : "linear-gradient(135deg, #E8B4A8, #D4AF78)",
              color: "white",
            }}
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? "Đã sao chép!" : "Sao chép"}
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            className="py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border-2 transition-all hover:bg-gray-50"
            style={{
              borderColor: "rgba(0,0,0,0.1)",
              color: "#1A1818",
              background: "white",
            }}
          >
            <QrCode className="w-4 h-4" /> Tải Mã QR
          </button>
          <button
            className="py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border-2 transition-all hover:bg-gray-50"
            style={{
              borderColor: "rgba(0,0,0,0.1)",
              color: "#1A1818",
              background: "white",
            }}
          >
            <Wifi className="w-4 h-4" /> Hướng dẫn NFC
          </button>
        </div>

        <Link
          to="/"
          className="block w-full py-4 rounded-2xl font-bold text-white mb-3 text-center"
          style={{ background: "linear-gradient(135deg, #E8B4A8, #D4AF78)" }}
        >
          <Gift className="w-4 h-4 inline mr-2" />
          Xem Thiệp Của Tôi
        </Link>

        <button
          onClick={onReset}
          className="w-full py-3 text-sm font-medium transition-all hover:opacity-70"
          style={{ color: "#999", background: "none", border: "none" }}
        >
          <Sparkles className="w-4 h-4 inline mr-1" />
          Tạo thiệp mới
        </button>

        <p className="mt-4 text-xs" style={{ color: "#ccc" }}>
          Powered by <strong style={{ color: "#E8B4A8" }}>wemo.vn</strong>
        </p>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const defaultGift: GiftData = {
  templateId: "",
  photos: [],
  hasVideo: false,
  hasVoice: false,
  recipientName: "",
  title: "",
  message: "",
  music: "none",
};

export function GiftWizard() {
  const [step, setStep] = useState(0);
  const [gift, setGift] = useState<GiftData>(defaultGift);
  const [done, setDone] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const canContinue = () => {
    if (step === 0) return Boolean(gift.templateId);
    if (step === 1)
      return gift.photos.length > 0 || gift.hasVideo || gift.hasVoice;
    if (step === 2)
      return gift.recipientName.trim() !== "" && gift.message.trim() !== "";
    return true;
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setDone(true);
    }
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const reset = () => {
    setGift(defaultGift);
    setStep(0);
    setDone(false);
  };

  if (done) return <SuccessScreen gift={gift} onReset={reset} />;

  const stepComponents = [
    <Step1 gift={gift} setGift={setGift} />,
    <Step2 gift={gift} setGift={setGift} />,
    <Step3 gift={gift} setGift={setGift} />,
    <Step4 gift={gift} />,
    <Step5 gift={gift} />,
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FAF8F5" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ background: "white", borderColor: "rgba(0,0,0,0.07)" }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #E8B4A8, #D4AF78)" }}
          >
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span
            style={{ fontWeight: 700, fontSize: "1.25rem", color: "#1A1818" }}
          >
            WEMO
          </span>
        </Link>
        <div className="flex-1 mx-8 hidden sm:block">
          <ProgressBar step={step} />
        </div>
        <Link
          to="/"
          className="text-sm font-medium transition-all hover:opacity-70"
          style={{ color: "#999" }}
        >
          <X className="w-5 h-5" />
        </Link>
      </div>

      {/* Mobile progress */}
      <div className="sm:hidden px-4 pt-4">
        <ProgressBar step={step} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: step content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                {stepComponents[step]}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div
              className="flex items-center justify-between mt-10 pt-6"
              style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
            >
              <button
                onClick={back}
                disabled={step === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all"
                style={{
                  background: step === 0 ? "transparent" : "rgba(0,0,0,0.06)",
                  color: step === 0 ? "transparent" : "#1A1818",
                  border: "none",
                  cursor: step === 0 ? "default" : "pointer",
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>

              <motion.button
                onClick={next}
                disabled={!canContinue()}
                whileHover={canContinue() ? { scale: 1.03 } : {}}
                whileTap={canContinue() ? { scale: 0.97 } : {}}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all"
                style={{
                  background: canContinue()
                    ? "linear-gradient(135deg, #E8B4A8, #D4AF78)"
                    : "rgba(0,0,0,0.1)",
                  color: canContinue() ? "white" : "#ccc",
                  border: "none",
                  cursor: canContinue() ? "pointer" : "not-allowed",
                  boxShadow: canContinue()
                    ? "0 8px 24px rgba(232,180,168,0.4)"
                    : "none",
                }}
              >
                {step === STEPS.length - 1 ? "Hoàn Thành 🎉" : "Tiếp Theo"}
                {step < STEPS.length - 1 && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right: phone preview (desktop only) */}
        <div
          className="hidden lg:flex w-80 xl:w-96 border-l flex-col items-center justify-center py-10 sticky top-0 self-start h-[calc(100vh-73px)]"
          style={{ borderColor: "rgba(0,0,0,0.07)", background: "white" }}
        >
          <p
            className="text-xs font-semibold mb-6 uppercase tracking-widest"
            style={{ color: "#ccc" }}
          >
            Xem trước trực tiếp
          </p>
          <PhonePreview gift={gift} />
          <p
            className="mt-6 text-xs text-center px-8"
            style={{ color: "#ccc", lineHeight: 1.5 }}
          >
            Người nhận sẽ thấy giao diện này khi chạm NFC
          </p>
        </div>
      </div>
    </div>
  );
}
