import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, X, Maximize2, Sparkles, ExternalLink, Film, Rotate3d, Heart, Mail } from "lucide-react";
import { Link } from "react-router";
import { HeartCanvas3D } from "./gift3d/HeartCanvas3D";
import { SolidHeartCanvas3D } from "./gift3d/SolidHeartCanvas3D";
import { StarlightCanvas3D } from "./gift3d/StarlightCanvas3D";
import { CrystalRoseCanvas3D } from "./gift3d/CrystalRoseCanvas3D";
import { SingularityCanvas3D } from "./gift3d/SingularityCanvas3D";
import { FallingTextGiftView } from "./gift3d/FallingTextGiftView";
import { LoveCountGiftView } from "./gift3d/LoveCountGiftView";
import { WishSlidesGiftView } from "./gift3d/WishSlidesGiftView";
import { HeartImageGiftView } from "./gift3d/HeartImageGiftView";
import { WDayGiftView } from "./gift3d/WDayGiftView";

export interface PreviewTemplateItem {
  id: string;
  slug?: string;
  title?: string;
  name?: string;
  description?: string;
  sampleMessage?: string;
  image?: string;
  preview?: string;
  videoUrl?: string;
  photos?: string[];
  emoji?: string;
  color?: string;
  features?: string[];
}

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: PreviewTemplateItem | null;
}

function renderTemplate3D(templateId: string, demoGift: any) {
  switch (templateId) {
    case "solid-heart":
      return <SolidHeartCanvas3D gift={demoGift} />;
    case "starlight-galaxy":
      return <StarlightCanvas3D gift={demoGift} />;
    case "crystal-rose":
      return <CrystalRoseCanvas3D gift={demoGift} />;
    case "singularity-blackhole":
      return <SingularityCanvas3D gift={demoGift} />;
    case "falling-memories":
      return <FallingTextGiftView gift={demoGift} />;
    case "love-counter":
      return <LoveCountGiftView gift={demoGift} />;
    case "heart-wish":
      return <WishSlidesGiftView gift={demoGift} />;
    case "heart-image":
      return <HeartImageGiftView gift={demoGift} />;
    case "gift-wday":
      return <WDayGiftView gift={demoGift} />;
    case "love-romantic":
    default:
      return <HeartCanvas3D gift={demoGift} />;
  }
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
  } else if (url.includes("embed/")) {
    videoId = url.split("embed/")[1]?.split("?")[0] || "";
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
}

export function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
}: TemplatePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"video" | "3d">("video");

  // Determine active tab when template opens
  useEffect(() => {
    if (template) {
      if (template.videoUrl && template.videoUrl.trim() !== "") {
        setActiveTab("video");
      } else {
        setActiveTab("3d");
      }
    }
  }, [template]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  const title = template.title || template.name || "Mẫu Thiệp 3D";
  const slug = template.slug || template.id;
  const hasVideo = Boolean(template.videoUrl && template.videoUrl.trim() !== "");
  const isYouTube =
    hasVideo &&
    (template.videoUrl!.includes("youtube.com") ||
      template.videoUrl!.includes("youtu.be"));

  const demoGift = {
    recipientName: "Người Nhận",
    senderName: "WEMO",
    title: title,
    message:
      template.sampleMessage ||
      template.description ||
      "Đây là bản xem thử trải nghiệm tương tác 3D chân thực của mẫu thiệp WEMO.",
    photos:
      template.photos && template.photos.length > 0
        ? template.photos
        : template.image
        ? [template.image]
        : [],
    theme: "tinh-yeu",
    templateId: template.id,
    music: "romantic",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-50 w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 backdrop-blur-sm gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-[#FFF0F4] border border-[#FFCCD5] flex items-center justify-center text-sm flex-shrink-0">
                {template.emoji || "✨"}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight truncate leading-tight">
                  {title}
                </h3>
                <span className="text-[11px] font-medium text-stone-500">
                  Bản xem thử trực tiếp
                </span>
              </div>
            </div>

            {/* Toggle Tabs (if videoUrl is available) */}
            <div className="flex items-center gap-2">
              {hasVideo && (
                <div className="flex items-center bg-stone-200/70 p-0.5 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("video")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === "video"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Film className="w-3.5 h-3.5 text-[#E63956]" />
                    <span className="hidden sm:inline">Video Demo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("3d")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === "3d"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Rotate3d className="w-3.5 h-3.5 text-[#D4AF78]" />
                    <span className="hidden sm:inline">Trải Nghiệm 3D</span>
                  </button>
                </div>
              )}

              {/* Fullscreen button */}
              <a
                href={`/preview/${template.id}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Mở toàn màn hình"
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media Body Viewer */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-stone-950 overflow-hidden select-none">
            {activeTab === "video" && hasVideo ? (
              isYouTube ? (
                <iframe
                  src={getYouTubeEmbedUrl(template.videoUrl!)}
                  title={`Video demo ${title}`}
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
                  className="w-full h-full object-contain bg-black"
                />
              )
            ) : (
              <div className="w-full h-full relative">
                {renderTemplate3D(template.id, demoGift)}

                {/* Floating hint for interactive 3D */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-white/90 flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span>Chạm và kéo để tương tác xoay 360°</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 bg-white border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-stone-500 line-clamp-2 max-w-md">
              {template.description ||
                "Mẫu thiệp công nghệ WEMO cá nhân hóa toàn bộ ảnh kỷ niệm, thông điệp và âm nhạc."}
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <a
                href="https://zalo.me/0398768699"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors no-underline"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Tư Vấn Zalo</span>
              </a>

              <Link
                to={`/templates/${slug}`}
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all no-underline"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Xem Chi Tiết Mẫu</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
