import React, { useState, useEffect, useRef } from "react";
import { Mail, Heart, Sparkles, Play, Pause, CornerUpLeft } from "lucide-react";

interface LoveRomanticCardProps {
  senderName?: string;
  receiverName?: string;
  title?: string;
  paragraphs?: string[];
  audioSrc?: string;
}

export default function LoveRomanticCard({
  senderName = "Anh Tuấn (Anh)",
  receiverName = "Em",
  title = "Gặp Nhau Là Định Mệnh",
  paragraphs = [
    "Em yêu,",
    "Anh viết những dòng này từ trái tim thương nhớ. Gặp được em là điều tuyệt vời nhất đời anh. Nhớ ngày đầu mình cùng ngắm mưa rơi, ánh mắt em khi đó đã khiến anh say đắm.",
    "Chúng mình đã cùng nhau đi qua bao nẻo đường, chia sẻ niềm vui và cả nỗi buồn. Anh cảm ơn em vì tất cả, vì sự kiên nhẫn, sự sẻ chia và tình yêu ngọt ngào của em.",
    "Hãy luôn cười thật tươi em nhé, vì nụ cười của em là hạnh phúc của anh. Anh yêu em rất nhiều!",
  ],
  audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
}: LoveRomanticCardProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [isCardUnfolded, setIsCardUnfolded] = useState<boolean>(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [isSigVisible, setIsSigVisible] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [waveHeights, setWaveHeights] = useState<number[]>([8, 16, 20, 12, 4]);
  const waveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hiệu ứng chạy chữ tuần tự từng dòng khi mở thiệp
  useEffect(() => {
    let lineTimers: NodeJS.Timeout[] = [];
    let sigTimer: NodeJS.Timeout;

    if (isCardUnfolded) {
      paragraphs.forEach((_, index) => {
        const timer = setTimeout(() => {
          setVisibleLines((prev) => [...prev, index]);
        }, index * 900); // Đẩy tốc độ nhanh hơn một chút cho mobile (900ms)
        lineTimers.push(timer);
      });

      sigTimer = setTimeout(
        () => {
          setIsSigVisible(true);
        },
        paragraphs.length * 900 + 200,
      );
    } else {
      setVisibleLines([]);
      setIsSigVisible(false);
    }

    return () => {
      lineTimers.forEach((t) => clearTimeout(t));
      clearTimeout(sigTimer);
    };
  }, [isCardUnfolded, paragraphs]);

  // Hiệu ứng sóng âm động khi bật ghi âm
  useEffect(() => {
    if (isPlaying) {
      waveIntervalRef.current = setInterval(() => {
        setWaveHeights([
          Math.floor(Math.random() * 14) + 4,
          Math.floor(Math.random() * 14) + 4,
          Math.floor(Math.random() * 14) + 4,
          Math.floor(Math.random() * 14) + 4,
          Math.floor(Math.random() * 14) + 4,
        ]);
      }, 100);
    } else {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      setWaveHeights([6, 12, 16, 8, 4]);
    }

    return () => {
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, [isPlaying]);

  const handleOpenCard = () => {
    setIsEnvelopeOpen(true);
    setTimeout(() => {
      setIsCardUnfolded(true);
    }, 300);
  };

  const handleCloseCard = () => {
    setIsCardUnfolded(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setTimeout(() => {
      setIsEnvelopeOpen(false);
    }, 800);
  };

  const toggleVoice = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#ecdcd3] flex flex-col items-center justify-center p-3 sm:p-6 relative selection:bg-rose-100 font-sans">
      {/* Lớp hạt giấy Canvas */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100')] mix-blend-overlay" />

      {/* ================= BAO THƯ (ĐIỆN THOẠI & PC) ================= */}
      {!isEnvelopeOpen && (
        <div
          onClick={handleOpenCard}
          className="w-full max-w-[360px] sm:max-w-md h-[400px] sm:h-[420px] bg-gradient-to-br from-[#8a2836] to-[#591620] rounded-3xl shadow-2xl flex flex-col items-center justify-center cursor-pointer transform hover:scale-[1.01] transition-all duration-500 border border-black/10 z-30 relative px-4 text-center"
        >
          <div className="absolute inset-0 border border-dashed border-rose-300/20 rounded-3xl m-3 sm:m-4" />
          <div className="relative flex items-center justify-center">
            <Mail className="w-14 h-14 sm:w-16 sm:h-16 text-rose-100/90" />
            <Heart
              className="w-6 h-6 sm:w-7 sm:h-7 text-rose-600 fill-rose-500 absolute animate-ping"
              style={{ top: "32%" }}
            />
            <Heart
              className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white absolute"
              style={{ top: "32%" }}
            />
          </div>
          <h2
            className="text-rose-100 mt-5 font-serif italic tracking-widest text-base sm:text-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gửi Người Thương ♥
          </h2>
          <p className="text-rose-300/60 text-[11px] sm:text-xs mt-1 font-light">
            Chạm để lật mở cuốn sổ định mệnh
          </p>
        </div>
      )}

      {/* ================= CUỐN SỔ TÌNH YÊU TRONG SUỐT PHẢN HỒI ================= */}
      <div
        className={`w-full max-w-md md:max-w-5xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] relative z-20 bg-[#fefdfb] border border-stone-200 transition-all duration-[900ms] cubic-bezier(0.25, 1, 0.5, 1) ${
          !isEnvelopeOpen ? "hidden" : ""
        }`}
        style={{
          perspective: "2000px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Đường gáy sổ: Chỉ hiện ở màn hình máy tính (md), ẩn hoàn toàn trên điện thoại */}
        <div className="absolute inset-y-0 left-1/2 w-[8px] -ml-[4px] bg-gradient-to-r from-stone-200/10 via-stone-300/40 to-stone-200/10 hidden md:block z-30 pointer-events-none" />

        {/* Bố cục: 1 cột trên Mobile (Dưới cuộn lên), 2 cột trên PC (Lật ngang 3D) */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* ----------- TRANG TRÁI / TRANG TRÊN: HÌNH ẢNH KỶ NIỆM ----------- */}
          <div
            className="p-4 sm:p-6 md:p-8 flex flex-col justify-between relative min-h-[auto] md:min-h-[580px] bg-[#fefdfb] rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border-b border-stone-100 md:border-b-0 transition-all duration-[1200ms]"
            style={{
              transformOrigin:
                typeof window !== "undefined" && window.innerWidth >= 768
                  ? "right center"
                  : "center top",
              transform: isCardUnfolded ? "rotateY(0deg)" : "rotateY(90deg)",
              opacity: isCardUnfolded ? 1 : 0,
            }}
          >
            {/* Hoa văn SVG góc lá */}
            <svg
              className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 text-rose-900/10 pointer-events-none"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M0,0 Q30,10 40,40 Q10,30 0,0 M0,0 Q10,40 30,50 Q20,20 0,0 M0,0 Q40,20 50,30 Q30,10 0,0" />
            </svg>

            <div className="text-center w-full z-10 pt-2 md:pt-0">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-stone-400 uppercase block mb-0.5">
                LoveRomantic
              </span>
              <h3
                className="text-lg sm:text-xl font-bold tracking-wide text-[#6b1d2f]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {title}
              </h3>

              {/* Ảnh Polaroid Trung Tâm (Thu nhỏ vừa vặn mobile) */}
              <div className="bg-white p-2.5 sm:p-3 shadow-[0_6px_20px_rgba(0,0,0,0.03)] rounded-lg border border-stone-100 max-w-[280px] sm:max-w-sm mx-auto mt-3 sm:mt-4 relative">
                <Heart className="w-3 h-3 text-rose-300 fill-rose-200 absolute -right-2 top-1/2 opacity-60" />
                <Heart className="w-3 h-3 text-rose-300 fill-rose-200 absolute -left-3 bottom-12 opacity-60" />

                <div className="overflow-hidden aspect-[4/3] bg-stone-50 rounded-md">
                  <img
                    src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800"
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="text-center italic text-[11px] sm:text-xs text-stone-400 mt-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Anh and Em, early 30s)
                </p>
              </div>
            </div>

            {/* 🎞️ VIỀN CUỐN PHIM ĐIỆN ẢNH (Tự động co giãn theo chiều ngang điện thoại) 🎞️ */}
            <div className="mt-5 sm:mt-6 w-full z-10 px-0.5 sm:px-1 mb-4 md:mb-0">
              <div
                className="bg-[#1a1a1a] p-4 sm:p-5 relative rounded shadow-[inset_0_0_15px_rgba(0,0,0,0.6),0_6px_15px_rgba(0,0,0,0.12)]
                  before:content-[''] before:absolute before:left-0 before:right-0 before:height-[8px] before:top-[6px] before:bg-[linear-gradient(to_right,#efefef_0px,#efefef_6px,transparent_6px,transparent_12px)] before:bg-[size:12px_8px] before:opacity-85
                  after:content-[''] after:absolute after:left-0 after:right-0 after:height-[8px] after:bottom-[6px] after:bg-[linear-gradient(to_right,#efefef_0px,#efefef_6px,transparent_6px,transparent_12px)] after:bg-[size:12px_8px] after:opacity-85"
              >
                <div className="grid grid-cols-3 gap-1 bg-[#0a0a0a]">
                  <div className="border-x-[2px] sm:border-x-[3px] border-[#1a1a1a] bg-[#0f0f0f] text-center px-0.5">
                    <div className="aspect-square bg-stone-900 overflow-hidden rounded-sm border border-black">
                      <img
                        src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=300"
                        className="w-full h-full object-cover filter brightness-95"
                        alt="T1"
                      />
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-stone-400 font-medium mt-1 truncate">
                      Lần đầu gặp
                    </p>
                  </div>
                  <div className="border-x-[2px] sm:border-x-[3px] border-[#1a1a1a] bg-[#0f0f0f] text-center px-0.5">
                    <div className="aspect-square bg-stone-900 overflow-hidden rounded-sm border border-black">
                      <img
                        src="https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=300"
                        className="w-full h-full object-cover filter brightness-95"
                        alt="T2"
                      />
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-stone-400 font-medium mt-1 truncate">
                      Đi cùng nhau
                    </p>
                  </div>
                  <div className="border-x-[2px] sm:border-x-[3px] border-[#1a1a1a] bg-[#0f0f0f] text-center px-0.5">
                    <div className="aspect-square bg-stone-900 overflow-hidden rounded-sm border border-black relative">
                      <img
                        src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=300"
                        className="w-full h-full object-cover filter brightness-95"
                        alt="T3"
                      />
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-rose-300 font-semibold mt-1 truncate">
                      Mãi mãi (2026)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------- TRANG PHẢI / TRANG DƯỚI: NỘI DUNG BỨC THƯ HẠN CHẾ TRÀN CHỮ ----------- */}
          <div
            className="p-5 sm:p-6 md:p-8 flex flex-col justify-between bg-[#faf8f4] relative min-h-[480px] md:min-h-[580px] rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none transition-all duration-[1200ms]"
            style={{
              transformOrigin:
                typeof window !== "undefined" && window.innerWidth >= 768
                  ? "left center"
                  : "center bottom",
              transform: isCardUnfolded ? "rotateY(0deg)" : "rotateY(-90deg)",
              opacity: isCardUnfolded ? 1 : 0,
            }}
          >
            {/* Hoa văn góc lật ngược bên phải */}
            <svg
              className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 text-rose-900/10 pointer-events-none transform -scale-x-100"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M0,0 Q30,10 40,40 Q10,30 0,0 M0,0 Q10,40 30,50 Q20,20 0,0 M0,0 Q40,20 50,30 Q30,10 0,0" />
            </svg>

            <div className="w-full z-10">
              {/* Tiêu đề thư */}
              <div className="flex justify-between items-center border-b border-stone-200/80 pb-2 mb-3.5">
                <h4
                  className="text-xs sm:text-sm md:text-base font-bold flex items-center gap-1 text-rose-800"
                  style={{ fontFamily: "'Comfortaa', cursive" }}
                >
                  ✨ A Little Message of Love ✨
                </h4>
                <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
              </div>
              <p
                className="italic text-xs sm:text-sm text-stone-800 font-semibold mb-2.5 px-0.5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Dear {receiverName}, Gửi Người Thương ♥
              </p>

              {/* VÙNG CHỮ TỰ ĐỘNG KHÍT: max-h tăng giảm linh hoạt từ 220px (Mobile) đến 320px (PC) */}
              <div
                className="overflow-y-auto max-h-[220px] sm:max-h-[260px] md:max-h-[320px] pr-1 text-stone-700 leading-relaxed text-xs sm:text-sm md:text-[15px] space-y-3 text-justify"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <div className="space-y-2.5 px-0.5">
                  {paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className={`transition-all duration-700 ease-out transform ${
                        visibleLines.includes(i)
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-[5px]"
                      }`}
                    >
                      {para}
                    </p>
                  ))}
                </div>

                <div
                  className={`text-right pt-1 italic text-stone-400 text-[11px] sm:text-xs transition-opacity duration-1000 ${
                    isSigVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Forever & Always,
                  <br />
                  <strong className="text-xs sm:text-sm font-bold text-[#6b1d2f] not-italic tracking-wide mt-0.5 inline-block">
                    {senderName}
                  </strong>
                </div>
              </div>
            </div>

            {/* KHU VỰC AUDIO TRẢI NGHIỆM */}
            <div className="w-full z-10 pt-3 border-t border-stone-200/60 mt-4">
              <div className="flex flex-col items-center justify-center gap-1.5 max-w-xs mx-auto">
                {/* Sóng âm giả lập */}
                <div className="flex items-center gap-1 w-full justify-center opacity-40">
                  <div className="flex items-end gap-[2px] h-3.5">
                    {waveHeights.map((height, index) => (
                      <div
                        key={index}
                        className="w-[1.5px] bg-rose-800 transition-all duration-150"
                        style={{ height: `${height * 0.8}px` }} // Thu nhỏ nhẹ thanh sóng trên Mobile
                      />
                    ))}
                  </div>
                  <span className="text-stone-300 tracking-widest text-[9px] overflow-hidden truncate">
                    ••••••••••••••••••••••••
                  </span>
                </div>

                {/* Nút Play/Pause gọn gàng */}
                <button
                  onClick={toggleVoice}
                  className="flex items-center gap-2 bg-stone-100/90 hover:bg-rose-50 px-3.5 py-1 sm:py-1.5 rounded-full border border-stone-200/80 transition-all duration-300 active:scale-95"
                >
                  <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 bg-[#6b1d2f] text-white rounded-full flex items-center justify-center shadow-sm p-1">
                    {isPlaying ? (
                      <Pause className="w-2 h-2" />
                    ) : (
                      <Play className="w-2 h-2 ml-0.5" />
                    )}
                  </div>
                  <span
                    className="text-[10px] sm:text-[11px] text-stone-600 font-medium italic"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {isPlaying
                      ? "♥ Đang nghe lời nhắn nhủ..."
                      : "♥ Trái tim này đang nói..."}
                  </span>
                </button>
              </div>

              {/* Chân trang đóng sổ */}
              <div className="flex justify-between items-center mt-4 text-[9px] sm:text-[10px] text-stone-400 px-0.5">
                <button
                  onClick={handleCloseCard}
                  className="hover:text-rose-700 flex items-center gap-1 transition-colors font-medium"
                >
                  <CornerUpLeft className="w-3 h-3" /> Gập sổ lại
                </button>
                <span className="font-mono opacity-40">2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thẻ audio ẩn */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
