import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  Check,
  Music,
  Mic,
  Square,
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
  Camera,
  LayoutGrid,
  List,
  Eye,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { Link } from "react-router";
import confetti from "canvas-confetti";

// ─── Import Template Components ──────────────────────────────────────────────
import { HeartCanvas3D } from "../components/gift3d/HeartCanvas3D";
import { SolidHeartCanvas3D } from "../components/gift3d/SolidHeartCanvas3D";
import { StarlightCanvas3D } from "../components/gift3d/StarlightCanvas3D";
import { CrystalRoseCanvas3D } from "../components/gift3d/CrystalRoseCanvas3D";
import { SingularityCanvas3D } from "../components/gift3d/SingularityCanvas3D";
import { FallingTextGiftView } from "../components/gift3d/FallingTextGiftView";
import { LoveCountGiftView } from "../components/gift3d/LoveCountGiftView";
import { WishSlidesGiftView } from "../components/gift3d/WishSlidesGiftView";
import { HeartImageGiftView } from "../components/gift3d/HeartImageGiftView";
import { WDayGiftView } from "../components/gift3d/WDayGiftView";


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
  "Chọn Mẫu",
  "Thiết Kế",
  "Hoàn Thành",
];

const THEMES = [
  {
    id: "tinh-yeu",
    name: "Tình Yêu",
    emoji: "💖",
    description: "Lời bày tỏ ngọt ngào, ấm áp cho nửa kia của bạn.",
    color: "from-[#FF8A8A] to-[#FFA3A3]",
  },
  {
    id: "sinh-nhat",
    name: "Sinh Nhật",
    emoji: "🎂",
    description: "Gửi lời chúc mừng sinh nhật rực rỡ và ý nghĩa nhất.",
    color: "from-[#FBC2EB] to-[#A6C1EE]",
  },
  {
    id: "ky-niem",
    name: "Kỷ Niệm",
    emoji: "⏳",
    description: "Lưu giữ những khoảnh khắc, chặng đường ý nghĩa bên nhau.",
    color: "from-[#84FAB0] to-[#8FD3F4]",
  },
  {
    id: "giang-sinh",
    name: "Giáng Sinh",
    emoji: "🎄",
    description: "Trao gửi không khí Noel an lành, ấm áp tới người thân.",
    color: "from-[#FAD961] to-[#F76B1C]",
  },
];

