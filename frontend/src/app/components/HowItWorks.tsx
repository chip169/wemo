import { motion } from "motion/react";
import { Nfc, Layout, Upload, Heart } from "lucide-react";

const steps = [
  {
    icon: Nfc,
    title: "Chạm Thẻ NFC",
    description: "Người nhận chạm điện thoại vào hộp quà NFC - không cần cài ứng dụng",
    color: "#E8B4A8",
  },
  {
    icon: Layout,
    title: "Chọn Mẫu",
    description: "Chọn từ các mẫu đẹp: Sinh Nhật, Lãng Mạn, Giáng Sinh, Tốt Nghiệp...",
    color: "#D4AF78",
  },
  {
    icon: Upload,
    title: "Tải Ký Ức Lên",
    description: "Thêm ảnh, video, tin nhắn âm thanh và nội dung cá nhân hóa trong vài phút",
    color: "#E8B4A8",
  },
  {
    icon: Heart,
    title: "Trải Nghiệm Cảm Xúc",
    description: "Người nhận mở ra một trải nghiệm web tuyệt đẹp, cá nhân hóa đầy ký ức",
    color: "#D4AF78",
  },
];

export function HowItWorks() {
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
            Cách Thức Hoạt Động
          </h2>
          <p
            className="max-w-xl mx-auto text-stone-500 text-sm sm:text-base leading-relaxed"
          >
            Tạo trải nghiệm cảm xúc khó quên chỉ trong 4 bước đơn giản, trực quan và đầy cảm xúc
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Animated Connecting Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-[2px] -translate-y-1/2 bg-stone-100 z-0">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78]"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, rotateY: 30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className="relative"
                style={{ perspective: "1000px" }}
              >
                <div 
                  className="webo-glass-card rounded-[2rem] p-8 h-full flex flex-col items-center text-center relative hover:scale-[1.03] hover:shadow-xl transition-all duration-300 transform-style: preserve-3d"
                  style={{
                    borderTop: `4px solid ${step.color}`
                  }}
                >
                  {/* Step Large Decorative Number */}
                  <div className="absolute -top-6 left-8 text-7xl font-black font-display text-stone-100/50 pointer-events-none select-none">
                    {index + 1}
                  </div>

                  {/* Icon Container with subtle 3D lift */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotateZ: 5 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-stone-100 bg-white transform translateZ(20px)"
                  >
                    <step.icon className="w-7 h-7" style={{ color: step.color }} />
                  </motion.div>

                  {/* Title */}
                  <h3 
                    className="mb-3 text-lg font-bold text-stone-900"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
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
