import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Check,
  Clock,
  Sparkles,
  Home,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Package,
  Layers,
  Ruler,
  Zap,
} from "lucide-react";

interface TrackedOrder {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  depositAmount: number;
  status: "pending_payment" | "deposited" | "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "refunded";
  createdDate: string;
  chibiUrl: string;
  originalUrl: string;
  productConfig: {
    size: "10cm" | "15cm" | "20cm";
    quantity: number;
    base: "none" | "mica" | "wood";
    led: boolean;
  };
  paidAt: string;
}

const statusSteps = [
  { key: "pending_payment", label: "Chờ đặt cọc", emoji: "⏳", desc: "Đơn hàng đang chờ thanh toán đặt cọc" },
  { key: "deposited", label: "Đã nhận cọc", emoji: "✅", desc: "WEMO đã xác nhận khoản cọc 200,000đ" },
  { key: "processing", label: "Đang sản xuất", emoji: "🛠️", desc: "Figure 3D đang được thiết kế và in" },
  { key: "completed", label: "Đang giao / Xong", emoji: "📦", desc: "Mô hình đã hoàn thiện và gửi tới bạn" }
];

const getStatusStepIndex = (status: string) => {
  if (status === "pending_payment") return 0;
  if (status === "deposited" || status === "pending") return 1;
  if (status === "processing") return 2;
  if (status === "completed") return 3;
  return -1; // cancelled or other
};

const formatPrice = (p: number | undefined | null) => {
  if (p === undefined || p === null || isNaN(p)) return "0đ";
  return p.toLocaleString("vi-VN") + "đ";
};

