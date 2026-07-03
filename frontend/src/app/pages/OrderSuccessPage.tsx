import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Check,
  Gift,
  ArrowRight,
  Copy,
  Home,
  ChevronRight,
  Sparkles,
  Phone,
  Package,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import confetti from "canvas-confetti";

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch order details
    if (orderId) {
      fetch(`/api/orders/check-payment/${orderId}`)
        .then((r) => r.json())
        .then((d) => setOrderData(d))
        .catch(() => {});
    }

    // Celebration confetti burst
    const timer = setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.4 },
        colors: ["#E8B4A8", "#D4AF78", "#ffffff", "#fce7f3", "#fef3c7"],
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [orderId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateGift = () => {
    navigate(`/create?orderId=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16 font-sans relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#E8B4A8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-[#D4AF78]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
          <Link to="/" className="hover:text-stone-700 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" /> Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-700">Đặt Hàng Thành Công</span>
        </div>

        {/* Success Hero */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E8B4A8] to-[#D4AF78] flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <Check className="w-12 h-12 text-white stroke-[2.5]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black tracking-widest uppercase mb-4">
              <Check className="w-3.5 h-3.5" /> ĐÃ NHẬN ĐẶT CỌC
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mb-3">
              Đặt Hàng Thành Công! 🎉
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto">
              WEMO đã nhận được khoản cọc của bạn. Đội sản xuất sẽ bắt đầu xử lý đơn hàng trong vòng 24 giờ.
            </p>
          </motion.div>
        </div>

        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl border border-stone-200/60 shadow-xl p-6 sm:p-8 mb-6"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-[#D4AF78] rounded-t-3xl" />

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Mã Đơn Hàng</p>
              <p className="text-2xl font-black text-stone-900 font-mono">{orderId}</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Đã sao chép" : "Sao chép"}
            </button>
          </div>

          {/* Status timeline */}
          <div className="space-y-4 mb-6">
            {[
              {
                icon: Check,
                title: "Đã nhận đặt cọc",
                desc: "Thanh toán đã được xác nhận thành công.",
                done: true,
                active: false,
              },
              {
                icon: Sparkles,
                title: "Tạo thiệp 3D & NFC",
                desc: "Bước tiếp theo: Thiết kế thiệp kỹ thuật số tặng kèm.",
                done: false,
                active: true,
              },
              {
                icon: Package,
                title: "Sản xuất mô hình 3D",
                desc: "Đội kỹ thuật tiến hành in ấn và hoàn thiện sản phẩm.",
                done: false,
                active: false,
              },
              {
                icon: Phone,
                title: "Giao hàng tận nơi",
                desc: "Sản phẩm được đóng gói và giao đến địa chỉ của bạn.",
                done: false,
                active: false,
              },
            ].map((item, i) => (
              <div key={i} className={`flex gap-3 ${i < 3 ? "pb-4 border-b border-stone-100" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    item.done
                      ? "bg-emerald-100"
                      : item.active
                      ? "bg-[#E8B4A8]/20 border-2 border-[#E8B4A8]"
                      : "bg-stone-100"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${
                      item.done ? "text-emerald-500" : item.active ? "text-[#E8B4A8]" : "text-stone-300"
                    }`}
                  />
                </div>
                <div>
                  <p className={`text-sm font-bold ${item.done ? "text-stone-900" : item.active ? "text-[#E8B4A8]" : "text-stone-400"}`}>
                    {item.title}
                    {item.active && (
                      <span className="ml-2 text-[9px] font-black bg-[#E8B4A8] text-white px-1.5 py-0.5 rounded-full">
                        TIẾP THEO
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Next action */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#E8B4A8]/20 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E8B4A8]/20 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-[#E8B4A8]" />
                </div>
                <div>
                  <p className="font-black text-sm mb-1">Bước tiếp theo: Tạo Thiệp 3D</p>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Thiết kế thiệp kỹ thuật số kèm chip NFC — chọn mẫu, thêm ảnh kỷ niệm và viết lời chúc yêu thương.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCreateGift}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white text-sm font-black flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all hover:scale-[1.01] shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                Tạo Thiệp 3D & Ghi Lời Chúc Ngay
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-stone-500 text-center mt-2">
                Bạn có thể làm điều này bất cứ lúc nào — thiệp sẽ được đính kèm với đơn hàng.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Support info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-2"
        >
          <p className="text-xs text-stone-400 font-medium">
            Cần hỗ trợ? Liên hệ WEMO qua Zalo hoặc nhắn tin trực tiếp trên website.
          </p>
          <Link
            to="/"
            className="text-xs text-[#E8B4A8] font-bold hover:underline inline-flex items-center gap-1"
          >
            <Home className="w-3 h-3" /> Về Trang Chủ
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
