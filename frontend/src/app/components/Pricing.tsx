import { motion } from "motion/react";
import { Check, Sparkles, Crown, Building2, Users, Heart } from "lucide-react";
import { Link } from "react-router";

const plans = [
  {
    code: "MB-LG-STD",
    name: "WEMO LEGO – Standard",
    icon: Sparkles,
    price: "339.000đ",
    period: "/sản phẩm",
    description: "Mô hình LEGO-compatible cá nhân hóa theo ảnh thật, tối ưu chi phí.",
    color: "#E8B4A8",
    features: [
      "Mã SP: MB-LG-STD",
      "Lắp ráp theo ảnh thật của người nhận",
      "Trang phục mặc định, tóc & mặt theo ảnh",
      "Đi kèm chip NFC mở trang ký ức số",
      "Trang web độc bản: Ảnh, video, lời nhắn",
      "Hộp quà & thiệp chúc thiết kế độc bản",
      "Bảo hành & hỗ trợ chu đáo",
    ],
    cta: "Đặt Hàng Ngay",
    popular: false,
  },
  {
    code: "MB-LG-PRM",
    name: "WEMO LEGO – Premium",
    icon: Crown,
    price: "469.000đ",
    period: "/sản phẩm",
    description: "Cá nhân hóa chi tiết cao theo ảnh thật (tóc, trang phục & phụ kiện đặc trưng).",
    color: "#D4AF78",
    features: [
      "Mã SP: MB-LG-PRM",
      "Lắp ráp theo ảnh thật của người nhận",
      "Tóc, trang phục, phụ kiện chi tiết theo ảnh",
      "Đi kèm chip NFC mở trang ký ức số",
      "Trang web độc bản: Ảnh, video, lời nhắn",
      "Tặng kèm đế trưng bày & hộp quà cao cấp",
      "Hỗ trợ ưu tiên & duyệt mẫu thiết kế",
    ],
    cta: "Đặt Hàng Ngay",
    popular: true,
  },
  {
    code: "MB-LG-CPS",
    name: "WEMO LEGO – Couple Set (Standard)",
    icon: Users,
    price: "600.000đ",
    period: "/bộ 2 nhân vật",
    description: "Bộ đôi nhân vật LEGO theo ảnh cặp đôi kèm 1 landing page chung và hộp đôi.",
    color: "#E88D7B",
    features: [
      "Mã SP: MB-LG-CPS",
      "Bộ đôi 2 nhân vật LEGO cá nhân hóa",
      "Trang phục mặc định, tóc & mặt cá nhân hóa",
      "Tích hợp 1 landing page chung cho cả 2 người",
      "Hộp đôi thiết kế riêng sang trọng, tinh tế",
      "Tích hợp chip NFC trên đế cho cả hai",
      "Quà tặng kỷ niệm tình yêu ý nghĩa",
    ],
    cta: "Đặt Hàng Ngay",
    popular: false,
  },
  {
    code: "MB-LG-CPP",
    name: "WEMO LEGO – Couple Set (Premium)",
    icon: Heart,
    price: "850.000đ",
    period: "/bộ 2 nhân vật",
    description: "Bộ đôi nhân vật LEGO cao cấp, trang phục và phụ kiện tỉ mỉ cho cả hai bạn.",
    color: "#5C352E",
    features: [
      "Mã SP: MB-LG-CPP",
      "Bộ đôi 2 nhân vật LEGO cao cấp",
      "Tóc, trang phục, phụ kiện chi tiết cho cả hai",
      "1 landing page chung câu chuyện tình yêu",
      "Hộp đôi cao cấp thiết kế riêng đặc biệt",
      "Tặng kèm đế đôi cao cấp & thiệp chúc độc bản",
      "Duyệt mẫu thiết kế 3D trước khi gia công",
    ],
    cta: "Đặt Hàng Ngay",
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
          to={`/order?package=${plan.code}`}
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
    <section data-context="pricing" className="relative py-24" style={{ background: "#FCEBE7" }}>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
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

        {/* Enterprise & Event Custom Orders Banner */}
        <div className="mt-12 rounded-3xl p-8 sm:p-10 bg-stone-900 text-white border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF78]/20 text-[#D4AF78] text-[11px] font-black uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" /> Dành cho Sự Kiện & Doanh Nghiệp (B2B)
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Đặt Số Lượng Lớn Cho Sự Kiện, Tiệc Cưới, Quà Doanh Nghiệp
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
              Chiết khấu đặc biệt lên đến 30% cho đơn hàng từ 5 bộ trở lên. Tùy biến logo doanh nghiệp lên đế mô hình, thiết kế bao bì & trang ký ức thương hiệu riêng biệt.
            </p>
          </div>
          <a
            href="https://zalo.me/0398768699"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white hover:opacity-95 transition-all shadow-md active:scale-95 text-center"
          >
            Nhận Báo Giá Doanh Nghiệp
          </a>
        </div>

        {/* Money back guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p style={{ color: "#6B6B6B" }}>
            ✨ Cam kết chất lượng chuẩn LEGO-compatible • Hỗ trợ bảo hành & chăm sóc chu đáo
          </p>
        </motion.div>
      </div>
    </section>
  );
}
