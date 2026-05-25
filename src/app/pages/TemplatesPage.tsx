import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const templates = [
  {
    title: "Sinh Nhật Rực Rỡ",
    description: "Kỷ niệm thêm một năm tuổi với niềm vui và confetti rực rỡ. Hoàn hảo để gửi lời chúc tới người thân yêu.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGJpcnRoZGF5JTIwY2VsZWJyYXRpb24lMjBjb25mZXR0aXxlbnwxfHx8fDE3Nzk2MTE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#FFD4D4",
    gradient: "linear-gradient(135deg, #FFD4D4 0%, #FFB3BA 100%)",
    tag: "Phổ biến nhất",
    features: ["Confetti tự động", "Nhạc chúc mừng", "Slideshow ảnh", "Tin nhắn giọng nói"],
  },
  {
    title: "Ký Ức Lãng Mạn",
    description: "Bày tỏ tình yêu qua ảnh, video và những lời nhắn chân thành. Dành cho những kỷ niệm không thể quên.",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3Nzk2MTE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#E8B4A8",
    gradient: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
    tag: "Được yêu thích",
    features: ["Dòng thời gian tình yêu", "Nhạc nền lãng mạn", "Hiệu ứng trái tim", "Hộp thời gian bí mật"],
  },
  {
    title: "Giáng Sinh Diệu Kỳ",
    description: "Chia sẻ sự ấm áp và kỳ diệu của mùa lễ hội với gia đình và bạn bè trên toàn thế giới.",
    image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBob2xpZGF5JTIwZGVjb3JhdGlvbiUyMGZlc3RpdmV8ZW58MXx8fHwxNzc5NjExODMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#D4AF78",
    gradient: "linear-gradient(135deg, #D4AF78 0%, #C4A568 100%)",
    tag: "Theo mùa",
    features: ["Tuyết rơi hoạt ảnh", "Nhạc Giáng Sinh", "Lịch đếm ngược", "Thiệp điện tử"],
  },
  {
    title: "Ngày Tốt Nghiệp",
    description: "Ghi dấu thành tích và những khởi đầu mới đầy hứng khởi cùng những người quan trọng nhất.",
    image: "https://images.unsplash.com/photo-1623461487986-9400110de28e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VyZW1vbnklMjBjYXAlMjBnb3dufGVufDF8fHx8MTc3OTU0NDExMXww&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#B8A4D4",
    gradient: "linear-gradient(135deg, #B8A4D4 0%, #9B87C4 100%)",
    tag: "Dịp đặc biệt",
    features: ["Hành trình học tập", "Lời nhắn từ thầy cô", "Album kỷ niệm", "Lời chúc tương lai"],
  },
  {
    title: "Chào Đón Em Bé",
    description: "Ghi lại những khoảnh khắc đầu tiên quý giá và ký ức cột mốc để bé yêu nhìn lại khi lớn lên.",
    image: "https://images.unsplash.com/photo-1543342384-1f1350e27861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdib3JuJTIwYmFieSUyMGZhbWlseSUyMG1vbWVudHxlbnwxfHx8fDE3Nzk2MTE4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#A8D4E8",
    gradient: "linear-gradient(135deg, #A8D4E8 0%, #8BC4D8 100%)",
    tag: "Gia đình",
    features: ["Lời nhắn từ gia đình", "Cột mốc tháng tuổi", "Album ảnh đầu đời", "Hộp thời gian 18 năm"],
  },
  {
    title: "Dòng Thời Gian Kỷ Niệm",
    description: "Sống lại hành trình cùng nhau từng năm một — những kỷ niệm đẹp nhất được kể lại theo thứ tự thời gian.",
    image: "https://images.unsplash.com/photo-1523521803700-b3bcaeab0150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMGNvdXBsZSUyMGNlbGVicmF0aW9uJTIwdG9hc3R8ZW58MXx8fHwxNzc5NjExODM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#D4C4A8",
    gradient: "linear-gradient(135deg, #D4C4A8 0%, #C4B498 100%)",
    tag: "Kỷ niệm",
    features: ["Dòng thời gian tương tác", "Ảnh theo từng năm", "Nhạc theo giai đoạn", "Câu chuyện tình yêu"],
  },
];

export function TemplatesPage() {
  return (
    <div className="pt-20" style={{ background: "#FAF8F5" }}>
      {/* Hero */}
      <section className="py-20 text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ background: "rgba(232,180,168,0.2)", color: "#E8B4A8" }}
          >
            Mẫu Thiết Kế
          </span>
          <h1
            className="mb-4"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "#1A1818", lineHeight: 1.2 }}
          >
            Chọn Mẫu Hoàn Hảo
          </h1>
          <p className="max-w-2xl mx-auto" style={{ fontSize: "1.125rem", color: "#6B6B6B", lineHeight: 1.6 }}>
            6 mẫu được thiết kế chuyên nghiệp cho mọi dịp đặc biệt. Mỗi mẫu đều có thể tùy chỉnh hoàn toàn theo ý bạn.
          </p>
        </motion.div>
      </section>

      {/* Templates grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-3xl cursor-pointer"
              style={{
                background: "white",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <motion.img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }}
                />
                {/* Tag */}
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
                >
                  {template.tag}
                </div>
                {/* Color dot */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full shadow"
                  style={{ background: template.gradient }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2" style={{ fontSize: "1.375rem", fontWeight: 600, color: "#1A1818" }}>
                  {template.title}
                </h3>
                <p className="mb-4" style={{ color: "#6B6B6B", lineHeight: 1.6, fontSize: "0.9375rem" }}>
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {template.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: `${template.color}30`, color: "#1A1818" }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <button
                  className="flex items-center gap-2 text-sm font-semibold transition-all group/btn"
                  style={{ color: template.color }}
                >
                  Dùng Mẫu Này
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom template CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl p-10 text-center"
          style={{
            background: "white",
            border: "2px dashed rgba(232,180,168,0.5)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl"
            style={{ background: "rgba(232,180,168,0.15)" }}
          >
            ✨
          </div>
          <h2 className="mb-2" style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1A1818" }}>
            Tạo Mẫu Riêng Của Bạn
          </h2>
          <p className="mb-6 max-w-xl mx-auto" style={{ color: "#6B6B6B", lineHeight: 1.6 }}>
            Không tìm thấy mẫu phù hợp? Gói Doanh Nghiệp cho phép thiết kế mẫu tùy chỉnh hoàn toàn.
          </p>
          <a
            href="/pricing"
            className="inline-block px-8 py-3 rounded-full font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)" }}
          >
            Xem Gói Doanh Nghiệp
          </a>
        </motion.div>
      </section>
    </div>
  );
}
