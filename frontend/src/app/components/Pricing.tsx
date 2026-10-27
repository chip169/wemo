import { motion } from "motion/react";
import { Check, Sparkles, Crown, Building2, Users, Heart } from "lucide-react";
import { Link } from "react-router";

const plans = [
  {
    code: "MB-LG-STD",
    name: "WEMO LEGO – Standard",
    badge: "Tiết Kiệm",
    icon: Sparkles,
    price: "339.000đ",
    period: "/ 1 nhân vật",
    description: "Mô hình LEGO cá nhân hóa theo ảnh thật, thiết kế khuôn mặt & tóc riêng.",
    color: "#E8B4A8",
    features: [
      "Lắp ráp thủ công theo ảnh thật người nhận",
      "Khuôn mặt & kiểu tóc cá nhân hóa tỉ mỉ",
      "Đế gỗ tích hợp chip NFC chạm mở trang web",
      "Tặng 1 trang web kỷ niệm độc bản (ảnh, video)",
      "Kèm hộp quà nơ & thiệp chúc thiết kế riêng",
      "Bảo hành 12 tháng & hỗ trợ kỹ thuật trọn đời",
    ],
    cta: "Đặt Hàng Ngay",
    popular: false,
  },
  {
    code: "MB-LG-PRM",
    name: "WEMO LEGO – Premium",
    badge: "Khuyên Dùng",
    icon: Crown,
    price: "469.000đ",
    period: "/ 1 nhân vật",
    description: "Cá nhân hóa chi tiết cao: tóc, biểu cảm, trang phục & phụ kiện đặc trưng.",
    color: "#D4AF78",
    features: [
      "Cá nhân hóa toàn diện: Tóc, trang phục & phụ kiện",
      "Tỉ mỉ từng chi tiết đặc trưng theo ảnh gửi",
      "Đế gỗ tích hợp chip NFC chạm mở trang web",
      "Landing page độc bản: Nhạc nền, ảnh & video",
      "Tặng đế trưng bày cao cấp & hộp quà sang trọng",
      "Duyệt ảnh mẫu thiết kế trước khi gia công",
      "Ưu tiên hoàn thiện hỏa tốc theo yêu cầu",
    ],
    cta: "Đặt Gói Này Ngay",
    popular: true,
  },
  {
    code: "MB-LG-CPS",
    name: "WEMO LEGO – Couple Standard",
    badge: "Cặp Đôi",
    icon: Users,
    price: "600.000đ",
    period: "/ bộ 2 nhân vật",
    description: "Bộ đôi 2 nhân vật LEGO theo ảnh cặp đôi kèm 1 landing page chung và hộp đôi.",
    color: "#E88D7B",
    features: [
      "Bộ đôi 2 nhân vật LEGO theo ảnh cặp đôi",
      "Cá nhân hóa khuôn mặt & kiểu tóc cả hai bạn",
      "1 landing page chung câu chuyện tình yêu",
      "Tích hợp chip NFC chạm mở web kỷ niệm",
      "Hộp quà đôi thiết kế lãng mạn & tinh tế",
      "Kỷ vật tình yêu độc bản, bền đẹp theo năm tháng",
    ],
    cta: "Đặt Gói Cặp Đôi",
    popular: false,
  },
  {
    code: "MB-LG-CPP",
    name: "WEMO LEGO – Couple Premium",
    badge: "Bộ Đôi Cao Cấp",
    icon: Heart,
    price: "850.000đ",
    period: "/ bộ 2 nhân vật",
    description: "Bộ đôi LEGO cao cấp nhất, trang phục và phụ kiện tỉ mỉ cho cả hai bạn.",
    color: "#5C352E",
    features: [
      "Bộ đôi 2 nhân vật LEGO chi tiết cao cấp nhất",
      "Cá nhân hóa toàn diện trang phục & phụ kiện cặp đôi",
      "1 landing page Premium: Câu chuyện tình yêu, album riêng",
      "Đế đôi khắc tên & ngày kỷ niệm theo yêu cầu",
      "Hộp quà đôi giới hạn sang trọng kèm thiệp hoa khô",
      "Duyệt ảnh thiết kế 3D trước khi xuất xưởng",
      "Bảo hành trọn đời & hỗ trợ kỹ thuật vĩnh viễn",
    ],
    cta: "Đặt Gói Cao Cấp",
    popular: false,
  },
];

