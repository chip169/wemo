import { motion } from "motion/react";
import { Sparkles, ArrowRight, Wand2 } from "lucide-react";
import { Link } from "react-router";
import { HeroUnboxing3D } from "./HeroUnboxing3D";

export function HeroSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-16 md:py-24">
      
      {/* Subtle Ambient Background Light */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(232,180,168,0.08),transparent_60%)] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start relative">
          
          {/* ================= BÊN TRÁI: KHỐI CHỮ CỐ ĐỊNH KHI SCROLL ================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 z-30 flex flex-col justify-center py-6 select-none">
            
            {/* Minimalist Badge */}
            <div className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-white border border-[#E8B4A8]/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E8B4A8]" />
              <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase font-sans">
                Tương Lai Của Món Quà Cảm Xúc
              </span>
            </div>

            {/* Premium Heading using Playfair Display */}
            <h1
              className="mb-6 font-extrabold text-[#0A0A0A] tracking-tight leading-[1.15]"
              style={{ 
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 4.5vw, 3.75rem)" 
              }}
            >
              Biến Mỗi Món <br />
              Quà Thành <br />
              <span className="relative inline-block bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] bg-clip-text text-transparent pb-1">
                Ký Ức Số
              </span>
            </h1>

            {/* Description */}
            <p className="mb-8 text-sm sm:text-base text-stone-500 leading-relaxed max-w-md">
              WEMO kết hợp công nghệ chạm NFC độc bản và mô hình Figure Chibi 3D để lưu giữ trọn vẹn những thước phim, hình ảnh và lời chúc chân thành nhất của bạn.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                to="/ai-chibi"
                id="hero-cta-chibi"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Wand2 className="w-4 h-4" />
                Thử Chibi AI Miễn Phí
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-700 text-sm font-bold hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm"
              >
                Xem Bảng Giá
              </Link>
            </div>

            {/* Flat minimalism metrics */}
            <div className="pt-8 border-t border-stone-100 grid grid-cols-3 gap-4 max-w-sm w-full">
              {[
                { value: "50K+", label: "Ký ức số" },
                { value: "4.9★", label: "Đánh giá" },
                { value: "95%", label: "Hài lòng" },
              ].map((stat, i) => (
                <div key={i} className="text-left">
                  <div 
                    className="font-bold text-lg sm:text-xl text-[#0A0A0A] tracking-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= BÊN PHẢI: HIỆU ỨNG 3D UNBOXING KHI SCROLL ================= */}
          <div className="lg:col-span-7 w-full">
            <HeroUnboxing3D />
          </div>

        </div>
      </div>
    </section>
  );
}
