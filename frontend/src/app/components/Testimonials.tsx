import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonialsRow1 = [
  {
    name: "Kim Xuân Hiếu",
    role: "Quà Kỷ Niệm",
    content: "WEMO đã biến kỷ niệm 5 năm của chúng tôi thành điều gì đó thực sự kỳ diệu. Mẫu dòng thời gian với ảnh và tin nhắn thoại làm vợ tôi bật khóc. Đây là kho báu vô giá.",
    avatar: "https://6a1d3eb50bc623d413b1bf46.imgix.net/wemo/z7291398006584_7f6e5ed7608e2d8e2ca06646c3dff042.jpg",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Quà Sinh Nhật",
    content: "Tôi tạo quà sinh nhật cho bạn thân bằng WEMO. Cô ấy hoàn toàn bị choáng ngợp! Sự kết hợp video, nhạc làm chúng tôi cảm giác thật gần nhau dù cách hàng ngàn km.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Chào Đón Em Bé",
    content: "Mẫu chào đón em bé của WEMO cho phép tôi tổng hợp lời nhắn từ gia đình khắp thế giới. Đây là kỷ vật số ý nghĩa nhất của gia đình tôi.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 5,
  },
];

const testimonialsRow2 = [
  {
    name: "Jessica & Tom",
    role: "Quà Giáng Sinh",
    content: "Tặng quà WEMO cho cả nhà dịp Noel. Ai cũng trầm trồ vì sự tinh tế và cá nhân hóa. Chạm NFC mang lại cảm giác cực kỳ công nghệ và sang trọng!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Quà Tốt Nghiệp",
    content: "Con gái tôi tốt nghiệp đại học, tôi muốn tặng cô bé thứ gì đó đặc biệt. WEMO giúp tôi lưu trữ hành trình qua 4 năm đại học thật sống động.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Cầu Hôn Bất Ngờ",
    content: "Tôi đã cầu hôn bằng WEMO! Tôi giấu thẻ NFC khắp thành phố để cô ấy tìm kiếm kỷ niệm cũ. Đến thẻ cuối cùng thì tôi đợi sẵn ở đó. Cô ấy đã đồng ý! ❤️",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    rating: 5,
  },
];

function ReviewCard({ testimonial }: { testimonial: typeof testimonialsRow1[0] }) {
  return (
    <div className="w-[340px] inline-block whitespace-normal mx-3 align-top">
      <div className="rounded-3xl p-6 border border-stone-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative h-full flex flex-col justify-between">
        
        {/* Large Decorative Quote Icon */}
        <Quote className="absolute right-6 top-6 w-10 h-10 text-stone-100/60 pointer-events-none" />

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
        <div className="flex items-center gap-3 pt-4 border-t border-stone-50">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover bg-stone-100 border border-stone-100"
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
    <section className="relative py-24 md:py-32 bg-[#FCEBE7] overflow-hidden">
      
      {/* Inline styles for infinite scrolling marquee */}
      <style dangerouslySetInnerHTML={{__html: `
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

      <div className="w-full relative">
        
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
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#FCEBE7] to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#FCEBE7] to-transparent pointer-events-none z-10" />

        </div>
      </div>
    </section>
  );
}
