import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Image as ImageIcon, X, Clock, Calendar } from "lucide-react";
import { AudioPlayerWidget, VideoPlayerWidget } from "./GiftContentOverlay";

export function LoveCountGiftView({ gift }: { gift: any }) {
  const [introFinished, setIntroFinished] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Time counter state
  const [time, setTime] = useState({
    days: 365,
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const boyName = gift.senderName || "Chàng Trai";
  const girlName = gift.recipientName || "Cô Gái";
  const photos: string[] = (gift.photos && gift.photos.length > 0)
    ? gift.photos
    : [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
        "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=400&q=80",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80",
      ];

  const boyAvatar = photos[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80";
  const girlAvatar = photos[1] || photos[0] || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80";

  // Hold to fill heart button
  const startHold = () => {
    if (holdIntervalRef.current) return;
    const duration = 1500;
    const step = 30;
    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        const next = prev + (step / duration) * 100;
        if (next >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          holdIntervalRef.current = null;
          setIntroFinished(true);
          return 100;
        }
        return next;
      });
    }, step);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setHoldProgress(0);
  };

  // Clock counter
  useEffect(() => {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); // 1 year ago default

    const update = () => {
      const now = new Date();
      const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const days = Math.floor((nowMidnight.getTime() - startMidnight.getTime()) / 86400000);

      const nextMidnight = new Date(nowMidnight.getTime() + 86400000);
      const remaining = nextMidnight.getTime() - now.getTime();
      const hours = String(Math.floor(remaining / 3600000)).padStart(2, "0");
      const minutes = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
      const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

      setTime({ days: Math.max(0, days), hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-[#1a0510] via-[#2a081a] to-[#14000c] text-white flex flex-col items-center justify-center p-4">
      {/* Background Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-400"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              fontSize: `${(i % 3) * 10 + 16}px`,
              animation: `floatHeart ${(i % 4) + 6}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Intro Hold-To-Unlock Screen */}
      <AnimatePresence>
        {!introFinished && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#2a0515] via-[#15020a] to-black p-6"
          >
            <div className="relative w-32 h-32 mb-8">
              <svg className="w-full h-full" viewBox="-2 -2 36 34">
                <path
                  fill="none"
                  stroke="#FF4D6D"
                  strokeWidth="2"
                  d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.5-9.3,16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z"
                />
                <clipPath id="loveHeartClip">
                  <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.5-9.3,16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z" />
                </clipPath>
                <rect
                  x="0"
                  y={30 - (30 * holdProgress) / 100}
                  width="32"
                  height="30"
                  fill="#FF4D6D"
                  clipPath="url(#loveHeartClip)"
                />
              </svg>
            </div>

            <h3 className="font-bold text-rose-200 text-lg mb-2">Nhật Ký Đếm Ngày Yêu</h3>
            <p className="text-xs text-rose-300/70 mb-8 text-center max-w-xs">
              Nhấn và giữ nút bên dưới để mở nhật ký tình yêu của hai bạn nhé
            </p>

            <button
              onPointerDown={startHold}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-sm shadow-[0_6px_25px_rgba(255,77,109,0.5)] cursor-pointer border-0 active:scale-95 transition-transform"
            >
              Nhấn Giữ ❤️
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Love Count Interface */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-[0_0_60px_rgba(255,77,109,0.25)] space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
          <Calendar className="w-4 h-4" />
          Chúng Ta Đã Ở Bên Nhau
        </div>

        {/* Couple Avatars & Counter */}
        <div className="flex items-center justify-between w-full px-2">
          {/* Partner 1 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-rose-500 to-pink-400 shadow-lg">
              <img
                src={boyAvatar}
                alt={boyName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="font-bold text-xs sm:text-sm text-rose-200">{boyName}</span>
          </div>

          {/* Days Center Heart */}
          <div className="flex flex-col items-center">
            <div className="text-2xl text-rose-400 animate-pulse">❤️</div>
            <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight drop-shadow-md">
              {time.days}
            </div>
            <span className="text-xs text-rose-300/80 font-medium mt-1">Ngày rùi nè...</span>
          </div>

          {/* Partner 2 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-pink-400 to-rose-500 shadow-lg">
              <img
                src={girlAvatar}
                alt={girlName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="font-bold text-xs sm:text-sm text-rose-200">{girlName}</span>
          </div>
        </div>

        {/* Live Timer Boxes (HH:MM:SS) */}
        <div className="flex items-center gap-3 bg-black/40 border border-rose-500/20 px-6 py-3 rounded-2xl font-mono text-xl sm:text-2xl font-bold text-rose-200 shadow-inner">
          <div className="flex flex-col items-center">
            <span>{time.hours}</span>
            <span className="text-[10px] text-rose-400 font-sans uppercase">Giờ</span>
          </div>
          <span className="text-rose-400/60 -mt-3">:</span>
          <div className="flex flex-col items-center">
            <span>{time.minutes}</span>
            <span className="text-[10px] text-rose-400 font-sans uppercase">Phút</span>
          </div>
          <span className="text-rose-400/60 -mt-3">:</span>
          <div className="flex flex-col items-center">
            <span>{time.seconds}</span>
            <span className="text-[10px] text-rose-400 font-sans uppercase">Giây</span>
          </div>
        </div>

        {/* Action Button: Kỷ Niệm */}
        <button
          onClick={() => setShowGallery(true)}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-bold text-xs shadow-[0_4px_20px_rgba(244,63,94,0.4)] transition-all cursor-pointer border-0 active:scale-95"
        >
          <ImageIcon className="w-4 h-4" /> Kỷ Niệm Yêu Thương
        </button>
      </div>

      {/* Gallery & Message Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowGallery(false)}
          >
            <div
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto no-scrollbar rounded-3xl bg-gradient-to-b from-slate-950 via-[#1a0510] to-slate-950 border border-rose-500/40 p-6 sm:p-8 text-white shadow-2xl space-y-6"
              style={{
                boxShadow: "0 0 70px rgba(244, 63, 94, 0.35)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowGallery(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-900/80 border border-rose-500/40 flex items-center justify-center text-rose-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
                <Heart className="w-4 h-4 fill-rose-400" />
                Album Kỷ Niệm Của Chúng Mình
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 gap-3">
                {photos.map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-rose-500/20 shadow-md">
                    <img src={url} alt={`Kỷ niệm ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>

              {/* Message */}
              <div className="bg-black/50 border border-rose-500/25 rounded-2xl p-5 leading-relaxed text-sm text-stone-200 whitespace-pre-line font-medium shadow-inner">
                {gift.message || "Từng ngày, từng giờ, từng phút bên nhau đều là những khoảnh khắc đẹp nhất. Cảm ơn vì đã luôn ở bên anh!"}
              </div>

              {gift.hasVoice && gift.voiceUrl && (
                <AudioPlayerWidget src={gift.voiceUrl} themeStyle={themeStyle} />
              )}
              {gift.hasVideo && gift.videoUrl && (
                <VideoPlayerWidget src={gift.videoUrl} themeStyle={themeStyle} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes floatHeart {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          100% { transform: translateY(-30px) rotate(15deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
