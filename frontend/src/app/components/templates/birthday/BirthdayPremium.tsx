import React, { useState, useEffect } from "react";
import { Crown, Camera, Sparkles, MessageSquare, Send, Heart, Calendar, MapPin, Clock } from "lucide-react";
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

type VIPComment = {
  id: string;
  name: string;
  sticker: string;
  text: string;
  time: string;
};

export default function BirthdayPremium({
  recipientName,
  title,
  message,
  photos = [],
  isEditing = false,
  onUpdate,
}: TemplateProps) {
  const [isOpen, setIsOpen] = useState(isEditing ? true : false);
  const [likes, setLikes] = useState(139);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedSticker, setSelectedSticker] = useState("✨");
  const [comments, setComments] = useState<VIPComment[]>([
    {
      id: "1",
      name: "Gia đình WEMO",
      sticker: "👑",
      text: "Chúc bạn tuổi mới rực rỡ, viên mãn và luôn giữ vững vị thế độc bản của mình!",
      time: "5 phút trước",
    },
    {
      id: "2",
      name: "Mai Vy",
      sticker: "🥂",
      text: "Chúc mừng sinh nhật nha! Tuổi mới luôn xinh đẹp, hạnh phúc và gặt hái thêm nhiều thành công mới!",
      time: "15 phút trước",
    },
  ]);

  // Event Date countdown
  const eventDate = "2027-05-20T19:00:00";
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(eventDate).getTime();
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
    // Burst stars confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D4AF78", "#FCF6BA", "#B38728", "#AA771C"],
    });
  };

  const handlePhotoClick = (index: number) => {
    if (!isEditing || !onUpdate) return;
    const newPhotos = [...photos];
    const pool = [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    ];
    newPhotos[index] = pool[index % pool.length];
    onUpdate({ photos: newPhotos });
  };

  const activePhotos = [
    photos[0] || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    photos[1] || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80",
    photos[2] || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
  ];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newCmt: VIPComment = {
      id: Date.now().toString(),
      name: commentName.trim() || "Khách quý VVIP",
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
    <div className="w-full relative overflow-hidden bg-[#0c0c0c] text-[#F5EDE4] rounded-3xl min-h-[600px] border border-amber-950 font-luxury shadow-2xl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:wght@300;450;700;900&display=swap');
        .font-luxury-serif { font-family: 'Playfair Display', serif; }
        .font-luxury-display { font-family: 'Playfair Display', serif; font-weight: 800; font-style: italic; }
        .font-luxury-body { font-family: 'Lora', serif; }
        
        .gold-border {
          border: 1px solid transparent;
          background: linear-gradient(#0c0c0c, #0c0c0c) padding-box,
                      linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C) border-box;
        }

        .gold-text-gradient {
          background: linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .luxury-card-texture {
          background-color: #111;
          background-image: radial-gradient(circle at 100% 150%, #151515 24%, #111 28%, #111 52%, transparent 52%);
        }
      `}</style>

      {/* Editor State Toggle Controls */}
      {isEditing && (
        <div className="absolute top-3 left-3 z-50 flex gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className={`px-3 py-1 rounded-full text-[9px] font-luxury-serif tracking-widest border transition-all ${
              !isOpen ? "bg-[#B38728] text-black border-[#FCF6BA]" : "bg-black/60 text-stone-300 border-stone-700"
            }`}
          >
            BAO THƯ
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className={`px-3 py-1 rounded-full text-[9px] font-luxury-serif tracking-widest border transition-all ${
              isOpen ? "bg-[#B38728] text-black border-[#FCF6BA]" : "bg-black/60 text-stone-300 border-stone-700"
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
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full min-h-[600px] flex flex-col justify-between p-8 items-center bg-gradient-to-b from-[#14120f] to-[#080706] relative"
          >
            {/* Elegant Background Gold Dust Ornaments */}
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#BF953F_1px,transparent_1px)] [background-size:16px_16px] z-0" />
            <div className="absolute top-20 w-44 h-44 rounded-full bg-[#BF953F]/5 blur-3xl" />

            <div className="z-10 text-center mt-12">
              <span className="text-[10px] font-luxury-serif tracking-[0.3em] gold-text-gradient uppercase block mb-1">
                Royal Invitation
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#BF953F] to-transparent mx-auto my-3" />
              <Crown className="w-8 h-8 mx-auto text-[#D4AF78] animate-pulse mb-4" />
            </div>

            {/* Main Invitation Box Wax Seal */}
            <div className="z-10 text-center my-6 max-w-xs px-4">
              <p className="text-[10px] font-luxury-serif tracking-[0.2em] text-stone-400 uppercase">THƯ MỜI SỰ KIỆN</p>
              <h2 className="text-2xl font-luxury-display tracking-wide mt-2 gold-text-gradient">
                VIP LUXURY PARTY
              </h2>
              
              <div className="mt-8 p-6 rounded-2xl gold-border bg-black/40 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="text-[9px] font-luxury-serif text-stone-400 tracking-widest block uppercase mb-1">DÀNH RIÊNG CHO</span>
                <p className="text-lg font-luxury-serif font-semibold text-white tracking-wide uppercase truncate">
                  {recipientName || "Khách Quý VVIP"}
                </p>
              </div>
            </div>

            {/* Open Button */}
            <div className="z-10 mb-8 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="px-6 py-3 rounded-full text-xs font-luxury-serif font-black tracking-[0.2em] bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] text-black shadow-[0_10px_25px_rgba(191,149,63,0.3)] hover:shadow-[0_12px_30px_rgba(191,149,63,0.5)] transition-all animate-bounce"
              >
                MỞ HỘP QUÀ HOÀNG GIA 🥂
              </motion.button>
              <span className="text-[8px] font-luxury-serif tracking-widest text-stone-500 uppercase block mt-3">
                Chạm vào con dấu để lật mở câu chuyện
              </span>
            </div>
          </motion.div>
        ) : (
          /* ================= NỘI DUNG CHÍNH THIỆP (STORY CONTENT) ================= */
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col justify-start relative px-6 py-10 space-y-12 luxury-card-texture overflow-y-auto max-h-[80vh]"
          >
            {/* Sparkles particle background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#D4AF78_1px,transparent_1px)] [background-size:24px_24px] z-0" />

            {/* TRANG BÌA CẢM XÚC */}
            <section className="text-center z-10 space-y-5">
              <div className="relative inline-block">
                <Crown className="w-10 h-10 mx-auto text-[#D4AF78] mb-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] animate-pulse" />
              </div>
              
              <h1 className="text-2xl font-luxury-display tracking-widest uppercase leading-snug text-white">
                {title || "Tuổi Mới Rực Rỡ"}
              </h1>

              {/* Cover Photo - Gold Frame with Reflection effect */}
              <div className="flex justify-center my-6">
                <div
                  onClick={() => handlePhotoClick(0)}
                  className="relative w-56 aspect-[3/4] p-1.5 gold-border rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] cursor-pointer group bg-black/60 overflow-hidden"
                >
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <img
                      src={activePhotos[0]}
                      alt="Party Host"
                      className="w-full h-full object-cover filter contrast-[1.03] brightness-[0.98] group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Reflection glass effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                    
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="w-7 h-7 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-luxury-serif text-[#D4AF78] tracking-widest uppercase">GIA CHỦ VVIP</p>
                <p className="text-lg font-luxury-serif text-white tracking-widest font-black uppercase mt-1">
                  {recipientName || "Khách Quý VVIP"}
                </p>
              </div>
            </section>

            {/* BỨC THƯ TỪ TÂM KHẢM */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <h3 className="text-xs font-luxury-serif tracking-[0.2em] uppercase text-white">Lời Chúc Tốt Đẹp</h3>
                <div className="w-8 h-[1px] bg-[#D4AF78]/40 mx-auto mt-2" />
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#161412] to-[#0e0d0b] border border-amber-950/60 shadow-xl relative overflow-hidden">
                <div className="absolute top-2 left-2 text-[24px] font-serif text-[#D4AF78]/20 select-none">“</div>
                <div className="absolute bottom-2 right-4 text-[24px] font-serif text-[#D4AF78]/20 select-none">”</div>
                
                {isEditing ? (
                  <textarea
                    value={message}
                    onChange={(e) => onUpdate?.({ message: e.target.value })}
                    className="w-full text-xs font-luxury-body italic text-stone-300 bg-transparent border border-dashed border-amber-900/60 p-3 rounded-xl focus:outline-none h-24 resize-none leading-relaxed"
                    placeholder="Điền lời chúc gửi gia chủ..."
                  />
                ) : (
                  <p className="text-sm font-luxury-body italic leading-loose text-[#F5EDE4] text-center whitespace-pre-line px-2">
                    {message || "Chúc bạn tuổi mới vạn sự hanh thông, luôn giữ vững ngọn lửa đam mê và gặt hái thêm nhiều thành tựu rực rỡ trên hành trình phía trước."}
                  </p>
                )}
              </div>
            </section>

            {/* NHỮNG THƯỚC PHIM KỶ NIỆM */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <h3 className="text-xs font-luxury-serif tracking-[0.2em] uppercase text-white">Thước Phim Thời Gian</h3>
                <div className="w-8 h-[1px] bg-[#D4AF78]/40 mx-auto mt-2" />
              </div>

              {/* Stacked polaroids gallery */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => handlePhotoClick(1)}
                  className="p-2 bg-gradient-to-b from-[#1a1815] to-[#12110f] border border-stone-800 rounded-xl shadow-lg relative group cursor-pointer"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-stone-900 border border-stone-850">
                    <img src={activePhotos[1]} alt="Moments 1" className="w-full h-full object-cover filter contrast-[1.02]" />
                  </div>
                  <div className="py-2 text-[8px] font-luxury-serif text-stone-400 tracking-wider text-center uppercase">Khoảnh khắc 01</div>
                  {isEditing && (
                    <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div
                  onClick={() => handlePhotoClick(2)}
                  className="p-2 bg-gradient-to-b from-[#1a1815] to-[#12110f] border border-stone-800 rounded-xl shadow-lg relative group cursor-pointer"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-stone-900 border border-stone-850">
                    <img src={activePhotos[2]} alt="Moments 2" className="w-full h-full object-cover filter contrast-[1.02]" />
                  </div>
                  <div className="py-2 text-[8px] font-luxury-serif text-stone-400 tracking-wider text-center uppercase">Khoảnh khắc 02</div>
                  {isEditing && (
                    <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* THỜI GIAN & KHÔNG GIAN HẸN ƯỚC */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <h3 className="text-xs font-luxury-serif tracking-[0.2em] uppercase text-white">Đại Tiệc Hoàng Gia</h3>
                <div className="w-8 h-[1px] bg-[#D4AF78]/40 mx-auto mt-2" />
              </div>

              {/* Event Details Box */}
              <div className="gold-border rounded-2xl bg-black/70 p-5 space-y-5 text-left relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF78]/10 flex items-center justify-center border border-[#D4AF78]/30">
                    <Calendar className="w-4 h-4 text-[#D4AF78]" />
                  </div>
                  <div>
                    <span className="text-[8px] font-luxury-serif text-stone-400 block tracking-widest uppercase">THỜI GIAN</span>
                    <span className="text-[11px] font-luxury-serif text-white font-bold">19:00 - NGÀY 20 THÁNG 05 NĂM 2027</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF78]/10 flex items-center justify-center border border-[#D4AF78]/30">
                    <MapPin className="w-4 h-4 text-[#D4AF78]" />
                  </div>
                  <div>
                    <span className="text-[8px] font-luxury-serif text-stone-400 block tracking-widest uppercase">ĐỊA ĐIỂM</span>
                    <span className="text-[11px] font-luxury-serif text-white font-bold block">TẦNG 9, TOÀ A, KHÁCH SẠN CINELOVE</span>
                    <span className="text-[9px] text-stone-400 font-luxury-serif italic">Sảnh Orchid Premium</span>
                  </div>
                </div>

                {/* Countdown display */}
                <div className="pt-3 border-t border-[#D4AF78]/20">
                  <span className="text-[8px] font-luxury-serif text-stone-400 block tracking-widest uppercase text-center mb-3">ĐẾM NGƯỢC GIỜ G</span>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-[#14120f]/60 p-2 rounded-xl border border-stone-850">
                      <span className="text-base font-bold text-white block">{timeLeft.days}</span>
                      <span className="text-[7px] text-stone-500 font-luxury-serif uppercase tracking-widest block">Ngày</span>
                    </div>
                    <div className="bg-[#14120f]/60 p-2 rounded-xl border border-stone-850">
                      <span className="text-base font-bold text-white block">{timeLeft.hours}</span>
                      <span className="text-[7px] text-stone-500 font-luxury-serif uppercase tracking-widest block">Giờ</span>
                    </div>
                    <div className="bg-[#14120f]/60 p-2 rounded-xl border border-stone-850">
                      <span className="text-base font-bold text-white block">{timeLeft.minutes}</span>
                      <span className="text-[7px] text-stone-500 font-luxury-serif uppercase tracking-widest block">Phút</span>
                    </div>
                    <div className="bg-[#14120f]/60 p-2 rounded-xl border border-stone-850">
                      <span className="text-base font-bold text-white block">{timeLeft.seconds}</span>
                      <span className="text-[7px] text-stone-500 font-luxury-serif uppercase tracking-widest block">Giây</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* SỔ VÀNG LỜI CHÚC (GUESTBOOK) */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <h3 className="text-xs font-luxury-serif tracking-[0.2em] uppercase text-white">Sổ Vàng Lời Chúc VIP</h3>
                <div className="w-8 h-[1px] bg-[#D4AF78]/40 mx-auto mt-2" />
              </div>

              {/* Form Input */}
              <form onSubmit={handleAddComment} className="space-y-3 bg-[#111] p-4 rounded-2xl border border-stone-800 text-left">
                <div>
                  <label className="block text-[8px] font-luxury-serif text-[#D4AF78] tracking-widest uppercase mb-1">DANH TÍNH KHÁCH VVIP</label>
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Nhập tên của bạn..."
                    className="w-full px-3 py-2 bg-black border border-stone-850 rounded-xl outline-none text-xs text-white placeholder-stone-600 focus:border-[#D4AF78]/50"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-luxury-serif text-[#D4AF78] tracking-widest uppercase mb-1">CHỌN BIỂU TƯỢNG CẢM XÚC</label>
                  <div className="flex gap-2.5">
                    {["✨", "🎂", "🎉", "🥂", "💖"].map((stk) => (
                      <button
                        key={stk}
                        type="button"
                        onClick={() => setSelectedSticker(stk)}
                        className={`w-8 h-8 rounded-full border text-xs flex items-center justify-center transition-colors ${
                          selectedSticker === stk ? "bg-[#D4AF78] border-[#FCF6BA] text-black" : "bg-black border-stone-850 text-[#F5EDE4] hover:bg-stone-900"
                        }`}
                      >
                        {stk}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-luxury-serif text-[#D4AF78] tracking-widest uppercase mb-1">LỜI CHÚC MỪNG</label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Viết lời chúc gửi đến gia chủ..."
                    rows={2}
                    className="w-full px-3 py-2 bg-black border border-stone-850 rounded-xl outline-none text-xs text-white placeholder-stone-600 focus:border-[#D4AF78]/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-900 hover:to-black text-white text-[10px] font-luxury-serif tracking-widest font-bold border border-stone-750 flex items-center justify-center gap-1.5 disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-3 h-3" />
                  KÝ SỔ VÀNG
                </button>
              </form>

              {/* Messages list */}
              <div className="space-y-3 mt-4 text-left max-h-[220px] overflow-y-auto pr-1">
                {comments.map((cmt) => (
                  <div key={cmt.id} className="p-3 bg-black/40 rounded-xl border border-stone-850/60 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF78]/10 border border-[#D4AF78]/20 flex items-center justify-center text-sm shrink-0">
                      {cmt.sticker}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-luxury-serif font-black text-[#D4AF78] uppercase truncate">{cmt.name}</span>
                        <span className="text-[7px] text-stone-500 font-mono shrink-0">{cmt.time}</span>
                      </div>
                      <p className="text-[10px] text-stone-300 leading-relaxed font-sans">{cmt.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CARD BOTTOM ACTION (INTERACTIVE LOVE LIKES) */}
            <footer className="border-t border-[#D4AF78]/20 pt-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-luxury-serif text-[#D4AF78] tracking-widest">LƯỢT YÊU THÍCH:</span>
                <span className="text-xs font-mono font-bold text-stone-300">{likes}</span>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  hasLiked ? "bg-[#D4AF78] border-[#FCF6BA] text-black" : "bg-black/60 border border-stone-800 text-[#D4AF78] hover:bg-stone-900"
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? "fill-black" : ""}`} />
              </motion.button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
