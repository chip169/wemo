import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Heart, Sparkles, Calendar, MapPin, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

type GiftContentOverlayProps = {
  gift: any;
  themeStyle: {
    textMain: string;
    textSub: string;
    cardBg: string;
    accentText: string;
    accentBg: string;
    borderColor: string;
    glowColor: string;
    heartColor: string;
  };
};

export function AudioPlayerWidget({ src, themeStyle }: { src: string; themeStyle: any }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setPlaying(!playing);
  };

  return (
    <div className={`p-4 rounded-2xl ${themeStyle.cardBg} border ${themeStyle.borderColor} backdrop-blur-md flex items-center gap-4 text-left w-full shadow-lg`}>
      <button
        type="button"
        onClick={toggle}
        className={`w-10 h-10 rounded-full ${themeStyle.accentBg} text-white flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform`}
      >
        {playing ? <Pause className="w-4 h-4 text-white fill-white" /> : <Play className="w-4 h-4 text-white fill-white ml-0.5" />}
      </button>
      <div className="flex-1">
        <p className={`text-[9px] font-sans font-bold tracking-widest ${themeStyle.accentText} uppercase`}>Lời nhắn âm thanh</p>
        <p className={`text-[11px] ${themeStyle.textMain} font-bold truncate`}>Bấm để phát ghi âm chúc mừng</p>
      </div>
      {playing && (
        <div className="flex items-center gap-0.5 h-3">
          <div className={`w-[2px] ${themeStyle.accentBg} h-full animate-bounce`} style={{ animationDelay: "0.1s" }} />
          <div className={`w-[2px] ${themeStyle.accentBg} h-2/3 animate-bounce`} style={{ animationDelay: "0.2s" }} />
          <div className={`w-[2px] ${themeStyle.accentBg} h-full animate-bounce`} style={{ animationDelay: "0.3s" }} />
        </div>
      )}
    </div>
  );
}

export function VideoPlayerWidget({ src, themeStyle }: { src: string; themeStyle: any }) {
  const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
  let embedUrl = src;
  if (isYouTube) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = src.match(regExp);
    if (match && match[2].length === 11) {
      embedUrl = `https://www.youtube.com/embed/${match[2]}`;
    }
  }

  return (
    <div className={`rounded-2xl overflow-hidden border ${themeStyle.borderColor} bg-black/10 aspect-video w-full relative shadow-lg`}>
      {isYouTube ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={src} controls className="w-full h-full object-cover" />
      )}
    </div>
  );
}

