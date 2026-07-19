import { motion, useScroll, useTransform } from "motion/react";
import { Sparkles, ArrowRight, Wand2 } from "lucide-react";
import { Link } from "react-router";

export function HeroSection() {
  const { scrollY } = useScroll();

  // 3D Scroll Transforms for the main Pink 3D Figure
  const rotateX = useTransform(scrollY, [0, 800], [0, 12]);     // Smooth tilt
  const rotateY = useTransform(scrollY, [0, 800], [0, -12]);    // Smooth side twist
  const translateY = useTransform(scrollY, [0, 800], [0, 50]);  // Subtle parallax down
  const scale = useTransform(scrollY, [0, 800], [1, 1.05]);     // Subtle zoom in
  const opacity = useTransform(scrollY, [600, 800], [1, 0.95]); // Maintain visibility

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FCE1DA] to-[#FFF0EC] py-12">
      {/* CSS Styles for laser scanline, rotating circles, and neon grid */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes laser-sweep {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes rotate-hud-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotate-hud-counter {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .laser-line {
          animation: laser-sweep 4s linear infinite;
        }
        .hud-clockwise {
          animation: rotate-hud-clockwise 25s linear infinite;
        }
        .hud-counter {
          animation: rotate-hud-counter 15s linear infinite;
        }
        .tech-grid {
          background-size: 30px 30px;
          background-image: 
            linear-gradient(to right, rgba(232, 180, 168, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(232, 180, 168, 0.08) 1px, transparent 1px);
        }
        `
      }} />

      {/* Background chuyển động mượt mà */}
      <div className="absolute inset-0 webo-animated-gradient opacity-40" />

      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -80, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#E8B4A8]/25 to-[#D4AF78]/30 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 60, -40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#D4AF78]/25 to-[#E8B4A8]/30 blur-[120px]"
        />
      </div>

      {/* Hạt tròn/Trái tim nhỏ mờ trôi nền phía sau */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#E8B4A8]/30"
            style={{
              width: i % 2 === 0 ? "6px" : "4px",
              height: i % 2 === 0 ? "6px" : "4px",
              left: `${15 + Math.random() * 30}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ================= BÊN TRÁI: KHỐI CHỮ ================= */}
          <div className="lg:col-span-5 text-center lg:text-left z-30 flex flex-col justify-center relative py-12 select-none">
            {/* Badge */}
            <div className="inline-flex self-center lg:self-start items-center gap-2 px-4 py-2 rounded-full mb-8 bg-white/90 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-white">
              <Sparkles className="w-3.5 h-3.5 text-[#E8B4A8]" />
              <span className="text-[11px] font-bold tracking-wider text-[#6E6E6E] uppercase">
                Tương Lai Của Món Quà Cảm Xúc
              </span>
            </div>

            {/* Tiêu đề chuẩn hàng, ngắt dòng đúng chuẩn */}
            <h1
              className="mb-6 font-extrabold text-[#1A1818] tracking-tight leading-[1.2]"
              style={{ fontSize: "clamp(2.5rem, 4.8vw, 3.8rem)" }}
            >
              Biến Mỗi Món <br />
              Quà Thành <br />
              <span className="relative inline-block bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] bg-clip-text text-transparent pb-1">
                Ký Ức Số
              </span>
            </h1>

            {/* Mô tả */}
            <p className="mb-8 text-sm sm:text-base text-[#666666] leading-relaxed max-w-md mx-auto lg:mx-0">
              WEMO kết hợp công nghệ chạm NFC độc bản và thiệp cá nhân hóa để
              lưu giữ trọn vẹn những thước phim, hình ảnh và lời chúc chân thành
              nhất.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
              <Link
                to="/ai-chibi"
                id="hero-cta-chibi"
                data-bot-guide="hero-cta"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white text-sm font-black shadow-lg hover:opacity-90 transition-all hover:scale-105"
              >
                <Wand2 className="w-4 h-4" />
                Thử Chibi AI Miễn Phí
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                data-bot-guide="hero-pricing"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-700 text-sm font-bold hover:bg-stone-50 transition-all shadow-sm"
              >
                Xem Bảng Giá
              </Link>
            </div>

            {/* Block số liệu dạng phẳng tối giản bên dưới */}
            <div className="pt-8 border-t border-gray-200/60 grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0 w-full">
              {[
                { value: "50K+", label: "Ký ức số" },
                { value: "4.9★", label: "Đánh giá" },
                { value: "95%", label: "Hài lòng" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="font-extrabold text-lg sm:text-xl text-[#1A1818] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-medium text-[#8C8C8C] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= BÊN PHẢI: MÔ HÌNH 3D CHUYỂN ĐỘNG CUỘN (SCROLL-DRIVEN 3D MOTION) ================= */}
          <div 
            className="lg:col-span-7 relative flex flex-col items-center justify-center w-full min-h-[500px] lg:min-h-[600px] z-20"
            style={{ perspective: 1200 }}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                y: translateY,
                scale,
                opacity,
                transformStyle: "preserve-3d"
              }}
              className="relative w-full max-w-[480px] aspect-[4/5] flex items-center justify-center pointer-events-none"
            >
              {/* Ảnh Chibi 3D Figure chính */}
              <img
                src="/assets/chibi-figure.png"
                alt="WEMO 3D Chibi Figure"
                className="w-full h-full object-contain drop-shadow-[0_25px_60px_rgba(232,180,168,0.45)] pointer-events-auto mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('figure-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />

              {/* Khung hiển thị dự phòng (Fallback) khi chưa có ảnh */}
              <div
                id="figure-fallback"
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0"
                style={{ display: 'none' }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#E8B4A8] to-[#D4AF78] flex items-center justify-center text-white mb-5 shadow-lg animate-pulse">
                  <Sparkles className="w-9 h-9" />
                </div>
                <h3 className="text-lg font-black text-[#1A1818] mb-2">Mô hình 3D Chibi</h3>
                <p className="text-xs text-stone-500 max-w-[280px] leading-relaxed">
                  Đang đợi bạn tải ảnh mô hình lên thư mục <br />
                  <code className="bg-white/80 px-1.5 py-0.5 rounded border font-mono mt-1 inline-block text-[10px] text-[#E8B4A8]">
                    assets/chibi-figure.png
                  </code>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