export function TrackOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/orders/track/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Không thể tìm thấy thông tin đơn hàng.");
      }
      setOrder(data.order);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || "Có lỗi xảy ra khi truy vấn dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setOrder(null);
    }
  }, [orderId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchId.trim().toUpperCase();
    if (!cleanId) return;
    navigate(`/track/${cleanId}`);
  };

  const currentStepIdx = order ? getStatusStepIndex(order.status) : -1;
  const isCancelled = order ? order.status === "cancelled" : false;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-16 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#E8B4A8]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-[#D4AF78]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
          <Link to="/" className="hover:text-stone-700 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" /> Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-700">Theo Dõi Đơn Hàng</span>
        </div>

        {!orderId ? (
          // General Search Box UI
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8B4A8]/15 border border-[#E8B4A8]/30 text-[#e88d7b] text-xs font-black tracking-widest uppercase mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              WEMO TRACKING SYSTEM
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-4">
              Tra Cứu Đơn Hàng Figure
            </h1>
            <p className="text-sm text-stone-500 mb-8 leading-relaxed">
              Nhập mã đơn hàng (ví dụ: <span className="font-bold text-stone-700 font-mono">ORD-123456</span>) đã nhận qua Zalo hoặc Email để kiểm tra tiến trình sản xuất mô hình Chibi 3D của bạn.
            </p>

            <form onSubmit={handleSearchSubmit} className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-xl space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Nhập mã đơn hàng ORD-XXXXXX..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-sm bg-stone-50/50 text-stone-800 font-bold uppercase tracking-wider transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] hover:opacity-95 text-white rounded-2xl text-xs font-black tracking-widest uppercase shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                Tra Cứu Tiến Độ
              </button>
            </form>
          </motion.div>
        ) : (
          // Order Tracking Detail UI
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/60 shadow-md">
              <div className="text-center sm:text-left">
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">
                  Theo dõi đơn hàng
                </p>
                <h1 className="text-2xl font-black text-stone-900 font-mono mt-1">
                  {orderId}
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Khách hàng: <span className="font-bold text-stone-700">{order?.customerName}</span> · Ngày đặt: {order && new Date(order.createdDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchId("");
                  navigate("/track");
                }}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" /> Tra cứu đơn khác
              </button>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl p-16 border border-stone-200/60 shadow-md text-center text-stone-400 font-bold text-xs flex flex-col items-center justify-center gap-3"
                >
                  <Loader2 className="w-6 h-6 animate-spin text-[#E8B4A8]" />
                  Đang truy xuất thông tin đơn hàng...
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl p-10 border border-stone-200/60 shadow-md text-center space-y-4"
                >
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <h3 className="text-lg font-black text-stone-950">Không Tìm Thấy Đơn Hàng</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Mã đơn hàng <span className="font-bold text-stone-700 font-mono">{orderId}</span> không khớp với bất kỳ bản ghi nào trong hệ thống. Vui lòng kiểm tra lại.
                  </p>
                  <button
                    onClick={() => {
                      setSearchId("");
                      navigate("/track");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Quay lại tìm kiếm
                  </button>
                </motion.div>
              ) : order ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
                >
                  {/* Left columns: Timeline & Specs */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Timeline Progress */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/60 shadow-md space-y-8 relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78]" />
                      
                      <div>
                        <h2 className="text-sm font-black text-stone-800 uppercase tracking-widest">
                          Tiến trình sản xuất Figure
                        </h2>
                        <p className="text-[10px] text-stone-400 mt-1">Cập nhật thời gian thực từ xưởng WEMO</p>
                      </div>

                      {isCancelled ? (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-rose-955">Đơn hàng đã bị hủy</h4>
                            <p className="text-[11px] text-rose-700 mt-0.5">
                              Đơn hàng này đã bị hủy bỏ trên hệ thống. Vui lòng liên hệ WEMO để được giải đáp thắc mắc.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-4 md:items-center">
                          {/* Horizontal line for desktop */}
                          <div className="absolute hidden md:block top-4 left-[12%] right-[12%] h-[2px] bg-stone-100 -z-10" />

                          {statusSteps.map((step, idx) => {
                            const isDone = idx <= currentStepIdx;
                            const isCurrent = idx === currentStepIdx;

                            return (
                              <div key={step.key} className="flex md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-2 flex-1 relative">
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all duration-300 ${
                                    isDone
                                      ? "bg-gradient-to-tr from-[#E8B4A8] to-[#D4AF78] text-white shadow-md"
                                      : "bg-stone-100 text-stone-400 border border-stone-200"
                                  }`}
                                >
                                  {isDone && !isCurrent ? <Check className="w-4 h-4" /> : step.emoji}
                                </div>
                                <div className="space-y-0.5">
                                  <h4 className={`text-xs font-black ${isDone ? "text-stone-900" : "text-stone-400"}`}>
                                    {step.label}
                                  </h4>
                                  <p className="text-[10px] text-stone-400 leading-normal max-w-[130px] hidden md:block mx-auto">
                                    {step.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Figure Preview Designs */}
                    {(order.chibiUrl || order.originalUrl) && (
                      <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-md space-y-5">
                        <div>
                          <h2 className="text-sm font-black text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#D4AF78] fill-current" /> Bản vẽ & Chân dung thiết kế
                          </h2>
                          <p className="text-[10px] text-stone-400 mt-1">
                            Hình ảnh đối chiếu dùng để dựng hình mô hình 3D thực tế
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {order.originalUrl && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">
                                Ảnh Chân Dung Gốc
                              </p>
                              <div className="relative rounded-2xl overflow-hidden aspect-square border bg-stone-50 shadow-sm flex items-center justify-center">
                                <img
                                  src={order.originalUrl}
                                  alt="Ảnh gốc của khách hàng"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}

                          {order.chibiUrl && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-[#D4AF78] uppercase tracking-widest text-center flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3 fill-[#D4AF78]" />
                                Ảnh Chibi Vẽ Bằng AI
                              </p>
                              <div className="relative rounded-2xl overflow-hidden aspect-square border-2 border-[#D4AF78]/40 bg-stone-50 shadow-md flex items-center justify-center">
                                <img
                                  src={order.chibiUrl}
                                  alt="Ảnh Chibi AI"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right column: Figure Details */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-md text-left space-y-5 relative">
                      <div className="absolute inset-x-0 top-0 h-1 bg-[#D4AF78]" />

                      <div>
                        <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-[#D4AF78]" /> Chi Tiết Mô Hình
                        </h3>
                        <p className="text-[10px] text-stone-400 mt-1">Thông số kỹ thuật sản xuất của Figure</p>
                      </div>

                      <div className="space-y-3.5 pt-2">
                        {/* Size */}
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                            <Ruler className="w-4 h-4 text-stone-500" />
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 font-bold block uppercase">Kích Thước Figure</span>
                            <span className="text-xs font-black text-stone-800">{order.productConfig.size}</span>
                          </div>
                        </div>

                        {/* Display Base */}
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                            <Layers className="w-4 h-4 text-stone-500" />
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 font-bold block uppercase">Đế Trưng Bày</span>
                            <span className="text-xs font-black text-stone-800">
                              {order.productConfig.base === "none" && "Không đế"}
                              {order.productConfig.base === "mica" && "Đế Mica cao cấp (+30k)"}
                              {order.productConfig.base === "wood" && "Đế Gỗ nguyên khối (+50k)"}
                            </span>
                          </div>
                        </div>

                        {/* LED Lights */}
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-stone-500" />
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 font-bold block uppercase">Đèn LED Trang Trí</span>
                            <span className="text-xs font-black text-stone-800">
                              {order.productConfig.led ? "Có tích hợp hệ thống LED (+80k)" : "Không có"}
                            </span>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-stone-500" />
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 font-bold block uppercase">Số Lượng</span>
                            <span className="text-xs font-black text-stone-800">{order.productConfig.quantity} nhân vật</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-100 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-400 font-bold uppercase">Tổng giá trị đơn</span>
                          <span className="font-bold text-stone-800">{formatPrice(order.amount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-400 font-bold uppercase">Số tiền đã cọc</span>
                          <span className="font-bold text-emerald-600">{formatPrice(order.depositAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs pt-1">
                          <span className="text-stone-500 font-black uppercase">Còn lại phải trả</span>
                          <span className="font-black text-sm text-[#D4AF78]">
                            {formatPrice(order.amount - order.depositAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 text-left space-y-1.5">
                      <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                        💡 Hỗ trợ từ WEMO
                      </h4>
                      <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                        Nếu bạn cần thay đổi thông tin vận chuyển, đổi địa chỉ hoặc điều chỉnh thiết kế, hãy nhanh chóng liên hệ WEMO qua Zalo hoặc Hotline để bộ phận thiết kế xử lý kịp thời trước khi in 3D.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
