import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, Mail, X } from "lucide-react";
import { AudioPlayerWidget, VideoPlayerWidget } from "./GiftContentOverlay";

const DEFAULT_MESSAGES = [
  "Anh yêu em",
  "Em là cả cuộc đời anh",
  "Mãi mãi bên nhau",
  "Em là ánh mặt trời của anh",
  "Có em mọi thứ đều tốt đẹp hơn",
  "Em là cả vũ trụ của anh",
  "Cảm ơn em đã xuất hiện",
  "Anh luôn nghĩ về em",
  "Trái tim anh thuộc về em",
  "Em là giấc mơ ngọt ngào nhất",
  "Anh yêu em rất nhiều",
  "Em là niềm vui mỗi ngày của anh",
  "Em là tất cả của anh",
  "Anh nhớ em nhiều lắm",
  "Em là điều tuyệt vời nhất",
];

const ACCENT_COLORS = [
  "#ff4757",
  "#ff6348",
  "#ffa502",
  "#eccc68",
  "#2ed573",
  "#1e90ff",
  "#3742fa",
  "#a55eea",
  "#ff4081",
  "#ff69b4",
];

const HEART_ICONS = ["❤️", "🧡", "💛", "💚", "💙", "💜", "🩷", "🩵", "✨", "🌸"];

interface FallingItemData {
  id: number;
  type: "text" | "image";
  content: string;
  left: string;
  duration: number;
  color: string;
  width: number;
}

interface ExplosionData {
  id: number;
  x: number;
  y: number;
  char: string;
  tx: number;
  ty: number;
  fontSize: number;
}

