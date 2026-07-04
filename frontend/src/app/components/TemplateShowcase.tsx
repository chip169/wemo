import { motion } from "motion/react";
import { Card } from "./ui/card";

const templates = [
  {
    title: "Ký Ức Lãng Mạn",
    description: "Bày tỏ tình yêu qua ảnh, video và những lời nhắn chân thành. Mẫu mạng lưới trái tim 3D lãng mạn.",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3Nzk2MTE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#E8B4A8",
    gradient: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
  },
  {
    title: "Mẫu Tinh Cầu 3D Vũ Trụ",
    description: "Lời nhắn bay lơ lửng giữa tinh vân lấp lánh và sao băng rực rỡ, kèm theo 16 ảnh kỷ niệm bay vòng quanh cực đẹp.",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#E11D48",
    gradient: "linear-gradient(135deg, #0D0214 0%, #E11D48 100%)",
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