function PricingCard({ plan }: { plan: typeof plans[0] }) {
  return (
    <div
      className={`rounded-3xl p-7 sm:p-8 h-full flex flex-col justify-between border transition-all duration-300 relative ${
        plan.popular
          ? 'bg-gradient-to-b from-[#2B1B18] via-[#221513] to-[#1A0E0C] text-white border-2 border-[#D4AF78] shadow-[0_22px_55px_-10px_rgba(212,175,120,0.38)] md:-translate-y-4 md:scale-[1.02] z-10'
          : 'bg-white/95 backdrop-blur-md text-[#2D1612] border border-[#E8B4A8]/30 shadow-[0_12px_36px_rgba(92,53,46,0.06)] hover:shadow-[0_20px_45px_rgba(232,180,168,0.2)] hover:border-[#D4AF78]/60 hover:-translate-y-1.5'
      }`}
    >
      {/* Top Floating Badge */}
      {plan.popular ? (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <span
            className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #FDE68A 0%, #D4AF78 50%, #C08A3E 100%)",
              color: "#241310",
            }}
          >
            <Crown className="w-3.5 h-3.5 fill-[#241310]" /> Được Khuyên Dùng
          </span>
        </div>
      ) : (
        <div className="absolute top-4 right-5">
          <span
            className="text-[9.5px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{
              background: "rgba(232, 180, 168, 0.15)",
              color: "#8C5D53",
            }}
          >
            {plan.badge}
          </span>
        </div>
      )}

      <div>
        {/* Header Icon */}
        <div className="mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
            style={{
              background: plan.popular
                ? 'linear-gradient(135deg, #FDE68A 0%, #D4AF78 100%)'
                : 'linear-gradient(135deg, #FFF0EC 0%, #FCE1DA 100%)',
              border: plan.popular ? 'none' : '1px solid rgba(232, 180, 168, 0.4)',
            }}
          >
            <plan.icon className={`w-5.5 h-5.5 ${plan.popular ? 'text-[#241310]' : 'text-[#8C5D53]'}`} />
          </div>
        </div>

        {/* Name */}
        <h3 className="mb-2 text-xl font-bold font-sans tracking-tight">
          {plan.name}
        </h3>

        {/* Description */}
        <p
          className="mb-6 text-xs sm:text-[13px] leading-relaxed min-h-[42px]"
          style={{ color: plan.popular ? '#C4B5B0' : '#785A52' }}
        >
          {plan.description}
        </p>

        {/* Price Section */}
        <div className={`mb-6 pb-6 border-b ${plan.popular ? 'border-white/10' : 'border-[#E8B4A8]/20'}`}>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span
              className="font-extrabold tracking-tight leading-none"
              style={{
                fontSize: "2.15rem",
                color: plan.popular ? '#FFFFFF' : '#2D1612',
              }}
            >
              {plan.price}
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: plan.popular ? 'rgba(212, 175, 120, 0.2)' : 'rgba(232, 180, 168, 0.15)',
                color: plan.popular ? '#FDE68A' : '#8C5D53',
              }}
            >
              {plan.period}
            </span>
          </div>
          <div className={`mt-2 text-[11px] font-medium flex items-center gap-1.5 ${plan.popular ? 'text-[#D4AF78]' : 'text-[#8C5D53]'}`}>
            <Check className="w-3.5 h-3.5 flex-shrink-0 text-[#D4AF78]" />
            <span>Chip NFC • Tặng kèm web NFC</span>
          </div>
        </div>

        {/* Features List */}
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: plan.popular ? 'rgba(212, 175, 120, 0.25)' : 'rgba(232, 180, 168, 0.25)',
                  color: plan.popular ? '#FDE68A' : '#8C5D53',
                }}
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span
                className="text-xs sm:text-[13px] leading-snug font-medium"
                style={{ color: plan.popular ? '#E8DDD9' : '#4A2E28' }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      {plan.name.includes("Sự Kiện") ? (
        <a
          href="https://zalo.me/0398768699"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shadow-sm ${
            plan.popular
              ? 'bg-gradient-to-r from-[#FDE68A] via-[#D4AF78] to-[#C08A3E] text-[#241310] hover:shadow-lg hover:scale-[1.01]'
              : 'bg-[#FFF5F2] text-[#5C352E] border border-[#E8B4A8]/60 hover:bg-gradient-to-r hover:from-[#E8B4A8] hover:to-[#D4AF78] hover:text-white hover:border-transparent hover:shadow-md'
          }`}
        >
          {plan.cta}
        </a>
      ) : (
        <Link
          to={`/order?package=${plan.code}`}
          className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shadow-sm ${
            plan.popular
              ? 'bg-gradient-to-r from-[#FDE68A] via-[#D4AF78] to-[#C08A3E] text-[#241310] hover:shadow-lg hover:scale-[1.01]'
              : 'bg-[#FFF5F2] text-[#5C352E] border border-[#E8B4A8]/60 hover:bg-gradient-to-r hover:from-[#E8B4A8] hover:to-[#D4AF78] hover:text-white hover:border-transparent hover:shadow-md'
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