export function GiftContentOverlay({ gift, themeStyle }: GiftContentOverlayProps) {
  const [loveCount, setLoveCount] = useState(520);
  const [clickedHeart, setClickedHeart] = useState(false);
  const [anniversaryDays, setAnniversaryDays] = useState(0);

  // Confetti burst on heart click
  const triggerLoveBeat = () => {
    setLoveCount((prev) => prev + 1);
    setClickedHeart(true);
    setTimeout(() => setClickedHeart(false), 300);

    confetti({
      particleCount: 50,
      spread: 45,
      origin: { y: 0.8 },
      colors: [themeStyle.heartColor, "#ffffff", "#fecfe5"],
    });
  };

  useEffect(() => {
    // Generate simulated sweet anniversary days
    const start = new Date("2024-02-14").getTime();
    const now = new Date().getTime();
    const diff = Math.abs(now - start);
    setAnniversaryDays(Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  // Classify Chibi images from normal photos
  const isChibi = (url: string) => url.toLowerCase().includes("chibi-") || url.toLowerCase().includes("chibi");
  const chibiPhoto = gift.photos?.find((url: string) => isChibi(url));
  const normalPhotos = gift.photos?.filter((url: string) => !isChibi(url)) || [];

  return (
    <div className="absolute inset-0 z-10 w-full h-full overflow-y-auto no-scrollbar py-8 px-4 flex flex-col items-center justify-start pointer-events-none">
      <div className="w-full max-w-md space-y-6 pb-20 pointer-events-auto">
        
        {/* HEADER: GREETING */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-8 space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 border border-white/60 backdrop-blur-sm text-[10px] font-sans font-bold uppercase tracking-widest text-stone-600 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
            <span>WEMO Magic 3D Card</span>
          </div>

          <h1 
            className="text-4xl font-extrabold tracking-tight pt-1 drop-shadow-md select-none"
            style={{
              background: `linear-gradient(135deg, ${themeStyle.accentText}, ${themeStyle.glowColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Thân Gửi {gift.recipientName}
          </h1>
          <p className={`text-xs font-semibold ${themeStyle.textSub} opacity-80 italic`}>
            {gift.title || "Một món quà đặc biệt dành riêng cho bạn"}
          </p>
        </motion.div>

        {/* CHIBI AVATAR (IF CREATED) */}
        {chibiPhoto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`p-3 rounded-[2rem] ${themeStyle.cardBg} border ${themeStyle.borderColor} shadow-2xl backdrop-blur-md flex flex-col items-center`}
          >
            <div 
              className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-inner border border-white/60 bg-gradient-to-br from-white/20 to-white/5 group"
            >
              <img 
                src={chibiPhoto} 
                alt="Chibi Model" 
                className="w-full h-full object-cover filter contrast-[1.02]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-3 left-3 bg-white/80 border border-white/90 px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                <p className="text-[10px] font-bold text-stone-700 tracking-wider flex items-center gap-1 uppercase">
                  <span>🎨 AI Chibi Model</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ALBUM PHOTOS (NORMAL) */}
        {normalPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`p-4 rounded-[2rem] ${themeStyle.cardBg} border ${themeStyle.borderColor} shadow-xl backdrop-blur-md space-y-4`}
          >
            <div className="text-center">
              <span className={`text-[9px] font-sans tracking-[0.25em] font-black uppercase ${themeStyle.accentText}`}>
                Album Kỷ Niệm
              </span>
              <div className="w-8 h-[2px] bg-amber-250 mx-auto mt-1" />
            </div>

            <div className={`grid ${normalPhotos.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
              {normalPhotos.map((photo: string, index: number) => (
                <div
                  key={index}
                  className="p-1.5 bg-white/65 border border-white/50 rounded-2xl shadow-sm hover:scale-103 transition-transform"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-stone-150">
                    <img 
                      src={photo} 
                      alt={`Memory ${index + 1}`} 
                      className="w-full h-full object-cover filter contrast-[1.01]" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SENDER MESSAGE */}
        {gift.message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`p-6 rounded-[2rem] ${themeStyle.cardBg} border ${themeStyle.borderColor} shadow-xl backdrop-blur-md text-center relative overflow-hidden`}
          >
            <span className="absolute top-2 left-4 text-6xl text-stone-300/20 font-serif leading-none">“</span>
            <p className={`text-[13px] ${themeStyle.textMain} font-medium leading-relaxed italic relative z-10 whitespace-pre-line px-2 font-sans`}>
              {gift.message}
            </p>
            <span className="absolute bottom-2 right-4 text-6xl text-stone-300/20 font-serif leading-none">”</span>
          </motion.div>
        )}

        {/* DYNAMIC CONTENT MEDIA (VIDEO/AUDIO) */}
        {(gift.hasVoice && gift.voiceUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full"
          >
            <AudioPlayerWidget src={gift.voiceUrl} themeStyle={themeStyle} />
          </motion.div>
        )}

        {(gift.hasVideo && gift.videoUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="w-full"
          >
            <VideoPlayerWidget src={gift.videoUrl} themeStyle={themeStyle} />
          </motion.div>
        )}

        {/* SWEET ENGAGEMENT WIDGET */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={`p-6 rounded-[2.5rem] ${themeStyle.cardBg} border ${themeStyle.borderColor} shadow-xl backdrop-blur-md text-center space-y-4`}
        >
          <span className={`text-[8px] font-sans tracking-[0.2em] ${themeStyle.textSub} opacity-80 block uppercase`}>
            Gửi yêu thương trao nhận
          </span>
          
          <div className="flex justify-center items-baseline gap-1">
            <span className={`text-4xl font-bold font-serif ${themeStyle.accentText} drop-shadow-sm`}>
              {loveCount}
            </span>
            <span className={`text-xs ${themeStyle.textSub}`}>nhịp đập tim</span>
          </div>

          <div className="pt-2 flex flex-col items-center">
            <motion.button
              onClick={triggerLoveBeat}
              animate={clickedHeart ? { scale: 1.25 } : { scale: 1 }}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer`}
              style={{ backgroundColor: themeStyle.heartColor }}
            >
              <Heart className="w-7 h-7 text-white fill-white animate-pulse" />
            </motion.button>
          </div>
        </motion.div>

        {/* Info bottom */}
        <p className="pt-8 text-[10px] text-stone-400 font-semibold uppercase tracking-widest flex items-center justify-center gap-1 opacity-70">
          <span>Thiệp được tạo bởi</span>
          <span className="font-bold text-stone-500">WEMO NFC</span>
        </p>

      </div>
    </div>
  );
}
