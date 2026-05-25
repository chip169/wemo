import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah & Michael",
    role: "Quà Kỷ Niệm",
    content: "WEBO đã biến kỷ niệm 5 năm của chúng tôi thành điều gì đó thực sự kỳ diệu. Mẫu dòng thời gian với tất cả ảnh và tin nhắn giọng nói khiến vợ tôi rơi nước mắt vì xúc động. Đây không chỉ là món quà—đây là kho báu chúng tôi sẽ giữ mãi mãi.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Quà Sinh Nhật",
    content: "Tôi đã tạo quà sinh nhật cho bạn thân bằng WEBO. Cô ấy hoàn toàn bị choáng ngợp! Khả năng thêm video, nhạc và tin nhắn cá nhân khiến cảm giác như tôi đang ở đó ăn mừng cùng cô ấy dù cách xa hàng ngàn km.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Chào Đón Em Bé",
    content: "Là cha mẹ mới, chúng tôi muốn tạo ra điều gì đó đặc biệt để con trai nhìn lại sau này. Mẫu chào đón em bé của WEBO cho phép chúng tôi tổng hợp lời nhắn từ gia đình khắp nơi trên thế giới. Đây là kỷ vật số ý nghĩa nhất mà chúng tôi có thể tưởng tượng.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 5,
  },
  {
    name: "Jessica & Tom",
    role: "Quà Giáng Sinh",
    content: "Chúng tôi tặng quà WEBO cho cả gia đình dịp Giáng Sinh này. Mọi người đều kinh ngạc vì sự cá nhân và chu đáo của nó. Thẻ NFC khiến cảm giác như đang mở quà vật lý, nhưng trải nghiệm phong phú hơn rất nhiều!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Quà Tốt Nghiệp",
    content: "Con gái tôi tốt nghiệp đại học và tôi muốn tặng cô bé thứ gì đó có ý nghĩa. WEBO giúp tôi tạo ra hành trình qua toàn bộ sự nghiệp học tập với ảnh, video và lời nhắn từ giáo viên và bạn bè. Thật kỳ diệu!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Bất Ngờ Lãng Mạn",
    content: "Tôi đã cầu hôn bạn gái bằng trải nghiệm WEBO! Tôi giấu các manh mối khắp những địa điểm yêu thích của chúng tôi trong thành phố, mỗi thẻ NFC tiết lộ một ký ức. Khi cô ấy đến thẻ cuối cùng, tôi đang ở đó chờ. Cô ấy đồng ý! ❤️",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden webo-animated-gradient">
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
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700,
              color: '#1A1818',
            }}
          >
            Những Câu Chuyện Chạm Đến Trái Tim
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: '1.125rem',
              color: '#6B6B6B',
              lineHeight: 1.6,
            }}
          >
            Xem cách mọi người trên thế giới đang tạo ra những khoảnh khắc khó quên với WEBO
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="webo-glass-card rounded-3xl p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote 
                className="w-10 h-10 mb-4 opacity-20"
                style={{ color: '#E8B4A8' }}
              />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-current"
                    style={{ color: '#D4AF78' }}
                  />
                ))}
              </div>

              {/* Content */}
              <p 
                className="mb-6"
                style={{
                  color: '#1A1818',
                  lineHeight: 1.7,
                  fontSize: '0.9375rem',
                }}
              >
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                  style={{ background: '#F5EDE4' }}
                />
                <div>
                  <div 
                    className="font-semibold"
                    style={{ color: '#1A1818' }}
                  >
                    {testimonial.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
