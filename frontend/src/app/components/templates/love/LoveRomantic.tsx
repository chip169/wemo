import React, { useState, useEffect } from "react";
import { Heart, Camera, Sparkles, Send, Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
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

type LoveComment = {
  id: string;
  name: string;
  sticker: string;
  text: string;
  time: string;
};

function LoveHeartParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute text-rose-400/20 pointer-events-none select-none"
      style={{
        left: `${Math.random() * 100}%`,
        bottom: "-20px",
        fontSize: `${12 + Math.random() * 18}px`,
      }}
      animate={{
        y: ["0vh", "-85vh"],
        x: [0, (Math.random() - 0.5) * 60],
        rotate: [0, 360],
        opacity: [0.8, 0],
      }}
      transition={{
        duration: 5 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      ❤️
    </motion.div>
  );
}

export default function LoveRomantic({
  recipientName,
  title,
  message,
  photos = [],
  isEditing = false,
  onUpdate,
}: TemplateProps) {
  const [isOpen, setIsOpen] = useState(isEditing ? true : false);
  const [loveCount, setLoveCount] = useState(999);
  const [clickedHeart, setClickedHeart] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedSticker, setSelectedSticker] = useState("💖");
  const [comments, setComments] = useState<LoveComment[]>([
    {
      id: "1",
      name: "Người giấu mặt",
      sticker: "🌹",
      text: "Chúc hai bạn mãi hạnh phúc bên nhau nhé! Thật đáng ngưỡng mộ!",
      time: "10 phút trước",
    },
    {
      id: "2",
      name: "Thu Trang",
      sticker: "🌟",
      text: "Nhìn album ảnh ngọt ngào quá đi mất. Happy Anniversary!",
      time: "1 giờ trước",
    },
  ]);

  // Date since love calculation (mock starting date: 2024-02-14)
  const anniversaryDate = "2024-02-14";
  const [daysCount, setDaysCount] = useState(0);

  useEffect(() => {
    const start = new Date(anniversaryDate).getTime();
    const now = new Date().getTime();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysCount(diffDays);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#FF4D4D", "#FFCCD5", "#FF8A8A", "#FF0033"],
    });
  };

  const handlePhotoClick = (index: number) => {
    if (!isEditing || !onUpdate) return;
    const newPhotos = [...photos];
    const pool = [
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    ];
    newPhotos[index] = pool[index % pool.length];
    onUpdate({ photos: newPhotos });
  };

  const activePhotos = [
    photos[0] || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80",
    photos[1] || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
    photos[2] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  ];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newCmt: LoveComment = {
      id: Date.now().toString(),
      name: commentName.trim() || "Người Thương",
      sticker: selectedSticker,
      text: commentText.trim(),
      time: "Vừa xong",
    };
    setComments([newCmt, ...comments]);
    setCommentName("");
    setCommentText("");
  };

  const triggerLoveBeat = () => {
    setLoveCount(loveCount + 1);
    setClickedHeart(true);
    setTimeout(() => setClickedHeart(false), 300);
  };

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#FFEBEB] to-[#FFCCD5] text-rose-950 rounded-3xl min-h-[600px] border border-rose-200 font-serif shadow-2xl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Great+Vibes&display=swap');
        .font-romantic-title { font-family: 'Great Vibes', cursive; }
        .font-romantic-serif { font-family: 'Playfair Display', serif; }
        
        .love-wax-seal {
          box-shadow: 0 4px 10px rgba(220, 38, 38, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4);
          background: radial-gradient(circle at 35% 35%, #ef4444 0%, #b91c1c 80%);
        }
      `}</style>

      {/* Editor State Toggle Controls */}
      {isEditing && (
        <div className="absolute top-3 left-3 z-50 flex gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className={`px-3 py-1 rounded-full text-[9px] font-sans tracking-widest border transition-all ${
              !isOpen ? "bg-rose-600 text-white border-rose-400" : "bg-white/60 text-stone-700 border-stone-300"
            }`}
          >
            BAO THƯ
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className={`px-3 py-1 rounded-full text-[9px] font-sans tracking-widest border transition-all ${
              isOpen ? "bg-rose-600 text-white border-rose-400" : "bg-white/60 text-stone-700 border-stone-300"
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
            key="love-envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full min-h-[600px] flex flex-col justify-between p-8 items-center bg-gradient-to-b from-[#FFF0F0] to-[#FFD1D1] relative"
          >
            {/* Background love particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <LoveHeartParticle key={i} delay={i * 0.9} />
              ))}
            </div>

            <div className="z-10 text-center mt-12 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-rose-400 block">Love Letter</span>
              <h1 className="text-4xl font-romantic-title text-rose-600 drop-shadow-sm">Our Romantic Story</h1>
              <div className="w-12 h-[1px] bg-rose-200 mx-auto mt-2" />
            </div>

            {/* Glowing Heart Wax Seal */}
            <div className="z-10 text-center my-4">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-rose-200/40 animate-ping" />
                <button
                  onClick={handleOpen}
                  className="w-20 h-20 rounded-full love-wax-seal flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform relative z-10"
                >
                  <Heart className="w-9 h-9 fill-white animate-pulse" />
                </button>
              </div>
              <p className="text-[9px] uppercase tracking-widest text-rose-500 font-sans mt-5 block">
                THƯ TÌNH DÀNH RIÊNG CHO
              </p>
              <h3 className="text-xl font-bold font-romantic-serif text-rose-900 mt-1 uppercase tracking-wide">
                {recipientName || "Người Thương"}
              </h3>
            </div>

            {/* Bottom Invitation text */}
            <div className="z-10 mb-8 text-center space-y-3">
              <button
                onClick={handleOpen}
                className="px-6 py-2.5 rounded-full text-[10px] font-sans font-bold tracking-[0.2em] bg-rose-600 text-white hover:bg-rose-700 shadow-md active:scale-95 transition-all"
              >
                MỞ BỨC THƯ TÌNH 💌
              </button>
              <span className="text-[8px] text-rose-400 block tracking-widest">
                NHẤP ĐỂ KHÁM PHÁ HÀNH TRÌNH HẠNH PHÚC
              </span>
            </div>
          </motion.div>
        ) : (
          /* ================= NỘI DUNG CHÍNH THIỆP (STORY CONTENT) ================= */
          <motion.div
            key="love-content"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col justify-start relative px-6 py-10 space-y-12 overflow-y-auto max-h-[85vh]"
          >
            {/* Background love particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <LoveHeartParticle key={i} delay={i * 0.5} />
              ))}
            </div>

            {/* CHƯƠNG 1: TRANG BÌA HẠNH PHÚC */}
            <section className="text-center z-10 space-y-5">
              <div className="relative inline-block">
                <Heart className="w-8 h-8 mx-auto text-rose-600 fill-rose-500 drop-shadow-[0_0_8px_rgba(225,29,72,0.4)] animate-pulse" />
                <span className="text-[9px] font-sans tracking-[0.25em] text-rose-500 font-bold block mt-1">CHƯƠNG I</span>
              </div>
              
              <h1 className="text-3xl font-romantic-title text-rose-900 leading-none">
                {title || "Mãi Yêu Thương"}
              </h1>

              {/* Cover image - Heart outline border */}
              <div className="flex justify-center my-6">
                <div
                  onClick={() => handlePhotoClick(0)}
                  className="relative w-52 h-52 rounded-full p-2 bg-gradient-to-tr from-rose-400 via-pink-200 to-rose-300 shadow-[0_15px_30px_rgba(219,39,119,0.2)] cursor-pointer group"
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative bg-stone-50">
                    <img
                      src={activePhotos[0]}
                      alt="Couple Love"
                      className="w-full h-full object-cover filter contrast-[1.01] brightness-[0.98] group-hover:scale-105 transition-transform duration-700"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="text-[8px] font-sans tracking-widest text-rose-400 uppercase">GỬI ĐẾN NỬA KIA</span>
                <p className="text-lg font-bold font-romantic-serif text-rose-900 tracking-wider uppercase mt-0.5">
                  {recipientName || "Người Thương"}
                </p>
              </div>
            </section>

            {/* CHƯƠNG 2: LỜI TỪ TÂM KHẢM */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <span className="text-[9px] font-sans tracking-[0.25em] text-rose-500 font-bold block mb-1">CHƯƠNG II</span>
                <h3 className="text-xs font-sans tracking-[0.2em] uppercase text-rose-800 font-black">Bức Thư Tình</h3>
                <div className="w-8 h-[1px] bg-rose-350 mx-auto mt-2" />
              </div>

              {/* Glassmorphic paper box */}
              <div className="p-6 rounded-2xl bg-white/40 border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.03)] backdrop-blur-md relative overflow-hidden text-left">
                <div className="absolute top-2 left-2 text-[20px] text-rose-300 font-romantic-title select-none">My Love,</div>
                
                {isEditing ? (
                  <textarea
                    value={message}
                    onChange={(e) => onUpdate?.({ message: e.target.value })}
                    className="w-full text-xs font-romantic-serif italic text-rose-900 bg-transparent border border-dashed border-rose-300 p-3 rounded-xl focus:outline-none h-24 resize-none leading-relaxed"
                    placeholder="Điền những lời ngọt ngào..."
                  />
                ) : (
                  <p className="text-sm font-romantic-serif italic leading-loose text-rose-950 text-center whitespace-pre-line px-2 mt-4">
                    {message || "Cảm ơn vì đã luôn ở bên, lắng nghe và chia sẻ mọi buồn vui cùng anh. Nụ cười của em luôn là động lực lớn nhất giúp anh vượt qua mọi bão giông cuộc đời."}
                  </p>
                )}
              </div>
            </section>

            {/* CHƯƠNG 3: NHỮNG KỶ NIỆM NGỌT NGÀO */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <span className="text-[9px] font-sans tracking-[0.25em] text-rose-500 font-bold block mb-1">CHƯƠNG III</span>
                <h3 className="text-xs font-sans tracking-[0.2em] uppercase text-rose-800 font-black">Thước Phim Đôi Ta</h3>
                <div className="w-8 h-[1px] bg-rose-350 mx-auto mt-2" />
              </div>

              {/* Photo stack/cards */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => handlePhotoClick(1)}
                  className="p-2 bg-white/70 border border-rose-100 rounded-2xl shadow-md relative group cursor-pointer"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                    <img src={activePhotos[1]} alt="Moments 1" className="w-full h-full object-cover filter contrast-[1.01]" />
                  </div>
                  <div className="py-2 text-[9px] text-rose-500 tracking-wider text-center font-romantic-serif">Sweet Memory</div>
                  {isEditing && (
                    <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div
                  onClick={() => handlePhotoClick(2)}
                  className="p-2 bg-white/70 border border-rose-100 rounded-2xl shadow-md relative group cursor-pointer"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                    <img src={activePhotos[2]} alt="Moments 2" className="w-full h-full object-cover filter contrast-[1.01]" />
                  </div>
                  <div className="py-2 text-[9px] text-rose-500 tracking-wider text-center font-romantic-serif">Sweet Memory</div>
                  {isEditing && (
                    <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* CHƯƠNG 4: HÀNH TRÌNH ĐÃ QUA */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <span className="text-[9px] font-sans tracking-[0.25em] text-rose-500 font-bold block mb-1">CHƯƠNG IV</span>
                <h3 className="text-xs font-sans tracking-[0.2em] uppercase text-rose-800 font-black">Ngày Yêu Thương</h3>
                <div className="w-8 h-[1px] bg-rose-350 mx-auto mt-2" />
              </div>

              {/* Day Counter Widget */}
              <div className="p-6 rounded-2xl bg-white/60 border border-white/80 shadow-md text-center space-y-4">
                <span className="text-[8px] font-sans tracking-[0.2em] text-rose-400 block uppercase">HÀNH TRÌNH CHÚNG MÌNH BẮT ĐẦU</span>
                
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-4xl font-bold font-romantic-serif text-rose-600 drop-shadow-sm">{daysCount}</span>
                  <span className="text-sm text-rose-800">ngày yêu</span>
                </div>
                
                <p className="text-[10px] text-rose-500 tracking-wide font-sans leading-relaxed italic">
                  "Ngày ta chung bước: 14/02/2024. Chặng đường đi qua luôn ngập tràn tiếng cười và kỷ niệm ngọt ngào."
                </p>

                {/* Love Beat Interactive Button */}
                <div className="pt-4 border-t border-rose-100 flex flex-col items-center space-y-2">
                  <span className="text-[8px] font-sans text-rose-400 tracking-widest uppercase">NHẤP ĐỂ TRAO TIM YÊU THƯƠNG</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-stone-500">Love: {loveCount}</span>
                    <motion.button
                      onClick={triggerLoveBeat}
                      animate={clickedHeart ? { scale: 1.3 } : { scale: 1 }}
                      className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                      <Heart className="w-6 h-6 fill-white animate-pulse" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </section>

            {/* CHƯƠNG 5: HẸN ƯỚC NƠI HẠN GẶP */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <span className="text-[9px] font-sans tracking-[0.25em] text-rose-500 font-bold block mb-1">CHƯƠNG V</span>
                <h3 className="text-xs font-sans tracking-[0.2em] uppercase text-rose-800 font-black">Buổi Hẹn Hò Đặc Biệt</h3>
                <div className="w-8 h-[1px] bg-rose-350 mx-auto mt-2" />
              </div>

              {/* Event Location Box */}
              <div className="p-5 rounded-2xl bg-white/50 border border-white/60 shadow-sm text-left space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <span className="text-[8px] font-sans tracking-widest text-rose-400 block uppercase">THỜI GIAN</span>
                    <span className="text-[11px] font-bold text-rose-900">19:00 - Thứ Bảy, Ngày 14 Tháng 02 Năm 2026</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <span className="text-[8px] font-sans tracking-widest text-rose-400 block uppercase">ĐỊA ĐIỂM HẸN HÒ</span>
                    <span className="text-[11px] font-bold text-rose-900 block">NHÀ HÀNG PHÁP CINE D'AMOUR</span>
                    <span className="text-[9px] text-stone-500 italic block">Tầng Thượng, Central Landmark, TP.HCM</span>
                  </div>
                </div>

                {/* Map URL button */}
                <a
                  href="https://maps.google.com/?q=Central+Landmark+CineLove"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-sans text-[10px] font-bold tracking-widest flex items-center justify-center gap-1.5 shadow-md rounded-xl transition-all"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  CHỈ ĐƯỜNG ĐẾN ĐIỂM HẸN
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </section>

            {/* CHƯƠNG 6: SỔ KÝ ỨC LỜI YÊU THƯƠNG */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <span className="text-[9px] font-sans tracking-[0.25em] text-rose-500 font-bold block mb-1">CHƯƠNG VI</span>
                <h3 className="text-xs font-sans tracking-[0.2em] uppercase text-rose-800 font-black">Lời Chúc Tình Yêu</h3>
                <div className="w-8 h-[1px] bg-rose-350 mx-auto mt-2" />
              </div>

              {/* Input Form */}
              <form onSubmit={handleAddComment} className="space-y-3 bg-white/50 border border-white/70 p-4 rounded-2xl text-left">
                <div>
                  <label className="block text-[8px] font-sans font-bold text-rose-500 tracking-widest uppercase mb-1">DANH TÍNH</label>
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Tên của bạn..."
                    className="w-full px-3 py-2 bg-white/70 border border-rose-100 rounded-xl outline-none text-xs text-rose-950 placeholder-stone-400 focus:border-rose-450"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-sans font-bold text-rose-500 tracking-widest uppercase mb-1">STIKER YÊU THƯƠNG</label>
                  <div className="flex gap-2">
                    {["💖", "🌹", "🌟", "💑", "💌"].map((stk) => (
                      <button
                        key={stk}
                        type="button"
                        onClick={() => setSelectedSticker(stk)}
                        className={`w-8 h-8 rounded-full border text-xs flex items-center justify-center transition-colors ${
                          selectedSticker === stk ? "bg-rose-500 border-rose-400 text-white shadow-sm" : "bg-white/60 border-rose-100 text-stone-700 hover:bg-rose-50"
                        }`}
                      >
                        {stk}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-sans font-bold text-rose-500 tracking-widest uppercase mb-1">THÔNG ĐIỆP GỬI ĐẾN CẶP ĐÔI</label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Viết lời nhắn..."
                    rows={2}
                    className="w-full px-3 py-2 bg-white/70 border border-rose-100 rounded-xl outline-none text-xs text-rose-950 placeholder-stone-400 focus:border-rose-450 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-sans tracking-widest font-bold border border-rose-400 flex items-center justify-center gap-1.5 disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-3 h-3" />
                  KÝ TÊN LƯU BÚT
                </button>
              </form>

              {/* Comments Feed */}
              <div className="space-y-3 mt-4 text-left max-h-[200px] overflow-y-auto pr-1">
                {comments.map((cmt) => (
                  <div key={cmt.id} className="p-3 bg-white/30 rounded-xl border border-white/50 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-sm shrink-0">
                      {cmt.sticker}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-rose-900 uppercase truncate">{cmt.name}</span>
                        <span className="text-[7px] text-stone-500 shrink-0 font-sans">{cmt.time}</span>
                      </div>
                      <p className="text-[10px] text-rose-950 font-sans leading-relaxed">{cmt.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="pt-6 border-t border-rose-200/50 text-center z-10 text-[9px] uppercase tracking-widest text-rose-400 font-sans">
              ✦ Together Forever ✦
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
