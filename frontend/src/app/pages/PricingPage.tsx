import { motion } from "motion/react";
import { Check, Sparkles, Crown, Building2, Users, Heart } from "lucide-react";
import { Link } from "react-router";

const faqs = [
  {
    q: "Gói Standard và Premium khác nhau như thế nào?",
    a: "Gói Standard (339.000đ) sử dụng trang phục mặc định và cá nhân hóa khuôn mặt, kiểu tóc theo ảnh thật của bạn. Gói Premium (469.000đ) được chế tác chi tiết toàn diện: cá nhân hóa từ kiểu tóc, trang phục cụ thể đến các phụ kiện đặc trưng (kính, mũ, túi xách, máy ảnh...) đúng theo ảnh chụp.",
  },
  {
    q: "Gói Couple Set bao gồm những gì?",
    a: "Gói Couple Set bao gồm bộ đôi 2 nhân vật LEGO cá nhân hóa theo hình ảnh cặp đôi, đi kèm 1 landing page chung lưu giữ câu chuyện tình yêu của hai bạn và hộp đôi thiết kế riêng sang trọng. Phiên bản Couple Premium (850.000đ) sẽ có thêm trang phục và phụ kiện chi tiết cho cả 2 nhân vật.",
  },
  {
    q: "Chip NFC ẩn trên mô hình LEGO hoạt động như thế nào?",
    a: "Mỗi mô hình LEGO của WEMO đều được tích hợp chip NFC ẩn thông minh bên dưới đế. Người nhận chỉ cần chạm nhẹ điện thoại vào đế LEGO để mở ra trang web ký ức số độc bản chứa ảnh, video và lời chúc, không cần tải ứng dụng.",
  },
  {
    q: "Tôi có được chiết khấu khi đặt số lượng lớn cho sự kiện/đám cưới không?",
    a: "Có! WEMO có chính sách chiết khấu lên đến 30% cho các đơn hàng từ 5 bộ trở lên, kèm dịch vụ khắc logo doanh nghiệp lên đế và tùy biến trang web sự kiện riêng.",
  },
];

const plans = [
  {
    code: "MB-LG-STD",
    name: "WEMO LEGO – Standard",
    badge: "Tiết kiệm",
    icon: Sparkles,
    price: "339.000đ",
    period: "/sản phẩm",
    description: "Mô hình LEGO-compatible cá nhân hóa theo ảnh thật, tối ưu chi phí.",
    color: "#E8B4A8",
    features: [
      "Mã sản phẩm: MB-LG-STD",
      "Lắp ráp theo ảnh thật của người nhận",
      "Trang phục mặc định, tóc & mặt cá nhân hóa",
      "Đi kèm chip NFC chạm mở trang ký ức số",
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
    badge: "Được khuyên dùng",
    icon: Crown,
    price: "469.000đ",
    period: "/sản phẩm",
    description: "Cá nhân hóa chi tiết cao theo ảnh thật (tóc, trang phục & phụ kiện chi tiết).",
    color: "#D4AF78",
    features: [
      "Mã sản phẩm: MB-LG-PRM",
      "Lắp ráp theo ảnh thật của người nhận",
      "Tóc, trang phục, phụ kiện chi tiết theo ảnh",
      "Đi kèm chip NFC chạm mở trang ký ức số",
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
    badge: "Cặp đôi",
    icon: Users,
    price: "600.000đ",
    period: "/bộ 2 nhân vật",
    description: "Bộ đôi nhân vật LEGO theo ảnh cặp đôi kèm 1 landing page chung và hộp đôi.",
    color: "#E88D7B",
    features: [
      "Mã sản phẩm: MB-LG-CPS",
      "Bộ đôi 2 nhân vật LEGO theo ảnh cặp đôi",
      "Trang phục mặc định, tóc & mặt cá nhân hóa",
      "1 landing page chung cho cả 2 người",
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
    badge: "Bộ đôi cao cấp",
    icon: Heart,
    price: "850.000đ",
    period: "/bộ 2 nhân vật",
    description: "Bộ đôi nhân vật LEGO cao cấp, trang phục và phụ kiện tỉ mỉ cho cả hai bạn.",
    color: "#5C352E",
    features: [
      "Mã sản phẩm: MB-LG-CPP",
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
            Sở Hữu Mô Hình LEGO <span style={{ color: "#E8B4A8" }}>Độc Bản</span>
          </h1>
          <p
            className="max-w-2xl mx-auto"
            style={{ fontSize: "1.25rem", color: "#5A5A5A", lineHeight: 1.6 }}
          >
            Chọn gói sản phẩm phù hợp với nhu cầu của bạn. Mỗi mô hình LEGO cá nhân hóa WEMO là một tác phẩm nghệ thuật độc bản đi kèm chip NFC thông minh lưu giữ ký ức số mãi mãi.
          </p>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
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

        {/* Enterprise & Event Custom Orders Banner */}
        <div className="mt-12 rounded-3xl p-8 sm:p-10 bg-stone-900 text-white border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
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
