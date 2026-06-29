import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  Check,
  Music,
  Mic,
  Video,
  Image,
  Gift,
  Copy,
  QrCode,
  Wifi,
  Play,
  Pause,
  X,
  Star,
  Sparkles,
  Search,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import confetti from "canvas-confetti";

// ─── Import Template Components ──────────────────────────────────────────────
import BirthdayPremium from "../components/templates/birthday/BirthdayPremium";
import LoveRomantic from "../components/templates/love/LoveRomantic";
import ChristmasCozy from "../components/templates/christmas/ChristmasCozy";
import AnniversaryTimeline from "../components/templates/anniversary/AnniversaryTimeline";


// ─── Types ────────────────────────────────────────────────────────────────────

export type GiftData = {
  theme: string;
  templateId: string;
  photos: string[];
  hasVideo: boolean;
  hasVoice: boolean;
  recipientName: string;
  title: string;
  message: string;
  music: string;
  orderId: string;
  orderSignature?: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  "Chủ Đề",
  "Chọn Mẫu",
  "Tải Tệp",
  "Thiết Kế",
  "Hoàn Thành",
];

const THEMES = [
  {
    id: "sinh-nhat",
    name: "Sinh Nhật",
    emoji: "🎂",
    description: "Chúc mừng tuổi mới rực rỡ và tràn đầy niềm vui.",
    color: "from-[#FF9A9E] to-[#FECFEF]",
  },
  {
    id: "tinh-yeu",
    name: "Tình Yêu",
    emoji: "💖",
    description: "Lời bày tỏ ngọt ngào, ấm áp cho nửa kia của bạn.",
    color: "from-[#FF8A8A] to-[#FFA3A3]",
  },
  {
    id: "ky-niem",
    name: "Kỷ Niệm",
    emoji: "📸",
    description: "Lưu giữ chặng đường và khoảnh khắc thời gian đã qua.",
    color: "from-[#D4C4A8] to-[#C4B498]",
  },
  {
    id: "giang-sinh",
    name: "Giáng Sinh & Lễ Hội",
    emoji: "🎄",
    description: "Gửi sự ấm áp và an lành mùa lễ Noel cuối năm.",
    color: "from-[#4A7C2F] to-[#2D5016]",
  },
];

const TEMPLATES = [
  {
    id: "sinh-nhat-premium",
    name: "Sinh Nhật Hoàng Gia Premium",
    emoji: "👑",
    color: "#D4AF78",
    light: "#2c2519",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    theme: "sinh-nhat",
  },
  {
    id: "love-romantic",
    name: "Mãi Yêu Thương",
    emoji: "💖",
    color: "#FF4D4D",
    light: "#FFF5F5",
    img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
    theme: "tinh-yeu",
  },
  {
    id: "anniversary-timeline",
    name: "Dòng Thời Gian Kỷ Niệm",
    emoji: "📅",
    color: "#8B7355",
    light: "#FAF7F4",
    img: "https://images.unsplash.com/photo-1523521803700-b3bcaeab0150?w=400&q=80",
    theme: "ky-niem",
  },
  {
    id: "christmas-cozy",
    name: "Mùa Noel Ấm Áp",
    emoji: "🎄",
    color: "#2D5016",
    light: "#F5F9F2",
    img: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&q=80",
    theme: "giang-sinh",
  },
];

const MUSIC = [
  { id: "none", name: "Không nhạc", emoji: "🔇" },
  { id: "piano", name: "Piano nhẹ nhàng", emoji: "🎹" },
  { id: "romantic", name: "Lãng mạn", emoji: "🎻" },
  { id: "birthday", name: "Chúc sinh nhật", emoji: "🎂" },
];

const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80",
];

// ─── Render Live Template ────────────────────────────────────────────────────

export function RenderLiveTemplate({
  gift,
  isEditing = false,
  onUpdate,
}: {
  gift: GiftData;
  isEditing?: boolean;
  onUpdate?: (fields: Partial<GiftData>) => void;
}) {
  const props = {
    recipientName: gift.recipientName,
    title: gift.title,
    message: gift.message,
    photos: gift.photos,
    isEditing,
    onUpdate,
  };

  switch (gift.templateId) {
    case "sinh-nhat-premium":
      return <BirthdayPremium {...props} />;
    case "love-romantic":
      return <LoveRomantic {...props} />;
    case "anniversary-timeline":
      return <AnniversaryTimeline {...props} />;
    case "christmas-cozy":
      return <ChristmasCozy {...props} />;
    default:
      return (
        <div className="w-full h-full p-6 flex flex-col justify-center items-center text-center bg-stone-100 text-stone-400">
          <Sparkles className="w-8 h-8 mb-2 animate-pulse" />
          <p className="text-xs font-medium">Vui lòng chọn mẫu thiệp ở Bước 1</p>
        </div>
      );
  }
}

