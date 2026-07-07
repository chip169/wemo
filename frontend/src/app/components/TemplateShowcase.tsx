import { motion } from "motion/react";
import { useState, useRef } from "react";
import { Card } from "./ui/card";
import { Sparkles, ArrowUpRight } from "lucide-react";

const templates = [
  {
    title: "Ký Ức Lãng Mạn",
    description: "Bày tỏ tình yêu qua ảnh, video và những lời nhắn chân thành. Mẫu mạng lưới trái tim 3D lãng mạn ngọt ngào.",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3Nzk2MTE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=600",
    color: "#E8B4A8",
    gradient: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
  },
  {
    title: "Mẫu Tinh Cầu 3D Vũ Trụ",
    description: "Lời nhắn bay lơ lửng giữa tinh vân lấp lánh và sao băng rực rỡ, kèm theo 16 ảnh kỷ niệm bay vòng quanh cực đẹp.",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "#E11D48",
    gradient: "linear-gradient(135deg, #0D0214 0%, #E11D48 100%)",
  },
  {
    title: "Kỷ Niệm Tối Giản",
    description: "Phong cách tạp chí thời trang cao cấp với tone màu thanh lịch, tập trung vào những thông điệp và hình ảnh nghệ thuật.",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "#0A0A0A",
    gradient: "linear-gradient(135deg, #1C1917 0%, #78716C 100%)",
  }
];

function InteractiveCard({ template }: { template: typeof templates[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotateX((yc - y) / 10); // tilt range
    setRotateY((x - xc) / 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="webo-3d-scene w-full h-full cursor-pointer group"
    >
      <Card
        className="webo-3d-card overflow-hidden border border-stone-100 rounded-3xl bg-white shadow-sm flex flex-col h-full"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: rotateX !== 0 ? "0 25px 50px -12px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.02)"
        }}
      >
        {/* Image view */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
          <img
            src={template.image}
            alt={template.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              Xem chi tiết mẫu <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          
          {/* Accent Color Tag */}
          <div 
            className="absolute top-4 right-4 w-9 h-9 rounded-full shadow-md border border-white/50"
            style={{ background: template.gradient }}
          />
        </div>

        {/* Info panel */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 
              className="mb-2 text-lg font-bold text-stone-900 group-hover:text-[#E8B4A8] transition-colors"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {template.title}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
              {template.description}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function TemplateShowcase() {
  return (
    <section className="relative py-24 md:py-32 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E8B4A8]" /> Template Collection
          </div>
          <h2 
            className="mb-4 font-black text-stone-900 tracking-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
            }}
          >
            Mẫu Thiết Kế Đẹp Mắt
          </h2>
          <p
            className="max-w-xl mx-auto text-stone-500 text-sm sm:text-base leading-relaxed"
          >
            Chọn từ các mẫu thiết kế chuyên nghiệp hoặc tùy chỉnh trải nghiệm độc đáo của riêng bạn
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
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <InteractiveCard template={template} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
