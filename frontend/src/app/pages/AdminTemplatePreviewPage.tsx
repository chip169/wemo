/**
 * AdminTemplatePreviewPage.tsx
 * Admin-only fullscreen 3D preview for each template.
 * Access: /admin/preview/:templateId (requires admin token)
 */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Heart, Loader2, ShieldAlert } from "lucide-react";
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

interface TemplateData {
  id: string;
  name: string;
  preview: string;
  photos?: string[];
  sampleMessage?: string;
  features?: string[];
  videoUrl?: string;
}

// Map template ID → 3D component + demo gift data
function buildDemoGift(tpl: TemplateData) {
  return {
    recipientName: "Người Nhận Mẫu",
    senderName: "WEMO Admin",
    title: tpl.name,
    message:
      tpl.sampleMessage ||
      "Đây là bản xem thử mẫu thiệp 3D. Nội dung này sẽ được thay thế bằng lời nhắn cá nhân hóa của khách hàng.",
    photos: tpl.photos || [],
    theme: "tinh-yeu",
    templateId: tpl.id,
    music: "romantic",
  };
}

export function AdminTemplatePreviewPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"3d" | "video">("3d");

  // 1. Check admin status (optional, won't block public users)
  useEffect(() => {
    const token = localStorage.getItem("wemo_admin_token");
    if (!token) {
      setIsAdmin(false);
      return;
    }

    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setIsAdmin(res.ok);
      })
      .catch(() => setIsAdmin(false));
  }, []);

  // 2. Fetch template data from API (public for everyone)
  useEffect(() => {
    setLoading(true);
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: TemplateData[]) => {
        const found = data.find((t) => t.id === templateId);
        if (found) {
          setTemplate(found);
          if (found.videoUrl && found.videoUrl.trim() !== "") {
            setViewMode("video");
          }
        } else {
          setError("Không tìm thấy mẫu thiết kế với ID: " + templateId);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi tải dữ liệu mẫu thiết kế.");
        setLoading(false);
      });
  }, [templateId]);

  // ── Loading ──
  if (loading || (!template && !error)) {
    return (
      <div className="min-h-screen bg-[#FCEBE7] flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8B4A8] to-[#D4AF78] flex items-center justify-center text-white"
        >
          <Heart className="w-6 h-6 fill-white" />
        </motion.div>
        <p className="mt-4 text-xs font-bold text-stone-500 uppercase tracking-widest animate-pulse">
          Đang tải bản xem thử mẫu thiệp...
        </p>
      </div>
    );
  }

  // ── Error ──
  if (error || !template) {
    return (
      <div className="min-h-screen bg-[#FCEBE7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-sm p-8 rounded-[2.5rem] bg-white/70 border border-white/40 shadow-2xl backdrop-blur-md flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-5 border border-amber-100">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-lg font-extrabold text-stone-900 mb-2">Không Tìm Thấy</h2>
          <p className="text-xs text-stone-500 max-w-xs mb-6 leading-relaxed">
            {error || "Mẫu thiệp không tồn tại hoặc đã ngừng hoạt động."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-gradient-to-r from-stone-800 to-stone-950 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 text-center block cursor-pointer border-0"
          >
            Quay Lại
          </button>
        </div>
      </div>
    );
  }

  // ── 3D Preview ──
  const demoGift = buildDemoGift(template);
  const hasVideo = Boolean(template.videoUrl && template.videoUrl.trim() !== "");
  const isYouTube =
    hasVideo &&
    (template.videoUrl!.includes("youtube.com") ||
      template.videoUrl!.includes("youtu.be"));

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0] || "";
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none bg-stone-950">
      {/* Media: Video or 3D Canvas */}
      {viewMode === "video" && hasVideo ? (
        <div className="w-full h-full flex items-center justify-center bg-black">
          {isYouTube ? (
            <iframe
              src={getYouTubeEmbedUrl(template.videoUrl!)}
              title={template.name}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={template.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          )}
        </div>
      ) : (
        /* Render 3D Canvas */
        template.id === "solid-heart" ? (
          <SolidHeartCanvas3D gift={demoGift} />
        ) : template.id === "starlight-galaxy" ? (
          <StarlightCanvas3D gift={demoGift} />
        ) : template.id === "crystal-rose" ? (
          <CrystalRoseCanvas3D gift={demoGift} />
        ) : template.id === "singularity-blackhole" ? (
          <SingularityCanvas3D gift={demoGift} />
        ) : template.id === "falling-memories" ? (
          <FallingTextGiftView gift={demoGift} />
        ) : template.id === "love-counter" ? (
          <LoveCountGiftView gift={demoGift} />
        ) : template.id === "heart-wish" ? (
          <WishSlidesGiftView gift={demoGift} />
        ) : template.id === "heart-image" ? (
          <HeartImageGiftView gift={demoGift} />
        ) : template.id === "gift-wday" ? (
          <WDayGiftView gift={demoGift} />
        ) : (
          <HeartCanvas3D gift={demoGift} />
        )
      )}

      {/* Top overlay header */}
      <div className="absolute top-4 left-4 right-4 z-30 pointer-events-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (isAdmin ? navigate("/adminWemo") : navigate(-1))}
            className="w-10 h-10 rounded-full bg-white/85 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-center text-stone-800 hover:bg-white transition-all cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="bg-white/85 backdrop-blur-md border border-white/40 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#E63956] uppercase tracking-wider">
              {isAdmin ? "Admin Preview" : "Bản Xem Thử"}
            </span>
            <span className="text-xs font-bold text-stone-800">{template.name}</span>
          </div>

          {/* Toggle between Video and 3D if videoUrl available */}
          {hasVideo && (
            <div className="bg-white/85 backdrop-blur-md border border-white/40 shadow-lg rounded-full p-1 flex items-center gap-1">
              <button
                onClick={() => setViewMode("video")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "video"
                    ? "bg-[#FFF0F4] text-[#E63956] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                🎬 Video
              </button>
              <button
                onClick={() => setViewMode("3d")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "3d"
                    ? "bg-[#FFF0F4] text-[#E63956] shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                ✨ 3D
              </button>
            </div>
          )}
        </div>

        {/* Action button for visitors */}
        {!isAdmin && (
          <div className="flex items-center gap-2">
            <a
              href="https://zalo.me/0398768699"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/85 backdrop-blur-md border border-white/40 text-stone-800 text-xs font-bold shadow-lg hover:bg-white transition-all no-underline"
            >
              Tư Vấn Zalo
            </a>
            <Link
              to={`/templates/${template.id}`}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white text-xs font-bold shadow-lg hover:opacity-95 transition-all no-underline"
            >
              Tạo Thiệp Mẫu Này
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
