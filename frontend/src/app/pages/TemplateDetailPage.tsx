import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Music, Image, Mic, Clock, Sparkles, Play, Star, Video } from "lucide-react";

/* ─── Template data ─────────────────────────────────────────── */

const TEMPLATES: Record<string, TemplateConfig> = {
  "lang-man": {
    slug: "lang-man",
    title: "Ký Ức Lãng Mạn",
    subtitle: "Bày tỏ tình yêu qua ảnh, video và những lời nhắn chân thành",
    bg: "linear-gradient(135deg, #F6C3B7 0%, #E8B4A8 50%, #D4AF78 100%)",
    cardBg: "#FDF5F3",
    accent: "#C4776A",
    accentLight: "#E8B4A8",
    emoji: "💕",
    confettiColors: ["#E8B4A8", "#D4AF78", "#F6C3B7", "#C4776A", "#F0D9D5"],
    heroImg: "/assets/templates/love-romantic.jpg",
    photos: [
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=300&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1551850985-5e6cd6e2dd8c?w=400&h=300&fit=crop&auto=format",
    ],
    sampleMessage: "Anh/Em yêu, mỗi khoảnh khắc bên em/anh đều là một trang ký ức đẹp nhất trong cuốn sách cuộc đời. Cảm ơn em/anh đã là ánh nắng của ngày tôi, là bến bờ của những giông tố. Tôi yêu em/anh mãi mãi.",
    sender: "Của anh/em, người luôn bên cạnh 💕",
    features: ["Tối đa 6 ảnh kỷ niệm", "Mạng lưới trái tim rơi", "Nhạc nền tình yêu", "Dòng thời gian hẹn hò", "Hộp thư bí mật"],
    mood: "Lãng mạn · Ấm áp · Chân thành",
  },
  "tinh-cau-3d": {
    slug: "tinh-cau-3d",
    title: "Mẫu Tinh Cầu 3D Vũ Trụ",
    subtitle: "Thiết kế tương tác không gian vũ trụ tinh vân lấp lánh và ảnh bay lượn vòng tròn",
    bg: "linear-gradient(135deg, #0D0214 0%, #E11D48 100%)",
    cardBg: "#0D0214",
    accent: "#E11D48",
    accentLight: "#FF80BF",
    emoji: "🪐",
    confettiColors: ["#FF1E82", "#E11D48", "#FFFFFF", "#8B5CF6", "#38BDF8"],
    heroImg: "/assets/templates/solid-heart.jpg",
    photos: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
      "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=400&q=80",
      "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80",
    ],
    sampleMessage: "Em ơi, một năm bên nhau là một năm anh cảm thấy mình là người hạnh phúc nhất thế giới. Cảm ơn em đã bước vào cuộc sống của anh và vẽ nên bức tranh tình yêu lấp lánh như ngàn tinh tú. Anh yêu em mãi mãi! 💖",
    sender: "Của em, người đồng hành trọn đời ❤️",
    features: ["Tối đa 16 ảnh kỷ niệm", "Hành tinh tinh cầu 3D tương tác", "Sao băng rơi đa góc luân phiên", "Vành đai Saturn hạt sao", "Nhạc nền lãng mạn"],
    mood: "Huyền ảo · Lãng mạn · Tương tác 3D",
  },
  "da-khuc-anh-sao": {
    slug: "da-khuc-anh-sao",
    title: "Dạ Khúc Ánh Sao 3D",
    subtitle: "Vầng trăng khuyết pha lê phát sáng giữa ngàn tinh tú và dải ngân hà huyền ảo",
    bg: "linear-gradient(135deg, #0B1021 0%, #1E1B4B 50%, #D97706 100%)",
    cardBg: "#0B1021",
    accent: "#F59E0B",
    accentLight: "#FDE68A",
    emoji: "🌙",
    confettiColors: ["#F59E0B", "#FDE68A", "#60A5FA", "#FFFFFF", "#38BDF8"],
    heroImg: "/assets/templates/starlight-galaxy.jpg",
    photos: [
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
      "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80",
    ],
    sampleMessage: "Dù thời gian có trôi và vạn vật đổi thay, khoảnh khắc ngắm nhìn ánh sao cùng người tôi thương vẫn luôn là điều tuyệt diệu nhất. Nguyện cùng nhau đi qua ngàn đêm trăng sáng.",
    sender: "Thương gửi từ ánh sao của bạn ✨",
    features: ["Tối đa 12 ảnh kỷ niệm", "Vầng trăng khuyết pha lê 3D", "Dải sao băng lấp lánh", "Vòng xoay ảnh quỹ đạo", "Bụi tinh vân tương tác"],
    mood: "Huyền bí · Thi vị · Vĩnh cửu",
  },
  "bong-hong-3d": {
    slug: "bong-hong-3d",
    title: "Bông Hồng Pha Lê 3D",
    subtitle: "Bông hoa hồng pha lê nở rộ phát sáng cùng những cánh hoa bay bổng trong không gian cổ tích",
    bg: "linear-gradient(135deg, #180018 0%, #831843 50%, #FDA4AF 100%)",
    cardBg: "#140014",
    accent: "#FB7185",
    accentLight: "#FDA4AF",
    emoji: "🌹",
    confettiColors: ["#FB7185", "#FDA4AF", "#E11D48", "#10B981", "#FFF1F2"],
    heroImg: "/assets/templates/crystal-rose.jpg",
    photos: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
      "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=400&q=80",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80",
    ],
    sampleMessage: "Chúc em/anh luôn rạng rỡ và tỏa sáng như đóa hồng pha lê vĩnh cửu. Cảm ơn vì đã luôn mang niềm vui và sự ấm áp đến cho cuộc sống của tôi mỗi ngày! 🌹✨",
    sender: "Với tất cả tình yêu thương ❤️",
    features: ["Tối đa 10 ảnh kỷ niệm", "Đóa hồng pha lê nở rộ 3D", "Cánh hoa rơi bồng bềnh", "Ánh sáng lăng kính đa sắc", "Hộp thư tình yêu ngọt ngào"],
    mood: "Sang trọng · Quý phái · Ngọt ngào",
  },
  "ho-den-3d": {
    slug: "ho-den-3d",
    title: "Hố Đen Singularity 3D",
    subtitle: "Đĩa bồi tụ xoáy rực rỡ quanh hố đen vũ trụ kỳ vĩ, ánh sáng quang sai bẻ cong không thời gian",
    bg: "linear-gradient(135deg, #05050A 0%, #1A0B2E 50%, #F59E0B 100%)",
    cardBg: "#05050A",
    accent: "#F59E0B",
    accentLight: "#FDE68A",
    emoji: "🕳️",
    confettiColors: ["#F59E0B", "#FDE68A", "#3B82F6", "#FFFFFF", "#9333EA"],
    heroImg: "/assets/templates/singularity-blackhole.jpg",
    photos: [
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80",
    ],
    sampleMessage: "Tình yêu như lực hấp dẫn vô cực của hố đen kỳ vĩ, bẻ cong cả không gian và thời gian để đưa chúng ta về bên nhau. Mãi yêu em! 🌌🕳️",
    sender: "Từ chân trời sự kiện của anh 🪐",
    features: ["Tối đa 16 ảnh kỷ niệm", "Đĩa bồi tụ xoáy chuyển động 3D", "Vòng quang sai bẻ cong ánh sáng", "Hố đen chân trời sự kiện"],
    mood: "Hùng vĩ · Vũ trụ · Huyền bí",
  },
  "mua-ky-uc": {
    slug: "mua-ky-uc",
    title: "Mưa Ký Ức & Lời Yêu",
    subtitle: "Cơn mưa sao băng ký ức với những bức ảnh và lời chúc yêu thương rơi bồng bềnh",
    bg: "linear-gradient(135deg, #2b0015 0%, #FF4D6D 50%, #FF85A1 100%)",
    cardBg: "#1F0010",
    accent: "#FF4D6D",
    accentLight: "#FF85A1",
    emoji: "🌧️",
    confettiColors: ["#FF4D6D", "#FF85A1", "#FFAFCC", "#FFFFFF"],
    heroImg: "/assets/templates/falling-memories.jpg",
    photos: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
      "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=400&q=80",
    ],
    sampleMessage: "Từng khoảnh khắc rơi xuống như ngàn lời yêu thương anh muốn gửi đến em. Cảm ơn em vì đã là điều kỳ diệu nhất trong cuộc đời anh! 💕",
    sender: "Gửi đến em ngàn vì sao ký ức 💖",
    features: ["Tối đa 20 ảnh kỷ niệm", "Cơn mưa ảnh và thông điệp rơi", "Hiệu ứng nổ tim tương tác", "Bức thư tình yêu ngọt ngào"],
    mood: "Mộng mơ · Ngọt ngào · Cảm xúc",
  },
  "dem-ngay-yeu": {
    slug: "dem-ngay-yeu",
    title: "Nhật Ký Đếm Ngày Yêu",
    subtitle: "Bộ đếm thời gian bên nhau thời gian thực cùng ảnh đại diện đôi và album kỷ niệm",
    bg: "linear-gradient(135deg, #1A0510 0%, #E11D48 50%, #FDA4AF 100%)",
    cardBg: "#14000C",
    accent: "#E11D48",
    accentLight: "#FDA4AF",
    emoji: "⏳",
    confettiColors: ["#E11D48", "#FDA4AF", "#FB7185", "#FFFFFF"],
    heroImg: "/assets/templates/love-counter.jpg",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
    ],
    sampleMessage: "Mỗi ngày trôi qua bên em đều là một ngày tuyệt vời nhất. Cảm ơn vì chúng ta đã luôn nắm chặt tay nhau trên chặng đường này! ⏳❤️",
    sender: "Người thương của em ❤️",
    features: ["Ảnh đại diện cặp đôi", "Bộ đếm ngày, giờ, phút, giây", "Nhấn giữ tim 3s mở thiệp", "Album ảnh kỷ niệm"],
    mood: "Bền chặt · Lãng mạn · Trân quý",
  },
  "slide-ky-uc": {
    slug: "slide-ky-uc",
    title: "Trình Chiếu Lời Chúc Ký Ức",
    subtitle: "Chạm tim mở thiệp, hiệu ứng chữ giải mã hacker và slide trình chiếu ảnh kỷ niệm",
    bg: "linear-gradient(135deg, #120014 0%, #D946EF 50%, #F472B6 100%)",
    cardBg: "#0E0010",
    accent: "#D946EF",
    accentLight: "#F472B6",
    emoji: "💌",
    confettiColors: ["#D946EF", "#F472B6", "#C084FC", "#FFFFFF"],
    heroImg: "/assets/templates/heart-wish.jpg",
    photos: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
      "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=400&q=80",
    ],
    sampleMessage: "Chúc người tôi thương luôn mỉm cười rạng rỡ và hạnh phúc mỗi ngày. Em luôn xứng đáng với những điều tuyệt vời nhất trần đời! 🌟💖",
    sender: "Thương gửi từ trái tim 💌",
    features: ["Chạm tim hiệu ứng mở đầu", "Hiệu ứng chữ giải mã hacker", "Trình chiếu slide ảnh & GIF", "Thanh điều hướng tiện lợi"],
    mood: "Trẻ trung · Bất ngờ · Tinh tế",
  },
  "trai-tim-anh-3d": {
    slug: "trai-tim-anh-3d",
    title: "Trái Tim Ghép Ảnh 3D",
    subtitle: "Những bức ảnh kỷ niệm ghép thành hình trái tim 3D lơ lửng giữa trời sao, xoay 360 độ",
    bg: "linear-gradient(135deg, #000000 0%, #BE185D 50%, #F472B6 100%)",
    cardBg: "#050005",
    accent: "#EC4899",
    accentLight: "#F472B6",
    emoji: "❤️",
    confettiColors: ["#EC4899", "#BE185D", "#F472B6", "#FFFFFF"],
    heroImg: "/assets/templates/heart-image.jpg",
    photos: [
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80",
    ],
    sampleMessage: "Những khoảnh khắc bên em ghép lại thành trái tim tình yêu hoàn hảo nhất. Cảm ơn em vì đã là tình yêu và định mệnh của đời anh! ❤️✨",
    sender: "Yêu em vô cùng ❤️",
    features: ["Tối đa 20 ảnh kỷ niệm", "Trái tim ảnh 3D xoay không gian", "Mưa chữ yêu thương phát sáng", "Bầu trời đêm sao băng lung linh"],
    mood: "Sáng tạo · Độc đáo · 3D",
  },
  "tri-an-20-10": {
    slug: "tri-an-20-10",
    title: "Tri Ân Yêu Thương 20/10",
    subtitle: "Thiết kế tôn vinh phái đẹp và Mẹ yêu. Mưa ảnh kỷ niệm rơi nhẹ nhàng cùng giai điệu piano ngọt ngào",
    bg: "linear-gradient(135deg, #FFD6E0 0%, #FFF2CC 50%, #FFE5EC 100%)",
    cardBg: "#FFF7F9",
    accent: "#FB7185",
    accentLight: "#FDA4AF",
    emoji: "💐",
    confettiColors: ["#FB7185", "#FDA4AF", "#F472B6", "#FFE5EC"],
    heroImg: "/assets/templates/gift-wday.jpg",
    photos: [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
    ],
    sampleMessage: "Chúc người phụ nữ tuyệt vời nhất luôn ngập tràn niềm vui, mạnh khỏe và hạnh phúc. Cảm ơn vì tất cả những hi sinh và yêu thương vô điều kiện! 💐💕",
    sender: "Gửi ngàn lời tri ân yêu thương 🌸",
    features: ["Tối đa 12 ảnh kỷ niệm", "Cơn mưa ảnh hoa rơi bồng bềnh", "Thông điệp chuyển động cảm xúc", "Nhạc nền du dương ngọt ngào"],
    mood: "Ấm áp · Tri ân · Dịu dàng",
  },
};

