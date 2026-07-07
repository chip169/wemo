import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Nfc, Layout, Upload, Heart } from "lucide-react";

const steps = [
  {
    icon: Nfc,
    title: "Chạm Thẻ NFC",
    description: "Người nhận chạm điện thoại vào hộp quà NFC - không cần cài ứng dụng",
    color: "#FFD4D4",
  },
  {
    icon: Layout,
    title: "Chọn Mẫu",
    description: "Chọn từ các mẫu đẹp: Sinh Nhật, Lãng Mạn, Giáng Sinh, Tốt Nghiệp & nhiều hơn",
    color: "#E8B4A8",
  },
  {
    icon: Upload,
    title: "Tải Ký Ức Lên",
    description: "Thêm ảnh, video, tin nhắn âm thanh và nội dung cá nhân hóa trong vài phút",
    color: "#D4AF78",
  },
  {
    icon: Heart,
    title: "Trải Nghiệm Cảm Xúc",
    description: "Người nhận mở ra một trải nghiệm web tuyệt đẹp, cá nhân hóa đầy ký ức của bạn",
    color: "#FFD4D4",
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
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
      className="webo-glass-card rounded-3xl p-8 h-full hover:shadow-2xl transition-all duration-300 relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/50"
    >
      {/* Spotlight effect */}
      {isHovered && (
        <div
          className="absolute pointer-events-none rounded-full blur-[40px] opacity-60 transition-opacity duration-300"
          style={{
            width: '150px',
            height: '150px',
            left: spotlightPos.x - 75,
            top: spotlightPos.y - 75,
            background: 'radial-gradient(circle, rgba(232,180,168,0.3) 0%, rgba(212,175,120,0) 70%)',
            zIndex: 0,
          }}
        />
      )}

      {/* Step number */}
      <div 
        className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md z-10"
        style={{
          background: 'linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)',
          color: 'white',
          fontSize: '14px',
        }}
      >
        {index + 1}
      </div>

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: step.color,
            boxShadow: `0 8px 20px ${step.color}40`,
          }}
        >
          <step.icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Content */}
        <h3 
          className="mb-3 font-bold text-[#1A1818]"
          style={{
            fontSize: '1.25rem',
          }}
        >
          {step.title}
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#FFF0EC] to-[#FCE1DA]">
      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 60, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-[#D4AF78]/15 to-[#E8B4A8]/15 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-[#E8B4A8]/15 to-[#D4AF78]/15 blur-[100px]"
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
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.2,
            }}
          >
            Cách Thức Hoạt Động
          </h2>
          <p
            className="max-w-2xl mx-auto text-stone-500"
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
            }}
          >
            Tạo trải nghiệm cảm xúc khó quên chỉ trong 4 bước đơn giản
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <motion.path
                d="M 0 0 Q 25 50, 50 0 T 100 0"
                stroke="#E8B4A8"
                strokeWidth="2"
                fill="none"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative h-full"
              >
                <StepCard step={step} index={index} />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
