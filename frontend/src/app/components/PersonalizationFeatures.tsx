import { motion } from "motion/react";
import { useState, useRef } from "react";
import { Image, Video, Mic, Sparkles, Music, Clock, QrCode, Smartphone } from "lucide-react";

const features = [
  {
    icon: Image,
    title: "Tải Ảnh Lên",
    description: "Thêm ảnh không giới hạn để tạo bộ sưu tập trình chiếu độc đáo",
    color: "#E8B4A8",
  },
  {
    icon: Video,
    title: "Tải Video Lên",
    description: "Chia sẻ video nhắn tin và những thước phim quý giá",
    color: "#D4AF78",
  },
  {
    icon: Mic,
    title: "Tin Nhắn Thoại",
    description: "Ghi âm lời nhắn cá nhân phát ra đúng thời điểm hoàn hảo",
    color: "#E8B4A8",
  },
  {
    icon: Sparkles,
    title: "Hiệu Ứng Động",
    description: "Hiệu ứng chuyển cảnh đẹp mắt, pháo hoa confetti sinh động",
    color: "#D4AF78",
  },
  {
    icon: Music,
    title: "Nhạc Nền Tùy Chọn",
    description: "Thêm nhạc nền hoặc bài hát yêu thích để khơi gợi cảm xúc",
    color: "#E8B4A8",
  },
  {
    icon: Clock,
    title: "Hẹn Giờ Mở Quà",
    description: "Lên lịch hiển thị tin nhắn vào đúng ngày giờ quan trọng",
    color: "#D4AF78",
  },
  {
    icon: QrCode,
    title: "Hỗ Trợ QR + NFC",
    description: "Hoạt động mượt mà với cả chạm NFC và quét mã QR",
    color: "#E8B4A8",
  },
  {
    icon: Smartphone,
    title: "Tương Thích Mọi Thiết Bị",
    description: "Trải nghiệm hoàn hảo trên điện thoại - không cần cài app",
    color: "#D4AF78",
  },
];

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotateX((yc - y) / 8);
    setRotateY((x - xc) / 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      <div 
        className="webo-glass-card rounded-[2rem] p-6 text-center border border-stone-100 flex flex-col items-center justify-between h-full min-h-[220px]"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out, box-shadow 0.3s ease",
          background: "#FFFFFF",
          boxShadow: rotateX !== 0 ? "0 20px 40px rgba(0,0,0,0.05)" : "none"
        }}
      >
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-stone-100 bg-[#FAFAFA]"
        >
          <feature.icon className="w-5.5 h-5.5" style={{ color: feature.color }} />
        </motion.div>

        {/* Content */}
        <div>
          <h3 
            className="mb-2 text-base font-bold text-stone-900"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {feature.title}
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed max-w-[200px] mx-auto">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PersonalizationFeatures() {
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
            Tính Năng Cá Nhân Hóa
          </h2>
          <p
            className="max-w-xl mx-auto text-stone-500 text-sm sm:text-base leading-relaxed"
          >
            Mỗi chi tiết đều quan trọng. Tạo trải nghiệm thực sự độc đáo với các công cụ tùy chỉnh mạnh mẽ của chúng tôi
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="h-full"
            >
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </div>

        {/* Feature highlight banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 border border-stone-100 rounded-3xl p-8 md:p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(232, 180, 168, 0.03) 0%, rgba(212, 175, 120, 0.03) 100%)',
          }}
        >
          <Sparkles 
            className="w-10 h-10 mx-auto mb-4 text-[#E8B4A8]"
          />
          <h3 
            className="mb-3 text-2xl font-bold text-stone-900"
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
            Kết hợp tất cả các tính năng này để tạo ra những trải nghiệm độc đáo như chính mối quan hệ của hai bạn. Giới hạn duy nhất là trí tưởng tượng của bạn.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
