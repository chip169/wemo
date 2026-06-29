import React, { useState, useEffect } from "react";
import { Camera, Sparkles, Send, Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

type TemplateProps = {
  recipientName: string;
  title: string;
  message: string;
  photos: string[];
  isEditing?: boolean;
  onUpdate?: (fields: {
    title?: string;
    recipientName?: string;
    message?: string;
    photos?: string[];
  }) => void;
};

type ChristmasComment = {
  id: string;
  name: string;
  sticker: string;
  text: string;
  time: string;
};

function SnowflakeParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute text-white/30 pointer-events-none select-none"
      style={{
        left: `${Math.random() * 100}%`,
        top: "-20px",
        fontSize: `${10 + Math.random() * 12}px`,
      }}
      animate={{
        y: ["0vh", "90vh"],
        x: [0, (Math.random() - 0.5) * 40],
        rotate: [0, 360],
        opacity: [0.8, 0],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      ❄️
    </motion.div>
  );
}

export default function ChristmasCozy({
  recipientName,
  title,
  message,
  photos = [],
  isEditing = false,
  onUpdate,
}: TemplateProps) {
  const [isOpen, setIsOpen] = useState(isEditing ? true : false);
  const [likes, setLikes] = useState(88);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedSticker, setSelectedSticker] = useState("🎄");
  const [comments, setComments] = useState<ChristmasComment[]>([
    {
      id: "1",
      name: "Bác Gấu",
      sticker: "🎅",
      text: "Chúc cả nhà Giáng Sinh an lành, ấm áp và ngập tràn hồng ân Thiên Chúa!",
      time: "1 giờ trước",
    },
    {
      id: "2",
      name: "Tố Ny",
      sticker: "🎁",
      text: "Nhìn cưng xỉu luôn! Mong nhận được quà Noel thật to nha!",
      time: "3 giờ trước",
    },
  ]);

  // Christmas eve target date countdown (e.g. 2026-12-24 18:00)
  const targetDate = "2026-12-24T18:00:00";
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    // Burst Christmas colors confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#2D5016", "#D32F2F", "#D4AF78", "#FFFFFF"],
    });
  };

  const handlePhotoClick = (index: number) => {
    if (!isEditing || !onUpdate) return;
    const newPhotos = [...photos];
    const pool = [
      "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600&q=80",
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=600&q=80",
      "https://images.unsplash.com/photo-1543589077-47d816067938?w=600&q=80",
    ];
    newPhotos[index] = pool[index % pool.length];
    onUpdate({ photos: newPhotos });
  };

  const activePhotos = [
    photos[0] || "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600&q=80",
    photos[1] || "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=600&q=80",
    photos[2] || "https://images.unsplash.com/photo-1543589077-47d816067938?w=600&q=80",
  ];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newCmt: ChristmasComment = {
      id: Date.now().toString(),
      name: commentName.trim() || "Yêu tinh Noel",
      sticker: selectedSticker,
      text: commentText.trim(),
      time: "Vừa xong",
    };
    setComments([newCmt, ...comments]);
    setCommentName("");
    setCommentText("");
  };

  const handleLike = () => {
    setLikes(hasLiked ? likes - 1 : likes + 1);
    setHasLiked(!hasLiked);
  };

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#1A3E2F] to-[#11261B] text-[#FAF7F4] rounded-3xl min-h-[600px] border-4 border-[#D4AF78]/25 font-sans shadow-2xl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Montserrat:wght@400;650&display=swap');
        .font-xmas-title { font-family: 'Cinzel', serif; }
        .font-xmas-sans { font-family: 'Montserrat', sans-serif; }
        
        /* Fireplace burning animation using gradients */
        .fireplace-glow {
          box-shadow: 0 0 40px rgba(220, 38, 38, 0.25), inset 0 0 20px rgba(245, 158, 11, 0.3);
          background: linear-gradient(180deg, rgba(26,62,47,0.3) 0%, rgba(185,28,28,0.15) 100%);
        }
      `}</style>

      {/* Falling snow particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <SnowflakeParticle key={i} delay={i * 0.6} />
        ))}
      </div>

      {/* Editor State Toggle Controls */}
      {isEditing && (
        <div className="absolute top-3 left-3 z-50 flex gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className={`px-3 py-1 rounded-full text-[9px] font-xmas-sans tracking-widest border transition-all ${
              !isOpen ? "bg-[#D32F2F] text-white border-[#D4AF78]" : "bg-black/60 text-stone-300 border-stone-700"
            }`}
          >
            BAO THƯ
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className={`px-3 py-1 rounded-full text-[9px] font-xmas-sans tracking-widest border transition-all ${
              isOpen ? "bg-[#D32F2F] text-white border-[#D4AF78]" : "bg-black/60 text-stone-300 border-stone-700"
            }`}
          >
            NỘI DUNG
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ================= BAO THƯ (ENVELOPE COVER) ================= */
          <motion.div
            key="christmas-envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full min-h-[600px] flex flex-col justify-between p-8 items-center bg-gradient-to-b from-[#1E3B2F] to-[#12241D] relative"
          >
            <div className="z-10 text-center mt-12 space-y-2">
              <span className="text-[10px] font-xmas-sans tracking-[0.3em] text-[#D4AF78] block uppercase">
                Merry Christmas
              </span>
              <h1 className="text-3xl font-xmas-title text-white font-extrabold tracking-widest">WINTER WONDERLAND</h1>
              <div className="w-12 h-[1px] bg-[#D4AF78]/40 mx-auto mt-2" />
            </div>

            {/* Christmas Stocking / Gift Box badge */}
            <div className="z-10 text-center my-6">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-red-600/30 animate-pulse border border-[#D4AF78]/30" />
                <button
                  onClick={handleOpen}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#9B1C31] to-[#D32F2F] flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all shadow-[0_8px_20px_rgba(211,47,47,0.4)] relative z-10 border border-[#D4AF78]/40"
                >
                  <span className="text-3xl animate-bounce">🎁</span>
                </button>
              </div>
              
              <p className="text-[8px] tracking-widest text-[#D4AF78] font-xmas-sans mt-5 block">
                MÓN QUÀ GIÁNG SINH GỬI
              </p>
              <h3 className="text-xl font-black font-xmas-title text-white mt-1 uppercase tracking-widest">
                {recipientName || "Người Thương"}
              </h3>
            </div>

            {/* Bottom Invitation Button */}
            <div className="z-10 mb-8 text-center space-y-3">
              <button
                onClick={handleOpen}
                className="px-6 py-2.5 rounded-full text-[10px] font-xmas-sans font-bold tracking-[0.2em] bg-[#D32F2F] text-white hover:bg-red-700 shadow-md transition-all active:scale-95 border border-[#D4AF78]/40"
              >
                KHUI QUÀ GIÁNG SINH 🎄
              </button>
              <span className="text-[8px] text-[#D4AF78] block tracking-widest uppercase">
                NHẤP VÀO HỘP QUÀ ĐỂ NHẬN HƠI ẤM NOEL
              </span>
            </div>
          </motion.div>
        ) : (
          /* ================= NỘI DUNG CHÍNH THIỆP (STORY CONTENT) ================= */
          <motion.div
            key="christmas-content"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col justify-start relative px-6 py-10 space-y-12 overflow-y-auto max-h-[85vh]"
          >
            {/* CHƯƠNG 1: TRANG BÌA GIÁNG SINH */}
            <section className="text-center z-10 space-y-5">
              <div className="relative inline-block">
                <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">🎄</span>
                <span className="text-[9px] font-xmas-sans tracking-[0.25em] text-[#D4AF78] font-bold block mt-2">CHƯƠNG I</span>
              </div>
              
              <h1 className="text-2xl font-xmas-title font-extrabold tracking-widest text-white uppercase">
                {title || "Mùa Noel Ấm Áp"}
              </h1>

              {/* Cover Photo inside dynamic snowball / glass ball layout */}
              <div className="flex justify-center my-6">
                <div
                  onClick={() => handlePhotoClick(0)}
                  className="relative w-52 h-52 rounded-full p-2 bg-gradient-to-tr from-[#9B1C31] to-[#D32F2F] shadow-[0_15px_30px_rgba(0,0,0,0.5)] cursor-pointer group border border-[#D4AF78]/40"
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative bg-stone-100">
                    <img
                      src={activePhotos[0]}
                      alt="Xmas Moments"
                      className="w-full h-full object-cover filter contrast-[1.01] brightness-[0.98] group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Simulated snowball glass light reflection */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Floating star badges */}
                  <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>

              <div className="text-center">
                <span className="text-[8px] font-xmas-sans tracking-widest text-[#D4AF78] uppercase">ẤM ÁP TRAO</span>
                <p className="text-base font-bold font-xmas-title text-white tracking-widest uppercase mt-0.5">
                  {recipientName || "Người Thương"}
                </p>
              </div>
            </section>

            {/* CHƯƠNG 2: LỜI TỪ TÂM KHẢM */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <span className="text-[9px] font-xmas-sans tracking-[0.25em] text-[#D4AF78] font-bold block mb-1">CHƯƠNG II</span>
                <h3 className="text-xs font-xmas-sans tracking-[0.2em] uppercase text-white font-bold">Thư Chúc Noel</h3>
                <div className="w-8 h-[1px] bg-[#D4AF78]/40 mx-auto mt-2" />
              </div>

              {/* Scroll theme parchment box */}
              <div className="p-6 rounded-2xl bg-white/10 border border-white/10 fireplace-glow backdrop-blur-sm relative overflow-hidden text-left shadow-lg">
                <div className="absolute top-2 left-2 text-[20px] text-red-500/20 select-none">🔔</div>
                
                {isEditing ? (
                  <textarea
                    value={message}
                    onChange={(e) => onUpdate?.({ message: e.target.value })}
                    className="w-full text-xs font-xmas-sans text-[#FAF7F4] bg-transparent border border-dashed border-white/20 p-3 rounded-xl focus:outline-none h-24 resize-none leading-relaxed"
                    placeholder="Viết những lời Giáng Sinh chúc nguyện..."
                  />
                ) : (
                  <p className="text-xs font-xmas-sans leading-loose text-[#FAF7F4]/90 text-center whitespace-pre-line px-2 font-medium">
                    {message || "Chúc bạn một mùa Giáng Sinh tràn ngập niềm vui, ấm áp bên gia đình và người thương yêu. Mong rằng những điều lành nhất sẽ gõ cửa cuộc đời bạn trong năm mới."}
                  </p>
                )}
              </div>
            </section>

            {/* CHƯƠNG 3: NHỮNG KỶ NIỆM MÙA ĐÔNG */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <span className="text-[9px] font-xmas-sans tracking-[0.25em] text-[#D4AF78] font-bold block mb-1">CHƯƠNG III</span>
                <h3 className="text-xs font-xmas-sans tracking-[0.2em] uppercase text-white font-bold">Thước Phim Giáng Sinh</h3>
                <div className="w-8 h-[1px] bg-[#D4AF78]/40 mx-auto mt-2" />
              </div>

              {/* Holiday frame gallery */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => handlePhotoClick(1)}
                  className="p-2 bg-white/5 border border-white/10 rounded-2xl shadow-md relative group cursor-pointer"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                    <img src={activePhotos[1]} alt="Moments 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="py-2 text-[8px] text-[#D4AF78] tracking-wider text-center font-xmas-sans font-bold uppercase">Cozy Eve</div>
                  {isEditing && (
                    <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div
                  onClick={() => handlePhotoClick(2)}
                  className="p-2 bg-white/5 border border-white/10 rounded-2xl shadow-md relative group cursor-pointer"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                    <img src={activePhotos[2]} alt="Moments 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="py-2 text-[8px] text-[#D4AF78] tracking-wider text-center font-xmas-sans font-bold uppercase">Cozy Eve</div>
                  {isEditing && (
                    <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* CHƯƠNG 4: ĐÊM TIỆC SUM VẦY (COUNTDOWN) */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <span className="text-[9px] font-xmas-sans tracking-[0.25em] text-[#D4AF78] font-bold block mb-1">CHƯƠNG IV</span>
                <h3 className="text-xs font-xmas-sans tracking-[0.2em] uppercase text-white font-bold">Thời Khắc Noel</h3>
                <div className="w-8 h-[1px] bg-[#D4AF78]/40 mx-auto mt-2" />
              </div>

              {/* Countdown box */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 fireplace-glow shadow-sm text-left space-y-4">
                <span className="text-[7.5px] font-xmas-sans tracking-[0.2em] text-[#D4AF78] block uppercase text-center">ĐỒNG HỒ ĐẾM NGƯỢC GIÁNG SINH</span>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#11261B] p-2 rounded-xl border border-white/10">
                    <span className="text-base font-bold text-white block">{timeLeft.days}</span>
                    <span className="text-[6.5px] text-stone-400 font-xmas-sans uppercase tracking-wider block">Ngày</span>
                  </div>
                  <div className="bg-[#11261B] p-2 rounded-xl border border-white/10">
                    <span className="text-base font-bold text-white block">{timeLeft.hours}</span>
                    <span className="text-[6.5px] text-stone-400 font-xmas-sans uppercase tracking-wider block">Giờ</span>
                  </div>
                  <div className="bg-[#11261B] p-2 rounded-xl border border-white/10">
                    <span className="text-base font-bold text-white block">{timeLeft.minutes}</span>
                    <span className="text-[6.5px] text-stone-400 font-xmas-sans uppercase tracking-wider block">Phút</span>
                  </div>
                  <div className="bg-[#11261B] p-2 rounded-xl border border-white/10">
                    <span className="text-base font-bold text-white block">{timeLeft.seconds}</span>
                    <span className="text-[6.5px] text-stone-400 font-xmas-sans uppercase tracking-wider block">Giây</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-white/10 text-left">
                  <div className="w-8 h-8 rounded-lg bg-red-650 border border-[#D4AF78]/30 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[8px] font-xmas-sans tracking-widest text-[#D4AF78] block uppercase">ĐÊM HỘI COZY</span>
                    <span className="text-[11px] font-bold text-white block">18:00 - Thứ Năm, Ngày 24/12/2026</span>
                    <span className="text-[9px] text-[#FAF7F4]/75 italic block">Sảnh Tiệc Lò Sưởi, CineLove Hotel</span>
                  </div>
                </div>

                {/* Map URL button */}
                <a
                  href="https://maps.google.com/?q=CineLove+Hotel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-gradient-to-r from-[#D32F2F] to-[#9B1C31] text-white border border-[#D4AF78]/35 font-xmas-sans text-[10px] font-bold tracking-widest flex items-center justify-center gap-1.5 shadow-md rounded-xl transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  CHỈ ĐƯỜNG GPS ĐẾN TIỆC
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </section>

            {/* CHƯƠNG 5: HỘP THƯ BẮC CỰC (GUESTBOOK) */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <span className="text-[9px] font-xmas-sans tracking-[0.25em] text-[#D4AF78] font-bold block mb-1">CHƯƠNG V</span>
                <h3 className="text-xs font-xmas-sans tracking-[0.2em] uppercase text-white font-bold">Thư Gửi Ông Già Noel</h3>
                <div className="w-8 h-[1px] bg-[#D4AF78]/40 mx-auto mt-2" />
              </div>

              {/* Form Input */}
              <form onSubmit={handleAddComment} className="space-y-3 bg-[#162f23] border border-white/10 p-4 rounded-2xl text-left">
                <div>
                  <label className="block text-[8px] font-xmas-sans font-bold text-[#D4AF78] tracking-widest uppercase mb-1">DANH TÍNH</label>
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Tên của bạn..."
                    className="w-full px-3 py-2 bg-[#11261B] border border-white/10 rounded-xl outline-none text-xs text-white placeholder-stone-600 focus:border-[#D4AF78]/55"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-xmas-sans font-bold text-[#D4AF78] tracking-widest uppercase mb-1">CHỌN HÌNH KHÓA NOEL</label>
                  <div className="flex gap-2">
                    {["🎄", "🎅", "❄️", "🎁", "✨"].map((stk) => (
                      <button
                        key={stk}
                        type="button"
                        onClick={() => setSelectedSticker(stk)}
                        className={`w-8 h-8 rounded-full border text-xs flex items-center justify-center transition-colors ${
                          selectedSticker === stk ? "bg-[#D32F2F] border-[#D4AF78] text-white" : "bg-[#11261B] border-white/10 text-stone-300 hover:bg-[#1c3e2e]"
                        }`}
                      >
                        {stk}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-xmas-sans font-bold text-[#D4AF78] tracking-widest uppercase mb-1">ƯỚC NGUYỆN GIÁNG SINH</label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Viết điều ước gửi đi..."
                    rows={2}
                    className="w-full px-3 py-2 bg-[#11261B] border border-white/10 rounded-xl outline-none text-xs text-white placeholder-stone-600 focus:border-[#D4AF78]/55 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="w-full py-2 rounded-xl bg-[#D32F2F] hover:bg-red-750 text-white text-[10px] font-xmas-sans tracking-widest font-bold border border-[#D4AF78]/35 flex items-center justify-center gap-1.5 disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-3 h-3" />
                  GỬI THƯ LƯU BÚT
                </button>
              </form>

              {/* Comments display */}
              <div className="space-y-3 mt-4 text-left max-h-[200px] overflow-y-auto pr-1">
                {comments.map((cmt) => (
                  <div key={cmt.id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#11261B] border border-[#D4AF78]/25 flex items-center justify-center text-sm shrink-0">
                      {cmt.sticker}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-white uppercase truncate">{cmt.name}</span>
                        <span className="text-[7px] text-stone-500 shrink-0 font-xmas-sans">{cmt.time}</span>
                      </div>
                      <p className="text-[9.5px] text-[#FAF7F4]/80 leading-relaxed">{cmt.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="pt-6 border-t border-white/10 flex items-center justify-between z-10">
              <span className="text-[8px] font-xmas-sans text-[#D4AF78] tracking-widest uppercase">MERRY CHRISTMAS</span>
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-[#FAF7F4]/60 font-xmas-sans">Tương tác:</span>
                <span className="text-[10px] font-mono text-[#D4AF78] font-bold">{likes}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  hasLiked ? "bg-[#D4AF78] text-[#11261B] border-[#D4AF78]" : "bg-white/5 border-white/10 text-[#D4AF78]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </motion.button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
