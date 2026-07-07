import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const STATIC_TEMPLATES = [
  {
    slug: "lang-man",
    title: "Ký Ức Lãng Mạn",
    description: "Bày tỏ tình yêu qua ảnh, video và những lời nhắn chân thành. Mẫu mạng lưới trái tim 3D lãng mạn.",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxvdmUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3Nzk2MTE4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#E8B4A8",
    gradient: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
    tag: "Mạng lưới 3D",
    features: ["Tối đa 6 ảnh kỷ niệm", "Mạng lưới trái tim rơi", "Nhạc nền lãng mạn", "Hộp thư bí mật"],
  },
  {
    slug: "tinh-cau-3d",
    title: "Mẫu Tinh Cầu 3D Vũ Trụ",
    description: "Lời nhắn bay lơ lửng giữa tinh vân lấp lánh và sao băng rực rỡ, kèm theo 16 ảnh kỷ niệm bay vòng quanh cực đẹp.",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#E11D48",
    gradient: "linear-gradient(135deg, #0D0214 0%, #E11D48 100%)",
    tag: "Độc quyền 3D",
    features: ["Tối đa 16 ảnh kỷ niệm", "Hành tinh điểm sáng 3D", "Sao băng đa hướng luân phiên", "Vòng xoay ảnh kỷ niệm"],
  },
];

const LOCAL_STORAGE_KEY = "wemo_templates_cache_page";

export function TemplatesPage() {
  const [templates, setTemplates] = useState(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error("Error reading templates cache:", e);
    }
    return STATIC_TEMPLATES;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        const merged = STATIC_TEMPLATES.map((staticTpl) => {
          const dbId = staticTpl.slug === "tinh-cau-3d" ? "solid-heart" : "love-romantic";
          const dbTpl = data.find((t) => t.id === dbId);
          if (!dbTpl) return staticTpl;
          return {
            ...staticTpl,
            title: dbTpl.name || staticTpl.title,
            description: dbTpl.sampleMessage || staticTpl.description,
            image: dbTpl.preview || staticTpl.image,
            features: (dbTpl.features && dbTpl.features.length > 0) ? dbTpl.features : staticTpl.features,
          };
        });
        setTemplates(merged);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading templates:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="pt-20" style={{ background: "#FAF8F5" }}>
      <style dangerouslySetInnerHTML={{__html: `
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
            2 mẫu thiết kế 3D tương tác độc đáo cho nửa kia của bạn. Mỗi mẫu đều có thể tùy chỉnh hoàn toàn theo ý bạn.
          </p>
        </motion.div>
      </section>

      {/* Templates grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {templates.map((template, index) => {
            const showShimmer = isLoading && template.image.includes("unsplash.com");
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
              <Link
                to={`/templates/${template.slug}`}
                className="block group overflow-hidden rounded-3xl cursor-pointer"
                style={{
                  background: "white",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-stone-50">
                  {showShimmer ? (
                    <div className="w-full h-full shimmer-bg" />
                  ) : (
                    <motion.img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
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
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: `${template.color}15`, color: template.color }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold transition-all" style={{ color: template.color }}>
                  Xem Mẫu Này
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            </motion.div>
          );
          })}
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
