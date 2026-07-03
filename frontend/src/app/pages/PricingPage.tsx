import { useState } from "react";
import { motion } from "motion/react";
import { Check, Sparkles, Crown, Layers, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const faqs = [
  {
    q: "Kích thước 6cm và 9cm khác nhau như thế nào về tính năng?",
    a: "Cả hai phiên bản đều sở hữu công nghệ Memobox độc quyền. Bản 9cm mang lại không gian hiển thị lớn hơn, trải nghiệm hình ảnh sống động hơn và được mở khóa các tính năng cao cấp như không giới hạn dung lượng ảnh/video và tùy chỉnh hiệu ứng chuyển động.",
  },
  {
    q: "Tôi có được giảm giá khi mua số lượng lớn cho sự kiện không?",
    a: "Có! Gói Combo 6 là giải pháp thiết kế sẵn để tối ưu chi phí cho bạn. Nếu bạn có nhu cầu đặt số lượng lớn hơn cho doanh nghiệp hoặc tiệc cưới, vui lòng liên hệ bộ phận chăm sóc khách hàng để nhận báo giá chi tiết.",
  },
  {
    q: "Nội dung hình ảnh và video trên Memobox có lưu trữ mãi mãi không?",
    a: "Hoàn toàn mãi mãi. Sau khi mua và kích hoạt sản phẩm, hệ thống lưu trữ đám mây của chúng tôi đảm bảo người nhận có thể quét và xem lại những thước phim kỷ niệm bất cứ lúc nào mà không phát sinh thêm chi phí tháng.",
  },
];

export function PricingPage() {
  // State quản lý size cho gói Combo 6 ('6cm' hoặc '9cm')
  const [comboSize, setComboSize] = useState<"6cm" | "9cm">("6cm");

  // Dữ liệu động của gói Combo 6 dựa trên state size
  const comboDetails = {
    "6cm": {
      price: "3.200.000đ",
      originalPrice: "3.600.000đ",
      saving: "400.000đ",
      sizeText: "Kích thước khối: 6cm x 6cm (Trọn bộ 6 hộp)",
    },
    "9cm": {
      price: "3.700.000đ",
      originalPrice: "4.200.000đ",
      saving: "500.000đ",
      sizeText: "Kích thước lớn: 9cm x 9cm (Trọn bộ 6 hộp Premium)",
    },
  };

  const plans = [
    {
      name: "Standard (6cm)",
      icon: Sparkles,
      price: "600.000đ",
      hasToggle: false,
      description:
        "Kích thước tiêu chuẩn tinh tế, hoàn hảo cho món quà cá nhân lưu giữ kỷ niệm.",
      color: "#FFD4D4",
      textColor: "#9C4141",
      features: [
        "Kích thước khối: 6cm x 6cm",
        "Công nghệ hiển thị Memobox",
        "Tích hợp chip NFC cao cấp",
        "Tối đa 20 hình ảnh kỷ niệm",
        "Tối đa 3 video ngắn",
        "Hỗ trợ cài đặt âm nhạc nền",
        "Bảo hành kỹ thuật 12 tháng",
      ],
      cta: "Chọn Gói Standard",
      popular: false,
    },
    {
      name: "Premium (9cm)",
      icon: Crown,
      price: "800.000đ",
      hasToggle: false,
      description:
        "Phiên bản cao cấp kích thước lớn, trải nghiệm thị giác sống động và sang trọng vượt trội.",
      color: "#E8B4A8",
      textColor: "#8A4F43",
      features: [
        "Kích thước lớn: 9cm x 9cm",
        "Không gian hiển thị rộng rãi hơn 1.5x",
        "Tải ảnh & video không giới hạn",
        "Tích hợp tin nhắn giọng nói độc quyền",
        "Tùy chỉnh giao diện hiển thị mẫu",
        "Hiệu ứng chuyển động (Animation) cao cấp",
        "Hỗ trợ ưu tiên 24/7",
      ],
      cta: "Sở Hữu Bản Premium",
      popular: true,
    },
    {
      name: "Combo 6 bánh tùy size",
      icon: Layers,
      price: comboDetails[comboSize].price,
      originalPrice: comboDetails[comboSize].originalPrice,
      saving: comboDetails[comboSize].saving,
      hasToggle: true,
      description:
        "Giải pháp hoàn hảo cho quà tặng sự kiện, đám cưới, gia đình hoặc doanh nghiệp.",
      color: "#D4AF78",
      textColor: "#735629",
      features: [
        "Bao gồm trọn bộ 6 hộp Memobox",
        comboDetails[comboSize].sizeText,
        `Tiết kiệm ngay ${comboDetails[comboSize].saving} so với mua lẻ`,
        "Hỗ trợ thiết kế giao diện hàng loạt theo yêu cầu",
        "Tích hợp logo thương hiệu/nội dung tùy biến",
        "Quản lý nội dung tất cả các hộp tập trung",
        "Giao hàng miễn phí toàn quốc",
      ],
      cta: "Đặt Hàng Combo",
      popular: false,
    },
  ];

  return (
    <div
      className="pt-28 relative overflow-hidden"
      style={{ background: "#FAF8F5" }}
    >
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#E8B4A8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#D4AF78]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <section className="py-20 text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
            style={{ background: "rgba(232,180,168,0.15)", color: "#8A4F43" }}
          >
            <Sparkles className="w-3.5 h-3.5" /> MEMOBOX PRICING
          </span>
          <h1
            className="mb-6 tracking-tight"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              color: "#1A1818",
              lineHeight: 1.15,
            }}
          >
            Lưu Giữ Kỷ Niệm <span style={{ color: "#E8B4A8" }}>Trọn Vẹn</span>
          </h1>
          <p
            className="max-w-2xl mx-auto"
            style={{ fontSize: "1.25rem", color: "#5A5A5A", lineHeight: 1.6 }}
          >
            Chọn kích thước phù hợp với không gian của bạn. Mỗi hộp Memobox là
            một câu chuyện tình yêu và ký ức được bảo tồn mãi mãi.
          </p>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="relative flex flex-col"
            >
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full font-bold text-white text-xs uppercase tracking-widest shadow-md z-20"
                  style={{
                    background:
                      "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
                  }}
                >
                  Khuyên Dùng
                </div>
              )}

              <div
                className="rounded-3xl p-8 h-full flex flex-col backdrop-blur-sm bg-white/90"
                style={{
                  border: plan.popular
                    ? "2px solid #E8B4A8"
                    : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: plan.popular
                    ? "0 25px 50px -12px rgba(232,180,168,0.3)"
                    : "0 20px 40px -15px rgba(0,0,0,0.05)",
                }}
              >
                {/* Header Icon & Size Toggle if applicable */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                    style={{ background: plan.color }}
                  >
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Inline Size Selector Toggle ONLY for Combo Card */}
                  {plan.hasToggle && (
                    <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 shadow-inner">
                      <button
                        onClick={() => setComboSize("6cm")}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          comboSize === "6cm"
                            ? "bg-white text-neutral-900 shadow-sm"
                            : "text-neutral-400 hover:text-neutral-600"
                        }`}
                      >
                        6cm
                      </button>
                      <button
                        onClick={() => setComboSize("9cm")}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          comboSize === "9cm"
                            ? "bg-white text-neutral-900 shadow-sm"
                            : "text-neutral-400 hover:text-neutral-600"
                        }`}
                      >
                        9cm
                      </button>
                    </div>
                  )}

                  {plan.popular && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E8B4A8]/10 text-[#8A4F43]">
                      Biên tập lựa chọn
                    </span>
                  )}
                </div>

                {/* Plan Name */}
                <h3
                  className="mb-2"
                  style={{
                    fontSize: "1.65rem",
                    fontWeight: 800,
                    color: "#1A1818",
                  }}
                >
                  {plan.name}
                </h3>

                {/* Description */}
                <p
                  className="mb-6 min-h-[44px]"
                  style={{
                    color: "#6B6B6B",
                    fontSize: "0.95rem",
                    lineHeight: 1.5,
                  }}
                >
                  {plan.description}
                </p>

                {/* Price block featuring crossed original price */}
                <div className="mb-8 bg-neutral-50 p-4 rounded-2xl flex flex-col justify-center min-h-[92px]">
                  {plan.originalPrice && (
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm line-through text-neutral-400 font-medium">
                        {plan.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 uppercase tracking-wider">
                        Tiết kiệm {plan.saving}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: 800,
                        color: "#1A1818",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-sm font-medium text-neutral-400 ml-1">
                      /bộ
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${plan.color}30` }}
                      >
                        <Check
                          className="w-3.5 h-3.5"
                          style={{ color: plan.textColor }}
                        />
                      </div>
                      <span className="text-neutral-700 text-sm font-medium group-hover:text-neutral-900 transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  to="/order"
                  className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                  style={
                    plan.popular
                      ? {
                          background:
                            "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
                          color: "white",
                        }
                      : {
                          background: "white",
                          color: "#1A1818",
                          border: `1.5px solid ${plan.color}`,
                        }
                  }
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-sm font-medium flex items-center justify-center gap-2"
          style={{ color: "#6B6B6B" }}
        >
          <span>📦 Đổi trả miễn phí trong 7 ngày nếu có lỗi sản xuất</span>
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
          <span>Bảo mật dữ liệu tuyệt đối</span>
        </motion.p>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative z-10 border-t border-neutral-100 pt-20">
        <h2
          className="text-center mb-12 tracking-tight"
          style={{ fontSize: "2.25rem", fontWeight: 800, color: "#1A1818" }}
        >
          Câu Hỏi Thường Gặp
        </h2>

        <div className="grid md:grid-cols-1 gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-6 bg-white border border-neutral-100"
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              }}
            >
              <h4
                className="mb-2.5 text-base font-bold flex items-start gap-2.5"
                style={{ color: "#1A1818" }}
              >
                <span className="text-[#E8B4A8] font-black">Q.</span>
                {faq.q}
              </h4>
              <p
                className="pl-6 text-neutral-600"
                style={{ lineHeight: 1.6, fontSize: "0.95rem" }}
              >
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
