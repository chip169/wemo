import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Heart, Sparkles, Infinity, Zap } from "lucide-react";

const reasons = [
  {
    icon: Heart,
    title: "Mỗi Món Quà Là Một Câu Chuyện",
    description:
      "Biến những món quà đơn giản thành hành trình cảm xúc mà người nhận sẽ trân trọng mãi mãi. Tạo ra ký ức bền lâu, không chỉ là khoảnh khắc.",
    stat: "10x",
    statLabel: "Đáng Nhớ Hơn",
    color: "#FFD4D4",
  },
  {
    icon: Sparkles,
    title: "Cảm Xúc Hơn Quà Truyền Thống",
    description:
      "Kết hợp ảnh, video, tin nhắn giọng nói và âm nhạc để tạo trải nghiệm đa giác quan chạm đến trái tim.",
    stat: "98%",
    statLabel: "Tỷ Lệ Hài Lòng",
    color: "#E8B4A8",
  },
  {
    icon: Infinity,
    title: "Trải Nghiệm Cá Nhân Hóa Vô Hạn",
    description:
      "Không giới hạn ảnh, video hay tin nhắn. Cập nhật và thêm nội dung bất cứ lúc nào. Món quà lớn lên cùng mối quan hệ của bạn.",
    stat: "∞",
    statLabel: "Khả Năng",
    color: "#D4AF78",
  },
  {
    icon: Zap,
    title: "Không Cần Cài Ứng Dụng",
    description:
      "Người nhận chỉ cần chạm và trải nghiệm. Hoạt động ngay lập tức trên bất kỳ điện thoại nào có NFC hoặc quét mã QR.",
    stat: "3 giây",
    statLabel: "Để Trải Nghiệm",
    color: "#FFD4D4",
  },
];

function ReasonCard({ reason }: { reason: typeof reasons[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlightPos({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="webo-glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/50"
    >
      {/* Spotlight Effect */}
      {isHovered && (
        <div
          className="absolute pointer-events-none rounded-full blur-[40px] opacity-60 transition-opacity duration-300"
          style={{
            width: '160px',
            height: '160px',
            left: spotlightPos.x - 80,
            top: spotlightPos.y - 80,
            background: 'radial-gradient(circle, rgba(232,180,168,0.3) 0%, rgba(212,175,120,0) 70%)',
            zIndex: 0,
          }}
        />
      )}

      <div className="flex items-start gap-6 relative z-10">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: reason.color,
            boxShadow: `0 8px 20px ${reason.color}40`,
          }}
        >
          <reason.icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className="mb-3 font-bold text-[#1A1818]"
            style={{
              fontSize: "1.5rem",
            }}
          >
            {reason.title}
          </h3>
          <p
            className="mb-4 text-stone-500 text-sm leading-relaxed"
          >
            {reason.description}
          </p>

          {/* Stat */}
          <div className="flex items-baseline gap-2">
            <span
              className="font-bold text-3xl"
              style={{
                color: reason.color,
              }}
            >
              {reason.stat}
            </span>
            <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">
              {reason.statLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WhyWemo() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#FAF3F0] to-[#FCE1DA]">
      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -60, 50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-[#E8B4A8]/15 to-[#D4AF78]/15 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-[#D4AF78]/15 to-[#E8B4A8]/15 blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="mb-4 font-bold text-[#1A1818]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.2,
            }}
          >
            Tại Sao Chọn WEMO?
          </h2>
          <p
            className="max-w-2xl mx-auto text-stone-500 text-base leading-relaxed"
          >
            Chúng tôi đang định nghĩa lại ý nghĩa của việc tặng quà có ý nghĩa trong thời đại số
          </p>
        </motion.div>

        {/* Reasons grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <ReasonCard reason={reason} />
            </motion.div>
          ))}
        </div>

        {/* Stats banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 md:p-12"
          style={{
            background: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
            boxShadow: "0 20px 60px rgba(232, 180, 168, 0.4)",
          }}
        >
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "50,000+", label: "Quà Đã Tạo" },
              { value: "200+", label: "Quốc Gia" },
              { value: "1M+", label: "Ký Ức Được Chia Sẻ" },
              { value: "4.9/5", label: "Đánh Giá Trung Bình" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="font-bold mb-2"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "1rem", opacity: 0.9 }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p
            className="italic max-w-3xl mx-auto text-stone-500 text-lg leading-relaxed"
          >
            "Những món quà tốt nhất không được gói bằng giấy — chúng được gói bằng ký ức, cảm xúc và những khoảnh khắc tồn tại mãi mãi."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
