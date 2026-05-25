import { motion } from "motion/react";
import { Card } from "./ui/card";

const templates = [
  {
    title: "Sinh Nhật Rực Rỡ",
    description: "Kỷ niệm thêm một năm tuổi với niềm vui và confetti rực rỡ",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGJpcnRoZGF5JTIwY2VsZWJyYXRpb24lMjBjb25mZXR0aXxlbnwxfHx8fDE3Nzk2MTE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#FFD4D4",
    gradient: "linear-gradient(135deg, #FFD4D4 0%, #FFB3BA 100%)",
  },
  {
    title: "Ký Ức Lãng Mạn",
    description: "Bày tỏ tình yêu qua ảnh, video và những lời nhắn chân thành",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3Nzk2MTE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#E8B4A8",
    gradient: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
  },
  {
    title: "Giáng Sinh Diệu Kỳ",
    description: "Chia sẻ sự ấm áp và kỳ diệu của mùa lễ hội",
    image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBob2xpZGF5JTIwZGVjb3JhdGlvbiUyMGZlc3RpdmV8ZW58MXx8fHwxNzc5NjExODMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#D4AF78",
    gradient: "linear-gradient(135deg, #D4AF78 0%, #C4A568 100%)",
  },
  {
    title: "Ngày Tốt Nghiệp",
    description: "Ghi dấu thành tích và những khởi đầu mới đầy hứng khởi",
    image: "https://images.unsplash.com/photo-1623461487986-9400110de28e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VyZW1vbnklMjBjYXAlMjBnb3dufGVufDF8fHx8MTc3OTU0NDExMXww&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#B8A4D4",
    gradient: "linear-gradient(135deg, #B8A4D4 0%, #9B87C4 100%)",
  },
  {
    title: "Chào Đón Em Bé",
    description: "Ghi lại những khoảnh khắc đầu tiên quý giá và ký ức cột mốc",
    image: "https://images.unsplash.com/photo-1543342384-1f1350e27861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdib3JuJTIwYmFieSUyMGZhbWlseSUyMG1vbWVudHxlbnwxfHx8fDE3Nzk2MTE4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#A8D4E8",
    gradient: "linear-gradient(135deg, #A8D4E8 0%, #8BC4D8 100%)",
  },
  {
    title: "Dòng Thời Gian Kỷ Niệm",
    description: "Sống lại hành trình cùng nhau từng năm một",
    image: "https://images.unsplash.com/photo-1523521803700-b3bcaeab0150?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbm5pdmVyc2FyeSUyMGNvdXBsZSUyMGNlbGVicmF0aW9uJTIwdG9hc3R8ZW58MXx8fHwxNzc5NjExODM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#D4C4A8",
    gradient: "linear-gradient(135deg, #D4C4A8 0%, #C4B498 100%)",
  },
];

export function TemplateShowcase() {
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
            Mẫu Thiết Kế Đẹp Mắt
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontSize: '1.125rem',
              color: '#6B6B6B',
              lineHeight: 1.6,
            }}
          >
            Chọn từ các mẫu thiết kế chuyên nghiệp hoặc tự tạo trải nghiệm độc đáo của riêng bạn
          </p>
        </motion.div>

        {/* Template grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card 
                className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                style={{
                  background: 'var(--webo-glass-white)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Template image */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Overlay gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    }}
                  />

                  {/* Color tag */}
                  <div 
                    className="absolute top-4 right-4 w-12 h-12 rounded-full shadow-lg"
                    style={{ background: template.gradient }}
                  />

                </div>

                {/* Template info */}
                <div className="p-6">
                  <h3 
                    className="mb-2"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: '#1A1818',
                    }}
                  >
                    {template.title}
                  </h3>
                  <p
                    style={{
                      color: '#6B6B6B',
                      lineHeight: 1.6,
                    }}
                  >
                    {template.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
