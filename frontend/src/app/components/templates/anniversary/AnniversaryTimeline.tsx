import { Camera, Calendar, Sparkles, Send, Clock, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useRef } from "react";

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

type TimelineComment = {
  id: string;
  name: string;
  sticker: string;
  text: string;
  time: string;
};

function AudioPlayerWidget({ src }: { src: string }) {
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
    <div className="p-4 rounded-2xl bg-white/40 border border-amber-900/10 backdrop-blur-md flex items-center gap-4 text-left mt-3">
      <button
        type="button"
        onClick={toggle}
        className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform"
      >
        {playing ? <Pause className="w-4 h-4 text-white fill-white" /> : <Play className="w-4 h-4 text-white fill-white ml-0.5" />}
      </button>
      <div className="flex-1">
        <p className="text-[9px] font-sans font-bold tracking-widest text-stone-500 uppercase">Lời nhắn âm thanh</p>
        <p className="text-[11px] text-stone-950 font-bold truncate">Bấm để phát ghi âm chúc mừng</p>
      </div>
      {playing && (
        <div className="flex items-center gap-0.5 h-3">
          <div className="w-[2px] bg-stone-850 h-full animate-bounce" style={{ animationDelay: "0.1s" }} />
          <div className="w-[2px] bg-stone-850 h-2/3 animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="w-[2px] bg-stone-850 h-full animate-bounce" style={{ animationDelay: "0.3s" }} />
        </div>
      )}
    </div>
  );
}

