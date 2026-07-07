import { motion } from "motion/react";
import { Link } from "react-router";
import { Heart, Home, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FCEBE7] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Background soft glowing blur shapes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#E8B4A8]/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-[#D4AF78]/10 blur-[80px] pointer-events-none" />

      {/* Floating hearts */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-12 md:left-24 opacity-25 text-[#E8B4A8]"
      >
        <Heart className="w-12 h-12 fill-current" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-12 md:right-24 opacity-20 text-[#D4AF78]"
      >
        <Heart className="w-16 h-16 fill-current" />
      </motion.div>

      {/* Main Glass Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10 rounded-[2.5rem] bg-white/70 border border-white/40 shadow-2xl backdrop-blur-md relative z-10 flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center text-amber-500 mb-6 border border-amber-100 shadow-inner animate-pulse">
          <span className="text-4xl">⚠️</span>
        </div>

        <h1 className="text-6xl font-black text-stone-900 tracking-tighter mb-4">404</h1>
        <h2 className="text-xl font-extrabold text-stone-800 mb-2">Đường Dẫn Không Hợp Lệ</h2>
        <p className="text-xs text-stone-500 leading-relaxed max-w-xs mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang địa chỉ khác. Hãy kiểm tra lại đường dẫn của bạn nhé.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            to="/"
            className="flex-1 py-3 bg-gradient-to-r from-stone-800 to-stone-950 hover:from-stone-900 hover:to-black text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Home className="w-3.5 h-3.5" />
            Trang Chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 py-3 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay Lại
          </button>
        </div>
      </motion.div>

      {/* Info bottom */}
      <p className="mt-8 text-[10px] text-stone-400 font-bold uppercase tracking-widest relative z-10">
        WEMO NFC PLATFORM
      </p>
    </div>
  );
}
