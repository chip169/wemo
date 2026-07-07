import { motion } from "motion/react";
import { Check, Sparkles, Crown, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const faqs = [
  {
    q: "Kích thước 9cm và 12cm khác nhau như thế nào?",
    a: "Phiên bản 9cm nhỏ gọn, tinh tế và rất thích hợp để trang trí bàn học/làm việc. Phiên bản 12cm có kích thước lớn hơn, được dựng hình phôi 3D thủ công sắc nét và tỉ mỉ hơn, giúp các chi tiết khuôn mặt và trang phục hiển thị nổi bật, sống động hơn.",
  },
  {
    q: "Tôi có được giảm giá khi đặt số lượng lớn cho sự kiện/đám cưới không?",
    a: "Có! Chúng tôi có chính sách chiết khấu vô cùng hấp dẫn (lên đến 30%) cho các đơn hàng từ 5 sản phẩm trở lên. Ngoài ra WEMO hỗ trợ tùy biến riêng bao bì, thiệp chúc và khắc tên/logo lên phần đế gỗ cho các đơn sự kiện.",
  },
  {
    q: "Chip NFC ẩn trên mô hình Figure hoạt động như thế nào?",
    a: "Mỗi mô hình Figure của WEMO đều được tích hợp một chip NFC ẩn thông minh bên dưới đế. Khi người nhận dùng điện thoại chạm nhẹ vào đế Figure, màn hình điện thoại sẽ tự động mở ra trang thiệp 3D độc bản chứa lời chúc, âm nhạc và những hình ảnh kỷ niệm của hai bạn.",
  },
];

export function PricingPage() {
  const plans = [
    {
      name: "Figure Chibi 9cm",
      icon: Sparkles,
      price: "650.000đ",
      period: "/sản phẩm",
      description: "Kích thước tiêu chuẩn tinh tế, phù hợp để bàn làm việc.",
      color: "#E8B4A8",
      textColor: "#8A4F43",
      features: [
        "Kích thước chiều cao: 9cm",
        "Vẽ chân dung Chibi AI miễn phí",
        "Dựng hình mô hình 3D độc bản",
        "Chất liệu nhựa in 3D cao cấp",
        "Tùy chọn đế mica / đế gỗ khắc tên",
        "Tích hợp chip NFC ẩn thông minh",
        "Hộp quà & thiệp chúc thiết kế riêng",
      ],
      cta: "Mua Ngay",
      popular: false,
    },
    {
      name: "Figure Chibi 12cm",
      icon: Crown,
      price: "800.000đ",
      period: "/sản phẩm",
      description: "Bản cao cấp sắc nét, cân đối và được ưa chuộng nhất.",
      color: "#D4AF78",
      textColor: "#735629",
      features: [
        "Kích thước chiều cao: 12cm",
        "Vẽ chân dung Chibi AI không giới hạn",
        "Chi tiết mô hình sắc nét vượt trội",
        "Dựng hình phôi 3D tỉ mỉ thủ công",
        "Tặng kèm đế mica hoặc đế gỗ",
        "Tích hợp chip NFC ẩn thông minh",
        "Hỗ trợ ưu tiên & Giao hàng nhanh",
      ],
      cta: "Mua Ngay",
      popular: true,
    },
    {
      name: "Sự Kiện / Doanh Nghiệp",
      icon: Building2,
      price: "Liên Hệ",
      period: "",
      description: "Đặt số lượng lớn cho sự kiện, tiệc cưới, quà tặng doanh nghiệp.",
      color: "#1C1917",
      textColor: "#5C5C5C",
      features: [
        "Áp dụng đơn hàng từ 5 sản phẩm",
        "Chiết khấu đặc biệt lên đến 30%",
        "Thiết kế chibi đồng loạt theo chủ đề",
        "Tùy biến bao bì & thiệp chúc thương hiệu",
        "Khắc tên/Logo thương hiệu lên đế gỗ",
        "Hỗ trợ giao nhận đa địa chỉ",
        "Thiết kế mẫu duyệt trước miễn phí",
      ],
      cta: "Nhận Báo Giá",
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
            <Sparkles className="w-3.5 h-3.5" /> WEMO PRICING
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
            Sở Hữu Figure Chibi <span style={{ color: "#E8B4A8" }}>Độc Bản</span>
          </h1>
          <p
            className="max-w-2xl mx-auto"
            style={{ fontSize: "1.25rem", color: "#5A5A5A", lineHeight: 1.6 }}
          >
            Chọn kích thước phù hợp với sở thích của bạn. Mỗi mô hình Figure Chibi 3D là một tác phẩm nghệ thuật cá nhân hóa được lưu giữ mãi mãi.
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
                      {plan.period}
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
                  to={plan.price === "Liên Hệ" ? "/faq" : "/order"}
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