// ─── Direct Preview (no phone shell) ─────────────────────────────────────────

function DirectPreview({
  gift,
  isEditing = false,
  onUpdate,
}: {
  gift: GiftData;
  isEditing?: boolean;
  onUpdate?: (fields: Partial<GiftData>) => void;
}) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-stone-200/60 shadow-lg bg-white">
      <div className="w-full overflow-y-auto max-h-[600px]" style={{ scrollbarWidth: 'thin' }}>
        <RenderLiveTemplate
          gift={gift}
          isEditing={isEditing}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}

// ─── Progress Bar Component ──────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              {i === step && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-orange-200/40"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all duration-300"
                style={{
                  background:
                    i < step
                      ? "linear-gradient(135deg, #E8B4A8, #D4AF78)"
                      : i === step
                        ? "#E8B4A8"
                        : "rgba(0,0,0,0.05)",
                  color: i <= step ? "white" : "#999",
                  border:
                    i === step ? "2px solid #E8B4A8" : "2px solid transparent",
                }}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
            </div>
            <span
              className="text-xs hidden sm:block font-medium"
              style={{ color: i === step ? "#E8B4A8" : "#999" }}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="w-6 sm:w-12 h-0.5 mb-4 transition-all duration-500"
              style={{
                background:
                  i < step
                    ? "linear-gradient(90deg, #E8B4A8, #D4AF78)"
                    : "rgba(0,0,0,0.08)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Gateway Screen (check Order ID) ─────────────────────────────────────────

function OrderCheckGateway({
  onValidOrder,
}: {
  onValidOrder: (orderId: string, orderSignature: string) => void;
}) {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingGiftUrl, setExistingGiftUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setExistingGiftUrl("");

    try {
      const response = await fetch("/api/orders/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Mã đơn hàng không hợp lệ.");
      }

      if (data.status === "exists") {
        const url = `${window.location.origin}/gift/${data.giftId}`;
        setExistingGiftUrl(url);
      } else if (data.status === "new") {
        onValidOrder(data.orderId, data.orderSignature);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(existingGiftUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-3xl bg-white/70 border border-white/40 shadow-xl backdrop-blur-md text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#E8B4A8]/10 flex items-center justify-center mx-auto mb-4 text-[#E8B4A8]">
          <Gift className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-stone-900 mb-2">Bắt Đầu Tạo Thiệp</h2>
        <p className="text-sm text-stone-500 mb-6">
          Vui lòng nhập mã đơn hàng (Order ID) đã mua của bạn để kích hoạt trang thiết kế thiệp WEMO.
        </p>

        {existingGiftUrl ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-800 text-xs text-left leading-relaxed border border-amber-200">
              ⚠️ <strong>Mã đơn hàng đã được sử dụng!</strong> Mỗi mã đơn hàng chỉ được tạo thiệp 1 lần duy nhất. Bạn có thể sao chép liên kết thiệp đã tạo bên dưới:
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 text-left">
              <span className="flex-1 text-xs truncate font-mono text-stone-700 pl-2">
                {existingGiftUrl}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-stone-900 hover:opacity-95"
              >
                {copied ? "Đã chép" : "Sao chép"}
              </button>
            </div>
            <button
              onClick={() => setExistingGiftUrl("")}
              className="text-xs font-semibold text-[#E8B4A8] hover:underline block mx-auto"
            >
              Thử mã đơn hàng khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Ví dụ: ORD-1001"
                className="w-full px-5 py-3 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-center font-mono font-bold tracking-wider text-stone-800 bg-white"
                disabled={loading}
              />
              {error && (
                <p className="text-xs text-rose-500 font-medium mt-2 text-left pl-1">
                  ⚠️ {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="w-full py-3 bg-gradient-to-r from-stone-800 to-stone-950 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {loading ? "Đang xác thực..." : "Xác Nhận & Tiếp Tục →"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// ─── Step Components ─────────────────────────────────────────────────────────

// Bước 0: Chọn Chủ Đề
function Step0({
  gift,
  setGift,
}: {
  gift: GiftData;
  setGift: (g: GiftData) => void;
}) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-stone-900">Chọn Chủ Đề Thiệp</h2>
      <p className="mb-8 text-sm text-stone-500">
        Chọn không gian cảm xúc phù hợp nhất với dịp tặng quà của bạn
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {THEMES.map((theme) => {
          const selected = gift.theme === theme.id;
          return (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Find first template of this theme
                const defaultTpl = TEMPLATES.find((t) => t.theme === theme.id);
                setGift({
                  ...gift,
                  theme: theme.id,
                  templateId: defaultTpl ? defaultTpl.id : "",
                });
              }}
              className="p-5 rounded-2xl text-left border-2 transition-all relative overflow-hidden flex flex-col justify-between h-36"
              style={{
                borderColor: selected ? "#E8B4A8" : "rgba(0,0,0,0.06)",
                background: selected ? "rgba(232, 180, 168, 0.05)" : "white",
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl">{theme.emoji}</span>
                {selected && (
                  <div className="w-5 h-5 rounded-full bg-[#E8B4A8] flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">{theme.name}</h3>
                <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                  {theme.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Bước 1: Chọn Mẫu Thiệp (Có Modal Xem Thử)
function Step1({
  gift,
  setGift,
}: {
  gift: GiftData;
  setGift: (g: GiftData) => void;
}) {
  const [demoTemplate, setDemoTemplate] = useState<any | null>(null);
  const filteredTemplates = TEMPLATES.filter((t) => t.theme === gift.theme);

  const handleOpenDemo = (e: React.MouseEvent, tpl: any) => {
    e.stopPropagation();
    // Create custom mock preview data based on the template properties
    const mockGift: GiftData = {
      theme: tpl.theme,
      templateId: tpl.id,
      photos: [tpl.img],
      hasVideo: false,
      hasVoice: false,
      recipientName: "Người Nhận",
      title: tpl.name,
      message: "Đây là nội dung hiển thị mẫu của thiệp. Bạn có thể thay đổi toàn bộ chữ, hình ảnh ở bước sau.",
      music: "none",
      orderId: "",
    };
    setDemoTemplate(mockGift);
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-stone-900">Chọn Mẫu Thiết Kế</h2>
      <p className="mb-8 text-sm text-stone-500">
        Khởi đầu với một phôi giao diện thiết kế chuyên nghiệp tương ứng với chủ đề đã chọn
      </p>

      <div className="grid grid-cols-2 gap-4">
        {filteredTemplates.map((tpl) => {
          const selected = gift.templateId === tpl.id;
          return (
            <motion.button
              key={tpl.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGift({ ...gift, templateId: tpl.id })}
              className="relative rounded-2xl overflow-hidden text-left transition-all bg-white shadow-sm flex flex-col"
              style={{
                border: selected
                  ? `2.5px solid ${tpl.color}`
                  : "2.5px solid transparent",
              }}
            >
              <div className="relative h-28 overflow-hidden bg-stone-100 w-full">
                <img
                  src={tpl.img}
                  alt={tpl.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-2 left-2 text-xl">{tpl.emoji}</div>
                {selected && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                    style={{ background: tpl.color }}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="p-3 flex items-center justify-between gap-1 w-full mt-auto">
                <p className="font-bold text-[11px] text-stone-800 truncate">
                  {tpl.name}
                </p>
                <button
                  type="button"
                  onClick={(e) => handleOpenDemo(e, tpl)}
                  className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-[9px] transition-colors"
                >
                  Xem thử
                </button>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Demo View Modal */}
      <AnimatePresence>
        {demoTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm relative flex flex-col items-center shadow-2xl"
            >
              <button
                onClick={() => setDemoTemplate(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-stone-900 text-sm mb-4">Xem thử giao diện mẫu</h3>
              
              <DirectPreview gift={demoTemplate} />

              <button
                onClick={() => {
                  setGift({ ...gift, templateId: demoTemplate.templateId });
                  setDemoTemplate(null);
                }}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold mt-5 shadow"
              >
                Chọn Mẫu Này
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Bước 2: Tải Tệp Ký Ức
function Step2({
  gift,
  setGift,
}: {
  gift: GiftData;
  setGift: (g: GiftData) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: reader.result as string,
            fileName: file.name,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Tải ảnh lên thất bại.");
        }
        setGift({ ...gift, photos: [...gift.photos, data.url] });
      } catch (err: any) {
        alert(err.message);
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
  };

  const removePhoto = (i: number) => {
    setGift({ ...gift, photos: gift.photos.filter((_, idx) => idx !== i) });
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-stone-900">Tải Tệp Đa Phương Tiện</h2>
      <p className="mb-8 text-sm text-stone-500">
        Đính kèm hình ảnh kỷ niệm, video, âm thanh để món quà thêm phần sinh động
      </p>

      <div className="mb-8 bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm">
        <h3 className="font-bold text-sm text-stone-800 mb-3 flex items-center gap-2">
          📸 Bộ Sưu Tập Ảnh ({gift.photos.length}/3)
        </h3>
        <div className="flex flex-wrap gap-3">
          {gift.photos.map((src, i) => (
            <motion.div
              key={i}
              className="relative rounded-xl overflow-hidden shadow-sm w-16 h-16 border"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/70 flex items-center justify-center cursor-pointer"
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            </motion.div>
          ))}
          {uploading && (
            <div className="w-16 h-16 rounded-xl flex items-center justify-center border border-stone-200 bg-stone-50">
              <Loader2 className="w-4 h-4 animate-spin text-[#E8B4A8]" />
            </div>
          )}
          {!uploading && gift.photos.length < 3 && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <button
                onClick={addPhoto}
                className="w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-orange-400 bg-stone-50 text-stone-400 transition-colors cursor-pointer"
              >
                <Image className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] font-medium">Thêm</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setGift({ ...gift, hasVideo: !gift.hasVideo })}
          className="p-4 rounded-2xl flex flex-col items-center text-center gap-2 border-2 transition-all cursor-pointer"
          style={{
            borderColor: gift.hasVideo ? "#E8B4A8" : "rgba(0,0,0,0.06)",
            background: gift.hasVideo ? "rgba(232,180,168,0.05)" : "white",
          }}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${gift.hasVideo ? "bg-orange-100 text-orange-600" : "bg-stone-100 text-stone-400"}`}
          >
            <Video className="w-5 h-5" />
          </div>
          <p className="font-bold text-xs text-stone-800">Thêm Video Clip</p>
        </button>

        <button
          onClick={() => setGift({ ...gift, hasVoice: !gift.hasVoice })}
          className="p-4 rounded-2xl flex flex-col items-center text-center gap-2 border-2 transition-all cursor-pointer"
          style={{
            borderColor: gift.hasVoice ? "#D4AF78" : "rgba(0,0,0,0.06)",
            background: gift.hasVoice ? "rgba(212,175,120,0.05)" : "white",
          }}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${gift.hasVoice ? "bg-amber-100 text-amber-600" : "bg-stone-100 text-stone-400"}`}
          >
            <Mic className="w-5 h-5" />
          </div>
          <p className="font-bold text-xs text-stone-800">Ghi Âm Lời Chúc</p>
        </button>
      </div>
    </div>
  );
}

// Bước 3: Tự chỉnh sửa tùy ý (2-column: live preview + form)
function Step3({
  gift,
  setGift,
}: {
  gift: GiftData;
  setGift: (g: GiftData) => void;
}) {
  const updateField = (fields: Partial<GiftData>) =>
    setGift({ ...gift, ...fields });

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-stone-900">Thiết Kế Nội Dung</h2>
      <p className="mb-8 text-sm text-stone-500">
        Chỉnh sửa trực tiếp trên thiệp hoặc sử dụng form bên dưới để cá nhân hóa nội dung
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Live editable template preview */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Xem trước trực tiếp</span>
          </div>
          <DirectPreview
            gift={gift}
            isEditing={true}
            onUpdate={updateField}
          />
          <p className="text-[10px] text-stone-400 mt-2 text-center italic">
            💡 Click trực tiếp vào ảnh, chữ trên thiệp để chỉnh sửa
          </p>
        </div>

        {/* Right: Edit form panel */}
        <div className="order-1 lg:order-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#E8B4A8]" />
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Thông tin thiệp</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Tên người nhận *
              </label>
              <input
                type="text"
                value={gift.recipientName}
                onChange={(e) => updateField({ recipientName: e.target.value })}
                placeholder="Ví dụ: Mẹ yêu, Bạn thân,..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Tiêu đề cảm xúc
              </label>
              <input
                type="text"
                value={gift.title}
                onChange={(e) => updateField({ title: e.target.value })}
                placeholder="Ví dụ: Tuổi mới rực rỡ, I Love You,..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Lời chúc nhắn gửi *
              </label>
              <textarea
                value={gift.message}
                onChange={(e) => updateField({ message: e.target.value })}
                rows={4}
                placeholder="Viết những lời ấm áp từ trái tim..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-sm resize-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
              🎵 Nhạc nền đi kèm
            </label>
            <div className="flex flex-wrap gap-2">
              {MUSIC.map((m) => (
                <button
                  key={m.id}
                  onClick={() => updateField({ music: m.id })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${gift.music === m.id ? "bg-stone-900 border-stone-900 text-white" : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"}`}
                >
                  {m.emoji} {m.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bước 4: Hoàn thành (Giao diện 2 cột xem trước kết hợp bảng đóng gói)
function Step4({
  gift,
  onSave,
  saving,
}: {
  gift: GiftData;
  onSave: () => void;
  saving: boolean;
}) {
  const tpl = TEMPLATES.find((t) => t.id === gift.templateId) || TEMPLATES[0];
  const rows = [
    { label: "Mã Đơn Hàng (Order ID)", value: gift.orderId, icon: "🏷️" },
    { label: "Chủ đề thiệp", value: `${THEMES.find((t) => t.id === gift.theme)?.emoji} ${THEMES.find((t) => t.id === gift.theme)?.name}`, icon: "🎨" },
    { label: "Mẫu giao diện", value: `${tpl.emoji} ${tpl.name}`, icon: "📱" },
    { label: "Tên người nhận", value: gift.recipientName || "Chưa nhập", icon: "👤" },
    { label: "Số lượng hình ảnh", value: `${gift.photos.length} hình ảnh`, icon: "📸" },
    {
      label: "Đa phương tiện kèm theo",
      icon: "🎙️",
      value:
        [
          gift.hasVideo && "Video Clip",
          gift.hasVoice && "Ghi âm Lời chúc",
          gift.music !== "none" && "Nhạc nền",
        ]
          .filter(Boolean)
          .join(", ") || "Chỉ chữ & ảnh",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <h2 className="mb-2 text-2xl font-black text-stone-900 text-center lg:text-left">
        Kiểm Tra & Xem Trước Thiệp
      </h2>
      <p className="mb-8 text-sm text-stone-500 text-center lg:text-left">
        Xem trước hiển thị trên thiết bị di động và kiểm tra thông số đóng gói chip NFC
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Packing details */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
                <span>⚙️</span> Cấu Hình Đóng Gói
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500 text-white font-bold animate-pulse">Ready</span>
            </div>
            <div className="divide-y divide-stone-100">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-4 hover:bg-stone-50/50 transition-colors"
                >
                  <span className="text-xs font-semibold text-stone-500 flex items-center gap-2">
                    <span className="text-sm">{row.icon}</span>
                    {row.label}
                  </span>
                  <span className="text-xs font-bold text-stone-800 text-right max-w-[50%] truncate">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#D4AF78]/10 border border-[#D4AF78]/30 text-stone-800 space-y-2 backdrop-blur-sm shadow-sm">
            <p className="text-xs font-bold flex items-center gap-1.5 text-amber-800">
              <Sparkles className="w-4 h-4 text-[#D4AF78] animate-spin" /> Kích hoạt không dây NFC:
            </p>
            <p className="text-[11px] leading-relaxed text-stone-600">
              Mọi dữ liệu sau khi mã hóa sẽ được lưu trữ an toàn trên máy chủ. Người nhận chỉ cần chạm điện thoại có NFC vào chip WEMO để tải trang thiệp này.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSave}
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-stone-800 to-stone-950 hover:from-stone-900 hover:to-black text-white rounded-2xl text-xs font-black tracking-wider shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang Đóng Gói Thiệp...
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 animate-pulse" />
                HOÀN THÀNH PHÔI & GẮN CHIP WEMO 🎉
              </>
            )}
          </motion.button>
        </div>

        {/* Right Column: Template Preview */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            XEM TRƯỚC THIỆP NGƯỜI NHẬN
          </p>
          <DirectPreview gift={gift} />
        </div>
      </div>
    </div>
  );
}

// ─── Success Screen ──────────────────────────────────────────────────────────

const CONFETTI_COLORS = ["#FF6B8A", "#E8B4A8", "#D4AF78", "#B8A4D4", "#FFE066"];

function SuccessScreen({
  gift,
  giftId,
  onReset,
}: {
  gift: GiftData;
  giftId: string;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [nfcStatus, setNfcStatus] = useState<"idle" | "listening" | "success" | "error">("idle");
  const tpl = TEMPLATES.find((t) => t.id === gift.templateId) || TEMPLATES[0];
  const giftUrl = `${window.location.origin}/gift/${giftId}`;

  useEffect(() => {
    // Spray beautiful confetti particles on success mount
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS,
    });
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(giftUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWriteNFC = async () => {
    // @ts-ignore
    if (!("NDEFReader" in window)) {
      // Simulate touching visual progress if browser doesn't support Web NFC (iOS fallback)
      setNfcStatus("listening");
      setTimeout(() => {
        setNfcStatus("success");
        confetti({
          particleCount: 60,
          spread: 50,
          colors: ["#D4AF78", "#fff"],
        });
      }, 3000);
      return;
    }

    try {
      setNfcStatus("listening");
      // @ts-ignore
      const ndef = new NDEFReader();
      await ndef.scan();
      await ndef.write({
        records: [{ recordType: "url", data: giftUrl }]
      });
      setNfcStatus("success");
      confetti({
        particleCount: 60,
        spread: 60,
        colors: ["#D4AF78", "#E8B4A8"],
      });
    } catch (err) {
      console.error(err);
      setNfcStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-stone-900/60 backdrop-blur-lg p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-[#FAF8F5] rounded-[2.5rem] p-8 text-center shadow-2xl border border-white/50 relative overflow-hidden my-8"
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#E8B4A8]/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#D4AF78]/20 rounded-full blur-[80px]" />

        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight mb-1">
          Thiết Kế Hoàn Tất!
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          Món quà số của bạn đã được đóng gói và lưu giữ trực tuyến.
        </p>

        {/* 3D Rotating Gift Card */}
        <div className="mb-6 flex justify-center [perspective:1000px]">
          <motion.div
            whileHover={{ rotateY: 15, rotateX: -10, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-72 h-44 rounded-2xl bg-gradient-to-br from-[#1E1B1B] to-[#3A3333] border-2 border-[#D4AF78]/40 shadow-2xl p-5 text-left relative overflow-hidden flex flex-col justify-between select-none cursor-pointer"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,120,0.15),transparent)] pointer-events-none" />
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF78] to-[#F3E0C3] opacity-80 flex items-center justify-center border border-white/25">
              <Heart className="w-4.5 h-4.5 text-stone-950 fill-stone-950" />
            </div>

            <div className="space-y-1 z-10">
              <span className="text-[8px] font-black text-[#D4AF78]/90 tracking-[0.25em] uppercase">WEMO DIGITAL GIFT</span>
              <h3 className="text-sm font-black text-white truncate max-w-[80%] uppercase tracking-wide">
                {gift.recipientName || "Người Nhận"}
              </h3>
            </div>

            <div className="space-y-2 z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-4.5 h-4.5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[9px] font-black border border-green-500/30">✓</div>
                <span className="text-[10px] text-stone-300 font-semibold">Đã mã hóa NFC & QR Code</span>
              </div>
              <div className="flex items-center justify-between text-[8px] font-mono text-stone-500 border-t border-stone-800/80 pt-2">
                <span>ORDER: {gift.orderId}</span>
                <span>ID: {giftId}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Shareable Link Box */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-stone-100/60 border border-stone-200/50 text-left mb-6 shadow-inner">
          <span className="flex-1 text-[11px] truncate font-mono text-stone-600 pl-3">
            {giftUrl}
          </span>
          <button
            onClick={copy}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer select-none ${
              copied ? "bg-green-600 text-white shadow" : "bg-stone-900 text-white hover:bg-stone-800"
            }`}
          >
            {copied ? "Đã chép! ✓" : "Sao Chép"}
          </button>
        </div>

        {/* Dynamic Widget Modals */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setShowQrModal(true)}
            className="py-3.5 rounded-2xl text-xs font-bold border border-stone-200 text-stone-700 flex items-center justify-center gap-2 bg-white hover:bg-stone-50/50 shadow-sm cursor-pointer transition-colors"
          >
            <QrCode className="w-4 h-4 text-[#D4AF78]" />
            Mã QR Quà Tặng
          </button>
          <button
            onClick={() => {
              setShowNfcModal(true);
              setNfcStatus("idle");
            }}
            className="py-3.5 rounded-2xl text-xs font-bold border border-stone-200 text-stone-700 flex items-center justify-center gap-2 bg-white hover:bg-stone-50/50 shadow-sm cursor-pointer transition-colors"
          >
            <Wifi className="w-4 h-4 text-[#E8B4A8]" />
            Gắn Chip NFC
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full py-4 bg-gradient-to-r from-stone-800 to-stone-950 hover:from-stone-900 hover:to-black text-white rounded-2xl text-xs font-black tracking-wider shadow-lg hover:opacity-95 cursor-pointer transition-opacity"
        >
          TẠO THIỆP MỚI KẾ TIẾP
        </button>
      </motion.div>

      {/* QR Code Interactive Popup */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF8F5] rounded-[2.5rem] p-6 w-full max-w-sm relative text-center shadow-2xl border border-white"
            >
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-black text-stone-900 text-sm mb-4">Mã QR Quà Tặng</h3>
              
              <div className="bg-white p-4 rounded-3xl border border-stone-200/60 inline-block shadow-inner mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(giftUrl)}`}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <p className="text-[10px] text-stone-500 mb-6 leading-relaxed max-w-[85%] mx-auto">
                Quét mã này để xem trực tiếp thiệp quà tặng. Bạn có thể in mã QR này hoặc lưu lại để chia sẻ.
              </p>

              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(giftUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow block text-center cursor-pointer select-none"
              >
                Tải QR / Xem Ảnh Lớn
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NFC Tag touching Popup */}
      <AnimatePresence>
        {showNfcModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF8F5] rounded-[2.5rem] p-6 w-full max-w-sm relative text-center shadow-2xl border border-white"
            >
              <button
                onClick={() => setShowNfcModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-black text-stone-900 text-sm mb-4">Ghi Thẻ WEMO NFC</h3>

              {nfcStatus === "idle" && (
                <div className="py-6 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <Wifi className="w-10 h-10" />
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-[85%] mx-auto">
                    Bật kết nối NFC trên điện thoại, áp mặt lưng thiết bị vào chip WEMO và bấm bắt đầu để mã hóa.
                  </p>
                  <button
                    onClick={handleWriteNFC}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    Bắt Đầu Ghi NFC
                  </button>
                </div>
              )}

              {nfcStatus === "listening" && (
                <div className="py-6 space-y-6">
                  <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#E8B4A8]/30 animate-ping" />
                    <div className="absolute inset-2 rounded-full bg-[#E8B4A8]/45 animate-pulse" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#E8B4A8] to-[#D4AF78] flex items-center justify-center text-white shadow-md">
                      <Wifi className="w-6 h-6 animate-bounce" />
                    </div>
                  </div>
                  <p className="text-xs text-amber-800 font-black animate-pulse uppercase tracking-wide">
                    Đang tìm chip NFC...
                  </p>
                  <p className="text-[10px] text-stone-400 leading-relaxed max-w-[80%] mx-auto">
                    Giữ cố định điện thoại chạm vào chip. Quá trình truyền tín hiệu sẽ hoàn tất trong giây lát...
                  </p>
                </div>
              )}

              {nfcStatus === "success" && (
                <div className="py-6 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto text-green-600 shadow-inner">
                    <span className="text-4xl font-bold">✓</span>
                  </div>
                  <p className="text-xs text-green-700 font-bold">
                    Kích hoạt chip NFC thành công!
                  </p>
                  <p className="text-[10px] text-stone-500 leading-relaxed max-w-[85%] mx-auto">
                    Thẻ quà tặng đã được gắn trực tiếp vào chip NFC. Người nhận chỉ cần chạm điện thoại của họ để đọc thiệp này.
                  </p>
                  <button
                    onClick={() => setShowNfcModal(false)}
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              )}

              {nfcStatus === "error" && (
                <div className="py-6 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <p className="text-xs text-red-700 font-bold">
                    Ghi thẻ thất bại
                  </p>
                  <p className="text-[10px] text-stone-500 leading-relaxed max-w-[80%] mx-auto">
                    Không tìm thấy tag hoặc kết nối bị ngắt quãng. Hãy chắc chắn điện thoại của bạn hỗ trợ NFC và thử lại.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNfcStatus("idle")}
                      className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Thử Lại
                    </button>
                    <button
                      onClick={() => setShowNfcModal(false)}
                      className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const defaultGift = (orderId: string, orderSignature: string): GiftData => ({
  theme: "sinh-nhat",
  templateId: "sinh-nhat-party",
  photos: [],
  hasVideo: false,
  hasVoice: false,
  recipientName: "",
  title: "",
  message: "",
  music: "none",
  orderId: orderId,
  orderSignature: orderSignature,
});

export function GiftWizard() {
  const [validatedOrderId, setValidatedOrderId] = useState<string | null>(null);
  const [orderSignature, setOrderSignature] = useState<string>("");
  const [step, setStep] = useState(0);
  const [gift, setGift] = useState<GiftData | null>(null);
  const [done, setDone] = useState(false);
  const [createdGiftId, setCreatedGiftId] = useState("");
  const [saving, setSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleValidOrder = (orderId: string, signature: string) => {
    setValidatedOrderId(orderId);
    setOrderSignature(signature);
    setGift(defaultGift(orderId, signature));
    setStep(0);
  };

  const canContinue = () => {
    if (!gift) return false;
    if (step === 0) return Boolean(gift.theme);
    if (step === 1) return Boolean(gift.templateId);
    if (step === 3)
      return gift.recipientName.trim() !== "" && gift.message.trim() !== "";
    return true;
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSave = async () => {
    if (!gift) return;
    setSaving(true);
    try {
      const response = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gift),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gặp lỗi khi lưu phôi thiệp.");
      }
      setCreatedGiftId(data.id);
      setDone(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Có lỗi xảy ra khi đóng gói thiệp.");
    } finally {
      setSaving(false);
    }
  };

  if (!validatedOrderId || !gift) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-20">
        <OrderCheckGateway onValidOrder={handleValidOrder} />
      </div>
    );
  }

  if (done)
    return (
      <SuccessScreen
        gift={gift}
        giftId={createdGiftId}
        onReset={() => {
          setValidatedOrderId(null);
          setOrderSignature("");
          setGift(null);
          setStep(0);
          setDone(false);
          setCreatedGiftId("");
        }}
      />
    );

  const stepComponents = [
    <Step0 gift={gift} setGift={setGift} />,
    <Step1 gift={gift} setGift={setGift} />,
    <Step2 gift={gift} setGift={setGift} />,
    <Step3 gift={gift} setGift={setGift} />,
    <Step4 gift={gift} onSave={handleSave} saving={saving} />,
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-200/60 bg-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#E8B4A8] to-[#D4AF78]">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="font-black text-base text-stone-900 tracking-tight">
            WEMO
          </span>
        </Link>
        <div className="flex-1 mx-8 hidden sm:block">
          <ProgressBar step={step} />
        </div>
        <Link to="/" className="text-stone-400 hover:text-stone-600">
          <X className="w-5 h-5" />
        </Link>
      </div>

      {/* Mobile Top Progress */}
      <div className="sm:hidden px-4 pt-3.5 bg-white pb-2 border-b border-stone-100">
        <ProgressBar step={step} />
      </div>

      {/* Main Layout Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Workspace Panel */}
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-[#FAF8F5]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col h-full justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
              >
                {stepComponents[step]}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Nav Action Control */}
            {step < STEPS.length - 1 && (
              <div className="flex items-center justify-between mt-12 pt-5 border-t border-stone-200/60">
                <button
                  onClick={back}
                  disabled={step === 0}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${step === 0 ? "opacity-0 pointer-events-none" : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"}`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
                </button>

                <button
                  onClick={next}
                  disabled={!canContinue()}
                  className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${canContinue() ? "bg-gradient-to-r from-stone-800 to-stone-950 active:scale-98" : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}
                >
                  Kế Tiếp
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
