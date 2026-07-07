import { motion } from "motion/react";
import { Check, Sparkles, Crown, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useState, useRef } from "react";

const plans = [
  {
    name: "Figure Chibi 9cm",
    icon: Sparkles,
    price: "650.000đ",
    period: "/sản phẩm",
    description: "Nhỏ gọn tinh tế, tuyệt vời để bày biện bàn làm việc.",
    color: "#E8B4A8",
    features: [
      "Kích thước chiều cao: 9cm",
      "Vẽ chân dung Chibi AI miễn phí",
      "Dựng hình phôi 3D độc bản",
      "Chất liệu nhựa in 3D cao cấp",
      "Tùy chọn đế mica / gỗ khắc tên",
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
    description: "Bản cao cấp sắc nét, cân đối và nổi bật nhất.",
    color: "#D4AF78",
    features: [
      "Kích thước chiều cao: 12cm",
      "Vẽ chân dung Chibi AI không giới hạn",
      "Chi tiết mô hình sắc nét vượt trội",
      "Dựng hình phôi 3D tỉ mỉ thủ công",
      "Tặng kèm đế mica hoặc đế gỗ",
      "Tích hợp chip NFC ẩn thông minh",
      "Giao hàng nhanh & hỗ trợ ưu tiên",
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
      "Thiết kế phác thảo duyệt trước miễn phí",
    ],
    cta: "Nhận Báo Giá",
    popular: false,
  },
];

function PricingCard({ plan }: { plan: typeof plans[0] }) {
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
    setRotateX((yc - y) / 12);
    setRotateY((x - xc) / 12);
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
      className="webo-3d-scene w-full h-full"
    >
      <div
        className={`webo-3d-card rounded-3xl p-8 h-full flex flex-col justify-between border transition-all duration-300 ${
          plan.popular 
            ? 'bg-[#0A0A0A] text-white border-[#D4AF78] shadow-[0_25px_60px_-15px_rgba(232,180,168,0.2)] md:-translate-y-4' 
            : 'bg-white text-stone-850 border-stone-100 shadow-sm hover:shadow-md'
        }`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Header panel */}
        <div>
          {/* Badge & Icon */}
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

            {plan.popular && (
              <span className="text-[9px] font-bold px-3 py-1 rounded-full bg-[#E8B4A8]/10 text-[#E8B4A8] border border-[#E8B4A8]/20 uppercase tracking-widest">
                Được chọn nhiều
              </span>
            )}
          </div>

          {/* Name */}
          <h3
            className="mb-2 text-xl font-bold font-sans"
            style={{ color: plan.popular ? '#FFFFFF' : '#0A0A0A' }}
          >
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
                  style={{ color: plan.popular ? '#D4AF78' : '#E8B4A8' }}
                />
                <span className="text-xs sm:text-sm leading-tight opacity-90 font-medium">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          to={plan.price === "Liên Hệ" ? "/faq" : "/order"}
          className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
            plan.popular
              ? 'bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white hover:shadow-lg webo-shimmer-shine-hover'
              : 'bg-white text-stone-900 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          {plan.cta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export function Pricing() {
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
            Bảng Giá Đơn Giản, Minh Bạch
          </h2>
          <p className="max-w-xl mx-auto text-stone-500 text-sm sm:text-base leading-relaxed">
            Chọn gói phù hợp với nhu cầu tặng quà của bạn. Không có chi phí phát sinh ẩn.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <PricingCard plan={plan} />
            </motion.div>
          ))}
        </div>

        {/* Money back guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 text-stone-400 text-xs font-bold uppercase tracking-widest"
        >
          ✨ Hoàn tiền trong 30 ngày cho tất cả các gói • Bảo mật dữ liệu tuyệt đối
        </motion.div>
      </div>
    </section>
  );
}
