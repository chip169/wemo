import { motion } from "motion/react";
import { Check, Sparkles, Crown, Building2, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Cơ Bản",
    icon: Sparkles,
    price: "199.000đ",
    period: "/quà",
    description: "Hoàn hảo để khám phá WEMO lần đầu",
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

const faqs = [
  {
    q: "Tôi có thể nâng cấp gói sau này không?",
    a: "Có! Bạn có thể nâng cấp từ Cơ Bản lên Cao Cấp hoặc Doanh Nghiệp bất cứ lúc nào. Sự chênh lệch giá sẽ được tính theo tỷ lệ.",
  },
  {
    q: "Gói Cơ Bản có thời hạn không?",
    a: "Không! Một lần thanh toán, trải nghiệm tồn tại mãi mãi. Người nhận có thể xem lại bất cứ lúc nào.",
  },
  {
    q: "Gói Doanh Nghiệp phù hợp với đám cưới không?",
    a: "Hoàn toàn phù hợp! Chúng tôi hỗ trợ tạo hàng trăm quà cùng lúc, lý tưởng cho đám cưới, sự kiện công ty và hội nghị.",
  },
];

export function PricingPage() {
  return (
    <div className="pt-20" style={{ background: "#FAF8F5" }}>
      {/* Hero */}
      <section className="py-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ background: "rgba(232,180,168,0.2)", color: "#E8B4A8" }}
          >
            Bảng Giá
          </span>
          <h1
            className="mb-4"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#1A1818",
              lineHeight: 1.2,
            }}
          >
            Đơn Giản & Minh Bạch
          </h1>
          <p
            className="max-w-2xl mx-auto"
            style={{ fontSize: "1.125rem", color: "#6B6B6B", lineHeight: 1.6 }}
          >
            Không phí ẩn, không bất ngờ. Chọn gói phù hợp và bắt đầu tạo ký ức
            ngay hôm nay.
          </p>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-semibold text-white text-sm shadow-lg z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
                  }}
                >
                  Phổ Biến Nhất
                </div>
              )}
              <div
                className="rounded-3xl p-8 h-full flex flex-col"
                style={{
                  background: plan.popular
                    ? "linear-gradient(135deg, rgba(232,180,168,0.08) 0%, rgba(212,175,120,0.08) 100%)"
                    : "white",
                  border: plan.popular
                    ? "2px solid #E8B4A8"
                    : "1px solid rgba(0,0,0,0.08)",
                  boxShadow: plan.popular
                    ? "0 20px 60px rgba(232,180,168,0.25)"
                    : "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: plan.color,
                    boxShadow: `0 8px 20px ${plan.color}50`,
                  }}
                >
                  <plan.icon className="w-7 h-7 text-white" />
                </div>

                <h3
                  className="mb-1"
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "#1A1818",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  className="mb-6"
                  style={{ color: "#6B6B6B", fontSize: "0.9375rem" }}
                >
                  {plan.description}
                </p>

                <div className="mb-8 flex items-baseline gap-2">
                  <span
                    style={{
                      fontSize: "2.75rem",
                      fontWeight: 700,
                      color: "#1A1818",
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ color: "#6B6B6B" }}>{plan.period}</span>
                </div>

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

                <button
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                  style={
                    plan.popular
                      ? {
                          background:
                            "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
                          color: "white",
                        }
                      : { background: `${plan.color}20`, color: "#1A1818" }
                  }
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
          style={{ color: "#6B6B6B" }}
        >
          ✨ Hoàn tiền trong 30 ngày cho tất cả các gói • Không cần giải thích
        </motion.p>
      </section>

      {/* FAQ mini */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2
          className="text-center mb-10"
          style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1A1818" }}
        >
          Câu Hỏi Về Bảng Giá
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-6"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <h4 className="mb-2 font-semibold" style={{ color: "#1A1818" }}>
                {faq.q}
              </h4>
              <p
                style={{
                  color: "#6B6B6B",
                  lineHeight: 1.6,
                  fontSize: "0.9375rem",
                }}
              >
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="/faq"
            style={{ color: "#E8B4A8", fontWeight: 600, fontSize: "0.9375rem" }}
          >
            Xem tất cả câu hỏi thường gặp →
          </a>
        </div>
      </section>
    </div>
  );
}
