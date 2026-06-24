import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Sparkles,
  Play,
  Pause,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

interface ModernCardProps {
  senderName?: string;
  receiverName?: string;
  mainTitle?: string;
  subtitle?: string;
  letterText?: string[];
  audioSrc?: string;
}

export default function ModernGalleryCard({
  senderName = "Tuấn Anh",
  receiverName = "Ngọc Linh",
  mainTitle = "THE ART OF US",
  subtitle = "Hành trình mộng mơ và những kẻ si tình",
  letterText = [
    "Gửi Linh,",
    "Giữa thế giới hơn 8 tỷ người, anh vẫn luôn nghĩ việc chúng mình tìm thấy nhau là một phép màu đẹp nhất. Tình yêu với anh không phải là những gì quá lớn lao, mà đôi khi chỉ là khoảnh khắc bình yên nhìn ngắm nụ cười của em, cùng nhau đi qua những ngày nắng nhẹ, hay ngồi yên lặng nghe một bản nhạc quen thuộc.",
    "Cảm ơn em vì đã là một phần rực rỡ nhất trong cuộc đời anh. Cảm ơn sự dịu dàng, thấu hiểu và vòng tay ấm áp mà em luôn dành cho anh mỗi khi mệt mỏi.",
    "Dù mai này thế giới có xoay chuyển ra sao, anh vẫn muốn nhẹ nhàng nắm tay em, cùng viết tiếp những trang slide thật đẹp cho hành trình mang tên 'Chúng Mình' nhé. Yêu em rất nhiều.",
  ],
  audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
}: ModernCardProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"gallery" | "letter">("gallery");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([
    4, 4, 4, 4, 4, 4, 4,
  ]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hiệu ứng giả lập sóng nhạc động khi phát audio
  useEffect(() => {
    if (isPlaying) {
      waveIntervalRef.current = setInterval(() => {
        setWaveHeights(
          Array.from({ length: 7 }, () => Math.floor(Math.random() * 16) + 3),
        );
      }, 1200 / 10);
    } else {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      setWaveHeights([4, 8, 12, 16, 12, 8, 4]);
    }
    return () => {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, [isPlaying]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleCloseCard = () => {
    setIsUnlocked(false);
    setIsPlaying(false);
    setActiveTab("gallery");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#f4f4f5] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-zinc-800 selection:text-white">
      {/* Nền Grain & Đèn Neon mờ tạo chiều sâu điện ảnh */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100')] mix-blend-overlay" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-900/20 rounded-full filter blur-[120px] pointer-events-none animate-pulse" />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-zinc-800/30 rounded-full filter blur-[120px] pointer-events-none animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* ================= TRẠNG THÁI 1: KHÓA MÀN HÌNH (COVER) ================= */}
      {!isUnlocked ? (
        <div
          onClick={() => setIsUnlocked(true)}
          className="w-full max-w-[360px] md:max-w-md aspect-[3/4] bg-zinc-900/40 backdrop-blur-md rounded-3xl p-6 border border-zinc-800/80 shadow-2xl flex flex-col justify-between items-center text-center cursor-pointer group transform hover:scale-[1.01] transition-all duration-500"
        >
          <div className="pt-8">
            <div className="inline-flex p-3 rounded-full bg-zinc-800/50 border border-zinc-700/30 text-rose-400 mb-4 group-hover:animate-bounce">
              <Heart className="w-6 h-6 fill-rose-500/10" />
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-medium">
              Invitation Card
            </p>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-light tracking-[0.15em] text-zinc-100">
              {mainTitle}
            </h1>
            <p className="text-xs text-zinc-400 font-light italic tracking-wide px-4">
              {subtitle}
            </p>
          </div>

          <div className="pb-6 flex flex-col items-center gap-1 text-zinc-500 group-hover:text-zinc-300 transition-colors">
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
              Chạm để khám phá
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      ) : (
        /* ================= TRẠNG THÁI 2: KHÔNG GIAN TRIỂN LÃM SỐ ================= */
        <div className="w-full max-w-md md:max-w-4xl bg-zinc-900/30 backdrop-blur-xl rounded-3xl border border-zinc-800/80 shadow-2xl overflow-hidden flex flex-col md:h-[620px] animate-fade-in transition-all duration-700">
          {/* Header điều hướng Menu Tab (Giao diện tinh gọn thời thượng) */}
          <div className="px-6 py-4 border-b border-zinc-800/60 flex justify-between items-center bg-zinc-950/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                Premium Digital Card
              </span>
            </div>

            {/* Thanh chuyển đổi linh hoạt */}
            <div className="flex bg-zinc-900/80 p-1 rounded-full border border-zinc-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab("gallery")}
                className={`px-4 py-1.5 rounded-full transition-all duration-300 ${activeTab === "gallery" ? "bg-zinc-800 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                Kỷ Niệm
              </button>
              <button
                onClick={() => setActiveTab("letter")}
                className={`px-4 py-1.5 rounded-full transition-all duration-300 ${activeTab === "letter" ? "bg-zinc-800 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                Bức Thư
              </button>
            </div>
          </div>

          {/* Thân thiệp thay đổi linh hoạt theo nội dung Tab */}
          <div className="flex-1 overflow-hidden p-5 md:p-8">
            {/* ---- TAB 1: TRIỂN LÃM ẢNH CINEMATIC ---- */}
            {activeTab === "gallery" && (
              <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up overflow-y-auto pr-1 md:overflow-hidden">
                {/* Ảnh lớn nghệ thuật bên trái */}
                <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden border border-zinc-800 shadow-lg group">
                  <img
                    src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800"
                    alt="Gallery 1"
                    className="w-full h-full object-cover filter brightness-[0.8] group-hover:scale-105 transition duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <p className="text-xs text-rose-400 font-mono tracking-widest mb-1">
                      CHAPTER I
                    </p>
                    <h4 className="text-lg font-light tracking-wide text-zinc-100">
                      Nơi tình yêu bắt đầu gieo mầm
                    </h4>
                  </div>
                </div>

                {/* 2 Ảnh nhỏ xếp dọc bên phải */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <div className="relative aspect-square md:aspect-auto md:h-[258px] rounded-2xl overflow-hidden border border-zinc-800 shadow-md group">
                    <img
                      src="https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=400"
                      alt="Gallery 2"
                      className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3.5">
                      <span className="text-[11px] tracking-wide text-zinc-300 font-light">
                        Những chuyến đi xa đầy ắp tiếng cười
                      </span>
                    </div>
                  </div>
                  <div className="relative aspect-square md:aspect-auto md:h-[258px] rounded-2xl overflow-hidden border border-zinc-800 shadow-md group">
                    <img
                      src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=400"
                      alt="Gallery 3"
                      className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3.5">
                      <span className="text-[11px] tracking-wide text-rose-300 font-medium">
                        Bên nhau bình yên từng phút giây
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---- TAB 2: BỨC THƯ TAY HIỆN ĐẠI TỐI GIẢN ---- */}
            {activeTab === "letter" && (
              <div className="h-full max-w-2xl mx-auto flex flex-col justify-between animate-slide-up">
                {/* Vùng nội dung chữ cuộn mượt không sợ tràn */}
                <div className="overflow-y-auto max-h-[300px] md:max-h-[380px] pr-2 space-y-4 text-zinc-300 font-light text-sm md:text-[15px] leading-relaxed text-justify tracking-wide">
                  {letterText.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className={
                        idx === 0
                          ? "text-base font-medium text-rose-300 mb-2"
                          : ""
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Ký tên tinh tế */}
                <div className="text-right mt-4 border-t border-zinc-800/40 pt-3">
                  <span className="text-xs text-zinc-500 block italic font-mono mb-0.5">
                    With all my heart
                  </span>
                  <span className="text-base font-light tracking-[0.15em] text-rose-400">
                    {senderName}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ================= FOOTER CONTROL: ÂM THANH & ĐIỀU KHIỂN ================= */}
          <div className="px-6 py-4 border-t border-zinc-800/60 bg-zinc-950/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Trình phát Voice tinh xảo tối giản */}
            <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/80 px-4 py-2 rounded-full w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={toggleAudio}
                className="w-8 h-8 bg-zinc-100 text-zinc-950 rounded-full flex items-center justify-center hover:bg-rose-400 hover:text-white active:scale-95 transition-all duration-300"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>

              <div className="flex flex-col">
                <span className="text-[11px] font-medium tracking-wide text-zinc-200">
                  Lời gửi gắm từ đối phương
                </span>
                {/* Cụm thanh sóng âm tối giản phát động */}
                <div className="flex items-center gap-[2px] h-3 mt-1 opacity-70">
                  {waveHeights.map((h, i) => (
                    <div
                      key={i}
                      className="w-[1.5px] bg-rose-400 transition-all duration-150 rounded-full"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Điều hướng đóng thiệp */}
            <button
              onClick={handleCloseCard}
              className="text-[11px] text-zinc-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors tracking-widest uppercase font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Quay về màn hình khóa
            </button>
          </div>
        </div>
      )}

      {/* Bản quyền */}
      <p className="text-[10px] text-zinc-600 font-mono tracking-widest mt-6 z-10">
        Artistic Frame Concept • 2026
      </p>

      {/* Thẻ audio chạy ẩn thực tế */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
