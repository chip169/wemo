import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Music, Play, Pause, Sparkles, Volume2 } from "lucide-react";
import { BirthdayCanvas3D } from "../components/gift3d/BirthdayCanvas3D";
import { LoveCanvas3D } from "../components/gift3d/LoveCanvas3D";
import { GalaxyCanvas3D } from "../components/gift3d/GalaxyCanvas3D";
import { HeartCanvas3D } from "../components/gift3d/HeartCanvas3D";
import { SolidHeartCanvas3D } from "../components/gift3d/SolidHeartCanvas3D";

const MUSIC_URLS = {
  piano: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  romantic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  birthday: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
};

function FloatingParticle({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
      style={{
        background: color,
        left: `${Math.random() * 100}%`,
        top: "-10px",
        opacity: 0.6,
      }}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, (Math.random() - 0.5) * 100],
        rotate: [0, 360],
        opacity: [0.8, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function GiftViewPage() {
  const { giftId } = useParams<{ giftId: string }>();
  const [gift, setGift] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamically add/remove no-scrollbar class to document html & body to hide scrollbar while allowing scrolling
  useEffect(() => {
    document.body.classList.add("no-scrollbar");
    document.documentElement.classList.add("no-scrollbar");
    return () => {
      document.body.classList.remove("no-scrollbar");
      document.documentElement.classList.remove("no-scrollbar");
    };
  }, []);

  // Handle music playing state
  useEffect(() => {
    if (gift && gift.music !== "none") {
      const url = MUSIC_URLS[gift.music as keyof typeof MUSIC_URLS];
      if (url) {
        if (!audioRef.current) {
          const audio = new Audio(url);
          audio.loop = true;
          audioRef.current = audio;
        }

        if (isPlayingMusic) {
          audioRef.current.play().catch((err) => {
            console.log("Autoplay blocked, waiting for interaction:", err);
            setIsPlayingMusic(false);
          });
        } else {
          audioRef.current.pause();
        }
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [gift, isPlayingMusic]);

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const res = await fetch(`/api/gifts/${giftId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Không thể tải thiệp quà tặng.");
        }
        setGift(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (giftId) fetchGift();
  }, [giftId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8B4A8] to-[#D4AF78] flex items-center justify-center text-white"
        >
          <Heart className="w-6 h-6 fill-white" />
        </motion.div>
        <p className="mt-4 text-xs font-bold text-stone-500 uppercase tracking-widest animate-pulse">
          Đang tải thiệp quà tặng...
        </p>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none">
        {/* Glowing shapes */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#E8B4A8]/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-[#D4AF78]/10 blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm p-8 rounded-[2.5rem] bg-white/70 border border-white/40 shadow-2xl backdrop-blur-md relative z-10 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-5 border border-amber-100 shadow-inner">
            <span className="text-3xl">⚠️</span>
          </div>
          
          <h2 className="text-lg font-extrabold text-stone-900 mb-2">Không Tìm Thấy Quà Tặng</h2>
          <p className="text-xs text-stone-500 max-w-xs mb-6 leading-relaxed">
            Liên kết quà tặng này không tồn tại hoặc đã hết hạn xác thực trên hệ thống WEMO.
          </p>

          <Link
            to="/"
            className="w-full py-3 bg-gradient-to-r from-stone-800 to-stone-950 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 text-center active:scale-98 transition-all block cursor-pointer"
          >
            Quay lại Trang Chủ
          </Link>
        </motion.div>

        <p className="mt-8 text-[10px] text-stone-400 font-bold uppercase tracking-widest relative z-10">
          WEMO NFC PLATFORM
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none">
      {/* 3D Canvas Template selection */}
      {gift.theme === "sinh-nhat" && <BirthdayCanvas3D gift={gift} />}
      {gift.theme === "tinh-yeu" && gift.templateId === "solid-heart" && <SolidHeartCanvas3D gift={gift} />}
      {gift.theme === "tinh-yeu" && gift.templateId !== "solid-heart" && <HeartCanvas3D gift={gift} />}
      {gift.theme === "ky-niem" && <GalaxyCanvas3D gift={gift} />}
      {!["sinh-nhat", "tinh-yeu", "ky-niem"].includes(gift.theme) && <HeartCanvas3D gift={gift} />}

      {/* Interactive Music Widget */}
      {gift.music !== "none" && (
        <div className="absolute top-4 right-4 z-30 pointer-events-auto">
          <button
            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border bg-white/80 backdrop-blur-sm text-stone-700 transition-all ${isPlayingMusic ? "border-rose-200 text-rose-500 scale-105 animate-pulse" : "border-stone-200"}`}
          >
            {isPlayingMusic ? <Volume2 className="w-5 h-5 animate-spin" style={{ animationDuration: "8s" }} /> : <Music className="w-5 h-5 text-stone-400" />}
          </button>
          {isPlayingMusic && (
            <div className="absolute top-12 right-0 bg-stone-900/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none">
              Đang phát nhạc...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
