import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function PersonalizationFeatures() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#FFF0EC] to-[#FAF3F0] overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -50, 40, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-10 left-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#E8B4A8]/10 to-[#D4AF78]/10 blur-[80px]"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Feature highlight banner - Khả Năng Vô Hạn */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-white/50 rounded-[2.5rem] p-10 md:p-16 text-center bg-white/40 backdrop-blur-md shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(232, 180, 168, 0.05) 0%, rgba(212, 175, 120, 0.05) 100%)',
          }}
        >
          <Sparkles 
            className="w-12 h-12 mx-auto mb-6 text-[#E8B4A8]"
          />
          <h3 
            className="mb-4 text-3xl font-bold text-stone-900"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic'
            }}
          >
            Khả Năng Vô Hạn
          </h3>
          <p
            className="max-w-2xl mx-auto text-stone-500 text-sm sm:text-base leading-relaxed"
          >
            Tự do kết hợp ảnh, video, nhạc nền và tin nhắn ghi âm để tạo ra những trải nghiệm độc đáo như chính mối quan hệ của hai bạn. Giới hạn duy nhất là trí tưởng tượng của bạn.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
