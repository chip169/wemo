import { motion } from "motion/react";
import { Check, Sparkles, Crown, Building2 } from "lucide-react";
import { Link } from "react-router";
import { useState, useRef } from "react";

const plans = [
  {
    name: "Figure Chibi 9cm",
    icon: Sparkles,
    price: "650.000đ",
    period: "/sản phẩm",
    description: "Nhỏ gọn tinh tế, tuyệt vời để bàn làm việc.",
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
    description: "Bản cao cấp sắc nét, cân đối và nổi bật nhất.",
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
      className={`rounded-3xl p-8 h-full flex flex-col justify-between border transition-all duration-300 hover:shadow-lg ${
        plan.popular 
          ? 'bg-[#0A0A0A] text-white border-[#D4AF78] shadow-[0_25px_60px_-15px_rgba(232,180,168,0.2)] md:-translate-y-4' 
          : 'bg-white text-stone-850 border-stone-100 shadow-sm hover:-translate-y-1'
      }`}
    >
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

          {plan.popular && (
            <span 
              className="text-[10px] font-extrabold px-3.5 py-1.5 rounded-full text-white uppercase tracking-widest shadow-sm"
              style={{
                background: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
              }}
            >
              Được khuyên dùng
            </span>
          )}
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


export function Pricing() {
  return (
    <section className="relative py-24" style={{ background: "#FCEBE7" }}>
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
            Chọn gói phù hợp với nhu cầu tặng quà của bạn. Không phí ẩn, không bất ngờ.
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