type TemplateConfig = {
  slug: string;
  title: string;
  subtitle: string;
  bg: string;
  cardBg: string;
  accent: string;
  accentLight: string;
  emoji: string;
  confettiColors: string[];
  heroImg: string;
  photos: string[];
  sampleMessage: string;
  sender: string;
  features: string[];
  mood: string;
};

/* ─── Confetti particle ─────────────────────────────────────── */
function Particle({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{
        background: color,
        left: `${Math.random() * 100}%`,
        top: "-8px",
      }}
      animate={{ y: [0, window.innerHeight + 20], x: [0, (Math.random() - 0.5) * 200], opacity: [1, 1, 0], rotate: [0, 720] }}
      transition={{ duration: 3 + Math.random() * 2, delay, ease: "easeIn", repeat: Infinity, repeatDelay: Math.random() * 3 }}
    />
  );
}

/* ─── Photo gallery ─────────────────────────────────────────── */
function PhotoGallery({ photos, accent }: { photos: string[]; accent: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden mb-3" style={{ aspectRatio: "4/3" }}>
        <motion.img
          key={active}
          src={photos[active]}
          alt="Ảnh kỷ niệm"
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)" }} />
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{ background: i === active ? "white" : "rgba(255,255,255,0.5)", transform: i === active ? "scale(1.3)" : "scale(1)" }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
        {photos.map((src, i) => (
          <button key={i} onClick={() => setActive(i)} className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "1" }}>
            <img src={src} alt="" className="w-full h-full object-cover animate-fade" />
            {i === active && (
              <motion.div layoutId="gallery-active" className="absolute inset-0 rounded-lg" style={{ border: `2px solid ${accent}` }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Timeline row (anniversary) ───────────────────────────── */
function TimelineRow({ year, event, accent }: { year: string; event: string; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-start gap-4"
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: accent }}>
          {year.slice(-2)}
        </div>
        <div className="w-px flex-1 mt-1" style={{ background: `${accent}30`, minHeight: "24px" }} />
      </div>
      <div className="pt-1.5 pb-4">
        <div className="text-xs font-mono mb-0.5" style={{ color: accent }}>{year}</div>
        <div style={{ color: "#1A1818", fontSize: "0.9375rem", lineHeight: 1.5 }}>{event}</div>
      </div>
    </motion.div>
  );
}

function isDarkColor(hex?: string): boolean {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return false;
  const c = hex.replace("#", "").trim();
  let r = 0, g = 0, b = 0;
  if (c.length === 3) {
    r = parseInt(c[0] + c[0], 16);
    g = parseInt(c[1] + c[1], 16);
    b = parseInt(c[2] + c[2], 16);
  } else if (c.length >= 6) {
    r = parseInt(c.substring(0, 2), 16);
    g = parseInt(c.substring(2, 4), 16);
    b = parseInt(c.substring(4, 6), 16);
  } else {
    return false;
  }
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

/* ─── Main component ────────────────────────────────────────── */
export function TemplateDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const staticTpl = TEMPLATES[slug ?? ""] ?? TEMPLATES["lang-man"];
  const [playing, setPlaying] = useState(false);
  const [showFull, setShowFull] = useState(false);

  // Dynamic template details from API database
  const [dbTpl, setDbTpl] = useState<any>(() => {
    try {
      const targetId = SLUG_TO_ID_MAP[slug ?? ""] || "love-romantic";
      const cachedShowcase = localStorage.getItem("wemo_templates_cache_v6") || localStorage.getItem("wemo_templates_cache_v5");
      const cachedPage = localStorage.getItem("wemo_templates_cache_page_v6") || localStorage.getItem("wemo_templates_cache_page_v5");
      const cachedData = cachedPage || cachedShowcase;
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const found = parsed.find((t: any) => t.id === targetId || t.slug === slug);
        if (found) {
          return {
            name: found.title,
            sampleMessage: found.description,
            preview: found.image,
            features: found.features || []
          };
        }
      }
    } catch (e) {
      console.error("Error loading cache in TemplateDetailPage:", e);
    }
    return null;
  });

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        const targetId = SLUG_TO_ID_MAP[slug ?? ""] || "love-romantic";
        const found = data.find((t) => t.id === targetId);
        if (found) {
          setDbTpl(found);
        }
      })
      .catch((err) => console.error("Error fetching templates:", err));
  }, [slug]);

  // Merge static stylings with database content
  const tpl = {
    ...staticTpl,
    title: (dbTpl?.name === "Mãi Yêu Thương (Mạng Lưới 3D)" ? "Ký Ức Lãng Mạn" : dbTpl?.name) || staticTpl.title,
    heroImg: dbTpl?.preview || staticTpl.heroImg,
    sampleMessage: dbTpl?.sampleMessage || staticTpl.sampleMessage,
    photos: (dbTpl?.photos && dbTpl.photos.length > 0) ? dbTpl.photos : staticTpl.photos,
    features: (dbTpl?.features && dbTpl.features.length > 0) ? dbTpl.features : staticTpl.features,
    videoUrl: dbTpl?.videoUrl || "",
  };

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const isAnniversary = slug === "ky-niem";
  const isDarkCard = isDarkColor(tpl.cardBg);
  const textColor = isDarkCard ? "#FFFFFF" : "#1E293B";
  const subTextColor = isDarkCard ? "rgba(255, 255, 255, 0.75)" : "#64748B";
  const cardAccent = isDarkCard ? (tpl.accentLight || tpl.accent) : tpl.accent;

  return (
    <div
      className="pt-20 min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(1300px 900px at 15% 10%, rgba(255, 238, 233, 0.95) 0%, transparent 70%), radial-gradient(1000px 700px at 85% 15%, rgba(254, 238, 224, 0.85) 0%, transparent 65%), radial-gradient(900px 600px at 50% 90%, rgba(255, 232, 236, 0.75) 0%, transparent 60%), linear-gradient(180deg, #FFF9F7 0%, #FAF3F0 50%, #F5ECE8 100%)",
      }}
    >
      {/* Ambient Luxury Lighting Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#FFD8D0]/40 to-[#FDEBE3]/10 blur-[100px]" />
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-[#FFE3D6]/35 to-[#FCE9DC]/10 blur-[100px]" />
        <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-[#FFE7EA]/40 to-[#FFF3EF]/10 blur-[100px]" />
      </div>

      {/* ── Back nav ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-3">
        <Link to="/templates" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-stone-900" style={{ color: "#6B6B6B" }}>
          <ArrowLeft className="w-4 h-4" />
          Tất cả mẫu thiệp
        </Link>
      </div>

      {/* ── Template Header Info (Cleanly outside of image) ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-3xl md:text-4xl">{tpl.emoji}</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A1818] tracking-tight">
                {tpl.title}
              </h1>
              <span
                className="px-3.5 py-1 rounded-full text-xs font-semibold shadow-sm"
                style={{
                  background: `${tpl.accentLight}35`,
                  color: tpl.accent === "#F59E0B" ? "#B45309" : tpl.accent,
                  border: `1px solid ${tpl.accent}30`,
                }}
              >
                {tpl.mood}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
              {tpl.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ── Hero banner (Clean image without any text on top) ── */}
      <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 rounded-3xl mb-12 shadow-2xl border border-black/5" style={{ maxWidth: "calc(72rem)", margin: "0 auto 3rem", marginLeft: "auto", marginRight: "auto" }}>
        <div className="relative h-72 sm:h-96 md:h-[460px] overflow-hidden rounded-3xl bg-slate-900 group">
          <img src={tpl.heroImg} alt={tpl.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Left: preview experience */}
          <div className="lg:col-span-3 space-y-6">

            {/* Message card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-8 relative overflow-hidden transition-all duration-300"
              style={{
                background: isDarkCard
                  ? `linear-gradient(145deg, ${tpl.cardBg} 0%, #0F172A 100%)`
                  : (tpl.cardBg || "#FFFFFF"),
                border: isDarkCard
                  ? `1px solid ${tpl.accent}45`
                  : `1px solid ${tpl.accentLight}60`,
                boxShadow: isDarkCard
                  ? `0 20px 40px -15px rgba(0,0,0,0.5), 0 0 25px -5px ${tpl.accent}30`
                  : "0 10px 30px -10px rgba(0,0,0,0.06)",
              }}
            >
              {/* Subtle ambient light glow inside dark card */}
              {isDarkCard && (
                <div
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-25"
                  style={{ background: tpl.accent }}
                />
              )}

              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{
                    background: isDarkCard ? `${tpl.accent}30` : tpl.accentLight,
                    border: isDarkCard ? `1px solid ${tpl.accent}60` : undefined,
                  }}
                >
                  <Heart className="w-5 h-5" style={{ color: cardAccent }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: cardAccent }}>
                    Lời Nhắn Cảm Xúc
                  </div>
                  <div className="text-xs font-medium" style={{ color: subTextColor }}>
                    Mẫu tin nhắn cá nhân hóa
                  </div>
                </div>
              </div>

              <p
                className="leading-relaxed mb-5 font-normal relative z-10"
                style={{
                  color: textColor,
                  fontSize: "1.0625rem",
                  lineHeight: 1.85,
                  fontStyle: "italic",
                  textShadow: isDarkCard ? "0 1px 3px rgba(0,0,0,0.6)" : "none",
                }}
              >
                "{tpl.sampleMessage}"
              </p>

              <div className="text-sm font-semibold flex items-center gap-1.5 relative z-10" style={{ color: cardAccent }}>
                {tpl.sender}
              </div>
            </motion.div>

            {/* Photo gallery */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl p-6"
              style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-4 h-4" style={{ color: tpl.accent }} />
                <span className="text-sm font-semibold" style={{ color: "#1A1818" }}>Bộ Sưu Tập Ảnh</span>
              </div>
              <PhotoGallery photos={tpl.photos} accent={tpl.accent} />
            </motion.div>

            {/* Video player card */}
            {tpl.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-3xl p-6"
                style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Video className="w-4 h-4" style={{ color: tpl.accent }} />
                  <span className="text-sm font-semibold" style={{ color: "#1A1818" }}>Video Mô Phỏng Mẫu</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-sm">
                  {tpl.videoUrl.includes("youtube.com") || tpl.videoUrl.includes("youtu.be") ? (
                    <iframe
                      src={tpl.videoUrl.replace("watch?v=", "embed/")}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={tpl.videoUrl} controls className="w-full h-full object-contain" />
                  )}
                </div>
              </motion.div>
            )}

            {/* Audio player mockup */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl p-6"
              style={{ background: tpl.accentLight + "30", border: `1px solid ${tpl.accentLight}60` }}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPlaying(!playing)}
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105"
                  style={{ background: tpl.accent }}
                >
                  {playing
                    ? <span className="w-4 h-4 border-l-2 border-r-2 border-white" style={{ borderLeftWidth: 3, borderRightWidth: 3, height: 16 }} />
                    : <Play className="w-6 h-6 text-white ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1" style={{ color: "#1A1818" }}>
                    <Mic className="w-3.5 h-3.5 inline mr-1" style={{ color: tpl.accent }} />
                    Tin Nhắn Giọng Nói Cá Nhân
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.1)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: tpl.accent }}
                      animate={playing ? { width: ["0%", "100%"] } : { width: "35%" }}
                      transition={playing ? { duration: 12, ease: "linear", repeat: Infinity } : {}}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1" style={{ color: "#4B5563" }}>
                    <span>0:00</span><span>0:42</span>
                  </div>
                </div>
                <Music className="w-5 h-5 flex-shrink-0" style={{ color: tpl.accent }} />
              </div>
            </motion.div>

            {/* Anniversary timeline extra */}
            {isAnniversary && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl p-6"
                style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-4 h-4" style={{ color: tpl.accent }} />
                  <span className="text-sm font-semibold" style={{ color: "#1A1818" }}>Dòng Thời Gian Tình Yêu</span>
                </div>
                <div className="space-y-0">
                  {[
                    { year: "2019", event: "Lần đầu gặp nhau tại quán cà phê nhỏ góc phố Hà Nội" },
                    { year: "2020", event: "Chuyến du lịch Đà Lạt đầu tiên cùng nhau — nơi anh ngỏ lời" },
                    { year: "2021", event: "Cùng nhau vượt qua mùa dịch, tình yêu càng thêm bền chặt" },
                    { year: "2022", event: "Đám cưới nhỏ ấm cúng bên gia đình và bạn bè thân thiết" },
                    { year: "2023", event: "Chào đón thành viên mới — bé Na ra đời" },
                    { year: "2024", event: "Kỷ niệm 5 năm bên nhau và vẫn mỗi ngày đều yêu hơn" },
                  ].map((item, i) => (
                    <TimelineRow key={i} year={item.year} event={item.event} accent={tpl.accent} />
                  ))}
                </div>
                <button
                  onClick={() => setShowFull(!showFull)}
                  className="text-sm font-medium mt-2 hover:opacity-70 transition-opacity"
                  style={{ color: tpl.accent }}
                >
                  {showFull ? "Thu gọn" : "Xem toàn bộ dòng thời gian →"}
                </button>
              </motion.div>
            )}
          </div>

          {/* Right: sidebar info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1A1818", lineHeight: 1.2 }} className="mb-1">
                {tpl.title}
              </h2>
              <p style={{ color: "#4B5563", lineHeight: 1.6, fontSize: "0.9375rem" }} className="mb-5">
                {tpl.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["NFC", "QR Code", "Mobile"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${tpl.accentLight}40`, color: tpl.accent === "#F59E0B" ? "#B45309" : tpl.accent }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-3xl p-6"
              style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <h3 className="font-semibold mb-4" style={{ color: "#1A1818" }}>
                <Sparkles className="w-4 h-4 inline mr-2" style={{ color: tpl.accent }} />
                Tính Năng Mẫu Này
              </h3>
              <ul className="space-y-3">
                {tpl.features.map((f, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="flex items-center gap-3 text-sm font-medium"
                    style={{ color: "#1F2937" }}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${tpl.accentLight}60` }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: tpl.accent }} />
                    </div>
                    {f}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-3xl p-5 flex items-center gap-4"
              style={{ background: `${tpl.accentLight}25`, border: `1px solid ${tpl.accentLight}60` }}
            >
              <div className="text-center">
                <div className="font-bold" style={{ fontSize: "2rem", color: tpl.accent === "#F59E0B" ? "#D97706" : tpl.accent }}>4.9</div>
                <div className="flex gap-0.5 justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" style={{ color: tpl.accent === "#F59E0B" ? "#D97706" : tpl.accent }} />
                  ))}
                </div>
                <div className="text-xs mt-0.5 font-medium" style={{ color: "#4B5563" }}>2.4K đánh giá</div>
              </div>
              <div className="flex-1 text-sm font-medium" style={{ color: "#1F2937", lineHeight: 1.6 }}>
                "Món quà ý nghĩa nhất tôi từng nhận được. Mỗi lần chạm NFC là một lần xúc động."
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="rounded-3xl p-6 text-center"
              style={{
                background: tpl.accent === "#F59E0B"
                  ? "linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%)"
                  : `linear-gradient(135deg, ${tpl.accent} 0%, ${tpl.accentLight} 100%)`,
                boxShadow: `0 20px 35px -10px ${tpl.accent}45`,
              }}
            >
              <div className="text-3xl mb-3">{tpl.emoji}</div>
              <h3 className="font-bold text-white mb-1" style={{ fontSize: "1.25rem" }}>Dùng Mẫu Này</h3>
              <p className="text-white/80 text-sm mb-5">Bắt đầu tạo quà tặng cảm xúc ngay hôm nay</p>
              <Link
                to="/pricing"
                className="block w-full py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: "white", color: tpl.accent }}
              >
                Bắt Đầu Ngay →
              </Link>
              <p className="text-white/60 text-xs mt-3">Hoàn tiền 30 ngày · Không cần thẻ tín dụng</p>
            </motion.div>

          </div>
        </div>

        {/* Other templates */}
        <div className="mt-16 pt-12" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <h2 className="font-bold mb-8" style={{ fontSize: "1.5rem", color: "#1A1818" }}>Khám Phá Thêm Mẫu Khác</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(TEMPLATES)
              .filter((t) => t.slug !== tpl.slug)
              .map((t, i) => (
                <motion.div
                  key={t.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/templates/${t.slug}`}
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-md"
                    style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${t.accentLight}40` }}>
                      {t.emoji}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "#1A1818" }}>{t.title}</div>
                      <div className="text-xs" style={{ color: "#9B9B9B" }}>{t.mood}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