export function FallingTextGiftView({ gift }: { gift: any }) {
  const [started, setStarted] = useState(false);
  const [openedLetter, setOpenedLetter] = useState(false);
  const [fallingItems, setFallingItems] = useState<FallingItemData[]>([]);
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const nextId = useRef(1);

  // Photos from gift or default
  const photos = (gift.photos && gift.photos.length > 0)
    ? gift.photos
    : [
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
        "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
        "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80",
      ];

  // Star canvas effect
  useEffect(() => {
    if (!started || !starCanvasRef.current) return;
    const canvas = starCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const stars = Array.from({ length: 110 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.5,
      speed: Math.random() * 0.18 + 0.05,
      angle: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.08,
    }));

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.65 + Math.random() * 0.35})`;
        ctx.shadowColor = "#ffb6d5";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        s.x += Math.cos(s.angle) * s.speed + s.drift;
        s.y += Math.sin(s.angle) * s.speed;
        if (s.x < 0) s.x = W;
        if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H;
        if (s.y > H) s.y = 0;
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [started]);

  // Rain generation
  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setFallingItems((prev) => {
        if (prev.length >= 20) return prev;
        const id = nextId.current++;
        const isImg = Math.random() < 0.35 && photos.length > 0;
        const color = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
        const itemWidth = isImg ? Math.random() * 35 + 85 : Math.random() * 30 + 150;
        const maxLeft = Math.max(window.innerWidth - itemWidth - 20, 20);
        const left = `${Math.random() * maxLeft}px`;
        const duration = Math.random() * 4 + 7;

        let content = "";
        if (isImg) {
          content = photos[Math.floor(Math.random() * photos.length)];
        } else {
          content = DEFAULT_MESSAGES[Math.floor(Math.random() * DEFAULT_MESSAGES.length)];
        }

        return [...prev, { id, type: isImg ? "image" : "text", content, left, duration, color, width: itemWidth }];
      });
    }, 950);

    return () => clearInterval(interval);
  }, [started, photos]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const burst = 20;
    const newParticles: ExplosionData[] = [];
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    for (let i = 0; i < burst; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 140 + 60;
      newParticles.push({
        id: nextId.current++,
        x: cx,
        y: cy,
        char: HEART_ICONS[Math.floor(Math.random() * HEART_ICONS.length)],
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        fontSize: Math.random() * 14 + 18,
      });
    }

    setExplosions((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setExplosions((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 900);
  };

  const themeStyle = {
    textMain: "text-rose-100",
    textSub: "text-rose-200/80",
    cardBg: "bg-slate-900/90",
    accentText: "text-rose-400",
    accentBg: "bg-rose-500",
    borderColor: "border-rose-500/40",
    glowColor: "rgba(244, 63, 94, 0.3)",
    heartColor: "#F43F5E",
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none">
      {/* Intro Modal Screen */}
      {!started && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-rose-950 via-slate-950 to-black">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center bg-gradient-to-b from-rose-100/95 to-rose-200/90 p-8 rounded-3xl border-2 border-rose-300 shadow-[0_0_60px_rgba(244,63,94,0.4)] max-w-xs text-center"
          >
            <img
              src="https://i.pinimg.com/originals/3f/4e/d3/3f4ed3cb1539cb42dc93b78020a3ef55.gif"
              alt="Món quà bất ngờ"
              className="w-36 h-36 rounded-2xl object-cover mb-6 shadow-md"
            />
            <h3 className="font-bold text-stone-900 text-lg mb-2">Món Quà Ngọt Ngào</h3>
            <p className="text-xs text-stone-600 mb-6">Chạm vào nút bên dưới để mở cơn mưa ký ức bạn nhé!</p>
            <button
              onClick={() => setStarted(true)}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-bold text-sm shadow-[0_6px_20px_rgba(244,63,94,0.4)] transition-all transform active:scale-95 cursor-pointer border-0"
            >
              Mở Quà ❤️
            </button>
          </motion.div>
        </div>
      )}

      {/* Star Canvas Background */}
      <canvas ref={starCanvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Falling Rain Area */}
      <div
        className="absolute inset-0 overflow-hidden cursor-pointer"
        onClick={handleContainerClick}
      >
        {fallingItems.map((item) => (
          <div
            key={item.id}
            onAnimationEnd={() => {
              setFallingItems((prev) => prev.filter((it) => it.id !== item.id));
            }}
            className="absolute pointer-events-none"
            style={{
              left: item.left,
              top: "-80px",
              width: `${item.width}px`,
              animation: `fallingRain ${item.duration}s linear forwards`,
            }}
          >
            {item.type === "image" ? (
              <img
                src={item.content}
                alt="Kỷ niệm"
                className="w-full h-auto rounded-2xl object-cover"
                style={{
                  filter: `drop-shadow(0 0 16px rgba(255,255,255,0.8)) drop-shadow(0 0 24px ${item.color})`,
                  border: `2px solid ${item.color}`,
                }}
              />
            ) : (
              <div
                className="px-4 py-2.5 rounded-2xl bg-white/95 text-stone-900 font-bold text-xs text-center shadow-lg leading-relaxed backdrop-blur-sm"
                style={{
                  border: `2px solid ${item.color}`,
                  color: item.color,
                  boxShadow: `0 0 18px ${item.color}88`,
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        ))}

        {/* Heart Explosions */}
        {explosions.map((exp) => (
          <div
            key={exp.id}
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${exp.x}px`,
              top: `${exp.y}px`,
              fontSize: `${exp.fontSize}px`,
              animation: "heartBurst 0.9s cubic-bezier(0.2, 0.8, 0.3, 1) forwards",
              ["--tx" as any]: `${exp.tx}px`,
              ["--ty" as any]: `${exp.ty}px`,
            }}
          >
            {exp.char}
          </div>
        ))}
      </div>

      {/* Floating Header Banner */}
      <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-slate-900/60 border border-rose-500/30 rounded-full px-4 py-1.5 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span className="text-rose-200/90 text-xs tracking-widest uppercase font-bold">Mưa Ký Ức & Lời Yêu</span>
        </motion.div>
      </div>

      {/* Bottom Floating Letter Button */}
      {started && (
        <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setOpenedLetter(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-bold text-xs shadow-[0_6px_25px_rgba(244,63,94,0.5)] transition-all cursor-pointer border-0 transform active:scale-95"
          >
            <Mail className="w-4 h-4" /> Mở Bức Thư Yêu Thương
          </button>
          <p className="text-rose-200/60 text-[11px]">Chạm bất kỳ đâu trên màn hình để thả tim</p>
        </div>
      )}

      {/* Full Letter Modal */}
      <AnimatePresence>
        {openedLetter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            onClick={() => setOpenedLetter(false)}
          >
            <div
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto no-scrollbar rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-rose-500/40 p-6 sm:p-8 text-white shadow-2xl space-y-6"
              style={{
                boxShadow: "0 0 70px rgba(244, 63, 94, 0.35), inset 0 0 20px rgba(244, 63, 94, 0.15)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenedLetter(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800/80 border border-rose-500/40 flex items-center justify-center text-rose-300 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
                <Heart className="w-4 h-4 fill-rose-400" />
                Bức Thư Tình Yêu
              </div>

              {gift.recipientName && (
                <h2 className="text-2xl sm:text-3xl font-black text-rose-200 tracking-tight font-serif">
                  Gửi {gift.recipientName} ❤️
                </h2>
              )}

              {gift.title && (
                <p className="text-lg font-bold text-rose-400/90 tracking-wide">
                  {gift.title}
                </p>
              )}

              <div className="bg-slate-950/70 border border-rose-500/25 rounded-2xl p-5 leading-relaxed text-sm text-stone-200 whitespace-pre-line font-medium shadow-inner">
                {gift.message || "Từng dòng chữ rơi xuống như ngàn lời yêu thương anh muốn gửi đến em mỗi ngày..."}
              </div>

              {gift.hasVoice && gift.voiceUrl && (
                <AudioPlayerWidget src={gift.voiceUrl} themeStyle={themeStyle} />
              )}
              {gift.hasVideo && gift.videoUrl && (
                <VideoPlayerWidget src={gift.videoUrl} themeStyle={themeStyle} />
              )}

              {gift.senderName && (
                <div className="text-right pt-2 border-t border-rose-500/20">
                  <span className="text-xs text-rose-400/80 font-bold">Thương mến từ: {gift.senderName} 💕</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes fallingRain {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(105vh); opacity: 0; }
        }
        @keyframes heartBurst {
          0% { transform: translate(0, 0) scale(0.6); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
