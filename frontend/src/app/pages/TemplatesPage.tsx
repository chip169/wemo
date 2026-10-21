import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Eye, Sparkles, Heart, Search, Check, Layers, Play, Mail } from "lucide-react";
import { Link } from "react-router";

const STATIC_TEMPLATES = [
  {
    slug: "lang-man",
    title: "Ký Ức Lãng Mạn",
    category: "romance",
    emoji: "💕",
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
    category: "galaxy",
    emoji: "🪐",
    description: "Lời nhắn bay lơ lửng giữa tinh vân lấp lánh và sao băng rực rỡ, kèm theo 16 ảnh kỷ niệm bay vòng quanh cực đẹp.",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#E11D48",
    gradient: "linear-gradient(135deg, #0D0214 0%, #E11D48 100%)",
    tag: "Độc quyền 3D",
    features: ["Tối đa 16 ảnh kỷ niệm", "Hành tinh điểm sáng 3D", "Sao băng đa hướng luân phiên", "Vòng xoay ảnh kỷ niệm"],
  },
  {
    slug: "da-khuc-anh-sao",
    title: "Dạ Khúc Ánh Sao 3D",
    category: "anniversary",
    emoji: "🌙",
    description: "Vầng trăng khuyết pha lê 3D phát sáng giữa dải ngân hà lấp lánh, ngàn vì sao hộ tống lời chúc và ảnh kỷ niệm bay bổng thần tiên.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #0B1021 0%, #3B82F6 50%, #F59E0B 100%)",
    tag: "Ngân Hà 3D",
    features: ["Tối đa 12 ảnh kỷ niệm", "Trăng khuyết pha lê 3D", "Dải sao băng lấp lánh", "Vòng xoay ảnh quỹ đạo"],
  },
  {
    slug: "bong-hong-3d",
    title: "Bông Hồng Pha Lê 3D",
    category: "rose",
    emoji: "🌹",
    description: "Bông hoa hồng pha lê đa giác 3D phát sáng rực rỡ, kèm theo những cánh hoa pha lê xoay chuyển bồng bềnh và thông điệp yêu thương ngọt ngào.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#FB7185",
    gradient: "linear-gradient(135deg, #180018 0%, #BE123C 50%, #FDA4AF 100%)",
    tag: "Pha Lê 3D",
    features: ["Tối đa 10 ảnh kỷ niệm", "Hoa hồng pha lê nở 3D", "Cánh hoa rơi bồng bềnh", "Ánh sáng lăng kính đa sắc"],
  },
  {
    slug: "ho-den-3d",
    title: "Hố Đen Singularity 3D",
    category: "galaxy",
    emoji: "🕳️",
    description: "Đĩa bồi tụ xoáy chuyển động rực rỡ quanh hố đen vũ trụ kỳ vĩ, ánh sáng quang sai bẻ cong không thời gian cùng ngàn vì sao hộ tống lời chúc và ảnh kỷ niệm.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #05050A 0%, #F59E0B 50%, #3B82F6 100%)",
    tag: "Vũ Trụ 3D",
    features: ["Tối đa 16 ảnh kỷ niệm", "Đĩa bồi tụ xoáy 3D", "Quang sai bẻ cong ánh sáng", "Hố đen chân trời sự kiện"],
  },
  {
    slug: "mua-ky-uc",
    title: "Mưa Ký Ức & Lời Yêu",
    category: "romance",
    emoji: "🌧️",
    description: "Cơn mưa sao băng ký ức với những tấm ảnh kỷ niệm và lời chúc yêu thương rơi bồng bềnh, hiệu ứng nổ pháo tim khi chạm, nền trời lung linh.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#FF4D6D",
    gradient: "linear-gradient(135deg, #2b0015 0%, #FF4D6D 50%, #FF85A1 100%)",
    tag: "Mưa Ký Ức",
    features: ["Tối đa 20 ảnh kỷ niệm", "Cơn mưa ảnh và lời yêu rơi", "Hiệu ứng nổ tim tương tác", "Bức thư tình yêu ngọt ngào"],
  },
  {
    slug: "dem-ngay-yeu",
    title: "Nhật Ký Đếm Ngày Yêu",
    category: "counter",
    emoji: "⏳",
    description: "Nút giữ tim 3 giây mở thiệp cảm xúc, bộ đếm thời gian bên nhau thời gian thực (ngày, giờ, phút, giây), ảnh đại diện cặp đôi và album kỷ niệm.",
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#E11D48",
    gradient: "linear-gradient(135deg, #1A0510 0%, #E11D48 50%, #FDA4AF 100%)",
    tag: "Đếm Ngày Yêu",
    features: ["Ảnh đại diện cặp đôi", "Đếm ngày, giờ, phút, giây", "Nhấn giữ tim 3s mở thiệp", "Album ảnh kỷ niệm"],
  },
  {
    slug: "slide-ky-uc",
    title: "Trình Chiếu Lời Chúc Ký Ức",
    category: "counter",
    emoji: "💌",
    description: "Trái tim phát sáng mở thiệp, hiệu ứng chữ giải mã hacker lãng mạn, trình chiếu slide ảnh kỷ niệm mượt mà cùng nhạc nền du dương.",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    color: "#D946EF",
    gradient: "linear-gradient(135deg, #120014 0%, #D946EF 50%, #F472B6 100%)",
    tag: "Slide Ký Ức",
    features: ["Chạm tim mở đầu", "Chữ giải mã hacker", "Trình chiếu slide ảnh & GIF", "Thanh điều hướng tiện lợi"],
  },
];

