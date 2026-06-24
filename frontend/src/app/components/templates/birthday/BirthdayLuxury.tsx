import React, { useState, useEffect } from "react";
import { Crown, Camera, Sparkles, MessageSquare, Send, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  title: string;
  text: string;
  time: string;
};

type Bubble = {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
};

export default function BirthdayLuxury({
  recipientName,
  title,
  message,
  photos = [],
  isEditing = false,
  onUpdate,
}: TemplateProps) {
  const [likes, setLikes] = useState(88);
  const [hasLiked, setHasLiked] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [showGoldDust, setShowGoldDust] = useState(true);
  
  // Custom user comment state
  const [vipComments, setVipComments] = useState<VIPComment[]>([
    {
      id: "1",
      name: "Chủ tịch HĐQT",
      title: "👑 VVIP",
      text: "Chúc tuổi mới vạn sự hanh thông, kiến tạo những thành tựu vượt bậc và luôn tỏa sáng vị thế độc bản!",
      time: "Vừa xong",
    },
    {
      id: "2",
      name: "Gia đình WEMO",
      title: "✨ VIP",
      text: "Chúc bạn tuổi mới ngập tràn niềm vui, viên mãn trong cuộc sống và luôn giữ vững ngọn lửa đam mê.",
      time: "5 phút trước",
    },
  ]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handlePhotoClick = () => {
    if (!isEditing || !onUpdate) return;
    onUpdate({
      photos: [
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80", // Premium suit luxury portrait
      ],
    });
  };

  const samplePhoto =
    photos[0] ||
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80";

  // Trigger Champagne bubble float animation
  const handleToastChampagne = () => {
    const newBubbles = Array.from({ length: 45 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: Math.random() * 100, // percentage across container
      size: Math.random() * 8 + 4, // 4px to 12px
      delay: Math.random() * 0.8,
      duration: Math.random() * 2 + 1.5, // 1.5s to 3.5s
    }));
    setBubbles(newBubbles);

    // Clean up after animation finished
    setTimeout(() => {
      setBubbles([]);
    }, 4500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    
    const newCmt: VIPComment = {
      id: Date.now().toString(),
      name: newCommentName.trim() || "Khách Quý VVIP",
      title: "👑 KHÁCH VIP",
      text: newCommentText.trim(),
      time: "Vừa xong",
    };
    
    setVipComments([newCmt, ...vipComments]);
    setNewCommentName("");
    setNewCommentText("");
    setShowCommentForm(false);
  };

  return (
    <div className="w-full select-none relative overflow-hidden">
      {/* Styles injecting premium serif & luxury font styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@200;400;500;600&display=swap');
        
        .font-luxury-display { font-family: 'Cinzel Decorative', serif; }
        .font-luxury-serif { font-family: 'Cinzel', serif; }
        .font-luxury-body { font-family: 'Cormorant Garamond', serif; }
        .font-luxury-sans { font-family: 'Montserrat', sans-serif; }

        /* Metallic gold foil border effect */
        .gold-metallic-border {
          position: relative;
          border: 2px solid transparent;
          background: linear-gradient(#111, #080808) padding-box,
                      linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C) border-box;
        }

        /* Glowing text effect */
        .gold-glow-text {
          color: #FCF6BA;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.2);
        }

        /* Premium scrollbar for VIP Comments */
        .luxury-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .luxury-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .luxury-scrollbar::-webkit-scrollbar-thumb {
          background: #B38728;
          border-radius: 9px;
        }

        /* Shimmer reflection animation for frame */
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .shine-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.13) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: shine 6s infinite ease-in-out;
        }
      `}</style>

      <div className="w-full bg-[#0c0c0c] rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
        
        {/* Animated Background Gold Dust */}
        {showGoldDust && (
          <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen z-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#glow)" className="animate-pulse" />
            </svg>
          </div>
        )}

        {/* Champagne Bubbles Layer */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <AnimatePresence>
            {bubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                initial={{ y: "105vh", x: `${bubble.x}%`, opacity: 0, scale: 0.5 }}
                animate={{
                  y: "-10vh",
                  opacity: [0, 0.8, 0.8, 0],
                  scale: [0.5, 1, 1.2, 0.8],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: bubble.duration,
                  delay: bubble.delay,
                  ease: "easeOut",
                }}
                className="absolute rounded-full bg-gradient-to-tr from-[#BF953F] to-[#FCF6BA] shadow-[0_0_8px_rgba(252,246,186,0.6)]"
                style={{
                  width: bubble.size,
                  height: bubble.size,
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Main luxury board */}
        <div className="mx-4 mt-8 mb-4 gold-metallic-border shine-effect rounded-[32px] p-6 pb-8 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-[#131313] via-[#0d0d0d] to-[#080808] shadow-[0_15px_40px_rgba(0,0,0,0.8)] z-10">
          
          {/* Ornate corner brackets for classic luxury look */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#BF953F]/40" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#BF953F]/40" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#BF953F]/40" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#BF953F]/40" />

          {/* Header Crown */}
          <div className="text-center pt-2 flex flex-col items-center">
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="mb-2 relative"
            >
              <Crown className="w-8 h-8 text-[#BF953F] drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]" />
              <Sparkles className="w-4 h-4 text-[#FCF6BA] absolute -top-1 -right-2 animate-ping" />
            </motion.div>
            
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => onUpdate?.({ title: e.target.value })}
                className="w-full text-center text-xs tracking-[0.3em] font-luxury-serif text-[#FCF6BA] bg-black/40 border border-dashed border-[#BF953F]/50 rounded py-1 px-2 uppercase focus:outline-none focus:border-[#FCF6BA]"
                placeholder="MỪNG SINH NHẬT HOÀNG GIA"
              />
            ) : (
              <h2 className="text-[13px] tracking-[0.25em] font-luxury-serif text-[#FCF6BA] uppercase gold-glow-text">
                {title || "MỪNG SINH NHẬT HOÀNG GIA"}
              </h2>
            )}
            <div className="flex items-center gap-1.5 mt-2.5 w-full justify-center">
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#BF953F]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#BF953F]" />
              <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#BF953F]" />
            </div>
          </div>

          {/* Premium Portrait Photo Frame */}
          <div className="my-5 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.03, rotate: 0.5 }}
              onClick={handlePhotoClick}
              className="p-1.5 bg-[#121212] rounded-2xl border border-[#BF953F]/60 shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative group cursor-pointer w-48 aspect-[3/4] overflow-hidden flex flex-col"
            >
              {/* Gold rim inside */}
              <div className="absolute inset-2 border border-[#BF953F]/20 rounded-xl pointer-events-none z-10" />
              <div className="flex-1 w-full rounded-xl overflow-hidden bg-black relative">
                <img
                  src={samplePhoto}
                  alt="VIP Portrait"
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </div>
              {isEditing && (
                <div className="absolute inset-1.5 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-xl transition-opacity z-20 gap-1.5">
                  <Camera className="w-6 h-6 text-[#FCF6BA] animate-bounce" />
                  <span className="text-[9px] text-[#FCF6BA] font-luxury-sans tracking-widest uppercase">
                    Tải Ảnh VIP
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Message & Recipient Box */}
          <div className="text-center px-2 flex-1 flex flex-col justify-center gap-4">
            
            {/* Elegant Quotation block */}
            <div className="relative py-1">
              <span className="absolute -top-4 left-0 font-serif text-3xl text-[#BF953F]/30 select-none">“</span>
              {isEditing ? (
                <textarea
                  value={message}
                  onChange={(e) => onUpdate?.({ message: e.target.value })}
                  className="w-full text-xs font-luxury-body text-stone-200 text-center bg-black/40 border border-dashed border-[#BF953F]/40 rounded-xl p-3 h-20 resize-none focus:outline-none focus:border-[#FCF6BA] leading-relaxed italic"
                  placeholder="Lời chúc hoàng gia tôn nghiêm..."
                />
              ) : (
                <p className="text-[14px] font-luxury-body text-stone-200 leading-relaxed italic tracking-wide px-3">
                  {message ||
                    "Kính chúc quý anh/chị tuổi mới bừng sáng hào quang, đón nhận vạn sự như ý và vững bước trên đài vinh quang đỉnh cao."}
                </p>
              )}
              <span className="absolute -bottom-6 right-0 font-serif text-3xl text-[#BF953F]/30 select-none">”</span>
            </div>

            {/* Recipient Ribbon Card */}
            <div className="mt-4 flex flex-col items-center justify-center">
              <span className="text-[8px] font-luxury-sans font-bold tracking-[0.3em] text-[#BF953F] uppercase mb-1">
                Kính gửi khách quý
              </span>
              
              {isEditing ? (
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => onUpdate?.({ recipientName: e.target.value })}
                  className="text-center text-xs font-luxury-serif font-bold text-[#FCF6BA] tracking-widest bg-black/40 uppercase focus:outline-none border-b border-dashed border-[#BF953F] w-44 py-1"
                  placeholder="TÊN KHÁCH VVIP..."
                />
              ) : (
                <div className="relative px-6 py-1.5 border border-[#BF953F]/30 bg-[#121212]/80 rounded-md shadow-sm">
                  <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-[#BF953F]" />
                  <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-[#BF953F]" />
                  <p className="text-[13px] font-luxury-serif font-extrabold text-[#FCF6BA] tracking-widest uppercase">
                    {recipientName || "Khách Quý VVIP"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* VIP Comments & Social Interaction Panel */}
        <section className="px-4 pb-6 space-y-4 font-luxury-sans z-10">
          
          {/* Dynamic VIP Comments Board */}
          <div className="bg-[#121212]/85 border border-[#BF953F]/20 rounded-2xl p-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#BF953F]/10 pb-2 mb-2">
              <span className="text-[9px] font-bold text-[#FCF6BA] tracking-wider uppercase flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#BF953F]" /> Sổ Vàng Lời Chúc VIP
              </span>
              <button 
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="text-[9px] text-[#BF953F] hover:text-[#FCF6BA] font-bold tracking-wide transition-colors"
              >
                {showCommentForm ? "Đóng" : "+ Gửi Lời Chúc"}
              </button>
            </div>

            <AnimatePresence mode="popLayout">
              {showCommentForm && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddComment}
                  className="space-y-2 mb-3 bg-black/50 p-2.5 rounded-lg border border-[#BF953F]/10 overflow-hidden"
                >
                  <input
                    type="text"
                    required
                    placeholder="Danh xưng (VD: Đối tác VIP, Bạn thân...)"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full text-[10px] bg-[#1a1a1a] border border-[#BF953F]/30 rounded px-2 py-1 text-stone-200 focus:outline-none focus:border-[#FCF6BA]"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Nhập lời chúc tốt đẹp nhất..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="w-full text-[10px] bg-[#1a1a1a] border border-[#BF953F]/30 rounded px-2 py-1.5 pr-8 text-stone-200 focus:outline-none focus:border-[#FCF6BA]"
                    />
                    <button 
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#BF953F] hover:text-[#FCF6BA] transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Comments list container */}
            <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1 luxury-scrollbar">
              {vipComments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="bg-black/35 rounded-xl px-3 py-2 text-[10px] border border-stone-900 flex flex-col gap-0.5 hover:border-[#BF953F]/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#FCF6BA] flex items-center gap-1">
                      {cmt.name}
                      <span className="text-[7px] text-[#BF953F] bg-[#BF953F]/10 px-1 py-0.2 rounded border border-[#BF953F]/20 uppercase">
                        {cmt.title}
                      </span>
                    </span>
                    <span className="text-[7.5px] text-stone-500 font-medium">{cmt.time}</span>
                  </div>
                  <p className="text-stone-300 leading-normal italic pl-1">
                    "{cmt.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Hub - Toast & Cheers Buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            
            {/* Interactive toast launcher */}
            <button
              onClick={handleToastChampagne}
              className="flex-1 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] text-[#3a2806] font-bold text-[10px] tracking-widest uppercase py-2.5 px-3 rounded-full shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-[#FCF6BA]/40 cursor-pointer"
            >
              🥂 Khai Tiệc Champagne
            </button>

            {/* Elegant Likes counter */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setLikes(hasLiked ? likes - 1 : likes + 1);
                  setHasLiked(!hasLiked);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border shadow-md active:scale-90 ${
                  hasLiked
                    ? "bg-[#BF953F] border-[#FCF6BA] text-black"
                    : "bg-black/60 backdrop-blur-xl border-[#BF953F]/30 text-[#FCF6BA] hover:bg-black/80"
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
              </button>
              <span className="text-[10px] font-bold text-[#FCF6BA] font-mono tracking-wider w-5 text-left">
                {likes}
              </span>
            </div>
          </div>

          {/* Brand footer details */}
          <div className="text-center text-[7.5px] text-stone-500 font-bold tracking-[0.25em] uppercase pt-1">
            ⚜️ THIẾT KẾ HOÀNG GIA WEMO PRESTIGE ⚜️
          </div>
        </section>
      </div>
    </div>
  );
}
