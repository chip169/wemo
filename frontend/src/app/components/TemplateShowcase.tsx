import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowUpRight, Eye, Play, Mail } from "lucide-react";
import { Card } from "./ui/card";
import { Link } from "react-router";

const INITIAL_TEMPLATES = [
  {
    id: "love-romantic",
    slug: "lang-man",
    title: "Ký Ức Lãng Mạn",
    description: "Bày tỏ tình yêu qua ảnh, video và những lời nhắn chân thành. Mẫu mạng lưới trái tim 3D lãng mạn.",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#E8B4A8",
    gradient: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
  },
  {
    id: "solid-heart",
    slug: "tinh-cau-3d",
    title: "Mẫu Tinh Cầu 3D Vũ Trụ",
    description: "Lời nhắn bay lơ lửng giữa tinh vân lấp lánh và sao băng rực rỡ, kèm theo 16 ảnh kỷ niệm bay vòng quanh cực đẹp.",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#E11D48",
    gradient: "linear-gradient(135deg, #0D0214 0%, #E11D48 100%)",
  },
  {
    id: "starlight-galaxy",
    slug: "da-khuc-anh-sao",
    title: "Dạ Khúc Ánh Sao 3D",
    description: "Vầng trăng khuyết pha lê 3D phát sáng giữa dải ngân hà lấp lánh, ngàn vì sao hộ tống lời chúc và ảnh kỷ niệm bay bổng thần tiên.",
    image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #0B1021 0%, #3B82F6 50%, #F59E0B 100%)",
  },
  {
    id: "crystal-rose",
    slug: "bong-hong-3d",
    title: "Bông Hồng Pha Lê 3D",
    description: "Bông hoa hồng pha lê đa giác 3D phát sáng rực rỡ, kèm theo những cánh hoa pha lê xoay chuyển bồng bềnh và thông điệp yêu thương ngọt ngào.",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#FB7185",
    gradient: "linear-gradient(135deg, #180018 0%, #BE123C 50%, #FDA4AF 100%)",
  },
  {
    id: "singularity-blackhole",
    slug: "ho-den-3d",
    title: "Hố Đen Singularity 3D",
    description: "Đĩa bồi tụ xoáy chuyển động rực rỡ quanh hố đen vũ trụ kỳ vĩ, ánh sáng quang sai bẻ cong không thời gian cùng ngàn vì sao.",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #05050A 0%, #F59E0B 50%, #3B82F6 100%)",
  },
  {
    id: "falling-memories",
    slug: "mua-ky-uc",
    title: "Mưa Ký Ức & Lời Yêu",
    description: "Cơn mưa sao băng ký ức với những tấm ảnh kỷ niệm và lời chúc yêu thương rơi bồng bềnh, hiệu ứng nổ pháo tim khi chạm.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#FF4D6D",
    gradient: "linear-gradient(135deg, #2b0015 0%, #FF4D6D 50%, #FF85A1 100%)",
  },
  {
    id: "love-counter",
    slug: "dem-ngay-yeu",
    title: "Nhật Ký Đếm Ngày Yêu",
    description: "Nút giữ tim 3 giây mở thiệp cảm xúc, bộ đếm thời gian bên nhau thời gian thực (ngày, giờ, phút, giây), ảnh đại diện cặp đôi.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#E11D48",
    gradient: "linear-gradient(135deg, #1A0510 0%, #E11D48 50%, #FDA4AF 100%)",
  },
  {
    id: "heart-wish",
    slug: "slide-ky-uc",
    title: "Trình Chiếu Lời Chúc Ký Ức",
    description: "Trái tim phát sáng mở thiệp, hiệu ứng chữ giải mã hacker lãng mạn, trình chiếu slide ảnh kỷ niệm mượt mà cùng nhạc nền du dương.",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#D946EF",
    gradient: "linear-gradient(135deg, #120014 0%, #D946EF 50%, #F472B6 100%)",
  }
];

const LOCAL_STORAGE_KEY = "wemo_templates_cache_v3";

function InteractiveCard({ template, isLoading }: { template: typeof INITIAL_TEMPLATES[0]; isLoading: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotateX((yc - y) / 14); // smooth tilt
    setRotateY((x - xc) / 14);
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
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full block group text-inherit select-none"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d"
      }}
    >
      <div
        className="overflow-hidden border border-stone-100 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgb(0,0,0,0.1)] flex flex-col h-full relative transition-all"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out, box-shadow 0.3s ease",
        }}
      >
        {/* Spotlight overlay effect on top */}
        {isHovered && (
          <div
            className="absolute pointer-events-none rounded-full transition-opacity duration-300 z-20"
            style={{
              width: '260px',
              height: '260px',
              left: spotlightPos.x - 130,
              top: spotlightPos.y - 130,
              background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(232,180,168,0.2) 50%, rgba(255,255,255,0) 70%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Top Image Box */}
        <div className="relative aspect-[16/11] overflow-hidden bg-stone-100 z-10 w-full">
          {showShimmer ? (
            <div className="w-full h-full shimmer-bg" />
          ) : (
            <img
              src={template.image}
              alt={template.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}

          {/* Top-left PAID badge */}
          <div className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA580C] text-white text-[11px] font-black tracking-wider uppercase shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>PAID</span>
          </div>

          {/* Center glass "Xem chi tiết" button */}
          <Link
            to={`/templates/${template.slug}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/25 transition-all shadow-md no-underline cursor-pointer group/btn"
          >
            <Eye className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
            <span>Xem chi tiết</span>
          </Link>
        </div>

        {/* Content panel */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between relative z-10 bg-white">
          <div>
            {/* Title */}
            <Link
              to={`/templates/${template.slug}`}
              className="no-underline text-inherit group-hover:text-[#EA580C] transition-colors"
            >
              <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-snug line-clamp-1 mb-2.5">
                {template.title}
              </h3>
            </Link>

            {/* Description with gold left border line */}
            <div className="border-l-2 border-[#D4AF78] pl-3 py-0.5">
              <p className="text-xs sm:text-[13px] text-stone-500 line-clamp-3 leading-relaxed font-normal">
                {template.description}
              </p>
            </div>
          </div>

          {/* Action Buttons: Video & Contact */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-1">
            <a
              href={`/adminWemo/preview/${template.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FFF0F4] border border-[#FFCCD5] text-[#E63956] hover:bg-[#FFE5EC] font-bold text-xs sm:text-sm transition-all no-underline shadow-2xs"
            >
              <Play className="w-3.5 h-3.5 stroke-[#E63956] fill-transparent" />
              <span>Video</span>
            </a>
            <a
              href="https://zalo.me/0398768699"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#E5A852] hover:bg-[#D99A40] text-[#2E1D03] font-bold text-xs sm:text-sm transition-all no-underline shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </div>
    </div>
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
            className="max-w-xl mx-auto text-stone-500 text-sm sm:text-base leading-relaxed whitespace-nowrap"
          >
            Chọn từ các mẫu thiết kế chuyên nghiệp hoặc tùy chỉnh trải nghiệm độc đáo của riêng bạn
          </p>
        </motion.div>

        {/* Template grid - responsive 3 items per row matching reference */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-7xl mx-auto">
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
