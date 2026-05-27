import { motion } from "motion/react";
import { Check, Sparkles, Crown, Building2 } from "lucide-react";

const plans = [
  {
    name: "Cơ Bản",
    icon: Sparkles,
    price: "199.000đ",
    period: "/quà",
    description: "Hoàn hảo để khám phá WEMO",
    color: "#FFD4D4",
    features: [
      "1 trải nghiệm quà NFC",
      "Tối đa 20 ảnh",
      "Tối đa 3 video",
      "1 tin nhắn giọng nói",
      "Chọn từ 6 mẫu thiết kế",
      "Mã QR thay thế",
      "Tối ưu hóa di động",
      "Hỗ trợ qua email",
    ],
    cta: "Bắt Đầu",
    popular: false,
  },
  {
    name: "Cao Cấp",
    icon: Crown,
    price: "499.000đ",
    period: "/quà",
    description: "Phổ biến nhất cho các dịp đặc biệt",
    color: "#E8B4A8",
    features: [
      "Ảnh & video không giới hạn",
      "Tin nhắn giọng nói không giới hạn",
      "Tích hợp âm nhạc",
      "Tất cả mẫu cao cấp",
      "Thương hiệu tùy chỉnh",
      "Hoạt ảnh nâng cao",
      "Tính năng hộp thời gian",
      "Hỗ trợ ưu tiên",
      "Phân tích quà tặng",
      "Cập nhật bất cứ lúc nào",
    ],
    cta: "Dùng Cao Cấp",
    popular: true,
  },
  {
    name: "Doanh Nghiệp",
    icon: Building2,
    price: "Liên Hệ",
    period: "/báo giá",
    description: "Cho sự kiện, đám cưới & quà doanh nghiệp",
    color: "#D4AF78",
    features: [
      "Tất cả trong gói Cao Cấp",
      "Tạo quà hàng loạt",
      "Thiết kế mẫu tùy chỉnh",
      "Tùy chọn nhãn trắng",
      "Truy cập API",
      "Cộng tác nhóm",
      "Quản lý tài khoản riêng",
      "Bảng phân tích",
      "Tên miền tùy chỉnh",
      "SLA doanh nghiệp",
    ],
    cta: "Liên Hệ Tư Vấn",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="relative py-24" style={{ background: "#FAF8F5" }}>
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
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              color: "#1A1818",
            }}
          >
            Bảng Giá Đơn Giản, Minh Bạch
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: "1.125rem",
              color: "#6B6B6B",
              lineHeight: 1.6,
            }}
          >
            Chọn gói phù hợp với nhu cầu tặng quà của bạn. Không phí ẩn, không
            bất ngờ.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {/* Popular badge */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-semibold text-white text-sm shadow-lg z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
                  }}
                >
                  Phổ Biến Nhất
                </motion.div>
              )}

              {/* Card */}
              <div
                className="rounded-3xl p-8 h-full flex flex-col"
                style={{
                  background: plan.popular
                    ? "linear-gradient(135deg, rgba(232, 180, 168, 0.1) 0%, rgba(212, 175, 120, 0.1) 100%)"
                    : "var(--webo-glass-white)",
                  backdropFilter: "blur(20px)",
                  border: plan.popular
                    ? "2px solid #E8B4A8"
                    : "1px solid rgba(255,255,255,0.3)",
                  boxShadow: plan.popular
                    ? "0 20px 60px rgba(232, 180, 168, 0.3)"
                    : "0 8px 32px rgba(31, 38, 135, 0.15)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: plan.color,
                    boxShadow: `0 8px 20px ${plan.color}40`,
                  }}
                >
                  <plan.icon className="w-7 h-7 text-white" />
                </div>

                {/* Plan name & description */}
                <h3
                  className="mb-2"
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 600,
                    color: "#1A1818",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  className="mb-6"
                  style={{
                    color: "#6B6B6B",
                    fontSize: "0.9375rem",
                  }}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-bold"
                      style={{
                        fontSize: "3rem",
                        color: "#1A1818",
                      }}
                    >
                      {plan.price}
                    </span>
                    <span style={{ color: "#6B6B6B" }}>{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: plan.color }}
                      />
                      <span style={{ color: "#1A1818", fontSize: "0.9375rem" }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Money back guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p style={{ color: "#6B6B6B" }}>
            ✨ Hoàn tiền trong 30 ngày cho tất cả các gói • Không cần giải thích
          </p>
        </motion.div>
      </div>
    </section>
  );
}