function VideoPlayerWidget({ src }: { src: string }) {
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
    <div className="rounded-2xl overflow-hidden border border-amber-900/10 bg-black/5 aspect-video w-full relative shadow-md mt-3">
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

export default function AnniversaryTimeline({
  recipientName,
  title,
  message,
  photos = [],
  isEditing = false,
  onUpdate,
  gift,
}: TemplateProps & { gift?: any }) {
  const [isOpen, setIsOpen] = useState(isEditing ? true : false);
  const [likes, setLikes] = useState(77);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedSticker, setSelectedSticker] = useState("⏳");
  const [comments, setComments] = useState<TimelineComment[]>([
    {
      id: "1",
      name: "Đồng nghiệp",
      sticker: "📸",
      text: "Nhìn hành trình kỉ niệm của hai người thật đáng ngưỡng mộ! Mãi hạnh phúc nhé!",
      time: "2 giờ trước",
    },
    {
      id: "2",
      name: "Tùng Lâm",
      sticker: "🌿",
      text: "Chúc mừng ngày kỉ niệm! Thêm nhiều dấu mốc rực rỡ nữa nha!",
      time: "1 ngày trước",
    },
  ]);

  // Target event date (e.g. Next anniversary milestone)
  const targetDate = "2027-05-20T12:00:00";
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
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#8B7355", "#FAF7F4", "#D4C4A8", "#EFE9DF"],
    });
  };

  const handlePhotoClick = (index: number) => {
    if (!isEditing || !onUpdate) return;
    const newPhotos = [...photos];
    const pool = [
      "https://images.unsplash.com/photo-1523521803700-b3bcaeab0150?w=600&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80",
    ];
    newPhotos[index] = pool[index % pool.length];
    onUpdate({ photos: newPhotos });
  };

  const activePhotos = [
    photos[0] || "https://images.unsplash.com/photo-1523521803700-b3bcaeab0150?w=600&q=80",
    photos[1] || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    photos[2] || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80",
  ];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newCmt: TimelineComment = {
      id: Date.now().toString(),
      name: commentName.trim() || "Kẻ lữ hành",
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

  const milestones = [
    {
      title: "Khoảnh khắc đầu tiên",
      date: "Ngày gặp gỡ",
      desc: "Trái tim lần đầu loạn nhịp khi nhìn thấy nụ cười ấy dưới nắng thu.",
      img: activePhotos[0],
    },
    {
      title: "Lời ngỏ yêu thương",
      date: "Ngày ngỏ lời",
      desc: "Cái gật đầu dịu dàng mở ra một chương hạnh phúc ngập tràn tiếng cười.",
      img: activePhotos[1],
    },
    {
      title: "Hành trình vô hạn",
      date: "Hiện tại & Tương lai",
      desc: "Tay trong tay cùng nhau bước tiếp đi qua mọi giông bão cuộc đời.",
      img: activePhotos[2],
    },
  ];

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#FAF7F4] to-[#EFE9DF] text-[#7C5E43] rounded-3xl min-h-[600px] border-2 border-[#D4C4A8] font-sans shadow-2xl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .font-retro-typewriter { font-family: 'Courier Prime', monospace; }
        .font-retro-serif { font-family: 'Playfair Display', serif; }
        
        .kraft-paper-texture {
          background-color: #FAF7F4;
          background-image: radial-gradient(circle at 100% 150%, #FAF7F4 24%, #EFE9DF 28%, #EFE9DF 52%, transparent 52%),
            radial-gradient(circle at 0% 100%, #FAF7F4 15%, #EFE9DF 39%, #EFE9DF 42%, transparent 42%);
        }
      `}</style>

      {/* Editor State Toggle Controls */}
      {isEditing && (
        <div className="absolute top-3 left-3 z-50 flex gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className={`px-3 py-1 rounded-full text-[9px] font-retro-typewriter tracking-widest border transition-all ${
              !isOpen ? "bg-[#8B7355] text-white border-[#D4C4A8]" : "bg-white/60 text-stone-700 border-stone-300"
            }`}
          >
            BAO THƯ
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className={`px-3 py-1 rounded-full text-[9px] font-retro-typewriter tracking-widest border transition-all ${
              isOpen ? "bg-[#8B7355] text-white border-[#D4C4A8]" : "bg-white/60 text-stone-700 border-stone-300"
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
            key="anniversary-envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full min-h-[600px] flex flex-col justify-between p-8 items-center bg-gradient-to-b from-[#F2EDE4] to-[#DFD6C4] relative"
          >
            {/* Elegant retro line ornaments */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#8B7355_1px,transparent_1px)] [background-size:20px_20px] z-0" />
            
            <div className="z-10 text-center mt-12 space-y-2">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#8B7355] block font-retro-typewriter">
                MEMORIES LOGBOOK
              </span>
              <h1 className="text-3xl font-retro-serif text-[#664C35] italic">Our Anniversary</h1>
              <div className="w-16 h-[1px] bg-[#D4C4A8] mx-auto mt-2" />
            </div>

            {/* Antique string binding wax seal design */}
            <div className="z-10 text-center my-6">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center border-2 border-dashed border-[#8B7355]/40 rounded-full">
                <div className="w-20 h-20 rounded-full bg-[#8B7355] flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all shadow-md relative z-10">
                  <Calendar className="w-9 h-9 text-[#FAF7F4] animate-pulse" />
                </div>
              </div>
              
              <p className="text-[8px] uppercase tracking-widest text-[#8B7355] font-retro-typewriter mt-5 block">
                HỒI KÝ DÀNH TẶNG
              </p>
              <h3 className="text-xl font-bold font-retro-serif text-[#664C35] mt-1 uppercase tracking-wide">
                {recipientName || "Bạn Kỷ Niệm"}
              </h3>
            </div>

            {/* Bottom button */}
            <div className="z-10 mb-8 text-center space-y-3">
              <button
                onClick={handleOpen}
                className="px-6 py-2.5 rounded-full text-[10px] font-retro-typewriter font-bold tracking-[0.2em] bg-[#8B7355] text-white hover:bg-[#725E45] shadow-md transition-all active:scale-95"
              >
                LẬT MỞ HỒI KÝ ⏳
              </button>
              <span className="text-[8px] text-[#8B7355] block tracking-widest uppercase">
                NHẤP ĐỂ TUA LẠI CUỐN BĂNG KÝ ỨC
              </span>
            </div>
          </motion.div>
        ) : (
          /* ================= NỘI DUNG CHÍNH THIỆP (STORY CONTENT) ================= */
          <motion.div
            key="anniversary-content"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col justify-start relative px-6 py-10 space-y-12 kraft-paper-texture overflow-y-auto max-h-[85vh]"
          >
            {/* Fine texture particles */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#8B7355_1px,transparent_1px)] [background-size:20px_20px] z-0" />

            {/* TRANG BÌA HỒI KÝ */}
            <section className="text-center z-10 space-y-5">
              <div className="relative inline-block">
                <Calendar className="w-8 h-8 mx-auto text-[#8B7355] drop-shadow-sm animate-pulse" />
              </div>
              
              <h1 className="text-2xl font-retro-serif font-black text-[#664C35] uppercase tracking-wide">
                {title || "Dòng Thời Gian Kỷ Niệm"}
              </h1>

              {/* Cover photo in Polaroid Frame */}
              <div className="flex justify-center my-6">
                <div
                  onClick={() => handlePhotoClick(0)}
                  className="bg-white p-3.5 pb-8 rounded-xl shadow-xl border border-stone-200/80 cursor-pointer group w-52 relative"
                >
                  <div className="aspect-[4/5] rounded overflow-hidden bg-stone-50 border border-stone-150">
                    <img
                      src={activePhotos[0]}
                      alt="First Memory"
                      className="w-full h-full object-cover filter sepia-[0.1] contrast-[1.01] brightness-[0.98] group-hover:scale-103 transition-transform duration-700"
                    />
                    {isEditing && (
                      <div className="absolute inset-3.5 bottom-8 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-2 left-4 text-[7px] font-retro-typewriter text-stone-400 tracking-wider">WEMO NARRATIVE</span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-[8px] font-retro-typewriter tracking-widest text-[#8B7355] uppercase">ĐỒNG HÀNH BỞI</span>
                <p className="text-base font-bold font-retro-serif text-[#664C35] uppercase tracking-wider mt-0.5">
                  {recipientName || "Bạn Kỷ Niệm"}
                </p>
              </div>
            </section>

            {/* LỜI TỪ TÂM KHẢM */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <h3 className="text-xs font-retro-typewriter tracking-[0.2em] uppercase text-[#664C35] font-black">Trang Hồi Ký</h3>
                <div className="w-8 h-[1px] bg-[#8B7355]/40 mx-auto mt-2" />
              </div>

              {/* Typewriter letter card */}
              <div className="p-6 rounded-2xl bg-white/60 border border-[#D4C4A8] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] text-left">
                {isEditing ? (
                  <textarea
                    value={message}
                    onChange={(e) => onUpdate?.({ message: e.target.value })}
                    className="w-full text-xs font-retro-typewriter text-stone-700 bg-transparent border border-dashed border-[#8B7355]/40 p-3 rounded-xl focus:outline-none h-24 resize-none leading-relaxed"
                    placeholder="Điền lời chúc gửi đối phương..."
                  />
                ) : (
                  <p className="text-xs font-retro-typewriter leading-loose text-stone-700 whitespace-pre-line px-2 text-center">
                    {message || "Những dấu mốc đáng nhớ nhất của chúng ta. Cảm ơn vì đã luôn đồng hành, cùng đi qua những năm tháng rực rỡ và cùng vun đắp tương lai phía trước."}
                  </p>
                )}
              </div>

              {/* Optional Voice / Video Greeting */}
              {((gift?.hasVoice && gift?.voiceUrl) || (gift?.hasVideo && gift?.videoUrl)) && (
                <div className="space-y-3 mt-4">
                  {gift.hasVoice && gift.voiceUrl && <AudioPlayerWidget src={gift.voiceUrl} />}
                  {gift.hasVideo && gift.videoUrl && <VideoPlayerWidget src={gift.videoUrl} />}
                </div>
              )}
            </section>

            {/* DÒNG THỜI GIAN KÝ ỨC (TIMELINE SECTION) */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <h3 className="text-xs font-retro-typewriter tracking-[0.2em] uppercase text-[#664C35] font-black">Nhật Ký Hành Trình</h3>
                <div className="w-8 h-[1px] bg-[#8B7355]/40 mx-auto mt-2" />
              </div>

              {/* Vertical timeline */}
              <div className="relative pl-5 border-l border-dashed border-[#8B7355]/40 space-y-8 text-left">
                {milestones.map((ms, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline circle */}
                    <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#8B7355] border border-[#FAF7F4] shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    </div>

                    {/* Timeline card */}
                    <div className="bg-white/60 border border-[#D4C4A8]/40 p-4 rounded-2xl shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-200/50 pb-1.5">
                        <span className="text-[10px] font-black font-retro-serif text-[#664C35]">{ms.title}</span>
                        <span className="text-[7.5px] font-retro-typewriter text-stone-400 tracking-wider uppercase">{ms.date}</span>
                      </div>

                      {/* Polaroid Image block inside timeline */}
                      <div
                        onClick={() => handlePhotoClick(idx)}
                        className="relative aspect-[16/9] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer"
                      >
                        <img src={ms.img} alt={ms.title} className="w-full h-full object-cover filter sepia-[0.1]" />
                        {isEditing && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      <p className="text-[9.5px] font-retro-typewriter text-stone-600 leading-normal italic">
                        "{ms.desc}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* THỜI KHẮC TIẾP THEO (COUNTDOWN) */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <h3 className="text-xs font-retro-typewriter tracking-[0.2em] uppercase text-[#664C35] font-black">Cột Mốc Kế Tiếp</h3>
                <div className="w-8 h-[1px] bg-[#8B7355]/40 mx-auto mt-2" />
              </div>

              {/* Hourglass/Retro countdown box */}
              <div className="p-5 rounded-2xl bg-white/60 border border-[#D4C4A8] shadow-sm space-y-4">
                <span className="text-[7.5px] font-retro-typewriter tracking-[0.2em] text-[#8B7355] block uppercase">THỜI GIAN ĐẾM NGƯỢC</span>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#FAF7F4] p-2 rounded-xl border border-[#D4C4A8]/60">
                    <span className="text-sm font-bold text-[#664C35] font-retro-serif block">{timeLeft.days}</span>
                    <span className="text-[6.5px] text-stone-400 font-retro-typewriter uppercase tracking-wider block">Ngày</span>
                  </div>
                  <div className="bg-[#FAF7F4] p-2 rounded-xl border border-[#D4C4A8]/60">
                    <span className="text-sm font-bold text-[#664C35] font-retro-serif block">{timeLeft.hours}</span>
                    <span className="text-[6.5px] text-stone-400 font-retro-typewriter uppercase tracking-wider block">Giờ</span>
                  </div>
                  <div className="bg-[#FAF7F4] p-2 rounded-xl border border-[#D4C4A8]/60">
                    <span className="text-sm font-bold text-[#664C35] font-retro-serif block">{timeLeft.minutes}</span>
                    <span className="text-[6.5px] text-stone-400 font-retro-typewriter uppercase tracking-wider block">Phút</span>
                  </div>
                  <div className="bg-[#FAF7F4] p-2 rounded-xl border border-[#D4C4A8]/60">
                    <span className="text-sm font-bold text-[#664C35] font-retro-serif block">{timeLeft.seconds}</span>
                    <span className="text-[6.5px] text-stone-400 font-retro-typewriter uppercase tracking-wider block">Giây</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-3 border-t border-stone-200/50 text-left">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-[#8B7355]" />
                  </div>
                  <div className="text-[10px] font-retro-typewriter text-stone-600">
                    <span>Đại tiệc kỷ niệm: </span>
                    <span className="font-bold text-[#664C35]">12:00 - Ngày 20/05/2027</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SỔ LƯU BÚT HÀNH TRÌNH (GUESTBOOK) */}
            <section className="z-10 space-y-4">
              <div className="text-center">
                <h3 className="text-xs font-retro-typewriter tracking-[0.2em] uppercase text-[#664C35] font-black">Sổ Lưu Bút Kỷ Niệm</h3>
                <div className="w-8 h-[1px] bg-[#8B7355]/40 mx-auto mt-2" />
              </div>

              {/* Form Input */}
              <form onSubmit={handleAddComment} className="space-y-3 bg-white/70 border border-[#D4C4A8] p-4 rounded-2xl text-left">
                <div>
                  <label className="block text-[8px] font-retro-typewriter text-[#8B7355] tracking-widest uppercase mb-1">NGƯỜI KÝ LƯU BÚT</label>
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Tên khách mời..."
                    className="w-full px-3 py-2 bg-[#FAF7F4] border border-[#D4C4A8]/60 rounded-xl outline-none text-xs text-stone-850 placeholder-stone-400 focus:border-[#8B7355]/60 font-retro-typewriter"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-retro-typewriter text-[#8B7355] tracking-widest uppercase mb-1">CHỌN BIỂU TƯỢNG KỶ NIỆM</label>
                  <div className="flex gap-2">
                    {["⏳", "📸", "💖", "✉️", "🌿"].map((stk) => (
                      <button
                        key={stk}
                        type="button"
                        onClick={() => setSelectedSticker(stk)}
                        className={`w-8 h-8 rounded-full border text-xs flex items-center justify-center transition-colors ${
                          selectedSticker === stk ? "bg-[#8B7355] border-[#8B7355] text-white shadow-sm" : "bg-[#FAF7F4] border-stone-200 text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {stk}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-retro-typewriter text-[#8B7355] tracking-widest uppercase mb-1">DÒNG LƯU BÚT</label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Để lại lời chúc mừng..."
                    rows={2}
                    className="w-full px-3 py-2 bg-[#FAF7F4] border border-[#D4C4A8]/60 rounded-xl outline-none text-xs text-stone-850 placeholder-stone-400 focus:border-[#8B7355]/60 resize-none font-retro-typewriter"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="w-full py-2 rounded-xl bg-[#8B7355] hover:bg-[#725E45] text-white text-[10px] font-retro-typewriter tracking-widest font-bold border border-[#725E45] flex items-center justify-center gap-1.5 disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-3 h-3" />
                  KÝ TÊN LƯU BÚT
                </button>
              </form>

              {/* Feed */}
              <div className="space-y-3 mt-4 text-left max-h-[200px] overflow-y-auto pr-1">
                {comments.map((cmt) => (
                  <div key={cmt.id} className="p-3 bg-white/40 rounded-xl border border-[#D4C4A8]/40 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-sm shrink-0">
                      {cmt.sticker}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-stone-800 font-retro-serif uppercase truncate">{cmt.name}</span>
                        <span className="text-[7px] text-stone-500 font-mono shrink-0">{cmt.time}</span>
                      </div>
                      <p className="text-[9.5px] font-retro-typewriter text-stone-600 leading-relaxed">{cmt.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="pt-6 border-t border-[#D4C4A8]/50 flex items-center justify-between z-10">
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-retro-typewriter text-stone-400">Yêu thích:</span>
                <span className="text-[10px] font-mono text-stone-500 font-bold">{likes}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  hasLiked ? "bg-[#8B7355] text-white border-[#8B7355]" : "bg-white/80 border-[#D4C4A8] text-[#8B7355]"
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
