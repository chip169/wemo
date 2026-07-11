import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const IMAGES = [
  {
    // Bé xanh dương (4.4457fbce) → màu xanh dương
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png",
    bg: "#EFF6FF",
    label: "Chạm · Mở · Kết Nối",
    slogan: "Chạm Nhẹ Một Giây,\nĐong Đầy Kỷ Niệm.",
    subtitle: "Chip NFC ẩn bên trong — chỉ cần đặt điện thoại, thiệp tương tác tự bật.",
    accent: "#2563EB",
    textColor: "#1E3A8A",
    sloganPos: "top-left",
  },
  {
    // Bé xanh lá (2.b977faab) → màu xanh lá
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png",
    bg: "#EDF7F0",
    label: "Tạc · Riêng · Độc Bản",
    slogan: "Độc Bản Riêng Bạn —\nĐậm Dấu Cá Nhân.",
    subtitle: "Chế tác từ ảnh thật của bạn, mỗi chibi 3D là một tác phẩm duy nhất trên đời.",
    accent: "#16A34A",
    textColor: "#14532D",
    sloganPos: "top-right",
  },
  {
    // Bé hồng (3.4df853b4) → màu hồng
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png",
    bg: "#FFF0F5",
    label: "Ảnh · Video · Giọng Nói",
    slogan: "Thước Phim, Giọng Nói —\nGói Trọn Yêu Thương.",
    subtitle: "Album ảnh, video kỷ niệm và lời chúc âm thanh xúc động — tất cả trong một vật.",
    accent: "#DB2777",
    textColor: "#831843",
    sloganPos: "bottom-left",
  },
  {
    // Bé cam (1.02464a56) → màu cam
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png",
    bg: "#FFF7ED",
    label: "Thêm · Sửa · Mãi Mãi",
    slogan: "Lưu Mãi Không Vơi,\nThảnh Thơi Đổi Mới.",
    subtitle: "Cập nhật hình ảnh, nhạc nền và lời chúc bất kỳ lúc nào — ký ức lớn theo năm tháng.",
    accent: "#EA580C",
    textColor: "#7C2D12",
    sloganPos: "bottom-right",
  },
];


// CSS keyframes
const SLOGAN_ANIM_CSS = `
@keyframes sloganSlideIn {
  0%   { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes sloganSlideInRight {
  0%   { opacity: 0; transform: translateX(20px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes sloganFadeUp {
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes lineExpand {
  0%   { transform: scaleX(0); opacity: 0; }
  100% { transform: scaleX(1); opacity: 1; }
}
.slogan-enter-left  { animation: sloganSlideIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }
.slogan-enter-right { animation: sloganSlideInRight 0.55s cubic-bezier(0.16,1,0.3,1) both; }
.slogan-label-anim  { animation: sloganFadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; animation-delay:0.08s; }
.slogan-line-anim   { animation: lineExpand 0.5s cubic-bezier(0.16,1,0.3,1) both; animation-delay:0.14s; transform-origin: left center; }
.slogan-line-right  { animation: lineExpand 0.5s cubic-bezier(0.16,1,0.3,1) both; animation-delay:0.14s; transform-origin: right center; }
.slogan-title-anim  { animation: sloganFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; animation-delay:0.22s; }
.slogan-sub-anim    { animation: sloganFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; animation-delay:0.34s; }
`;

function getSloganWrapperStyle(pos: string, isMobile: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    zIndex: 55,
    pointerEvents: "none",
  };

  if (isMobile) {
    return { ...base, top: "10%", left: "50%", transform: "translateX(-50%)", width: "90vw" };
  }

  switch (pos) {
    case "top-left": return { ...base, top: "14%", left: "4%" };
    case "top-right": return { ...base, top: "14%", right: "4%" };
    case "bottom-left": return { ...base, bottom: "180px", left: "4%" };
    case "bottom-right": return { ...base, bottom: "180px", right: "4%" };
    default: return { ...base, top: "14%", left: "4%" };
  }
}



