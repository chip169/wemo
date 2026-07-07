import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden" style={{ background: '#FFF0EC' }}>
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#FFD4D4' : i % 3 === 1 ? '#E8B4A8' : '#D4AF78',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, -100],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
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
          className="rounded-[3rem] p-12 md:p-16 text-center overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)',
            boxShadow: '0 30px 80px rgba(232, 180, 168, 0.5)',
          }}
        >
          {/* Decorative elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'white' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'white' }}
          />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Sparkles 
                className="w-16 h-16 mx-auto mb-6 text-white"
              />
            </motion.div>

            <h2 
              className="mb-6 text-white"
              style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Tạo Ra Những Ký Ức{' '}
              <span className="block">Không Bao Giờ Phai.</span>
            </h2>

            <p 
              className="mb-10 max-w-2xl mx-auto text-white/90"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.375rem)',
                lineHeight: 1.6,
              }}
            >
              Tham gia cùng hàng nghìn người đang tạo ra những trải nghiệm cảm xúc khó quên.
              Bắt đầu biến món quà của bạn thành những ký ức số trân quý ngay hôm nay.
            </p>


            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Không Cần Thẻ Tín Dụng</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Hoàn Tiền Trong 30 Ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