const STATIC_TEMPLATES = [
  {
    id: "love-romantic",
    name: "Ký Ức Lãng Mạn",
    description: "Bày tỏ tình yêu qua ảnh, video và những lời nhắn chân thành. Mẫu mạng lưới trái tim 3D lãng mạn.",
    emoji: "💕",
    color: "#E8B4A8",
    gradient: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
    light: "#FFF5F5",
    img: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    theme: "tinh-yeu",
    tag: "Mạng lưới 3D",
    features: ["Tối đa 6 ảnh kỷ niệm", "Mạng lưới trái tim rơi", "Nhạc nền lãng mạn", "Hộp thư bí mật"],
    allowedFeatures: {
      photos: true,
      maxPhotos: 6,
      video: false,
      voice: false,
      music: false,
    }
  },
  {
    id: "solid-heart",
    name: "Mẫu Tinh Cầu 3D Vũ Trụ",
    description: "Lời nhắn bay lơ lửng giữa tinh vân lấp lánh và sao băng rực rỡ, kèm theo 16 ảnh kỷ niệm bay vòng quanh cực đẹp.",
    emoji: "🪐",
    color: "#E11D48",
    gradient: "linear-gradient(135deg, #0D0214 0%, #E11D48 100%)",
    light: "#0F0015",
    img: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    theme: "tinh-yeu",
    themes: ["tinh-yeu", "sinh-nhat"],
    tag: "Độc quyền 3D",
    features: ["Tối đa 16 ảnh kỷ niệm", "Hành tinh điểm sáng 3D", "Sao băng đa hướng luân phiên", "Vòng xoay ảnh kỷ niệm"],
    allowedFeatures: {
      photos: true,
      maxPhotos: 16,
      video: false,
      voice: false,
      music: false,
    }
  },
  {
    id: "starlight-galaxy",
    name: "Dạ Khúc Ánh Sao 3D",
    description: "Vầng trăng khuyết pha lê 3D phát sáng giữa dải ngân hà lấp lánh, ngàn vì sao hộ tống lời chúc và ảnh kỷ niệm bay bổng thần tiên.",
    emoji: "🌙",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #0B1021 0%, #3B82F6 50%, #F59E0B 100%)",
    light: "#0B1021",
    img: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    theme: "ky-niem",
    themes: ["ky-niem", "tinh-yeu", "giang-sinh"],
    tag: "Ngân Hà 3D",
    features: ["Tối đa 12 ảnh kỷ niệm", "Vầng trăng khuyết pha lê 3D", "Dải sao băng lấp lánh", "Vòng xoay ảnh quỹ đạo"],
    allowedFeatures: {
      photos: true,
      maxPhotos: 12,
      video: false,
      voice: false,
      music: false,
    }
  },
  {
    id: "crystal-rose",
    name: "Bông Hồng Pha Lê 3D",
    description: "Bông hoa hồng pha lê đa giác 3D phát sáng rực rỡ, kèm theo những cánh hoa pha lê xoay chuyển bồng bềnh và thông điệp yêu thương ngọt ngào.",
    emoji: "🌹",
    color: "#FB7185",
    gradient: "linear-gradient(135deg, #180018 0%, #BE123C 50%, #FDA4AF 100%)",
    light: "#140014",
    img: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    theme: "sinh-nhat",
    themes: ["sinh-nhat", "tinh-yeu", "giang-sinh"],
    tag: "Pha Lê 3D",
    features: ["Tối đa 10 ảnh kỷ niệm", "Hoa hồng pha lê nở 3D", "Cánh hoa rơi bồng bềnh", "Ánh sáng lăng kính đa sắc"],
    allowedFeatures: {
      photos: true,
      maxPhotos: 10,
      video: false,
      voice: false,
      music: false,
    }
  },
  {
    id: "singularity-blackhole",
    name: "Hố Đen Singularity 3D",
    description: "Đĩa bồi tụ xoáy chuyển động rực rỡ quanh hố đen vũ trụ kỳ vĩ, ánh sáng quang sai bẻ cong không thời gian cùng ngàn vì sao hộ tống lời chúc và ảnh kỷ niệm.",
    emoji: "🕳️",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #05050A 0%, #F59E0B 50%, #3B82F6 100%)",
    light: "#030308",
    img: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    theme: "ky-niem",
    themes: ["ky-niem", "tinh-yeu", "sinh-nhat"],
    tag: "Vũ Trụ 3D",
    features: ["Tối đa 16 ảnh kỷ niệm", "Đĩa bồi tụ xoáy 3D", "Quang sai bẻ cong ánh sáng", "Hố đen chân trời sự kiện"],
    allowedFeatures: {
      photos: true,
      maxPhotos: 16,
      video: false,
      voice: false,
      music: false,
    }
  },
  {
    id: "falling-memories",
    name: "Mưa Ký Ức & Lời Yêu",
    description: "Cơn mưa sao băng ký ức với những tấm ảnh kỷ niệm và lời chúc yêu thương rơi bồng bềnh, hiệu ứng nổ pháo tim khi chạm, nền trời lung linh.",
    emoji: "🌧️",
    color: "#FF4D6D",
    gradient: "linear-gradient(135deg, #2b0015 0%, #FF4D6D 50%, #FF85A1 100%)",
    light: "#000000",
    img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    theme: "tinh-yeu",
    themes: ["tinh-yeu", "sinh-nhat", "ky-niem"],
    tag: "Mưa Ký Ức",
    features: ["Tối đa 20 ảnh kỷ niệm", "Cơn mưa ảnh và lời yêu rơi", "Hiệu ứng nổ tim tương tác", "Bức thư tình yêu ngọt ngào"],
    allowedFeatures: {
      photos: true,
      maxPhotos: 20,
      video: false,
      voice: false,
      music: false,
    }
  },
  {
    id: "love-counter",
    name: "Nhật Ký Đếm Ngày Yêu",
    description: "Nút giữ tim 3 giây mở thiệp cảm xúc, bộ đếm thời gian bên nhau thời gian thực (ngày, giờ, phút, giây), ảnh đại diện cặp đôi và album kỷ niệm.",
    emoji: "⏳",
    color: "#E11D48",
    gradient: "linear-gradient(135deg, #1A0510 0%, #E11D48 50%, #FDA4AF 100%)",
    light: "#14000C",
    img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    theme: "tinh-yeu",
    themes: ["tinh-yeu", "ky-niem"],
    tag: "Đếm Ngày Yêu",
    features: ["Ảnh đại diện cặp đôi", "Đếm ngày, giờ, phút, giây", "Nhấn giữ tim 3s mở thiệp", "Album ảnh kỷ niệm"],
    allowedFeatures: {
      photos: true,
      maxPhotos: 12,
      video: false,
      voice: false,
      music: false,
    }
  },
  {
    id: "heart-wish",
    name: "Trình Chiếu Lời Chúc Ký Ức",
    description: "Trái tim phát sáng mở thiệp, hiệu ứng chữ giải mã hacker lãng mạn, trình chiếu slide ảnh kỷ niệm mượt mà cùng nhạc nền du dương.",
    emoji: "💌",
    color: "#D946EF",
    gradient: "linear-gradient(135deg, #120014 0%, #D946EF 50%, #F472B6 100%)",
    light: "#0A000C",
    img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    theme: "sinh-nhat",
    themes: ["sinh-nhat", "tinh-yeu", "giang-sinh"],
    tag: "Slide Ký Ức",
    features: ["Chạm tim mở đầu", "Chữ giải mã hacker", "Trình chiếu slide ảnh & GIF", "Thanh điều hướng tiện lợi"],
    allowedFeatures: {
      photos: true,
      maxPhotos: 15,
      video: false,
      voice: false,
      music: false,
    }
  },
  {
    id: "heart-image",
    name: "Trái Tim Ghép Ảnh 3D",
    description: "Những bức ảnh kỷ niệm ghép thành hình trái tim 3D lơ lửng giữa trời sao, tự do xoay 360 độ kèm mưa chữ yêu thương phát sáng lung linh.",
    emoji: "❤️",
    color: "#EC4899",
    gradient: "linear-gradient(135deg, #000000 0%, #BE185D 50%, #F472B6 100%)",
    light: "#050005",
    img: "/templates/heart-image/preview.jpg",
    theme: "tinh-yeu",
    themes: ["tinh-yeu", "ky-niem", "sinh-nhat"],
    tag: "Trái Tim 3D",
    features: ["Tối đa 20 ảnh kỷ niệm", "Trái tim xoay 3D tương tác", "Bầu trời sao băng lung linh", "Chữ rơi cầu vồng phát sáng"],
    allowedFeatures: {
      photos: true,
      maxPhotos: 20,
      video: false,
      voice: false,
      music: false,
    }
  },
  {
    id: "gift-wday",
    name: "Tri Ân Yêu Thương 20/10",
    description: "Thiết kế tôn vinh phái đẹp và Mẹ yêu. Mưa ảnh kỷ niệm rơi nhẹ nhàng, chữ chúc chuyển động mềm mại cùng giai điệu piano ngọt ngào.",
    emoji: "💐",
    color: "#FB7185",
    gradient: "linear-gradient(135deg, #FFD6E0 0%, #FFF2CC 50%, #FFE5EC 100%)",
    light: "#FFF0F4",
    img: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    theme: "ky-niem",
    themes: ["ky-niem", "tinh-yeu", "sinh-nhat"],
    tag: "Tri Ân Phái Đẹp",
    features: ["Tối đa 12 ảnh kỷ niệm", "Cơn mưa ảnh hoa rơi", "Lời chúc chuyển động cảm xúc", "Nút bật/tắt nhạc nền 20/10"],
    allowedFeatures: {
      photos: true,
      maxPhotos: 12,
      video: false,
      voice: false,
      music: false,
    }
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
  if (gift.templateId === "solid-heart") {
    return <SolidHeartCanvas3D gift={gift} />;
  }
  if (gift.templateId === "starlight-galaxy") {
    return <StarlightCanvas3D gift={gift} />;
  }
  if (gift.templateId === "crystal-rose") {
    return <CrystalRoseCanvas3D gift={gift} />;
  }
  if (gift.templateId === "singularity-blackhole") {
    return <SingularityCanvas3D gift={gift} />;
  }
  if (gift.templateId === "falling-memories") {
    return <FallingTextGiftView gift={gift} />;
  }
  if (gift.templateId === "love-counter") {
    return <LoveCountGiftView gift={gift} />;
  }
  if (gift.templateId === "heart-wish") {
    return <WishSlidesGiftView gift={gift} />;
  }
  if (gift.templateId === "heart-image") {
    return <HeartImageGiftView gift={gift} />;
  }
  if (gift.templateId === "gift-wday") {
    return <WDayGiftView gift={gift} />;
  }
  return <HeartCanvas3D gift={gift} />;
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
    <div className="w-full h-[520px] sm:h-[640px] max-h-[70vh] relative rounded-2xl overflow-hidden border border-stone-200/60 shadow-lg bg-white">
      <RenderLiveTemplate
        gift={gift}
        isEditing={isEditing}
        onUpdate={onUpdate}
      />
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
                placeholder="Ví dụ: ORD-572913"
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

        <div className="mt-6 border-t border-stone-100 pt-4">
          <Link
            to="/"
            className="text-xs font-bold text-stone-400 hover:text-stone-600 inline-flex items-center gap-1 transition-colors"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Step Components ─────────────────────────────────────────────────────────

// Bước 1: Chọn Mẫu Thiệp (Bố cục tối ưu giao diện Mobile App)
function Step1({
  gift,
  setGift,
  templates,
}: {
  gift: GiftData;
  setGift: (g: GiftData) => void;
  templates: any[];
  onBack?: () => void;
}) {
  const [demoTemplate, setDemoTemplate] = useState<GiftData | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredTemplates = templates;
  const selectedTemplate = templates.find((t) => t.id === gift.templateId) || templates[0];

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
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Chọn Mẫu Thiết Kế
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8B4A8]/20 text-[#A85848]">
              {templates.length} mẫu
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Chạm để chọn phôi giao diện 3D tương tác bạn yêu thích nhất
          </p>
        </div>

        {/* View mode toggle (Grid vs List) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 self-start sm:self-auto shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer ${
              viewMode === "grid"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-500 hover:text-stone-800 bg-transparent"
            }`}
            title="Dạng lưới 2 cột (chuẩn mobile)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lưới</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer ${
              viewMode === "list"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-500 hover:text-stone-800 bg-transparent"
            }`}
            title="Dạng danh sách chi tiết"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chi tiết</span>
          </button>
        </div>
      </div>



      {/* Selected Template Quick Summary Bar */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8B4A8]/40 shadow-sm"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(252,235,231,0.6))" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={selectedTemplate.img}
              alt={selectedTemplate.name}
              className="w-11 h-11 rounded-xl object-cover border border-[#E8B4A8]/30 flex-shrink-0 shadow-xs"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A85848]">
                  Đang chọn
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-stone-900 truncate">
                {selectedTemplate.emoji} {selectedTemplate.name}
              </h4>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => handleOpenDemo(e, selectedTemplate)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8B4A8]/20 hover:bg-[#E8B4A8]/30 text-[#A85848] rounded-xl text-xs font-bold transition-all border border-[#E8B4A8]/40 cursor-pointer flex-shrink-0 ml-2"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xem thử</span> 3D
          </button>
        </motion.div>
      )}

      {/* Template Cards List / Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-3xl border border-stone-200/60 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-[#D4AF78]">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-stone-800">Không tìm thấy mẫu phù hợp</h3>
          <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
            Hãy chuyển sang mục "Tất cả" để khám phá toàn bộ kho 8 mẫu thiệp 3D của Wemo nhé!
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0 shadow-sm"
          >
            Xem tất cả {templates.length} mẫu
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ── GRID VIEW (MATCHING REFERENCE DESIGN) ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredTemplates.map((tpl) => {
            const selected = gift.templateId === tpl.id;
            return (
              <motion.div
                key={tpl.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGift({ ...gift, templateId: tpl.id, theme: tpl.theme || gift.theme || "tinh-yeu" })}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer text-left transition-all bg-white flex flex-col justify-between ${
                  selected
                    ? "ring-3 ring-[#EA580C] shadow-xl"
                    : "border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgb(0,0,0,0.1)] hover:-translate-y-1"
                }`}
              >
                {/* Image & Overlays */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-100 flex-shrink-0">
                  <img
                    src={tpl.img}
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />



                  {/* Center glass "Xem chi tiết" button */}
                  <button
                    type="button"
                    onClick={(e) => handleOpenDemo(e, tpl)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/25 transition-all shadow-md cursor-pointer group/btn"
                  >
                    <Eye className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                    <span>Xem chi tiết</span>
                  </button>

                  {/* Top-right selection tick */}
                  {selected && (
                    <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg animate-in zoom-in-50">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-[17px] font-bold text-stone-900 tracking-tight leading-snug line-clamp-1 group-hover:text-[#EA580C] transition-colors">
                        {tpl.name} {tpl.emoji || ""}
                      </h3>
                      {selected && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-900 text-white flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> Đã chọn
                        </span>
                      )}
                    </div>

                    {/* Description with gold left border line */}
                    <div className="border-l-2 border-[#D4AF78] pl-3 py-0.5">
                      <p className="text-xs sm:text-[13px] text-stone-500 line-clamp-3 leading-relaxed font-normal">
                        {tpl.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Row: Video & Contact / Chọn mẫu */}
                  <div className="grid grid-cols-2 gap-3 mt-5 pt-1">
                    <button
                      type="button"
                      onClick={(e) => handleOpenDemo(e, tpl)}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FFF0F4] border border-[#FFCCD5] text-[#E63956] hover:bg-[#FFE5EC] font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 stroke-[#E63956] fill-transparent" />
                      <span>Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGift({ ...gift, templateId: tpl.id, theme: tpl.theme || gift.theme || "tinh-yeu" })}
                      className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer border-0 ${
                        selected
                          ? "bg-stone-900 text-white shadow-sm"
                          : "bg-[#E5A852] hover:bg-[#D99A40] text-[#2E1D03]"
                      }`}
                    >
                      {selected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã chọn</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          <span>Chọn mẫu</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ── LIST VIEW (DẠNG DANH SÁCH CHI TIẾT) ── */
        <div className="space-y-3">
          {filteredTemplates.map((tpl) => {
            const selected = gift.templateId === tpl.id;
            return (
              <motion.div
                key={tpl.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => setGift({ ...gift, templateId: tpl.id, theme: tpl.theme || gift.theme || "tinh-yeu" })}
                className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl cursor-pointer transition-all bg-white flex items-center gap-3.5 ${
                  selected
                    ? "ring-2 ring-offset-2 ring-stone-900 shadow-md"
                    : "border border-stone-200/80 shadow-xs hover:shadow-sm"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 bg-stone-100">
                  <img src={tpl.img} alt={tpl.name} className="w-full h-full object-cover" />
                  {selected && (
                    <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center text-white backdrop-blur-xs">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{tpl.emoji}</span>
                    <h3 className="text-xs sm:text-sm font-black text-stone-900 truncate">
                      {tpl.name}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-stone-100 text-stone-600">
                      {tpl.tag}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {tpl.features?.slice(0, 2).map((feat: string, fIdx: number) => (
                      <span
                        key={fIdx}
                        className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-stone-100 text-stone-600"
                      >
                        • {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleOpenDemo(e, tpl)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold border-0 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3" /> Xem 3D
                  </button>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                      selected ? "bg-stone-900 text-white" : "text-stone-400"
                    }`}
                  >
                    {selected ? "✓ Đã chọn" : "Chạm để chọn"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Demo View Modal - Mobile Responsive */}
      <AnimatePresence>
        {demoTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-md relative flex flex-col shadow-2xl max-h-[92vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-sm">
                    ✨
                  </div>
                  <h3 className="font-black text-stone-900 text-sm sm:text-base">
                    Xem thử: {demoTemplate.title}
                  </h3>
                </div>
                <button
                  onClick={() => setDemoTemplate(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center border-0 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Body */}
              <div className="py-3 flex-1 overflow-hidden flex flex-col justify-center">
                <DirectPreview gift={demoTemplate} />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setDemoTemplate(null)}
                  className="py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGift({ ...gift, templateId: demoTemplate.templateId, theme: demoTemplate.theme || gift.theme || "tinh-yeu" });
                    setDemoTemplate(null);
                  }}
                  className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-md border-0 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                >
                  <Check className="w-3.5 h-3.5" /> Chọn Mẫu Này Cho Thiệp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataUrl);
      };
      img.onerror = () => {
        reject(new Error("Không thể tải hình ảnh."));
      };
    };
    reader.onerror = () => reject(new Error("Không thể đọc tệp tin."));
  });
};
// Bước 2: Thiết Kế & Tải Tệp
function Step2({
  gift,
  setGift,
  templates = STATIC_TEMPLATES,
}: {
  gift: GiftData;
  setGift: (g: GiftData) => void;
  templates?: any[];
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic allowedFeatures from template config
  const currentTemplate = templates.find((t) => t.id === gift.templateId);
  const allowedFeatures = currentTemplate?.allowedFeatures || {
    photos: true,
    maxPhotos: 6,
    video: true,
    voice: true,
    music: true,
  };
  const maxPhotos = allowedFeatures.maxPhotos || 6;

  // Video States
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoMode, setVideoMode] = useState<"upload" | "youtube">("upload");
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Voice States
  const [voiceUploading, setVoiceUploading] = useState(false);
  const [voiceMode, setVoiceMode] = useState<"record" | "upload">("record");
  const [recording, setRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [localVoiceUrl, setLocalVoiceUrl] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const localVoiceUrlRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (localVoiceUrlRef.current) URL.revokeObjectURL(localVoiceUrlRef.current);
    };
  }, []);

  const getPlayableVoiceUrl = (url: string) => {
    if (!url) return "";
    return url;
  };

  // AI Chibi states
  const [aiExpanded, setAiExpanded] = useState(false);
  const [portraitImage, setPortraitImage] = useState<string | null>(null);
  const [aiStyle, setAiStyle] = useState("cute-3d");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResultUrl, setAiResultUrl] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoadingStep, setAiLoadingStep] = useState(0);
  const aiLoadingSteps = [
    "🤖 AI đang phân tích khuôn mặt...",
    "🎨 Đang phác thảo chibi...",
    "✨ Đang dệt trang phục...",
    "💎 Đang dựng hình 3D...",
    "🎉 Đang hoàn tất..."
  ];

  useEffect(() => {
    let interval: any;
    if (aiGenerating) {
      setAiLoadingStep(0);
      interval = setInterval(() => {
        setAiLoadingStep((prev) => (prev < aiLoadingSteps.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      setAiLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [aiGenerating]);

  const portraitInputRef = useRef<HTMLInputElement>(null);

  // Camera states inside Step2 widget
  const [aiShowCamera, setAiShowCamera] = useState(false);
  const aiVideoRef = useRef<HTMLVideoElement | null>(null);
  const aiStreamRef = useRef<MediaStream | null>(null);

  const startAiCamera = async () => {
    setAiShowCamera(true);
    setAiError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      aiStreamRef.current = stream;
      if (aiVideoRef.current) {
        aiVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setAiError("Không thể truy cập camera. Vui lòng kiểm tra quyền thiết bị.");
      setAiShowCamera(false);
    }
  };

  const stopAiCamera = () => {
    if (aiStreamRef.current) {
      aiStreamRef.current.getTracks().forEach((track) => track.stop());
      aiStreamRef.current = null;
    }
    setAiShowCamera(false);
  };

  const captureAiPhoto = () => {
    if (!aiVideoRef.current) return;
    const video = aiVideoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL("image/jpeg", 0.8);
      setPortraitImage(base64);
      setAiResultUrl(null);
    }
    stopAiCamera();
  };

  useEffect(() => {
    return () => {
      if (aiStreamRef.current) {
        aiStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handlePortraitSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAiError(null);
    try {
      const base64 = await compressImage(file);
      setPortraitImage(base64);
      setAiResultUrl(null);
    } catch (err: any) {
      setAiError(err.message);
    }
  };

  const handleGenerateChibi = async () => {
    if (!portraitImage) return;
    setAiGenerating(true);
    setAiError(null);
    try {
      const res = await fetch("/api/ai/generate-chibi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: portraitImage,
          style: aiStyle
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể vẽ ảnh chibi.");
      setAiResultUrl(data.url);
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAddChibiToAlbum = () => {
    if (!aiResultUrl) return;
    if (gift.photos.length >= maxPhotos) {
      alert(`Bộ sưu tập ảnh thiệp đã đầy (Tối đa ${maxPhotos} ảnh). Vui lòng xóa bớt ảnh trước khi thêm.`);
      return;
    }
    setGift({ ...gift, photos: [...gift.photos, aiResultUrl] });
    setPortraitImage(null);
    setAiResultUrl(null);
    setAiExpanded(false);
  };

  const addPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentPhotos = gift.photos;
    const spaceLeft = maxPhotos - currentPhotos.length;
    if (spaceLeft <= 0) {
      alert(`Bộ sưu tập ảnh thiệp đã đầy (Tối đa ${maxPhotos} ảnh). Vui lòng xóa bớt ảnh trước khi thêm.`);
      return;
    }

    let filesToUpload = files;
    let skipped = false;
    if (files.length > spaceLeft) {
      filesToUpload = files.slice(0, spaceLeft);
      skipped = true;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of filesToUpload) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            if (!dataUrl || typeof dataUrl !== "string") {
              reject(new Error("Không thể đọc file ảnh."));
              return;
            }
            const img = new window.Image();
            img.onload = () => {
              try {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;
                const MAX_SIZE = 800;
                if (width > height && width > MAX_SIZE) {
                  height = Math.round((height * MAX_SIZE) / width);
                  width = MAX_SIZE;
                } else if (height > MAX_SIZE) {
                  width = Math.round((width * MAX_SIZE) / height);
                  height = MAX_SIZE;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(img, 0, 0, width, height);
                  resolve(canvas.toDataURL("image/jpeg", 0.85));
                } else {
                  resolve(dataUrl);
                }
              } catch (canvasErr) {
                resolve(dataUrl);
              }
            };
            img.onerror = () => resolve(dataUrl);
            img.src = dataUrl;
          };
          reader.onerror = () => reject(new Error("Không thể đọc tệp ảnh."));
          reader.readAsDataURL(file);
        });

        console.log(`📤 Uploading image: ${file.name}, size: ${Math.round(base64.length / 1024)}KB`);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: base64,
            fileName: file.name.replace(/\.[^/.]+$/, "") + ".jpg",
          }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          console.log(`✅ Image uploaded: ${data.url}`);
          uploadedUrls.push(data.url);
        } else {
          throw new Error(data.error || "Tải ảnh lên thất bại.");
        }
      }

      setGift({ ...gift, photos: [...gift.photos, ...uploadedUrls] });
      if (skipped) {
        alert(`Đã tải lên ${filesToUpload.length} ảnh. Bỏ qua các ảnh thừa do vượt quá giới hạn tối đa ${maxPhotos} ảnh.`);
      }
    } catch (err: any) {
      console.error("❌ Image upload error:", err);
      alert(err.message || "Có lỗi xảy ra khi xử lý ảnh.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePhoto = (i: number) => {
    setGift({ ...gift, photos: gift.photos.filter((_, idx) => idx !== i) });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64data = reader.result as string;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: base64data,
            fileName: file.name,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Tải video lên thất bại.");
        setGift({ ...gift, videoUrl: data.url });
      } catch (err: any) {
        alert(err.message);
      } finally {
        setVideoUploading(false);
        if (videoInputRef.current) videoInputRef.current.value = "";
      }
    };
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const finalMime = mediaRecorderRef.current?.mimeType || mimeType;
        const ext = finalMime.includes("mp4") ? "mp4" : finalMime.includes("ogg") ? "ogg" : "webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: finalMime });

        if (localVoiceUrlRef.current) URL.revokeObjectURL(localVoiceUrlRef.current);
        const blobUrl = URL.createObjectURL(audioBlob);
        localVoiceUrlRef.current = blobUrl;
        setLocalVoiceUrl(blobUrl);
        setGift({ ...gift, voiceUrl: "local://pending" });

        setVoiceUploading(true);
        try {
          const reader = new FileReader();
          const base64data = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Read error"));
            reader.readAsDataURL(audioBlob);
          });
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              file: base64data,
              fileName: `voice-${Date.now()}.${ext}`,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Tải ghi âm lên thất bại.");
          setGift({ ...gift, voiceUrl: data.url });
        } catch (err: any) {
          alert("Ghi âm đã lưu cục bộ nhưng tải lên thất bại: " + err.message);
        } finally {
          setVoiceUploading(false);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordDuration(0);
      timerRef.current = setInterval(() => {
        setRecordDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      alert("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập microphone của bạn.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleVoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVoiceUploading(true);
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
        if (!res.ok) throw new Error(data.error || "Tải tệp âm thanh thất bại.");
        setGift({ ...gift, voiceUrl: data.url });
      } catch (err: any) {
        alert(err.message);
      } finally {
        setVoiceUploading(false);
        if (voiceInputRef.current) voiceInputRef.current.value = "";
      }
    };
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const updateField = (fields: Partial<GiftData>) =>
    setGift({ ...gift, ...fields });

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-stone-900 text-center lg:text-left">Thiết Kế & Tải Tệp</h2>
      <p className="mb-8 text-sm text-stone-500 text-center lg:text-left">
        Tải hình ảnh kỷ niệm, viết lời chúc và xem trước mô phỏng 3D thời gian thực bên dưới
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form & Upload Panel (1/3) */}
        <div className="lg:col-span-1 space-y-4 max-h-[680px] overflow-y-auto pr-2 no-scrollbar">

          {/* Card 1: Thông tin thiệp */}
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

          {/* Card 2: Photos Section */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm">
            <h3 className="font-bold text-sm text-stone-800 mb-3 flex items-center gap-2">
              📸 Bộ Sưu Tập Ảnh ({gift.photos.length}/{maxPhotos})
            </h3>
            <div className="flex flex-wrap gap-3">
              {gift.photos.map((src, i) => (
                <div
                  key={src}
                  className="relative rounded-xl overflow-hidden shadow-sm w-16 h-16 border flex-shrink-0"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/70 flex items-center justify-center cursor-pointer border-0"
                  >
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              ))}
              {uploading && (
                <div className="w-16 h-16 rounded-xl flex items-center justify-center border border-stone-200 bg-stone-50">
                  <Loader2 className="w-4 h-4 animate-spin text-[#E8B4A8]" />
                </div>
              )}
              {!uploading && gift.photos.length < maxPhotos && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
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

          {/* 4. Video Section */}
          {allowedFeatures.video && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-stone-800 mb-1 flex items-center gap-2">
                🎥 Video Đính Kèm {gift.videoUrl && "✅"}
              </h3>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-xl p-4 bg-stone-50/50">
                {videoUploading ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-[#E8B4A8]" />
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Đang tải video...</span>
                  </div>
                ) : gift.videoUrl ? (
                  <div className="w-full space-y-3 text-center">
                    <video src={gift.videoUrl} controls className="w-full max-h-[140px] rounded-lg bg-black" />
                    <button
                      onClick={() => setGift({ ...gift, videoUrl: "" })}
                      className="text-xs text-rose-500 font-bold hover:underline block mx-auto border-0 bg-transparent cursor-pointer"
                    >
                      Xóa Video
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      ref={videoInputRef}
                      onChange={handleVideoUpload}
                      accept="video/*"
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="px-4 py-2 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-colors"
                    >
                      Chọn Tệp Video (MP4)
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 5. Ghi âm Lời chúc */}
          {allowedFeatures.voice && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-stone-800 mb-1 flex items-center gap-2">
                🎙️ Ghi Âm Lời Chúc {gift.voiceUrl && "✅"}
              </h3>

              <div className="flex gap-2 p-0.5 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setVoiceMode("record")}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${voiceMode === "record" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                >
                  Thu Âm Trực Tiếp
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceMode("upload")}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${voiceMode === "upload" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                >
                  Tải Tệp Âm Thanh
                </button>
              </div>

              {voiceMode === "record" ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-xl p-5 bg-stone-50/50">
                  {(gift.voiceUrl || localVoiceUrl) && !recording ? (
                    <div className="w-full space-y-2 text-center overflow-hidden">
                      <div className="w-full overflow-hidden">
                        <audio
                          key={localVoiceUrl || gift.voiceUrl}
                          src={localVoiceUrl || gift.voiceUrl}
                          controls
                          preload="auto"
                          className="w-full block"
                          style={{ maxWidth: "100%", minWidth: 0 }}
                        />
                      </div>
                      {voiceUploading && (
                        <div className="flex items-center justify-center gap-2 py-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E8B4A8]" />
                          <span className="text-[10px] text-stone-400 font-bold tracking-wider">Đang lưu lên máy chủ...</span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          if (localVoiceUrlRef.current) URL.revokeObjectURL(localVoiceUrlRef.current);
                          localVoiceUrlRef.current = "";
                          setLocalVoiceUrl("");
                          setGift({ ...gift, voiceUrl: "" });
                        }}
                        className="text-xs text-rose-500 font-bold hover:underline block mx-auto border-0 bg-transparent cursor-pointer"
                      >
                        Xóa Bản Thu Âm
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <button
                        type="button"
                        onClick={recording ? stopRecording : startRecording}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow border-none ${recording ? "bg-red-500 animate-pulse text-white" : "bg-[#E8B4A8]/10 text-[#E8B4A8] border border-[#E8B4A8]/30 hover:bg-[#E8B4A8]/20"}`}
                      >
                        {recording ? <Square className="w-5 h-5 fill-white text-white border-0" /> : <Mic className="w-6 h-6" />}
                      </button>
                      <span className="text-xs font-bold text-stone-700">
                        {recording ? `Đang ghi âm... ${formatDuration(recordDuration)}` : "Nhấn để thu âm"}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-xl p-4 bg-stone-50/50">
                  {voiceUploading ? (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-[#D4AF78]" />
                      <span className="text-[10px] text-stone-400 font-bold tracking-wider">Đang tải tệp âm thanh...</span>
                    </div>
                  ) : gift.voiceUrl ? (
                    <div className="w-full space-y-3 text-center overflow-hidden">
                      <div className="w-full overflow-hidden">
                        <audio
                          key={gift.voiceUrl}
                          src={getPlayableVoiceUrl(gift.voiceUrl)}
                          controls
                          preload="auto"
                          className="w-full block"
                          style={{ maxWidth: "100%", minWidth: 0 }}
                        />
                      </div>
                      <button
                        onClick={() => setGift({ ...gift, voiceUrl: "" })}
                        className="text-xs text-rose-500 font-bold hover:underline block mx-auto border-0 bg-transparent cursor-pointer"
                      >
                        Xóa Tệp Âm Thanh
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        ref={voiceInputRef}
                        onChange={handleVoiceUpload}
                        accept="audio/*"
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        onClick={() => voiceInputRef.current?.click()}
                        className="px-4 py-2 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-colors"
                      >
                        Chọn Tệp Âm Thanh
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 6. Nhạc nền */}
          {allowedFeatures.music && (
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
          )}
        </div>

        {/* Right Column: Live editable template preview (2/3) */}
        <div className="lg:col-span-2 flex flex-col items-center">
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
      </div>
    </div>
  );
}

// Bước 4: Hoàn thành (Giao diện 2 cột xem trước kết hợp bảng đóng gói)
function Step4({
  gift,
  onSave,
  saving,
  templates,
}: {
  gift: GiftData;
  onSave: () => void;
  saving: boolean;
  templates: any[];
}) {
  const tpl = templates.find((t) => t.id === gift.templateId) || templates[0];
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
    <div className="max-w-6xl mx-auto font-sans">
      <h2 className="mb-2 text-2xl font-black text-stone-900 text-center lg:text-left">
        Kiểm Tra & Xem Trước Thiệp
      </h2>
      <p className="mb-8 text-sm text-stone-500 text-center lg:text-left">
        Xem trước hiển thị trên thiết bị di động và kiểm tra thông số đóng gói chip NFC
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Packing details (1/3) */}
        <div className="lg:col-span-1 space-y-6">
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

        {/* Right Column: Template Preview (2/3) */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center">
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
  templates,
}: {
  gift: GiftData;
  giftId: string;
  onReset: () => void;
  templates: any[];
}) {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [nfcStatus, setNfcStatus] = useState<"idle" | "listening" | "success" | "error">("idle");
  const tpl = templates.find((t) => t.id === gift.templateId) || templates[0];
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
        className="w-full max-w-lg bg-[#FCEBE7] rounded-[2.5rem] p-8 text-center shadow-2xl border border-white/50 relative overflow-hidden my-8"
      >
        {/* Back Button */}
        <button
          onClick={onReset}
          className="absolute top-6 left-6 p-2.5 rounded-full bg-white/40 hover:bg-white/60 text-stone-600 transition-colors cursor-pointer border border-white/20 shadow-sm flex items-center justify-center z-20 active:scale-95"
          title="Quay lại"
        >
          <ArrowLeft className="w-4 h-4 text-stone-700" />
        </button>

        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#E8B4A8]/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#D4AF78]/20 rounded-full blur-[80px]" />

        {/* Professional Glowing Gift & Sparkles Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-[#E8B4A8] to-[#D4AF78] flex items-center justify-center shadow-[0_8px_30px_rgba(232,180,168,0.35)] mb-6 relative mt-4">
          <div className="absolute inset-1 rounded-full bg-[#FCEBE7] flex items-center justify-center border border-white/10">
            <Gift className="w-9 h-9 text-[#D4AF78]" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md border border-stone-100 flex items-center justify-center"
          >
            <Sparkles className="w-4 h-4 text-[#E8B4A8] fill-[#E8B4A8]" />
          </motion.div>
        </div>

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
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer select-none ${copied ? "bg-green-600 text-white shadow" : "bg-stone-900 text-white hover:bg-stone-800"
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
              className="bg-[#FCEBE7] rounded-[2.5rem] p-6 w-full max-w-sm relative text-center shadow-2xl border border-white"
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
              className="bg-[#FCEBE7] rounded-[2.5rem] p-6 w-full max-w-sm relative text-center shadow-2xl border border-white"
            >
              <button
                onClick={() => setShowNfcModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-black text-stone-900 text-sm mb-4">Ghi Thẻ WEMO NFC</h3>

              {nfcStatus === "idle" && (
                <div className="py-2.5 text-left">
                  {!("NDEFReader" in window) ? (
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-500 mb-1 border border-amber-100 shadow-inner">
                        <Wifi className="w-6 h-6 animate-pulse" />
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed text-center font-medium">
                        Trình duyệt/HĐH hiện tại không hỗ trợ ghi NFC trực tiếp (iOS Safari/Chrome/Facebook Browser).
                      </p>

                      <div className="space-y-2 pt-1.5">
                        <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-left">
                          <p className="text-[10px] font-bold text-stone-800 mb-1">Cách 1: Sử dụng Mã QR</p>
                          <p className="text-[9px] text-stone-500 leading-relaxed">
                            Quét hoặc in mã QR từ màn hình trước để dán lên quà. Người nhận quét QR là mở được thiệp tức thì.
                          </p>
                        </div>

                        <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-left">
                          <p className="text-[10px] font-bold text-stone-800 mb-1">Cách 2: Ghi qua app NFC Tools (Khuyên dùng)</p>
                          <ol className="list-decimal list-inside text-[9px] text-stone-500 space-y-1 mt-1 leading-relaxed">
                            <li>Nhấn nút bên dưới để chép link thiệp quà tặng.</li>
                            <li>Tải ứng dụng <strong>NFC Tools</strong> (miễn phí) trên App Store.</li>
                            <li>Mở app → chọn <strong>Write</strong> → <strong>Add a record</strong> → <strong>URL</strong>.</li>
                            <li>Dán liên kết đã chép vào → nhấn <strong>Write</strong> và áp lưng máy vào chip NFC để ghi.</li>
                          </ol>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(giftUrl);
                          alert("Đã sao chép liên kết thiệp quà tặng! Bạn có thể dán vào ứng dụng NFC Tools để ghi thẻ.");
                        }}
                        className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow text-center cursor-pointer active:scale-98 transition-all block mt-2"
                      >
                        Sao Chép Link Quà Tặng
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6 py-4 text-center">
                      <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                        <Wifi className="w-10 h-10" />
                      </div>
                      <p className="text-xs text-stone-650 leading-relaxed max-w-[85%] mx-auto">
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

const defaultGift = (orderId: string, orderSignature: string, chibiUrlOverride?: string): GiftData => {
  const params = new URLSearchParams(window.location.search);
  // Check chibiUrl from URL param (old flow) or sessionStorage (new flow)
  const chibiUrl = chibiUrlOverride || params.get("chibiUrl") || sessionStorage.getItem("wemo_chibi_url") || "";
  // Clear sessionStorage after reading
  if (chibiUrl) sessionStorage.removeItem("wemo_chibi_url");
  return {
    theme: "tinh-yeu",
    templateId: "love-romantic",
    photos: chibiUrl ? [chibiUrl] : [],
    hasVideo: false,
    hasVoice: false,
    recipientName: "",
    title: "",
    message: "",
    music: "none",
    orderId: orderId,
    orderSignature: orderSignature,
  };
};

export function GiftWizard() {
  const [validatedOrderId, setValidatedOrderId] = useState<string | null>(null);
  const [orderSignature, setOrderSignature] = useState<string>("");
  const [step, setStep] = useState(0);
  const [gift, setGift] = useState<GiftData | null>(null);
  const [done, setDone] = useState(false);
  const [createdGiftId, setCreatedGiftId] = useState("");
  const [saving, setSaving] = useState(false);
  const [bypassLoading, setBypassLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load dynamic template settings from DB to allow admin modifications to reflect immediately
  const [templates, setTemplates] = useState(STATIC_TEMPLATES);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        const merged = STATIC_TEMPLATES.map((staticTpl) => {
          const dbTpl = data.find((t) => t.id === staticTpl.id);
          if (!dbTpl) return staticTpl;
          return {
            ...staticTpl,
            name: dbTpl.name || staticTpl.name,
            description: dbTpl.sampleMessage || staticTpl.description,
            img: dbTpl.preview || staticTpl.img,
            features: (dbTpl.features && dbTpl.features.length > 0) ? dbTpl.features : staticTpl.features,
          };
        });
        setTemplates(merged);
      })
      .catch((err) => console.error("Error loading templates:", err));
  }, []);

  // Auto-bypass gateway when arriving from payment flow (orderId in URL param)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOrderId = params.get("orderId");
    if (!urlOrderId) return;

    setBypassLoading(true);
    // Verify order is deposited, then bypass gateway
    fetch(`/api/orders/check-payment/${urlOrderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.deposited || data.status === "deposited") {
          // Use a pseudo-signature since we verified payment server-side
          const pseudoSignature = "payment_verified";
          setValidatedOrderId(urlOrderId);
          setOrderSignature(pseudoSignature);
          setGift(defaultGift(urlOrderId, pseudoSignature));
          setStep(0);
        }
      })
      .catch(() => {})
      .finally(() => setBypassLoading(false));
  }, []);

  const handleValidOrder = (orderId: string, signature: string) => {
    setValidatedOrderId(orderId);
    setOrderSignature(signature);
    setGift(defaultGift(orderId, signature));
    setStep(0);
  };

  const canContinue = () => {
    if (!gift) return false;
    if (step === 0) return Boolean(gift.templateId);
    if (step === 1)
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

  if (bypassLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background:
            "radial-gradient(1300px 900px at 15% 10%, rgba(255, 238, 233, 0.95) 0%, transparent 70%), radial-gradient(1000px 700px at 85% 15%, rgba(254, 238, 224, 0.85) 0%, transparent 65%), linear-gradient(180deg, #FFF9F7 0%, #FAF3F0 50%, #F5ECE8 100%)",
        }}
      >
        <div className="text-center space-y-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E8B4A8] to-[#D4AF78] flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm font-bold text-stone-600">Đang tải thiết kế thiệp...</p>
        </div>
      </div>
    );
  }

  if (!validatedOrderId || !gift) {
    return (
      <div
        className="min-h-screen pt-20 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(1300px 900px at 15% 10%, rgba(255, 238, 233, 0.95) 0%, transparent 70%), radial-gradient(1000px 700px at 85% 15%, rgba(254, 238, 224, 0.85) 0%, transparent 65%), linear-gradient(180deg, #FFF9F7 0%, #FAF3F0 50%, #F5ECE8 100%)",
        }}
      >
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
        templates={templates}
      />
    );

  const stepComponents = [
    <Step1 gift={gift} setGift={setGift} templates={templates} onBack={back} />,
    <Step2 gift={gift} setGift={setGift} templates={templates} />,
    <Step4 gift={gift} onSave={handleSave} saving={saving} templates={templates} />,
  ];

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
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

      {/* Top Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/60 shadow-xs flex flex-col">
        <div className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between relative">
          {/* Left: Brand Logo */}
          <div className="flex items-center z-10">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#E8B4A8] to-[#D4AF78] shadow-xs">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-black text-base text-stone-900 tracking-tight">
                WEMO
              </span>
            </Link>
          </div>

          {/* Center Cluster: [Quay lại] - [ProgressBar] - [Kế Tiếp] */}
          <div className="hidden sm:flex items-center justify-center gap-4 lg:gap-8 flex-1 max-w-2xl mx-auto">
            {/* Back Button on left of progress */}
            <div className="w-28 flex justify-end">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
                </button>
              ) : (
                <div className="w-28" />
              )}
            </div>

            {/* Central Steps Timeline */}
            <div className="flex-shrink-0">
              <ProgressBar step={step} />
            </div>

            {/* Next / Save Button on right of progress */}
            <div className="w-28 flex justify-start">
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canContinue()}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
                    canContinue()
                      ? "bg-stone-900 hover:bg-black active:scale-95 cursor-pointer shadow-md"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed"
                  }`}
                >
                  Kế Tiếp <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
                >
                  {saving ? "Đang lưu..." : "Đóng Gói"} <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Close (X) button & Mobile Next/Back Controls */}
          <div className="flex items-center gap-2 z-10">
            {/* Mobile-only action buttons */}
            <div className="sm:hidden flex items-center gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={back}
                  className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 text-stone-700 rounded-lg text-xs font-bold"
                >
                  ←
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canContinue()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white ${
                    canContinue() ? "bg-stone-900" : "bg-stone-200 text-stone-400"
                  }`}
                >
                  Tiếp →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white rounded-lg text-xs font-bold"
                >
                  Lưu
                </button>
              )}
            </div>

            <Link
              to="/"
              className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile Top Progress Timeline */}
        <div className="sm:hidden px-4 pb-2 border-t border-stone-100">
          <ProgressBar step={step} />
        </div>
      </div>

      {/* Main Layout Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Workspace Panel */}
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-transparent no-scrollbar relative z-10">
          <div className={`w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col h-full justify-between transition-all ${step === 0 ? "max-w-7xl" : "max-w-5xl"}`}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
