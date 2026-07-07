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

export function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: '#FCEBE7' }}>
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
            Cách Thức Hoạt Động
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: '1.125rem',
              color: '#6B6B6B',
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
                className="relative"
              >
                <div 
                  className="webo-glass-card rounded-3xl p-8 h-full hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Step number */}
                  <div 
                    className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)',
                      color: 'white',
                    }}
                  >
                    {index + 1}
                  </div>

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
                    className="mb-3"
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#1A1818',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ color: '#6B6B6B', lineHeight: 1.6 }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
