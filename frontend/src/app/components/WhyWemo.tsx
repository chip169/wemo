import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Heart, Sparkles, Infinity as InfIcon, Zap } from "lucide-react";

const reasons = [
  {
    icon: Heart,
    title: "Mỗi Món Quà Là Một Câu Chuyện",
    description:
      "Biến những món quà đơn giản thành hành trình cảm xúc mà người nhận sẽ trân trọng mãi mãi. Tạo ra ký ức bền lâu, không chỉ là khoảnh khắc.",
    stat: "10x",
    statLabel: "Đáng Nhớ Hơn",
    color: "#E8B4A8",
  },
  {
    icon: Sparkles,
    title: "Cảm Xúc Hơn Quà Truyền Thống",
    description:
      "Kết hợp ảnh, video, tin nhắn giọng nói và âm nhạc để tạo trải nghiệm đa giác quan chạm đến trái tim.",
    stat: "98%",
    statLabel: "Tỷ Lệ Hài Lòng",
    color: "#D4AF78",
  },
  {
    icon: InfIcon,
    title: "Trải Nghiệm Cá Nhân Hóa Vô Hạn",
    description:
      "Không giới hạn ảnh, video hay tin nhắn. Cập nhật và thêm nội dung bất cứ lúc nào. Món quà lớn lên cùng mối quan hệ của bạn.",
    stat: "∞",
    statLabel: "Khả Năng",
    color: "#E8B4A8",
  },
  {
    icon: Zap,
    title: "Không Cần Cài Ứng Dụng",
    description:
      "Người nhận chỉ cần chạm và trải nghiệm. Hoạt động ngay lập tức trên bất kỳ điện thoại nào có NFC hoặc quét mã QR.",
    stat: "3 giây",
    statLabel: "Để Trải Nghiệm",
    color: "#D4AF78",
  },
];

function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const targetNumber = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (isNaN(targetNumber)) return;
    let start = 0;
    const end = targetNumber;
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);
    
    let timer = setInterval(() => {
      start += Math.ceil(end / 40); // step increase
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetNumber, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function WhyWemo() {
  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2
            className="mb-4 font-black text-stone-900 tracking-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
            }}
          >
            Tại Sao Chọn WEMO?
          </h2>
          <p className="max-w-xl mx-auto text-stone-500 text-sm sm:text-base leading-relaxed">
            Chúng tôi đang định nghĩa lại ý nghĩa của việc tặng quà có ý nghĩa trong thời đại số
          </p>
        </motion.div>

        {/* Reasons grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-3xl p-8 border border-stone-100 hover:border-stone-200 bg-white hover:scale-[1.01] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              style={{
                borderLeft: `4px solid ${reason.color}`
              }}
            >
              <div className="flex items-start gap-6">
                {/* Icon wrapper */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border border-stone-100 bg-[#FAFAFA]"
                >
                  <reason.icon className="w-5.5 h-5.5" style={{ color: reason.color }} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className="mb-3 text-lg font-bold text-stone-900"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {reason.title}
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mb-4">
                    {reason.description}
                  </p>

                  {/* Stat tag */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-xl" style={{ color: reason.color }}>
                      {reason.stat}
                    </span>
                    <span className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">
                      {reason.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Dark Stats banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[2.5rem] p-10 md:p-14 bg-[#0A0A0A] text-white shadow-2xl relative overflow-hidden"
        >
          {/* subtle glow ball in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(232,180,168,0.06),transparent_70%)] rounded-full pointer-events-none" />

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            {[
              { value: "50000+", label: "Quà Đã Tạo" },
              { value: "200+", label: "Quốc Gia" },
              { value: "1000000+", label: "Ký Ức Đã Chia Sẻ" },
              { value: "4.9/5", label: "Đánh Giá Trung Bình" },
            ].map((stat, i) => (
              <div key={i}>
                <div
                  className="font-bold mb-2 tracking-tight text-white"
                  style={{ 
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' 
                  }}
                >
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom elegant quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p
            className="italic max-w-2xl mx-auto text-stone-450 leading-relaxed font-serif"
            style={{ 
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)'
            }}
          >
            "Những món quà tốt nhất không được gói bằng giấy — chúng được gói bằng ký ức, cảm xúc và những khoảnh khắc tồn tại mãi mãi."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
