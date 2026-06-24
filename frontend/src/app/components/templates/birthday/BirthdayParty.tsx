import React, { useState, useEffect } from "react";
import {
  Camera,
  Heart,
  ThumbsUp,
  Gift,
  MessageSquare,
  Play,
  Pause,
} from "lucide-react";

type PinkRibbonTemplateProps = {
  recipientName: string;
  title: string;
  message: string;
  photos: string[];
  eventDate?: string;
  locationName?: string;
  isEditing?: boolean;
  onUpdate?: (fields: {
    title?: string;
    recipientName?: string;
    message?: string;
    photos?: string[];
    eventDate?: string;
    locationName?: string;
  }) => void;
};

export default function BirthdayPinkRibbon({
  recipientName = "MỸ LINH",
  title = "THƯ MỜI SINH NHẬT TUỔI 16",
  message = "Thời gian trôi thật nhanh!\nChớp mắt một cái là mình đã sắp bước sang tuổi 16 rồi.\nĐây thực sự là một khoảnh khắc rất đặc biệt\nMình mong có thể cùng người thân yêu nhất là bạn chia sẻ niềm vui này.",
  photos = [],
  eventDate = "2050.05.20 12:00",
  locationName = "Tầng 9, Toà A, Khách sạn CineLove",
  isEditing = false,
  onUpdate,
}: PinkRibbonTemplateProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(16);
  const [hasLiked, setHasLiked] = useState(false);

  const handlePhotoClick = () => {
    if (!isEditing || !onUpdate) return;
    onUpdate({
      photos: [
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
      ],
    });
  };

  const samplePhoto =
    photos[0] ||
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80";

  const sampleComments = [
    {
      name: "Việt Anh",
      text: "🎁 Chúc mừng sinh nhật! Chúc bạn luôn mạnh khỏe và hạnh phúc!",
    },
    { name: "Nam", text: "✨ Chúc mừng ngày đặc biệt của bạn!" },
    {
      name: "Thảo",
      text: "🎈 Sinh nhật vui vẻ, tuổi mới thành công rực rỡ nhé cô bé!",
    },
    {
      name: "Khánh Linh",
      text: "💖 Xinh xỉu luôn á! Sẽ tới quẩy hết mình nha!",
    },
  ];

  return (
    <div className="w-full select-none">
      {/* Khối nhúng tài nguyên và hiệu ứng nâng cao */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&family=Cinzel:wght@500;700&family=Montserrat:wght@400;500;600&display=swap');
        
        .font-premium-title { font-family: 'Comfortaa', cursive; }
        .font-premium-serif { font-family: 'Cinzel', serif; }
        .font-premium-sans { font-family: 'Montserrat', sans-serif; }

        /* Kỹ thuật giả lập vân giấy mỹ thuật đắt tiền chìm dưới nền hồng */
        .premium-matte-bg {
          background-color: #f7a7b9;
          background-image: 
            radial-gradient(circle at 50% 50%, transparent 0%, rgba(214, 90, 127, 0.15) 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
        }

        /* Vân giấy trắng cao cấp nội dung */
        .premium-card-texture {
          background-color: #ffffff;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M0 0h30v30H0z' fill='%23fdfafb' fill-opacity='0.4'/%3E%3Cpath d='M30 30h30v30H30z' fill='%23fdfafb' fill-opacity='0.4'/%3E%3C/svg%3E");
        }

        /* Thanh cuộn tàng hình nâng cao */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* THIẾP MỜ NỔI (MAIN CARD LAYER) */}
      <div className="w-full premium-matte-bg overflow-hidden rounded-3xl shadow-2xl relative no-scrollbar flex flex-col justify-between">
        {/* THANH ĐĨA NHẠC GLASSMORPHISM GÓC TRÊN TRÁI */}
        <div className="absolute top-6 left-6 z-30">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 bg-white/20 backdrop-blur-xl rounded-full border border-white/40 shadow-md flex items-center justify-center text-white transition-all active:scale-90"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 animate-pulse" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>

        {/* LOGO TRÒN "C" TRANG TRÍ GÓC PHẢI CHUẨN APP */}
        <div className="absolute top-6 right-6 z-30">
          <div className="w-7 h-7 bg-gradient-to-tr from-[#e25c80] to-[#ff7e9d] rounded-full shadow-md flex items-center justify-center border border-white/30">
            <span className="text-[10px] font-bold text-white font-premium-serif">
              C
            </span>
          </div>
        </div>

        {/* THIẾP MỜ NỔI (MAIN CARD LAYER) */}
        <div className="mx-4 mt-20 mb-4 premium-card-texture rounded-[36px] shadow-[0_15px_40px_-10px_rgba(136,44,69,0.3)] relative pb-8 pt-24 border border-pink-100/40">
          {/* HỌA TIẾT ĐỤC LỖ TAY REN CHẠY DỌC HAI BIÊN CARD */}
          <div className="absolute inset-y-8 left-3 w-2 flex flex-col justify-between opacity-30 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#d65a7f]" />
            ))}
          </div>
          <div className="absolute inset-y-8 right-3 w-2 flex flex-col justify-between opacity-30 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#d65a7f]" />
            ))}
          </div>

          {/* CỤM RUY BĂNG LỤA 3D TREO KHUNG HÌNH (SVG GRADIENT) */}
          <div className="absolute top-0 left-0 right-0 flex flex-col items-center -mt-12 z-20">
            <svg
              className="w-48 h-36 drop-shadow-[0_10px_12px_rgba(180,50,85,0.25)]"
              viewBox="0 0 160 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="ribbonDark"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#d6496e" />
                  <stop offset="100%" stopColor="#b03255" />
                </linearGradient>
                <linearGradient
                  id="ribbonLight"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ff9cb4" />
                  <stop offset="50%" stopColor="#f47293" />
                  <stop offset="100%" stopColor="#e25c80" />
                </linearGradient>
              </defs>
              {/* Đuôi ruy băng lụa rủ phía sau */}
              <path
                d="M54 48 C42 80 38 116 50 114 C60 112 66 76 62 48 Z"
                fill="url(#ribbonDark)"
              />
              <path
                d="M106 48 C118 80 122 116 110 114 C100 112 94 76 98 48 Z"
                fill="url(#ribbonDark)"
              />
              {/* Cánh nơ trái bồng bềnh */}
              <path
                d="M78 44 C45 8 10 10 14 38 C18 66 58 56 76 46 Z"
                fill="url(#ribbonLight)"
              />
              <path
                d="M70 42 C50 20 28 22 30 38"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.4"
              />
              {/* Cánh nơ phải bồng bềnh */}
              <path
                d="M82 44 C115 8 150 10 146 38 C142 66 102 56 84 46 Z"
                fill="url(#ribbonLight)"
              />
              <path
                d="M90 42 C110 20 132 22 130 38"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.4"
              />
              {/* Nút thắt tâm điểm */}
              <rect
                x="71"
                y="35"
                width="18"
                height="18"
                rx="6"
                fill="#ca3b5f"
              />
            </svg>
          </div>

          {/* AVATAR KHUNG TRÒN ĐỔ BÓNG NỔI KHỐI */}
          <div className="flex justify-center relative z-10">
            <div
              className="w-44 h-44 rounded-full border-[6px] border-white shadow-[0_10px_30px_rgba(214,90,127,0.3)] overflow-hidden relative group cursor-pointer bg-stone-100 transition-transform duration-500 hover:scale-105"
              onClick={handlePhotoClick}
            >
              <img
                src={samplePhoto}
                alt="Mei Profile"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* TIÊU ĐỀ THIỆP CHỮ SẮC NÉT KHÔNG VỠ */}
          <div className="mt-8 px-8 text-center">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => onUpdate?.({ title: e.target.value })}
                className="w-full text-center font-pink-sans font-bold text-[#e25c80] bg-pink-50/60 border border-dashed border-[#ff9cb4] rounded-xl py-1.5 px-3 focus:outline-none text-xs tracking-wider"
              />
            ) : (
              <h2 className="text-[14px] font-bold tracking-[0.18em] text-[#e25c80] font-premium-title uppercase leading-relaxed max-w-[90%] mx-auto">
                {title}
              </h2>
            )}
          </div>

          {/* ICON NƠ TRANG TRÍ PHÂN CÁCH TRUNG TÂM */}
          <div className="flex justify-center my-4 opacity-90">
            <svg
              className="w-9 h-7 text-[#fcaec1]"
              viewBox="0 0 40 30"
              fill="currentColor"
            >
              <path d="M16 12C8 3 2 11 4 18C7 24 14 17 16 15Z" />
              <path d="M24 12C32 3 38 11 36 18C33 24 26 17 24 15Z" />
              <circle cx="20" cy="15" r="4" fill="#e25c80" />
            </svg>
          </div>

          {/* LỜI MỜI KHÔNG GIAN DÒNG RỘNG RÃI */}
          <div className="px-9 text-center font-premium-sans">
            {isEditing ? (
              <textarea
                value={message}
                onChange={(e) => onUpdate?.({ message: e.target.value })}
                className="w-full h-28 text-center text-xs text-[#b03255] bg-pink-50/60 border border-dashed border-[#ff9cb4] rounded-2xl p-3 focus:outline-none resize-none leading-relaxed"
              />
            ) : (
              <p className="text-[11.5px] text-[#bc4363] font-medium leading-loose whitespace-pre-line tracking-wide">
                {message}
              </p>
            )}
          </div>

          {/* KHỐI LỊCH THỜI GIAN & ĐỊA ĐIỂM SANG TRỌNG */}
          <div className="mt-8 mx-8 pt-6 border-t border-dashed border-pink-200 text-center space-y-1.5">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => onUpdate?.({ eventDate: e.target.value })}
                  className="w-full text-center font-premium-serif text-2xl text-[#e25c80] bg-pink-50/60 border border-dashed border-[#ff9cb4] rounded-xl focus:outline-none py-1"
                />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => onUpdate?.({ locationName: e.target.value })}
                  className="w-full text-center text-xs text-stone-500 bg-pink-50/60 border border-dashed border-[#ff9cb4] rounded-xl focus:outline-none py-1"
                />
              </div>
            ) : (
              <>
                <div className="font-premium-serif text-[28px] tracking-widest text-[#e25c80] font-medium">
                  {eventDate}
                </div>
                <div className="font-premium-sans text-[11px] font-semibold text-stone-400 tracking-wider uppercase">
                  {locationName}
                </div>
              </>
            )}
          </div>
        </div>

        {/* PHẦN DƯỚI: KHÔNG GIAN BÌNH LUẬN GLASSMORPHISM SIÊU ĐẸP */}
        <section className="px-4 pb-6 space-y-4 font-premium-sans">
          {/* CÁC BONG BÓNG LỜI CHÚC TRỰC QUAN */}
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
            {sampleComments.map((cmt, idx) => (
              <div
                key={idx}
                className="bg-white/15 backdrop-blur-xl text-white rounded-2xl px-4 py-2.5 text-[11px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] w-fit max-w-[92%] border border-white/10"
              >
                <span className="font-semibold text-pink-200 mr-2">
                  {cmt.name}
                </span>
                <span className="opacity-95 leading-normal tracking-wide">
                  {cmt.text}
                </span>
              </div>
            ))}
          </div>

          {/* FOOTER TOOLBAR CHỨC NĂNG */}
          <div className="pt-1 flex items-center justify-between gap-2.5">
            {/* INPUT GIẢ LẬP NHẬP LIỆU */}
            <div className="flex-1 bg-black/15 backdrop-blur-xl rounded-full px-4 py-2.5 flex items-center justify-between border border-white/10 shadow-inner group cursor-pointer hover:bg-black/20 transition-colors">
              <span className="text-[11px] text-white/70 font-medium tracking-wide">
                Để lại lời chúc của bạn...
              </span>
              <MessageSquare className="w-3.5 h-3.5 text-white/60" />
            </div>

            {/* BỘ NÚT CHỨC NĂNG CÓ HIỆU ỨNG TƯƠNG TÁC */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setLikes(hasLiked ? likes - 1 : likes + 1);
                  setHasLiked(!hasLiked);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border shadow-md active:scale-90 ${
                  hasLiked
                    ? "bg-red-500 border-red-400 text-white"
                    : "bg-white/15 backdrop-blur-xl border-white/20 text-white hover:bg-white/25"
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? "fill-white" : ""}`} />
              </button>

              <button className="w-9 h-9 bg-white/15 backdrop-blur-xl hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-all border border-white/20 shadow-md active:scale-90">
                <Gift className="w-4 h-4" />
              </button>

              <button className="w-9 h-9 bg-white/15 backdrop-blur-xl hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-all border border-white/20 shadow-md active:scale-90">
                <ThumbsUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* COPYRIGHT TINH TẾ CHUẨN THƯƠNG HIỆU */}
          <div className="text-center text-[9px] text-white/30 font-semibold tracking-[0.2em] uppercase pt-1">
            ✨ Thiết kế bởi CineLove Premium ✨
          </div>
        </section>
      </div>
    </div>
  );
}
