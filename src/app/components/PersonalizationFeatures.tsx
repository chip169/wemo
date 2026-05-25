import { motion } from "motion/react";
import { Image, Video, Mic, Sparkles, Music, Clock, QrCode, Smartphone } from "lucide-react";

const features = [
  {
    icon: Image,
    title: "Tải Ảnh Lên",
    description: "Thêm ảnh không giới hạn để tạo bộ sưu tập và trình chiếu ấn tượng",
    color: "#FFD4D4",
  },
  {
    icon: Video,
    title: "Tải Video Lên",
    description: "Chia sẻ video nhắn tin và những khoảnh khắc quý giá được ghi lại",
    color: "#E8B4A8",
  },
  {
    icon: Mic,
    title: "Tin Nhắn Giọng Nói",
    description: "Ghi âm lời nhắn cá nhân phát ra đúng thời điểm hoàn hảo",
    color: "#D4AF78",
  },
  {
    icon: Sparkles,
    title: "Hoạt Ảnh Động",
    description: "Hiệu ứng chuyển cảnh đẹp mắt, pháo hoa confetti và các yếu tố tương tác",
    color: "#FFD4D4",
  },
  {
    icon: Music,
    title: "Tích Hợp Âm Nhạc",
    description: "Thêm nhạc nền hoặc bài hát đặc biệt để tạo không khí",
    color: "#E8B4A8",
  },
  {
    icon: Clock,
    title: "Hộp Thời Gian",
    description: "Lên lịch tin nhắn được tiết lộ vào ngày và dịp quan trọng trong tương lai",
    color: "#D4AF78",
  },
  {
    icon: QrCode,
    title: "Hỗ Trợ QR + NFC",
    description: "Hoạt động với cả thẻ NFC và mã QR truyền thống",
    color: "#FFD4D4",
  },
  {
    icon: Smartphone,
    title: "Thân Thiện Với Di Động",
    description: "Trải nghiệm hoàn hảo trên mọi thiết bị - không cần cài ứng dụng",
    color: "#E8B4A8",
  },
];

export function PersonalizationFeatures() {
  return (
    <section className="relative py-24" style={{ background: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 
            className="mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700,
              color: '#1A1818',
            }}
          >
            Tính Năng Cá Nhân Hóa
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: '1.125rem',
              color: '#6B6B6B',
              lineHeight: 1.6,
            }}
          >
            Mỗi chi tiết đều quan trọng. Tạo trải nghiệm thực sự độc đáo với các công cụ tùy chỉnh mạnh mẽ của chúng tôi
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="webo-glass-card rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: feature.color,
                  boxShadow: `0 8px 20px ${feature.color}40`,
                }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <h3 
                className="mb-2"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1A1818',
                }}
              >
                {feature.title}
              </h3>
              <p 
                style={{ 
                  fontSize: '0.875rem',
                  color: '#6B6B6B',
                  lineHeight: 1.6,
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Feature highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 webo-glass-card rounded-3xl p-8 md:p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 212, 212, 0.3) 0%, rgba(232, 180, 168, 0.3) 100%)',
          }}
        >
          <Sparkles 
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: '#E8B4A8' }}
          />
          <h3 
            className="mb-3"
            style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#1A1818',
            }}
          >
            Khả Năng Vô Hạn
          </h3>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: '1.125rem',
              color: '#6B6B6B',
              lineHeight: 1.6,
            }}
          >
            Kết hợp tất cả các tính năng này để tạo ra những trải nghiệm độc đáo như chính mối quan hệ của bạn.
            Giới hạn duy nhất là trí tưởng tượng của bạn.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
