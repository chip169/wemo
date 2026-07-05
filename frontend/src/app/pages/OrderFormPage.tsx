import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Sparkles,
  ChevronRight,
  Home,
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  Ruler,
  Layers,
  Zap,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

// ─── Pricing Table ─────────────────────────────────────────────────────────────
const PRICES = {
  size: { "10cm": 350000, "15cm": 450000, "20cm": 600000 },
  base: { none: 0, mica: 30000, wood: 50000 },
  led: 80000,
};

const SIZE_OPTIONS = [
  {
    id: "10cm",
    label: "10 cm",
    emoji: "🤏",
    desc: "Nhỏ gọn, để bàn làm việc",
    price: PRICES.size["10cm"],
  },
  {
    id: "15cm",
    label: "15 cm",
    emoji: "👌",
    desc: "Phổ biến nhất, cân đối đẹp",
    price: PRICES.size["15cm"],
    recommended: true,
  },
  {
    id: "20cm",
    label: "20 cm",
    emoji: "🖐",
    desc: "Nổi bật, làm quà sang trọng",
    price: PRICES.size["20cm"],
  },
];

const BASE_OPTIONS = [
  { id: "none", label: "Không đế", emoji: "🚫", price: 0 },
  { id: "mica", label: "Đế Mica", emoji: "💎", price: PRICES.base.mica },
  { id: "wood", label: "Đế Gỗ", emoji: "🪵", price: PRICES.base.wood },
];

const formatPrice = (p: number) =>
  p.toLocaleString("vi-VN") + "đ";

const calcTotal = (config: OrderConfig): number => {
  const base = PRICES.size[config.size as keyof typeof PRICES.size] || 0;
  const baseExtra = PRICES.base[config.base as keyof typeof PRICES.base] || 0;
  const ledExtra = config.led ? PRICES.led : 0;
  return (base + baseExtra + ledExtra) * config.quantity;
};

interface OrderConfig {
  size: "10cm" | "15cm" | "20cm";
  quantity: number;
  base: "none" | "mica" | "wood";
  led: boolean;
}

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
}

const STEPS = ["Ảnh Chibi", "Sản Phẩm", "Giao Hàng", "Xác Nhận"];

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        const max = 800;
        if (w > max || h > max) {
          if (w > h) { h = Math.round((h * max) / w); w = max; }
          else { w = Math.round((w * max) / h); h = max; }
        }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(e.target?.result as string); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => reject(new Error("Không thể xử lý ảnh."));
    };
    reader.onerror = () => reject(new Error("Không thể đọc tệp tin."));
  });
};