const LOCAL_STORAGE_KEY = "wemo_templates_cache_page";

const SLUG_TO_ID_MAP: Record<string, string> = {
  "lang-man": "love-romantic",
  "tinh-cau-3d": "solid-heart",
  "da-khuc-anh-sao": "starlight-galaxy",
  "bong-hong-3d": "crystal-rose",
  "ho-den-3d": "singularity-blackhole",
  "mua-ky-uc": "falling-memories",
  "dem-ngay-yeu": "love-counter",
  "slide-ky-uc": "heart-wish",
};

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
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        const merged = STATIC_TEMPLATES.map((staticTpl) => {
          const dbId = SLUG_TO_ID_MAP[staticTpl.slug] || staticTpl.slug;
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

  const categories = [
    { id: "all", label: "Tất cả", icon: "✨", count: templates.length },
    { id: "romance", label: "Tình yêu 💕", icon: "💕" },
    { id: "galaxy", label: "Vũ trụ 🪐", icon: "🪐" },
    { id: "rose", label: "Hoa hồng 🌹", icon: "🌹" },
    { id: "anniversary", label: "Kỷ niệm 🌙", icon: "🌙" },
    { id: "counter", label: "Đếm ngày & Slide ⏳", icon: "⏳" },
  ];

  const filteredTemplates = templates.filter((template) => {
    if (activeCategory !== "all" && template.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = template.title?.toLowerCase().includes(q);
      const matchDesc = template.description?.toLowerCase().includes(q);
      const matchTag = template.tag?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  return (
    <div data-context="templates" className="pt-16 sm:pt-20 min-h-screen" style={{ background: "#FCEBE7" }}>
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

      {/* Hero Header - Optimized for mobile */}
      <section className="py-8 sm:py-16 text-center px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 shadow-xs"
            style={{ background: "rgba(232,180,168,0.25)", color: "#A85B4C" }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Kho Mẫu Thiệp 3D Wemo
          </span>
          <h1
            className="mb-3 text-2xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight"
          >
            Chọn Mẫu Hoàn Hảo Cho Người Thương
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-base text-stone-600 leading-relaxed">
            Khám phá 8 mẫu thiệp 3D tương tác độc quyền. Mỗi mẫu đều tùy chỉnh toàn bộ hình ảnh, lời chúc và giai điệu theo câu chuyện của riêng hai bạn.
          </p>
        </motion.div>
      </section>

      {/* Controls: Category Pills & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Horizontal Category Scroll Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border-0 cursor-pointer ${
                    isActive
                      ? "bg-stone-900 text-white shadow-md scale-102"
                      : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80 shadow-xs"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên mẫu thiệp..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-stone-700 outline-none focus:border-[#E8B4A8] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold bg-transparent border-0 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Templates Grid - Mobile App Optimized (2 cols on mobile, 3-4 on desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredTemplates.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <h3 className="text-sm font-bold text-stone-800">Không tìm thấy mẫu thiệp nào</h3>
            <p className="text-xs text-stone-500">
              Hãy thử chọn mục "Tất cả" hoặc xóa từ khóa tìm kiếm.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold border-0 cursor-pointer"
            >
              Xem toàn bộ 8 mẫu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredTemplates.map((template, index) => {
              const showShimmer = isLoading && template.image.includes("unsplash.com");
              const previewId = SLUG_TO_ID_MAP[template.slug] || template.slug;
              return (
                <motion.div
                  key={template.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgb(0,0,0,0.1)] transition-all flex flex-col justify-between"
                >
                  {/* Top Image Preview */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-stone-100 w-full">
                    {showShimmer ? (
                      <div className="w-full h-full shimmer-bg" />
                    ) : (
                      <img
                        src={template.image}
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <Link
                        to={`/templates/${template.slug}`}
                        className="no-underline text-inherit group-hover:text-[#EA580C] transition-colors"
                      >
                        <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-snug line-clamp-1 mb-2.5">
                          {template.title} {template.emoji || ""}
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
                        href={`/adminWemo/preview/${previewId}`}
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
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Custom template CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-3xl p-6 sm:p-10 text-center max-w-3xl mx-auto bg-white border-2 border-dashed border-[#E8B4A8]/60 shadow-xs"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl bg-[#E8B4A8]/15"
          >
            ✨
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-stone-900 mb-1.5">
            Bạn Muốn Thiết Kế Mẫu Riêng Biệt?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-5 leading-relaxed">
            Wemo hỗ trợ dựng hiệu ứng 3D tùy biến theo yêu cầu cá nhân hóa hoặc quà tặng doanh nghiệp độc quyền.
          </p>
          <Link
            to="/wizard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] hover:opacity-95 shadow-md no-underline"
          >
            Bắt đầu tạo thiệp ngay <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
