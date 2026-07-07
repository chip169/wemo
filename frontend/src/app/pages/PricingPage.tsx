import { motion } from "motion/react";
import { Check, Sparkles, Crown, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useState, useRef } from "react";

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

const plans = [
  {
    name: "Figure Chibi 9cm",
    icon: Sparkles,
    price: "650.000đ",
    period: "/sản phẩm",
    description: "Kích thước tiêu chuẩn tinh tế, phù hợp để bàn làm việc.",
    color: "#E8B4A8",
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
    color: "#0A0A0A",
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

function PricingCard({ plan }: { plan: typeof plans[0] }) {
  return (
    <div
      className={`rounded-3xl p-8 h-full flex flex-col justify-between border transition-all duration-300 hover:shadow-lg relative ${
        plan.popular 
          ? 'bg-[#0A0A0A] text-white border-[#D4AF78] shadow-[0_25px_60px_-15px_rgba(232,180,168,0.2)] md:-translate-y-4' 
          : 'bg-white text-stone-850 border-stone-100 shadow-sm hover:-translate-y-1'
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <span 
            className="text-[9px] font-black px-4 py-1.5 rounded-full text-white uppercase tracking-widest shadow-md whitespace-nowrap block"
            style={{
              background: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
            }}
          >
            Được khuyên dùng
          </span>
        </div>
      )}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
            style={{ 
              background: plan.popular ? 'linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)' : '#FAFAFA',
              border: plan.popular ? 'none' : '1px solid #ECECF0'
            }}
          >
            <plan.icon className={`w-5.5 h-5.5 ${plan.popular ? 'text-white' : 'text-stone-700'}`} />
          </div>
        </div>

        {/* Name */}
        <h3 className="mb-2 text-xl font-bold font-sans">
          {plan.name}
        </h3>

        {/* Description */}
        <p
          className="mb-6 text-xs sm:text-sm leading-relaxed min-h-[40px]"
          style={{ color: plan.popular ? '#8E8E93' : '#6B6B6B' }}
        >
          {plan.description}
        </p>

        {/* Price */}
        <div 
          className="mb-8 py-4 px-5 rounded-2xl flex items-baseline gap-1"
          style={{ background: plan.popular ? 'rgba(255,255,255,0.03)' : '#FAFAFA' }}
        >
          <span
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.25rem",
              color: plan.popular ? '#FFFFFF' : '#0A0A0A',
            }}
          >
            {plan.price}
          </span>
          {plan.period && (
            <span className="text-xs ml-1 opacity-60" style={{ color: plan.popular ? '#8E8E93' : '#6B6B6B' }}>
              {plan.period}
            </span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3.5 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: '#D4AF78' }}
              />
              <span className="text-xs sm:text-sm leading-tight opacity-90 font-medium">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {plan.name.includes("Sự Kiện") ? (
        <a
          href="https://zalo.me/0398768699"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer ${
            plan.popular
              ? 'bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white hover:shadow-lg'
              : 'bg-white text-stone-900 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          {plan.cta}
        </a>
      ) : (
        <Link
          to="/order"
          className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer ${
            plan.popular
              ? 'bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white hover:shadow-lg'
              : 'bg-white text-stone-900 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          {plan.cta}
        </Link>
      )}
    </div>
  );
}


export function PricingPage() {
  return (
    <div
      className="pt-28 relative overflow-hidden"
      style={{ background: "#FCEBE7" }}
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
              className="h-full"
            >
              <PricingCard plan={plan} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <h2
          className="text-3xl font-bold text-center mb-12"
          style={{ color: "#1A1818" }}
        >
          Câu Hỏi Thường Gặp
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm"
            >
              <h3 className="text-lg font-bold mb-2 flex items-start gap-2 text-stone-900">
                <span className="text-[#E8B4A8] font-black">Q.</span>
                {faq.q}
              </h3>
              <p className="text-stone-500 pl-6 leading-relaxed text-sm">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
