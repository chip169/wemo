import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, ChevronLeft, ChevronRight, X, Mail } from "lucide-react";
import { AudioPlayerWidget, VideoPlayerWidget } from "./GiftContentOverlay";

const DEFAULT_SLIDES = [
  {
    text: "Chào buổi sáng, người tôi yêu! Cảm ơn bạn vì đã xuất hiện và làm cuộc sống của tôi trở nên ý nghĩa hơn.",
    gif: "https://i.pinimg.com/originals/b6/b1/d6/b6b1d64609f266d8f236752d8551f26f.gif",
  },
  {
    text: "Tôi chỉ mong hôm nay bạn sẽ luôn mỉm cười, vì nụ cười của bạn chính là điều đẹp nhất đối với tôi.",
    gif: "https://i.pinimg.com/originals/3f/4e/d3/3f4ed3cb1539cb42dc93b78020a3ef55.gif",
  },
  {
    text: "Dù hôm nay có bận rộn đến đâu, hãy nhớ rằng luôn có một người âm thầm yêu thương và dõi theo bạn.",
    gif: "https://i.pinimg.com/originals/b7/c6/4a/b7c64aca651271c52087f58276bd1de1.gif",
  },
  {
    text: "Mong mọi điều tốt đẹp và may mắn nhất sẽ luôn mỉm cười với bạn, vì bạn xứng đáng với tất cả hạnh phúc.",
    gif: "https://i.pinimg.com/originals/7e/f6/9c/7ef69cd0a6b0b78526c8ce983b3296fc.gif",
  },
  {
    text: "Nếu có lúc mệt mỏi, hãy nhớ rằng tôi luôn ở đây để lắng nghe, sẻ chia và đồng hành cùng bạn.",
    gif: "https://i.pinimg.com/originals/4e/89/d3/4e89d3e4ec4b1f59b1664e880a875c65.gif",
  },
  {
    text: "Chỉ cần bạn hạnh phúc và bình an, với tôi đó đã là món quà tuyệt vời nhất của mỗi ngày.",
    gif: "https://i.pinimg.com/originals/56/80/90/5680904ede54bea21d02450affebfc4f.gif",
  },
];

const HACKER_CHARS = "ABCDEF0123456789!@#$%^&*()_+{}[]:;<>,.?/~";

export function WishSlidesGiftView({ gift }: { gift: any }) {
  const [started, setStarted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [showFullLetter, setShowFullLetter] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Combine user photos into slides if available
  const userPhotos: string[] = (gift.photos && gift.photos.length > 0) ? gift.photos : [];
  const slides = DEFAULT_SLIDES.map((s, idx) => ({
    text: idx === 0 && gift.message ? gift.message : s.text,
    img: userPhotos[idx % userPhotos.length] || s.gif,
  }));

  // Hacker text decoding effect on slide change
  useEffect(() => {
    if (!started) return;
    const target = slides[currentSlide].text;
    let iteration = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((char, index) => {
            if (index < iteration) return char;
            if (char === " " || char === "\n") return char;
            return HACKER_CHARS[Math.floor(Math.random() * HACKER_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= target.length) {
        if (timerRef.current) clearInterval(timerRef.current);
      }
      iteration += 1.5;
    }, 25);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentSlide, started]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-[#120014] via-[#200024] to-[#0A000C] text-white flex flex-col items-center justify-center p-4 select-none">
      {/* Background Starry Sky & Floating Twinkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        {Array.from({ length: 45 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white shadow-[0_0_8px_white]"
            style={{
              left: `${(i * 19) % 100}%`,
              top: `${(i * 27) % 100}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              animation: `twinkle ${(i % 4) + 2}s infinite alternate`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Intro Screen */}
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#1d0022] via-[#0b000d] to-black p-6 cursor-pointer"
            onClick={() => setStarted(true)}
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-7xl mb-6 filter drop-shadow-[0_0_35px_rgba(244,63,94,0.7)]"
            >
              ❤️
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold text-rose-200 tracking-wide font-serif mb-2">
              Chạm Vào Trái Tim
            </h2>
            <p className="text-xs text-rose-300/60 tracking-wider uppercase">
              Để bắt đầu hành trình những lời chúc
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Slide Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/5 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-6 flex flex-col items-center shadow-[0_0_60px_rgba(244,63,94,0.25)] space-y-5">
        {/* Header Tag */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>Lời Chúc Yêu Thương</span>
          </div>
          <span className="text-xs font-mono text-rose-300/60 font-bold">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        {/* Slide Image */}
        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-rose-500/30 shadow-lg relative bg-black/40">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={slides[currentSlide].img}
              alt="Slide"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        {/* Hacker Decoding Message Box */}
        <div className="w-full min-h-[90px] bg-black/50 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-center text-center shadow-inner">
          <p className="text-xs sm:text-sm font-medium text-rose-100 leading-relaxed font-mono">
            {displayText}
          </p>
        </div>

        {/* Controls: Prev / Dots / Next */}
        <div className="flex items-center justify-between w-full pt-1">
          <button
            onClick={prevSlide}
            className="w-9 h-9 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 flex items-center justify-center text-rose-200 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all cursor-pointer border-0 ${
                  currentSlide === i ? "w-6 bg-rose-500 shadow-[0_0_10px_#f43f5e]" : "w-2 bg-rose-500/30 hover:bg-rose-500/60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-9 h-9 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 flex items-center justify-center text-rose-200 cursor-pointer transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Button to open full letter */}
        <button
          onClick={() => setShowFullLetter(true)}
          className="flex items-center gap-2 text-xs font-bold text-rose-300 hover:text-rose-100 transition-colors pt-2 cursor-pointer border-0 bg-transparent"
        >
          <Mail className="w-3.5 h-3.5" /> Xem toàn bộ thư chúc
        </button>
      </div>

      {/* Full Letter Modal */}
      <AnimatePresence>
        {showFullLetter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowFullLetter(false)}
          >
            <div
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto no-scrollbar rounded-3xl bg-gradient-to-b from-slate-950 via-[#18001d] to-slate-950 border border-rose-500/40 p-6 sm:p-8 text-white shadow-2xl space-y-6"
              style={{
                boxShadow: "0 0 70px rgba(244, 63, 94, 0.35)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFullLetter(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-900/80 border border-rose-500/40 flex items-center justify-center text-rose-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest">
                <Heart className="w-4 h-4 fill-rose-400" />
                Thiệp Chúc Yêu Thương
              </div>

              {gift.recipientName && (
                <h2 className="text-2xl sm:text-3xl font-black text-rose-200 tracking-tight font-serif">
                  Gửi {gift.recipientName} ✨
                </h2>
              )}

              <div className="bg-black/50 border border-rose-500/25 rounded-2xl p-5 leading-relaxed text-sm text-stone-200 whitespace-pre-line font-medium shadow-inner">
                {gift.message || "Mỗi ngày trôi qua, tôi đều muốn gửi đến bạn những điều ấm áp và tuyệt vời nhất!"}
              </div>

              {gift.hasVoice && gift.voiceUrl && (
                <AudioPlayerWidget src={gift.voiceUrl} themeStyle={themeStyle} />
              )}
              {gift.hasVideo && gift.videoUrl && (
                <VideoPlayerWidget src={gift.videoUrl} themeStyle={themeStyle} />
              )}

              {gift.senderName && (
                <div className="text-right pt-2 border-t border-rose-500/20">
                  <span className="text-xs text-rose-400/80 font-bold">Thương mến: {gift.senderName} ❤️</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
