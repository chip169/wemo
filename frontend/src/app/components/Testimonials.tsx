import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonialsRow1 = [
  {
    name: "Nguyễn Thuỳ Lâm",
    role: "Kỷ Niệm Yêu",
    content: "Món quà bất ngờ nhất mà tôi từng nhận được từ bạn trai. Khi chạm điện thoại vào hộp gỗ, cả một trang web mở ra ngập tràn ảnh và video kỷ niệm 3 năm yêu nhau của chúng tôi. Tôi đã bật khóc vì xúc động! 😭❤️",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZKPdeE632LHKq_A0f1RLVaHX50EJS9no9hcUGOOtgIw&s=10&auto=format,compress&q=90",
    rating: 5,
  },
  {
    name: "Trần Minh Hoàng",
    role: "Quà Sinh Nhật Vợ",
    content: "Vợ tôi rất thích mẫu thiết kế Ký Ức Lãng Mạn. Nó không chỉ là thiệp online thông thường mà có hiệu ứng lướt chuột 3D cực sang trọng. Công nghệ chạm NFC nhạy, hoạt động rất tốt trên cả iPhone lẫn Android.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvm-PLXe8srzWb4twn93eFS6ovM4yVJ-VNED_j2BycAg&s=10&auto=format,compress&q=90",
    rating: 5,
  },
  {
    name: "Lê Khánh Vy",
    role: "Kỷ Niệm Ngày Cưới",
    content: "WEMO giúp tôi lưu giữ những lời chúc từ gia đình ở xa một cách trọn vẹn nhất. Đây là món quà công nghệ kết hợp thủ công tinh tế nhất tôi từng mua. Rất khuyên dùng cho ai muốn tặng quà độc lạ!",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb02O0LaquTQeVta3VaYa8XeGgYalxAXhbd2pEKiLQEg&s=10&auto=format,compress&q=90",
    rating: 5,
  },
  {
    name: "Phạm Quốc Bảo",
    role: "Quà Tặng Bạn Gái",
    content: "Tính năng vẽ Chibi AI hoạt động siêu đỉnh. Ảnh của chúng tôi vẽ ra rất dễ thương, giao diện trang quà tặng mượt mà không bị giật lag khi tải video. Dịch vụ chăm sóc khách hàng của WEMO cực kỳ nhiệt tình.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNiz5TU8iIx8JBUvOLR97UzG2TTCuO4KuDkDJpO-I-bQ&s=10?w=200&auto=format,compress&q=90",
    rating: 5,
  },
];

const testimonialsRow2 = [
  {
    name: "Hoàng Mỹ Dung",
    role: "Quà Tốt Nghiệp",
    content: "Nhóm tôi đã làm một hộp quà WEMO gửi tặng cô giáo chủ nhiệm. Cả lớp tự thu âm tin nhắn thoại và tải ảnh kỷ niệm lên. Cô giáo đã rất bất ngờ và xúc động khi chạm điện thoại vào hộp. Ý tưởng thật sự rất nhân văn!",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgtttJUiv8aj4re2JrhGHsny_H-a9dfw4hqkQ3Jw8vVw&s=10&auto=format,compress&q=90",
    rating: 5,
  },
  {
    name: "Đỗ Đăng Khoa",
    role: "Quà Tặng Mẹ",
    content: "Mua tặng mẹ dịp 8/3, mẹ không rành công nghệ nhưng chỉ cần chạm nhẹ điện thoại vào là xem được ngay album ảnh gia đình kèm lời chúc của tôi. Tiện lợi và ý nghĩa vô cùng.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5vNROGPWfDEWiEUJ7tdmhes7o-l9Hef86MDvCBjcnPA&s=10&auto=format,compress&q=90",
    rating: 5,
  },
  {
    name: "Trần Khánh Duy",
    role: "Quà Valentine",
    content: "A beautiful fusion of physical craft and digital experience. The 3D planet template is breathtaking. She watches it every night! Recommended 10/10.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1PdWeUKsUuh3pGjQrBmeHofPRGW7gCd9taZwWy54xVQ&s&auto=format,compress&q=90",
    rating: 5,
  },
  {
    name: "Hoàng Sáo",
    role: "Cầu Hôn Bất Ngờ",
    content: "Tôi đã cầu hôn bằng WEMO! Tôi giấu thẻ NFC khắp thành phố để cô ấy tìm kiếm kỷ niệm cũ. Đến thẻ cuối cùng thì tôi đợi sẵn ở đó. Cô ấy đã đồng ý! ❤️",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZs7HeCnFeLw744DtiAjAyHWFhPgQ9h_i2GpmrGqFGfA&s=10&auto=format,compress&q=90",
    rating: 5,
  },
];

function ReviewCard({ testimonial }: { testimonial: typeof testimonialsRow1[0] }) {
  return (
    <div className="w-[340px] inline-block whitespace-normal mx-3 align-top">
      <div className="rounded-3xl p-6 border border-white/40 bg-white/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 relative h-full flex flex-col justify-between">

        {/* Large Decorative Quote Icon */}
        <Quote className="absolute right-6 top-6 w-10 h-10 text-stone-300/40 pointer-events-none" />

        <div>
          {/* Star Rating */}
          <div className="flex gap-0.5 mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF78] text-[#D4AF78]" />
            ))}
          </div>

          {/* Review Text */}
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
            "{testimonial.content}"
          </p>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-stone-200/50">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover bg-stone-100/50 border border-white/40"
          />
          <div>
            <div className="text-xs font-bold text-stone-900">{testimonial.name}</div>
            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{testimonial.role}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-[#FCE1DA] to-[#FFF0EC] overflow-hidden">

      {/* Inline styles for infinite scrolling marquee */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: marquee-left 35s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: marquee-right 35s linear infinite;
        }
        .animate-marquee-left:hover, .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-[#E8B4A8]/15 to-[#D4AF78]/15 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-[#D4AF78]/15 to-[#E8B4A8]/15 blur-[100px]"
        />
      </div>

      <div className="w-full relative z-10">

        {/* Section header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2
            className="mb-4 font-black text-stone-900 tracking-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
            }}
          >
            Những Câu Chuyện <br />
            Chạm Đến Trái Tim
          </h2>
          <p className="max-w-xl mx-auto text-stone-500 text-sm sm:text-base leading-relaxed">
            Xem cách mọi người đang tạo ra những khoảnh khắc hạnh phúc khó quên cùng WEMO
          </p>
        </div>

        {/* Scrolling Carousel Grid */}
        <div className="flex flex-col gap-6 py-4 relative">

          {/* Row 1 - Left direction */}
          <div className="overflow-hidden w-full mask-gradient">
            <div className="animate-marquee-left">
              {[...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1].map((testimonial, i) => (
                <ReviewCard key={i} testimonial={testimonial} />
              ))}
            </div>
          </div>

          {/* Row 2 - Right direction */}
          <div className="overflow-hidden w-full mask-gradient">
            <div className="animate-marquee-right">
              {[...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2].map((testimonial, i) => (
                <ReviewCard key={i} testimonial={testimonial} />
              ))}
            </div>
          </div>

          {/* Overlay fade edges to enhance premium look */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#FDE8E3] to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#FDE8E3] to-transparent pointer-events-none z-10" />

        </div>
      </div>
    </section>
  );
}