export function ToonhubPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sloganKey, setSloganKey] = useState(0); // force remount for re-animation

  useEffect(() => {
    IMAGES.forEach((item) => { const img = new Image(); img.src = item.src; });
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    const autoPlay = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
      setSloganKey((k) => k + 1);
    }, 3000);
    return () => { window.removeEventListener("resize", handleResize); clearInterval(autoPlay); };
  }, []);

  const navigate = useCallback((direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => direction === "next" ? (prev + 1) % 4 : (prev + 3) % 4);
    setSloganKey((k) => k + 1);
    setTimeout(() => setIsAnimating(false), 650);
  }, [isAnimating]);

  const centerIndex = activeIndex;
  const leftIndex = (activeIndex + 3) % 4;
  const rightIndex = (activeIndex + 1) % 4;

  const getRole = (index: number) => {
    if (index === centerIndex) return "center";
    if (index === leftIndex) return "left";
    if (index === rightIndex) return "right";
    return "back";
  };

  const getRoleStyles = (role: "center" | "left" | "right" | "back") => {
    switch (role) {
      case "center": return { transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`, filter: "blur(0px)", opacity: 1, zIndex: 20, left: "50%", height: isMobile ? "60%" : "85%", bottom: isMobile ? "22%" : "80px" };
      case "left": return { transform: "translateX(-50%) scale(1)", filter: "blur(2px)", opacity: 0.85, zIndex: 10, left: isMobile ? "20%" : "28%", height: isMobile ? "16%" : "26%", bottom: isMobile ? "32%" : "100px" };
      case "right": return { transform: "translateX(-50%) scale(1)", filter: "blur(2px)", opacity: 0.85, zIndex: 10, left: isMobile ? "80%" : "72%", height: isMobile ? "16%" : "26%", bottom: isMobile ? "32%" : "100px" };
      case "back": return { transform: "translateX(-50%) scale(1)", filter: "blur(4px)", opacity: 1, zIndex: 5, left: "50%", height: isMobile ? "13%" : "20%", bottom: isMobile ? "32%" : "100px" };
    }
  };

  const currentSlide = IMAGES[activeIndex];
  const wrapperStyle = getSloganWrapperStyle(currentSlide.sloganPos, isMobile);
  const isRight = currentSlide.sloganPos === "top-right" || currentSlide.sloganPos === "bottom-right";

  return (
    <div className="relative w-full overflow-hidden select-none" style={{ backgroundColor: currentSlide.bg, transition: "background-color 650ms cubic-bezier(0.4,0,0.2,1)", fontFamily: "'Inter', sans-serif" }}>
      {/* Inject animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: SLOGAN_ANIM_CSS }} />

      <div className="relative w-full" style={{ height: "100vh" }}>

        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none z-[50]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")", opacity: 0.4, backgroundSize: "200px 200px" }} />

        {/* Ghost text WEMO 3D */}
        <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2]" style={{ top: "15%", fontFamily: "'Anton', sans-serif", fontSize: "clamp(90px, 27vw, 430px)", fontWeight: 900, color: "#f6a2cfff", opacity: 0.35, lineHeight: 1, textTransform: "uppercase", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          WEMO 3D
        </div>

        {/* ===== DYNAMIC SLOGAN — floating editorial style ===== */}
        <div key={sloganKey} style={wrapperStyle}>
          <div
            className={isRight ? "slogan-enter-right" : "slogan-enter-left"}
            style={{
              maxWidth: isMobile ? "92vw" : "440px",
              textAlign: isMobile ? "center" : (isRight ? "right" : "left"),
            }}
          >
            {/* Accent line */}
            <div
              className={isRight ? "slogan-line-right" : "slogan-line-anim"}
              style={{
                height: "3px",
                width: "48px",
                borderRadius: 999,
                background: currentSlide.accent,
                marginBottom: "14px",
                marginLeft: isMobile ? "auto" : (isRight ? "auto" : 0),
                marginRight: isMobile ? "auto" : (isRight ? 0 : "auto"),
              }}
            />

            {/* Main slogan — each \n is the only line break, no auto-wrap */}
            <div className="slogan-title-anim" style={{
              fontFamily: "var(--font-display, 'Inter', sans-serif)",
              fontSize: isMobile ? "clamp(1.5rem, 5.5vw, 2rem)" : "clamp(1.7rem, 2.4vw, 2.3rem)",
              fontWeight: 900,
              color: currentSlide.textColor,
              letterSpacing: "-0.03em",
              lineHeight: 1.18,
              whiteSpace: "pre",
              textShadow: "0 2px 16px rgba(255,255,255,0.75)",
            }}>
              {currentSlide.slogan}
            </div>

            {/* Subtitle */}
            <p className="slogan-sub-anim" style={{
              marginTop: "12px",
              fontSize: "12.5px",
              color: currentSlide.textColor,
              opacity: 0.65,
              lineHeight: 1.6,
              fontWeight: 500,
              letterSpacing: "0.01em",
              textShadow: "0 1px 8px rgba(255,255,255,0.8)",
              display: isMobile ? "none" : "block",
              whiteSpace: "normal",
              maxWidth: "320px",
            }}>
              {currentSlide.subtitle}
            </p>
          </div>
        </div>
        {/* ===== END DYNAMIC SLOGAN ===== */}


        {/* Dot indicators */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] flex gap-2">
          {IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!isAnimating && idx !== activeIndex) {
                  setIsAnimating(true);
                  setActiveIndex(idx);
                  setSloganKey((k) => k + 1);
                  setTimeout(() => setIsAnimating(false), 650);
                }
              }}
              className="rounded-full transition-all duration-300"
              style={{ width: idx === activeIndex ? "24px" : "8px", height: "8px", backgroundColor: idx === activeIndex ? "#C13880" : "rgba(193,56,128,0.35)" }}
              aria-label={`Mo hinh ${idx + 1}`}
            />
          ))}
        </div>

        {/* Carousel */}
        <div className="absolute inset-0 z-[3]">
          {IMAGES.map((image, i) => {
            const style = getRoleStyles(getRole(i));
            return (
              <div key={i} className="absolute" style={{ aspectRatio: "0.6 / 1", willChange: "transform, filter, opacity", transition: "transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1)", ...style }}>
                <img src={image.src} alt={`WEMO Chibi 3D ${i + 1}`} className="w-full h-full object-contain object-bottom select-none" draggable={false} />
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 z-[60] px-6 sm:px-12 lg:px-16 pb-8 sm:pb-10 pt-6" style={{ background: `linear-gradient(to top, ${currentSlide.bg} 55%, transparent 100%)`, transition: "background 650ms cubic-bezier(0.4,0,0.2,1)" }}>
          <div className="flex items-center justify-between gap-4">

            {/* LEFT: slide counter */}
            <div className="flex-1 min-w-0 max-w-xs">
              <p className="font-bold uppercase mb-0.5 text-sm" style={{ color: currentSlide.accent, letterSpacing: "0.08em" }}>
                {activeIndex + 1} / {IMAGES.length}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed hidden sm:block" style={{ color: "#1A1818", opacity: 0.55 }}>
                {currentSlide.subtitle}
              </p>
            </div>

            {/* CENTER: navigation */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => navigate("prev")} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95" style={{ border: `1.5px solid ${currentSlide.accent}55`, color: currentSlide.accent, background: `${currentSlide.accent}15` }} aria-label="Truoc">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </button>
              <button onClick={() => navigate("next")} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95" style={{ border: `1.5px solid ${currentSlide.accent}55`, color: currentSlide.accent, background: `${currentSlide.accent}15` }} aria-label="Sau">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* RIGHT: CTA */}
            <div className="flex-shrink-0">
              <a href="/order" className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full font-semibold text-sm sm:text-base text-white transition-all duration-200 hover:scale-105 no-underline" style={{ background: `linear-gradient(135deg, #E8B4A8 0%, ${currentSlide.accent} 100%)`, boxShadow: `0 4px 18px ${currentSlide.accent}40`, transition: "background 650ms, box-shadow 650ms" }}>
                Đặt ngay <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
