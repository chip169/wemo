import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Bảng màu kem/beige đồng bộ với theme WEMO — khớp với màu nền các section bên dưới
const IMAGES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#FCEBE7', panel: '#F5EDE4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F5EDE4', panel: '#EDE5DB' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#FFF0F0', panel: '#FCEBE7' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#FFD4D4', panel: '#F5EDE4' },
];

export function ToonhubPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });

    // Mobile width detection
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Tự động chuyển nhân vật mỗi 3 giây
    const autoPlay = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 3000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(autoPlay);
    };
  }, []);

  // Navigation logic
  const navigate = useCallback((direction: "next" | "prev") => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (direction === "next") {
      setActiveIndex((prev) => (prev + 1) % 4);
    } else {
      setActiveIndex((prev) => (prev + 3) % 4);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  }, [isAnimating]);

  // Roles derived from activeIndex
  const centerIndex = activeIndex;
  const leftIndex = (activeIndex + 3) % 4;
  const rightIndex = (activeIndex + 1) % 4;
  const backIndex = (activeIndex + 2) % 4;

  const getRole = (index: number) => {
    if (index === centerIndex) return "center";
    if (index === leftIndex) return "left";
    if (index === rightIndex) return "right";
    return "back";
  };

  const getRoleStyles = (role: "center" | "left" | "right" | "back") => {
    switch (role) {
      case "center":
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: "blur(0px)",
          opacity: 1,
          zIndex: 20,
          left: "50%",
          height: isMobile ? "60%" : "92%",
          bottom: isMobile ? "22%" : "0px",
        };
      case "left":
        return {
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? "20%" : "30%",
          height: isMobile ? "16%" : "28%",
          bottom: isMobile ? "32%" : "12%",
        };
      case "right":
        return {
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? "80%" : "70%",
          height: isMobile ? "16%" : "28%",
          bottom: isMobile ? "32%" : "12%",
        };
      case "back":
        return {
          transform: "translateX(-50%) scale(1)",
          filter: "blur(4px)",
          opacity: 1,
          zIndex: 5,
          left: "50%",
          height: isMobile ? "13%" : "22%",
          bottom: isMobile ? "32%" : "12%",
        };
    }
  };

  // Dot indicator index
  const _ = backIndex; // silence unused warning

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: "background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ height: "100vh", paddingTop: 0 }}>
        {/* 1. Grain overlay (zIndex 50) */}
        <div
          className="absolute inset-0 pointer-events-none z-[50]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
            opacity: 0.4,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* 2. Giant ghost text "WEMO 3D" (zIndex 2) */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2]"
          style={{
            top: "18%",
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(90px, 28vw, 380px)",
            fontWeight: 900,
            color: "#C13880",
            opacity: 0.35,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
          }}
        >
          WEMO 3D
        </div>

        {/* 3. Dot indicators — top center (below header, zIndex 60) */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] flex gap-2">
          {IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!isAnimating && idx !== activeIndex) {
                  setIsAnimating(true);
                  setActiveIndex(idx);
                  setTimeout(() => setIsAnimating(false), 650);
                }
              }}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === activeIndex ? "24px" : "8px",
                height: "8px",
                backgroundColor: idx === activeIndex ? "#E8B4A8" : "rgba(232,180,168,0.4)",
              }}
              aria-label={`Chuyển sang mô hình ${idx + 1}`}
            />
          ))}
        </div>

        {/* 4. Carousel (zIndex 3) */}
        <div className="absolute inset-0 z-[3]">
          {IMAGES.map((image, i) => {
            const role = getRole(i);
            const style = getRoleStyles(role);

            return (
              <div
                key={i}
                className="absolute"
                style={{
                  position: "absolute",
                  aspectRatio: "0.6 / 1",
                  willChange: "transform, filter, opacity",
                  transition:
                    "transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)",
                  ...style,
                }}
              >
                <img
                  src={image.src}
                  alt={`WEMO Mô hình Chibi 3D ${i + 1}`}
                  className="w-full h-full object-contain object-bottom select-none"
                  draggable={false}
                />
              </div>
        {/* 5+6. Bottom bar — 3 zones: brand info | nav arrows | CTA */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[60] px-6 sm:px-12 pb-6 sm:pb-10 pt-4"
          style={{
            background: 'linear-gradient(to top, rgba(252,235,231,0.95) 60%, transparent 100%)',
          }}
        >
          <div className="flex items-end justify-between gap-4">

            {/* LEFT — Brand label + short description */}
            <div className="flex-1 min-w-0 max-w-[320px]">
              <p
                className="font-bold uppercase mb-1 text-sm sm:text-base tracking-wider"
                style={{ color: '#C13880', letterSpacing: '0.06em' }}
              >
                WEMO CHIBI 3D
              </p>
              <p
                className="text-xs sm:text-sm leading-relaxed hidden sm:block"
                style={{ color: '#1A1818', opacity: 0.65 }}
              >
                Mô hình chân dung 3D từ ảnh thật của bạn. Tích hợp NFC mở thiệp kỷ niệm — sản xuất thủ công độc bản.
              </p>
            </div>

            {/* CENTER — Nav arrows */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate("prev")}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95"
                style={{ border: '1.5px solid #E8B4A8', color: '#C13880', background: 'rgba(232,180,168,0.12)' }}
                aria-label="Mô hình trước"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => navigate("next")}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95"
                style={{ border: '1.5px solid #E8B4A8', color: '#C13880', background: 'rgba(232,180,168,0.12)' }}
                aria-label="Mô hình tiếp theo"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* RIGHT — CTA button */}
            <div className="flex-shrink-0">
              <a
                href="/order"
                className="flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full font-semibold text-sm sm:text-base text-white transition-all duration-200 hover:scale-105 hover:opacity-90 no-underline"
                style={{
                  background: 'linear-gradient(135deg, #E8B4A8 0%, #C13880 100%)',
                  boxShadow: '0 4px 16px rgba(193,56,128,0.3)',
                }}
              >
                Đặt ngay
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
�ẶT NGAY
          <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
        </a>
      </div>
    </div>
  );
}
