import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function PersonalizationFeatures() {
  return (
    <section className="relative py-16 md:py-24 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Feature highlight banner - Khả Năng Vô Hạn */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-stone-100 rounded-[2.5rem] p-10 md:p-16 text-center bg-white shadow-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(232, 180, 168, 0.03) 0%, rgba(212, 175, 120, 0.03) 100%)',
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
