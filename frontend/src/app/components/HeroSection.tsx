import { motion, useScroll, useTransform } from "motion/react";
import { Sparkles, ArrowRight, Wand2 } from "lucide-react";
import { Link } from "react-router";

export function HeroSection() {
  const { scrollY } = useScroll();
  const yPhone = useTransform(scrollY, [0, 1000], [0, 80]);
  const yBadge = useTransform(scrollY, [0, 1000], [0, -60]);
  const yFloatingLeftImg = useTransform(scrollY, [0, 1000], [0, -40]);
  const yFloatingLeftHeart = useTransform(scrollY, [0, 1000], [0, 40]);

  // Đường dẫn ảnh sản phẩm gốc để bóc tách chi tiết 3D
  const baseImg = "/assets/hero-product.jpeg";
  const optimizedImg = baseImg;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FCE1DA] to-[#FFF0EC] py-12">
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
          className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#E8B4A8]/20 to-[#D4AF78]/25 blur-[120px]"
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
          className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#D4AF78]/20 to-[#E8B4A8]/25 blur-[120px]"
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
          {/* ================= BÊN TRÁI: KHỐI CHỮ VÀ HÌNH 3D Y NHƯ HÌNH ================= */}
          <div className="lg:col-span-5 text-center lg:text-left z-30 flex flex-col justify-center relative py-12 select-none">
            {/* --- CÁC PHẦN TỬ 3D ĐỘNG BAO QUANH CHỮ --- */}

            {/* 1. Trái tim nhỏ trên cùng (Gần Badge) */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[45%] top-0 text-[#E8B4A8] text-xs opacity-80 w-8 h-8 flex items-center justify-center text-xs  rounded-xl shadow-md"
            >
              <img
                src="/assets/traiTim.png"
                alt="3D Couple"
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>

            {/* 2. Máy ảnh Claymation (Phía trên chữ Biến Mối Món) */}
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-24 top-2 w-7 h-7 flex items-center justify-center text-[10px] rounded-lg shadow-sm"
            >
              <img
                src="/assets/mayAnh.png"
                alt="3D Couple"
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>

            {/* 4. Hình Cặp đôi 3D (Bên phải chữ Quà Thành) */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, 4, 0] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="absolute right-4 top-36 w-11 h-11 rounded-full overflow-hidden shadow-md"
            >
              <img
                src={`${baseImg}?w=80&h=80&fit=crop`}
                alt="3D Couple"
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>

            {/* 5. Trái tim hồng nhỏ dưới chân cặp đôi */}
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute right-16 top-[220px] text-[10px] opacity-60 w-8 h-8 flex items-center justify-center text-xs  rounded-xl shadow-md"
            >
              <img
                src="/assets/traiTim.png"
                alt="3D Couple"
                className="w-full h-full object-cover rounded-full"
              />
            </motion.div>

            {/* 6. Bánh kem tầng 3D lớn trung tâm (Ngay cạnh chữ Ký Ức Số) */}
            <motion.div
              animate={{ y: [0, 7, 0], scale: [1, 1.03, 1] }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
              className="absolute right-20 top-[260px] w-16 h-16 rounded-full overflow-hidden shadow-lg bg-[#FCEBE7]"
            >
              <img
                src="/assets/banh.png"
                alt="3D Cake"
                className="w-full h-full object-cover scale-110"
              />
            </motion.div>

            {/* 7. Máy ảnh Retro bên phải bánh kem */}
            <motion.div
              style={{ y: yFloatingLeftImg }}
              className="absolute right-4 top-[290px] w-8 h-8 flex items-center justify-center text-xs  rounded-xl shadow-md"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.1,
                }}
                className="w-full h-full"
              >
                <img
                  src="/assets/mayAnh.png"
                  alt="3D Couple"
                  className="w-full h-full object-cover rounded-full"
                />
              </motion.div>
            </motion.div>

            {/* 8. Trái tim nhỏ ngoài cùng bên trái */}
            <motion.div
              style={{ y: yFloatingLeftHeart }}
              className="absolute -left-8 top-[245px] w-8 h-8 flex items-center justify-center text-xs  rounded-xl shadow-md "
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.8, repeat: Infinity }}
                className="w-full h-full"
              >
                <img
                  src="/assets/traiTim.png"
                  alt="3D Couple"
                  className="w-full h-full object-cover rounded-full"
                />
              </motion.div>
            </motion.div>

            {/* --- NỘI DUNG TEXT CHÍNH --- */}

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
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white text-sm font-black shadow-lg hover:opacity-90 transition-all hover:scale-105"
              >
                <Wand2 className="w-4 h-4" />
                Thử Chibi AI Miễn Phí
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
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

          {/* ================= BÊN PHẢI: VIDEO TO NGANG KHÔNG VIỀN + ẢNH PHỤ TRẮNG ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 relative flex flex-col items-center justify-center w-full"
          >
            {/* Khung video góc bo lớn siêu mượt */}
            <div className="relative w-full max-w-[840px] aspect-[16/10] rounded-[36px] overflow-visible z-20">
              {/* Thẻ Video chính */}
              <div className="w-full h-full rounded-[36px] overflow-hidden bg-gray-900 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] relative">
                <video
                  src="/assets/hero-video.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* Ngôi sao lấp lánh ở góc dưới video như ảnh thiết kế */}
                <motion.div
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-6 left-8 text-white text-xl drop-shadow-md pointer-events-none"
                >
                  WEMO
                </motion.div>
              </div>

              {/* THẺ ẢNH PHỤ TRÊN - GIỮ NGUYÊN NỀN VÀ VIỀN TRẮNG */}
              <motion.div
                style={{ y: yBadge }}
                className="absolute -top-10 -right-4 hidden xl:flex items-center gap-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white max-w-[210px] overflow-hidden"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-center gap-3 w-full"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={optimizedImg}
                      alt="Detail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-gray-400 font-medium">
                      Chi tiết sản phẩm
                    </span>
                    <span className="text-xs font-bold text-gray-800 truncate">
                      Luxury Box Edition
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* SMARTPHONE DƯỚI GÓC PHẢI - GIỮ NGUYÊN BORDER VIỀN TRẮNG DÀY */}
              <motion.div
                style={{ y: yPhone }}
                className="absolute -bottom-8 -right-6 hidden xl:block w-36 aspect-[9/16] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[5px] border-white bg-white z-30"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="w-full h-full overflow-hidden relative"
                >
                  <img
                    src={optimizedImg}
                    alt="NFC View"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full border border-white/60 bg-white/20 animate-pulse flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
