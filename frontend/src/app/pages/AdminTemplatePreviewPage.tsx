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

  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [error, setError] = useState("");

  // 1. Check admin auth
  useEffect(() => {
    const token = localStorage.getItem("wemo_admin_token");
    if (!token) {
      setAuthed(false);
      return;
    }

    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setAuthed(true);
        } else {
          setAuthed(false);
          localStorage.removeItem("wemo_admin_token");
        }
      })
      .catch(() => setAuthed(false));
  }, []);

  // 2. Fetch template data from API
  useEffect(() => {
    if (authed !== true) return;

    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: TemplateData[]) => {
        const found = data.find((t) => t.id === templateId);
        if (found) {
          setTemplate(found);
        } else {
          setError("Không tìm thấy mẫu thiết kế với ID: " + templateId);
        }
      })
      .catch(() => setError("Lỗi khi tải dữ liệu mẫu thiết kế."));
  }, [authed, templateId]);

  // ── Not authenticated ──
  if (authed === false) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-sm p-8 rounded-[2.5rem] bg-white/70 border border-white/40 shadow-2xl backdrop-blur-md flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-5 border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-extrabold text-stone-900 mb-2">Truy Cập Bị Từ Chối</h2>
          <p className="text-xs text-stone-500 max-w-xs mb-6 leading-relaxed">
            Trang xem thử 3D này chỉ dành cho quản trị viên. Vui lòng đăng nhập Admin trước.
          </p>
          <Link
            to="/adminWemo"
            className="w-full py-3 bg-gradient-to-r from-stone-800 to-stone-950 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 text-center block cursor-pointer"
          >
            Đăng Nhập Admin
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (authed === null || (!template && !error)) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8B4A8] to-[#D4AF78] flex items-center justify-center text-white"
        >
          <Heart className="w-6 h-6 fill-white" />
        </motion.div>
        <p className="mt-4 text-xs font-bold text-stone-500 uppercase tracking-widest animate-pulse">
          Đang tải bản xem thử 3D...
        </p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-sm p-8 rounded-[2.5rem] bg-white/70 border border-white/40 shadow-2xl backdrop-blur-md flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-5 border border-amber-100">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-lg font-extrabold text-stone-900 mb-2">Lỗi</h2>
          <p className="text-xs text-stone-500 max-w-xs mb-6 leading-relaxed">{error}</p>
          <Link
            to="/adminWemo"
            className="w-full py-3 bg-gradient-to-r from-stone-800 to-stone-950 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 text-center block cursor-pointer"
          >
            Quay Lại Admin
          </Link>
        </div>
      </div>
    );
  }

  // ── 3D Preview ──
  const demoGift = buildDemoGift(template!);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none">
      {/* Render the correct 3D canvas based on template ID */}
      {template!.id === "solid-heart" ? (
        <SolidHeartCanvas3D gift={demoGift} />
      ) : (
        <HeartCanvas3D gift={demoGift} />
      )}

      {/* Admin overlay: back button + label */}
      <div className="absolute top-4 left-4 z-30 pointer-events-auto flex items-center gap-3">
        <button
          onClick={() => navigate("/adminWemo")}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200 shadow-lg flex items-center justify-center text-stone-700 hover:bg-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="bg-white/80 backdrop-blur-sm border border-stone-200 shadow-lg rounded-full px-4 py-2">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Admin Preview</span>
          <span className="text-xs font-bold text-stone-800 ml-2">{template!.name}</span>
        </div>
      </div>
    </div>
  );
}
