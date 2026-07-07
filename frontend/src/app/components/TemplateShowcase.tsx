import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Card } from "./ui/card";
import { Link } from "react-router";

const INITIAL_TEMPLATES = [
  {
    id: "love-romantic",
    slug: "lang-man",
    title: "Ký Ức Lãng Mạn",
    description: "Bày tỏ tình yêu qua ảnh, video và những lời nhắn chân thành. Mẫu mạng lưới trái tim 3D lãng mạn.",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3Nzk2MTE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=600",
    color: "#E8B4A8",
    gradient: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
  },
  {
    id: "solid-heart",
    slug: "tinh-cau-3d",
    title: "Mẫu Tinh Cầu 3D Vũ Trụ",
    description: "Lời nhắn bay lơ lửng giữa tinh vân lấp lánh và sao băng rực rỡ, kèm theo 16 ảnh kỷ niệm bay vòng quanh cực đẹp.",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    color: "#E11D48",
    gradient: "linear-gradient(135deg, #0D0214 0%, #E11D48 100%)",
  }
];

const LOCAL_STORAGE_KEY = "wemo_templates_cache";

function InteractiveCard({ template, isLoading }: { template: typeof INITIAL_TEMPLATES[0]; isLoading: boolean }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotateX((yc - y) / 10); // tilt range
    setRotateY((x - xc) / 10);
    setSpotlightPos({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const showShimmer = isLoading && template.image.includes("unsplash.com");

  return (
    <Link
      to={`/templates/${template.slug}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full block cursor-pointer group text-inherit no-underline"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d"
      }}
    >
      <Card
        className="overflow-hidden border border-white/40 rounded-3xl bg-white/45 backdrop-blur-md shadow-sm flex flex-col h-full relative"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out, box-shadow 0.3s ease",
          boxShadow: rotateX !== 0 ? "0 25px 50px -12px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.02)"
        }}
      >
        {/* Spotlight effect */}
        {isHovered && (
          <div
            className="absolute pointer-events-none rounded-full blur-[40px] opacity-60 transition-opacity duration-300"
            style={{
              width: '180px',
              height: '180px',
              left: spotlightPos.x - 90,
              top: spotlightPos.y - 90,
              background: 'radial-gradient(circle, rgba(232,180,168,0.35) 0%, rgba(212,175,120,0) 70%)',
              zIndex: 0,
            }}
          />
        )}

        {/* Image view */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-50 z-10">
          {showShimmer ? (
            <div className="w-full h-full shimmer-bg" />
          ) : (
            <img
              src={template.image}
              alt={template.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
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
        <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
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
    </Link>
  );
}

export function TemplateShowcase() {
  const [templateList, setTemplateList] = useState(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error("Error reading templates cache:", e);
    }
    return INITIAL_TEMPLATES;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        const merged = INITIAL_TEMPLATES.map((tpl) => {
          const dbTpl = data.find((t) => t.id === tpl.id);
          if (!dbTpl) return tpl;
          return {
            ...tpl,
            title: dbTpl.name || tpl.title,
            description: dbTpl.sampleMessage || tpl.description,
            image: dbTpl.preview || tpl.image,
          };
        });
        setTemplateList(merged);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading templates in showcase:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-[#FCE1DA] to-[#FFF0EC] overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}} />

      {/* Ambient Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 45, -25, 0],
            y: [0, -70, 40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-[#E8B4A8]/15 to-[#D4AF78]/15 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 50, -60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-[#D4AF78]/15 to-[#E8B4A8]/15 blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2
            className="mb-4 font-black text-stone-900 tracking-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
            }}
          >
            Mẫu Thiết Kế Độc Đáo
          </h2>
          <p
            className="max-w-xl mx-auto text-stone-500 text-sm sm:text-base leading-relaxed"
          >
            Chọn từ các mẫu thiết kế chuyên nghiệp hoặc tùy chỉnh trải nghiệm độc đáo của riêng bạn
          </p>
        </motion.div>

        {/* Template grid - centered and balanced for 2 items */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {templateList.map((template, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <InteractiveCard template={template} isLoading={isLoading} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
