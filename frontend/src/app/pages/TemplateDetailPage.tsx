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
    heroImg: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&h=700&fit=crop&auto=format",
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
    heroImg: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&h=700&fit=crop&auto=format",
    photos: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
      "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=400&q=80",
      "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80",
      "https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=400&q=80",
      "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=400&q=80",
      "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=400&q=80",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=80",
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80",
      "https://images.unsplash.com/photo-1501901604252-bb626cc1d545?w=400&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=400&q=80",
      "https://images.unsplash.com/photo-1507504038482-7621c3c786d7?w=400&q=80"
    ],
    sampleMessage: "Em ơi, một năm bên nhau là một năm anh cảm thấy mình là người hạnh phúc nhất thế giới. Cảm ơn em đã bước vào cuộc sống của anh và vẽ nên bức tranh tình yêu lấp lánh như ngàn tinh tú. Anh yêu em mãi mãi! 💖",
    sender: "Của em, người đồng hành trọn đời ❤️",
    features: ["Tối đa 16 ảnh kỷ niệm", "Hành tinh tinh cầu 3D tương tác", "Sao băng rơi đa góc luân phiên", "Vành đai Saturn hạt sao", "Nhạc nền lãng mạn"],
    mood: "Huyền ảo · Lãng mạn · Tương tác 3D",
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

/* ─── Main component ────────────────────────────────────────── */
export function TemplateDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const staticTpl = TEMPLATES[slug ?? ""] ?? TEMPLATES["lang-man"];
  const [playing, setPlaying] = useState(false);
  const [showFull, setShowFull] = useState(false);

  // Dynamic template details from API database
  const [dbTpl, setDbTpl] = useState<any>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        const targetId = slug === "tinh-cau-3d" ? "solid-heart" : "love-romantic";
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
    sampleMessage: dbTpl?.sampleMessage || staticTpl.sampleMessage,
    photos: (dbTpl?.photos && dbTpl.photos.length > 0) ? dbTpl.photos : staticTpl.photos,
    features: (dbTpl?.features && dbTpl.features.length > 0) ? dbTpl.features : staticTpl.features,
    videoUrl: dbTpl?.videoUrl || "",
  };

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const isAnniversary = slug === "ky-niem";
  const isDarkCard = tpl.cardBg === "#0D0214";
  const textColor = isDarkCard ? "#F3F4F6" : "#2A2A2A";
  const subTextColor = isDarkCard ? "#9CA3AF" : "#9B9B9B";

  return (
    <div className="pt-20 min-h-screen" style={{ background: "#FAF8F5" }}>

      {/* ── Back nav ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <Link to="/templates" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70" style={{ color: "#6B6B6B" }}>
          <ArrowLeft className="w-4 h-4" />
          Tất cả mẫu thiệp
        </Link>
      </div>

      {/* ── Hero banner ── */}
      <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 rounded-3xl mb-12" style={{ maxWidth: "calc(72rem)", margin: "0 auto 3rem", marginLeft: "auto", marginRight: "auto" }}>
        <div className="relative h-72 md:h-96 overflow-hidden rounded-3xl">
          <img src={tpl.heroImg} alt={tpl.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 rounded-3xl" style={{ background: `${tpl.bg.replace("135deg", "160deg")}bb` }} />

          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {Array.from({ length: 18 }).map((_, i) => (
              <Particle key={i} color={tpl.confettiColors[i % tpl.confettiColors.length]} delay={i * 0.3} />
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="text-6xl md:text-7xl mb-4"
            >
              {tpl.emoji}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-white font-bold mb-2"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", textShadow: "0 2px 16px rgba(0,0,0,0.25)" }}
            >
              {tpl.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/90 max-w-xl"
              style={{ fontSize: "1rem" }}
            >
              {tpl.subtitle}
            </motion.p>
          </div>
        </div>

        {/* Mood badge */}
        <div className="absolute bottom-4 right-4 px-4 py-1.5 rounded-full text-xs font-semibold text-white" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}>
          {tpl.mood}
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
              className="rounded-3xl p-8"
              style={{ background: tpl.cardBg, border: `1px solid ${tpl.accentLight}50` }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: tpl.accentLight }}>
                  <Heart className="w-5 h-5 text-white" style={{ color: tpl.accent }} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: tpl.accent }}>Lời Nhắn Cảm Xúc</div>
                  <div className="text-xs" style={{ color: subTextColor }}>Mẫu tin nhắn cá nhân hóa</div>
                </div>
              </div>
              <p className="leading-relaxed mb-4" style={{ color: textColor, fontSize: "1rem", lineHeight: 1.8, fontStyle: "italic" }}>
                "{tpl.sampleMessage}"
              </p>
              <div className="text-sm font-medium" style={{ color: tpl.accent }}>{tpl.sender}</div>
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
                  <div className="flex justify-between text-xs mt-1" style={{ color: "#9B9B9B" }}>
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
              <p style={{ color: "#6B6B6B", lineHeight: 1.6, fontSize: "0.9375rem" }} className="mb-5">
                {tpl.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["NFC", "QR Code", "Mobile"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${tpl.accentLight}40`, color: tpl.accent }}>
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
                    className="flex items-center gap-3 text-sm"
                    style={{ color: "#2A2A2A" }}
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
              style={{ background: `${tpl.accentLight}25`, border: `1px solid ${tpl.accentLight}50` }}
            >
              <div className="text-center">
                <div className="font-bold" style={{ fontSize: "2rem", color: tpl.accent }}>4.9</div>
                <div className="flex gap-0.5 justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" style={{ color: tpl.accent }} />
                  ))}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#9B9B9B" }}>2.4K đánh giá</div>
              </div>
              <div className="flex-1 text-sm" style={{ color: "#4A4A4A", lineHeight: 1.6 }}>
                "Món quà ý nghĩa nhất tôi từng nhận được. Mỗi lần chạm NFC là một lần xúc động."
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="rounded-3xl p-6 text-center"
              style={{ background: `linear-gradient(135deg, ${tpl.accent} 0%, ${tpl.accentLight} 100%)` }}
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
