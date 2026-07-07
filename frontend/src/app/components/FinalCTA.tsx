import { motion } from "motion/react";
import { Sparkles, ArrowRight, Video } from "lucide-react";
import { Link } from "react-router";

export function FinalCTA() {
  return (
    <section className="relative py-28 bg-[#0A0A0A] overflow-hidden text-white">
      
      {/* Dot matrix grid background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.025)_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

      {/* Background glow ball */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(232,180,168,0.06),transparent_70%)] rounded-full pointer-events-none" />

      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#E8B4A8' : i % 3 === 1 ? '#D4AF78' : 'rgba(255,255,255,0.3)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, -120],
              opacity: [0, 0.7, 0],
              scale: [0, 1.4, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[3rem] p-12 md:p-20 text-center border border-stone-800 bg-[#161618]/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          {/* Decorative shapes */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,180,168,0.03),transparent_70%)] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,120,0.03),transparent_70%)] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-[#E8B4A8]" />
            </motion.div>

            <h2 
              className="mb-6 font-black tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                lineHeight: 1.2,
              }}
            >
              Tạo Ra Những Ký Ức <br />
              <span className="bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] bg-clip-text text-transparent">
                Không Bao Giờ Phai
              </span>
            </h2>

            <p className="mb-12 max-w-xl mx-auto text-stone-400 text-sm sm:text-base leading-relaxed">
              Tham gia cùng hàng nghìn người đang tạo ra những trải nghiệm cảm xúc độc bản. Bắt đầu biến món quà của bạn thành kỷ ức số trân quý ngay hôm nay.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all webo-shimmer-shine-hover"
              >
                Tạo thiệp ngay
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-transparent text-white border border-stone-850 hover:bg-stone-900 active:scale-[0.98] transition-all text-xs font-bold uppercase tracking-widest"
              >
                <Video className="w-4 h-4 text-[#E8B4A8]" />
                Xem Mẫu Thiệp
              </Link>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-stone-500 text-xs font-bold tracking-wider uppercase"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#E8B4A8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Không Cần Thẻ Tín Dụng</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#E8B4A8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Hoàn Tiền Trong 30 Ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#E8B4A8]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Bảo Mật & Riêng Tư</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