export function OrderFormPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [chibiUrl, setChibiUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [config, setConfig] = useState<OrderConfig>({
    size: "15cm",
    quantity: 1,
    base: "none",
    led: false,
  });

  const [contact, setContact] = useState<ContactInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const totalPrice = calcTotal(config);
  const DEPOSIT = 200000;

  // Load chibiUrl from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("wemo_chibi_url");
    if (saved) {
      setChibiUrl(saved);
    }
  }, []);

  const handleChibiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertToBase64(file);
      setChibiUrl(base64);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canProceedStep0 = true; // chibi optional
  const canProceedStep1 = config.quantity >= 1;
  const canProceedStep2 =
    contact.name.trim().length >= 2 &&
    contact.phone.trim().length >= 9 &&
    contact.address.trim().length >= 5 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/orders/create-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: contact.name,
          phone: contact.phone,
          email: contact.email,
          address: contact.address,
          note: contact.note,
          chibiUrl,
          productConfig: config,
          amount: totalPrice,
          depositAmount: DEPOSIT,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tạo đơn hàng thất bại.");
      // Clear session storage after order created
      sessionStorage.removeItem("wemo_chibi_url");
      navigate(`/payment/${data.orderId}`);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-16 font-sans relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#E8B4A8]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-[#D4AF78]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
          <Link to="/" className="hover:text-stone-700 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" /> Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/ai-chibi" className="hover:text-stone-700 transition-colors">Vẽ Chibi AI</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-700">Đặt Hàng</span>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8B4A8]/15 border border-[#E8B4A8]/30 text-[#e88d7b] text-xs font-black tracking-widest uppercase mb-4">
            <ShoppingBag className="w-3.5 h-3.5" />
            ĐẶT HÀNG FIGURE CHIBI 3D
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-2">
            Tùy Chỉnh Sản Phẩm Của Bạn
          </h1>
          <p className="text-sm text-stone-500">
            Chỉ vài bước đơn giản để biến ảnh Chibi thành mô hình 3D thực tế.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  {i === step && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#E8B4A8]/30"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all duration-300"
                    style={{
                      background:
                        i < step
                          ? "linear-gradient(135deg, #E8B4A8, #D4AF78)"
                          : i === step
                          ? "#E8B4A8"
                          : "rgba(0,0,0,0.06)",
                      color: i <= step ? "white" : "#999",
                      border: i === step ? "2px solid #E8B4A8" : "2px solid transparent",
                    }}
                  >
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                </div>
                <span
                  className="text-[10px] hidden sm:block font-bold"
                  style={{ color: i === step ? "#E8B4A8" : "#aaa" }}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-8 sm:w-14 h-0.5 mb-4 transition-all duration-500"
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

        {/* Card */}
        <div className="bg-white rounded-3xl border border-stone-200/60 shadow-xl overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78]" />

          <AnimatePresence mode="wait">
            {/* ─── Step 0: Chibi Image ─── */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-8 space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-stone-900 mb-1">Ảnh Chibi Của Bạn</h2>
                  <p className="text-sm text-stone-500">Xác nhận hoặc thay thế ảnh Chibi sẽ được in thành mô hình 3D.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-[#E8B4A8]/40 bg-stone-50 shadow-md shrink-0 flex items-center justify-center">
                    {chibiUrl ? (
                      <img src={chibiUrl} alt="Chibi preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-stone-300 gap-2 p-4 text-center">
                        <Sparkles className="w-10 h-10 stroke-1" />
                        <p className="text-xs font-medium text-stone-400">Chưa có ảnh Chibi</p>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    {chibiUrl ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                          <Check className="w-4 h-4" /> Đã có ảnh Chibi sẵn sàng in!
                        </div>
                        <p className="text-xs text-stone-500">Ảnh này sẽ được dùng làm phôi sản xuất mô hình 3D. Bạn có thể thay thế bằng ảnh khác nếu muốn.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-stone-700">Tải ảnh Chibi lên (tùy chọn)</p>
                        <p className="text-xs text-stone-400 leading-relaxed">Bạn có thể để trống — đội WEMO sẽ liên hệ để nhận ảnh sau khi đặt hàng thành công.</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl border border-[#E8B4A8]/40 text-[#e88d7b] text-xs font-black flex items-center gap-1.5 cursor-pointer hover:bg-[#E8B4A8]/5 transition-colors bg-white"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {chibiUrl ? "Thay Thế Ảnh" : "Tải Ảnh Lên"}
                      </button>
                      <Link
                        to="/ai-chibi"
                        className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-50 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Tạo Chibi AI
                      </Link>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleChibiUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Step 1: Product Config ─── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-8 space-y-7"
              >
                <div>
                  <h2 className="text-xl font-black text-stone-900 mb-1">Tùy Chỉnh Sản Phẩm</h2>
                  <p className="text-sm text-stone-500">Chọn thông số phù hợp — giá tự động cập nhật.</p>
                </div>

                {/* Size */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-stone-700 uppercase tracking-widest">
                    <Ruler className="w-3.5 h-3.5 text-[#E8B4A8]" /> Kích thước nhân vật
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {SIZE_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setConfig({ ...config, size: s.id as OrderConfig["size"] })}
                        className={`relative p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          config.size === s.id
                            ? "border-[#E8B4A8] bg-[#E8B4A8]/5 shadow-md"
                            : "border-stone-150 bg-white hover:border-stone-300"
                        }`}
                      >
                        {s.recommended && (
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#D4AF78] text-white text-[9px] font-black whitespace-nowrap">
                            Phổ biến
                          </div>
                        )}
                        <div className="text-2xl mb-1">{s.emoji}</div>
                        <div className="font-black text-sm text-stone-900">{s.label}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5 leading-tight">{s.desc}</div>
                        <div className={`text-xs font-black mt-2 ${config.size === s.id ? "text-[#E8B4A8]" : "text-stone-500"}`}>
                          {formatPrice(s.price)}
                        </div>
                        {config.size === s.id && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#E8B4A8] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-stone-700 uppercase tracking-widest">
                    <Layers className="w-3.5 h-3.5 text-[#E8B4A8]" /> Số lượng nhân vật
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, quantity: Math.max(1, config.quantity - 1) })}
                      className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      −
                    </button>
                    <span className="text-2xl font-black text-stone-900 w-10 text-center">{config.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, quantity: Math.min(10, config.quantity + 1) })}
                      className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      +
                    </button>
                    <span className="text-xs text-stone-400 font-medium">(Tối đa 10 nhân vật)</span>
                  </div>
                </div>

                {/* Base */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-stone-700 uppercase tracking-widest">
                    <Layers className="w-3.5 h-3.5 text-[#E8B4A8]" /> Loại đế trưng bày
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {BASE_OPTIONS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setConfig({ ...config, base: b.id as OrderConfig["base"] })}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          config.base === b.id
                            ? "border-[#E8B4A8] bg-[#E8B4A8]/5 shadow-sm"
                            : "border-stone-150 bg-white hover:border-stone-300"
                        }`}
                      >
                        <div className="text-xl mb-1">{b.emoji}</div>
                        <div className="font-bold text-xs text-stone-800">{b.label}</div>
                        <div className={`text-[10px] font-black mt-1 ${config.base === b.id ? "text-[#E8B4A8]" : "text-stone-400"}`}>
                          {b.price > 0 ? `+${formatPrice(b.price)}` : "Miễn phí"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* LED */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-stone-700 uppercase tracking-widest">
                    <Zap className="w-3.5 h-3.5 text-[#E8B4A8]" /> Tùy chọn đèn LED
                  </label>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, led: !config.led })}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                      config.led
                        ? "border-[#E8B4A8] bg-[#E8B4A8]/5 shadow-sm"
                        : "border-stone-150 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <div className="text-sm font-bold text-stone-900">Đèn LED phát sáng</div>
                        <div className="text-xs text-stone-400">Hiệu ứng ánh sáng lấp lánh từ đế, dùng pin AAA</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black ${config.led ? "text-[#E8B4A8]" : "text-stone-400"}`}>
                        +{formatPrice(PRICES.led)}
                      </span>
                      <div className={`w-10 h-6 rounded-full transition-colors relative ${config.led ? "bg-[#E8B4A8]" : "bg-stone-200"}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${config.led ? "left-5" : "left-1"}`} />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Price Preview */}
                <motion.div
                  key={totalPrice}
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-stone-400 font-medium mb-1">Tổng dự kiến ({config.quantity} nhân vật)</p>
                      <p className="text-2xl font-black">{formatPrice(totalPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-400 font-medium mb-1">Đặt cọc ngay</p>
                      <p className="text-xl font-black text-[#E8B4A8]">{formatPrice(DEPOSIT)}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-stone-400">
                    Số tiền còn lại ({formatPrice(totalPrice - DEPOSIT)}) sẽ thanh toán khi nhận hàng.
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ─── Step 2: Contact Info ─── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-8 space-y-5"
              >
                <div>
                  <h2 className="text-xl font-black text-stone-900 mb-1">Thông Tin Giao Hàng</h2>
                  <p className="text-sm text-stone-500">Điền thông tin để WEMO liên hệ và giao sản phẩm.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#E8B4A8]" /> Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-stone-800 text-sm font-medium bg-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#E8B4A8]" /> Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        placeholder="0901 234 567"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-stone-800 text-sm font-medium bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#E8B4A8]" /> Email *
                      </label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        placeholder="email@example.com"
                        className={`w-full px-4 py-3 rounded-xl border outline-none text-stone-800 text-sm font-medium bg-white transition-colors ${
                          contact.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())
                            ? "border-rose-400 focus:border-rose-500"
                            : "border-stone-200 focus:border-[#E8B4A8]"
                        }`}
                      />
                      {contact.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()) && (
                        <p className="text-[10px] text-rose-500 font-medium mt-1">
                          Vui lòng nhập đúng định dạng email (ví dụ: email@example.com).
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E8B4A8]" /> Địa chỉ giao hàng *
                    </label>
                    <input
                      type="text"
                      value={contact.address}
                      onChange={(e) => setContact({ ...contact, address: e.target.value })}
                      placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-stone-800 text-sm font-medium bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#E8B4A8]" /> Ghi chú thêm
                    </label>
                    <textarea
                      value={contact.note}
                      onChange={(e) => setContact({ ...contact, note: e.target.value })}
                      placeholder="Yêu cầu đặc biệt, ghi chú cho đội sản xuất..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-stone-800 text-sm font-medium bg-white transition-colors resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Step 3: Confirm ─── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-8 space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-stone-900 mb-1">Xác Nhận Đơn Hàng</h2>
                  <p className="text-sm text-stone-500">Kiểm tra lại thông tin trước khi đặt cọc.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Product summary */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-3">
                    <h3 className="text-xs font-black text-stone-600 uppercase tracking-widest">Sản phẩm</h3>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: "Kích thước", value: config.size },
                        { label: "Số lượng", value: `${config.quantity} nhân vật` },
                        { label: "Loại đế", value: config.base === "none" ? "Không đế" : config.base === "mica" ? "Đế Mica" : "Đế Gỗ" },
                        { label: "Đèn LED", value: config.led ? "Có (+80,000đ)" : "Không" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-stone-500 text-xs">{label}</span>
                          <span className="text-stone-800 font-bold text-xs">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-stone-200">
                      <div className="flex justify-between">
                        <span className="text-xs font-black text-stone-700">Tổng cộng</span>
                        <span className="text-sm font-black text-stone-900">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer summary */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-3">
                    <h3 className="text-xs font-black text-stone-600 uppercase tracking-widest">Thông tin giao hàng</h3>
                    <div className="space-y-2">
                      {[
                        { icon: User, label: contact.name },
                        { icon: Phone, label: contact.phone },
                        ...(contact.email ? [{ icon: Mail, label: contact.email }] : []),
                        { icon: MapPin, label: contact.address },
                      ].map(({ icon: Icon, label }, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-stone-600">
                          <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#E8B4A8]" />
                          <span className="font-medium">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Deposit highlight */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#E8B4A8]/10 to-[#D4AF78]/10 border border-[#E8B4A8]/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-500 font-medium mb-1">Số tiền đặt cọc ngay</p>
                    <p className="text-2xl font-black text-stone-900">{formatPrice(DEPOSIT)}</p>
                    <p className="text-[10px] text-stone-400 mt-1">Còn lại {formatPrice(totalPrice - DEPOSIT)} thanh toán khi nhận hàng</p>
                  </div>
                  <div className="text-4xl">🔒</div>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="px-6 sm:px-8 pb-6 flex items-center justify-between border-t border-stone-100 pt-5">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-stone-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" /> Quay Lại
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (step === 0 && !canProceedStep0) ||
                  (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2)
                }
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-stone-800 to-stone-950 text-white text-xs font-black flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all hover:scale-102 shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              >
                Tiếp Tục <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white text-xs font-black flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all hover:scale-102 shadow-md disabled:opacity-50 disabled:scale-100"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</>
                ) : (
                  <>Đặt Cọc {formatPrice(DEPOSIT)} →</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
