import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Check,
  ChevronRight,
  Home,
  Copy,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import confetti from "canvas-confetti";

const BANK_ID = "momo";
const ACCOUNT_NO = "PSG2628319600000026";
const ACCOUNT_NAME = "NGUYEN THI YEN NHI";
const POLL_INTERVAL_MS = 5000;
const COUNTDOWN_SECONDS = 15 * 60; // 15 minutes

const buildVietQRUrl = (orderId: string, amount: number) => {
  const addInfo = encodeURIComponent(`Thanh toan WEMO ${orderId}`);
  const accountName = encodeURIComponent(ACCOUNT_NAME);
  return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount || 0}&addInfo=${addInfo}&accountName=${accountName}`;
};

const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

export function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(() => {
    if (orderId) {
      try {
        const key = `wemo_payment_expiry_${orderId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          const expiry = parseInt(stored, 10);
          const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
          return remaining;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return COUNTDOWN_SECONDS;
  });
  const [paid, setPaid] = useState(false);
  const [polling, setPolling] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [qrError, setQrError] = useState(false);

  const pollRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);

  const checkPayment = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/orders/check-payment/${orderId}`);
      const data = await res.json();
      if (!res.ok) return;

      if (!orderData) setOrderData(data);

      if (data.deposited) {
        setPaid(true);
        setPolling(false);
        clearInterval(pollRef.current);
        clearInterval(countdownRef.current);

        // Confetti celebration!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#E8B4A8", "#D4AF78", "#ffffff", "#f9c3d3"],
        });

        // Redirect after 2.5s
        setTimeout(() => {
          navigate(`/order-success/${orderId}`);
        }, 2500);
      }
    } catch {
      // Silently ignore polling errors
    }
  };

  useEffect(() => {
    if (!orderId) return;

    // Set expiry in localStorage if not set yet
    try {
      const key = `wemo_payment_expiry_${orderId}`;
      const stored = localStorage.getItem(key);
      if (!stored) {
        const expiry = Date.now() + COUNTDOWN_SECONDS * 1000;
        localStorage.setItem(key, String(expiry));
      }
    } catch (e) {
      console.error(e);
    }

    // Initial fetch
    checkPayment();

    // Start polling
    pollRef.current = setInterval(checkPayment, POLL_INTERVAL_MS);

    // Countdown timer
    countdownRef.current = setInterval(() => {
      try {
        const key = `wemo_payment_expiry_${orderId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          const expiry = parseInt(stored, 10);
          const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
          setCountdown(remaining);
          if (remaining === 0) {
            clearInterval(countdownRef.current);
            setPolling(false);
          }
        } else {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              setPolling(false);
              return 0;
            }
            return prev - 1;
          });
        }
      } catch (e) {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            setPolling(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      clearInterval(pollRef.current);
      clearInterval(countdownRef.current);
    };
  }, [orderId]);

  const handleCopyInfo = (field: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const isExpired = countdown === 0 && !paid;
  const paymentAmount = orderData?.amount || orderData?.depositAmount || 0;

  return (
    <div className="min-h-screen bg-[#FCEBE7] pt-28 pb-16 font-sans relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#E8B4A8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-[#D4AF78]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
          <Link to="/" className="hover:text-stone-700 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" /> Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-700">Thanh Toán</span>
        </div>

        {/* Payment Success State */}
        <AnimatePresence>
          {paid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm mx-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <h2 className="text-xl font-black text-stone-900 mb-2">Thanh Toán Thành Công! 🎉</h2>
                <p className="text-sm text-stone-500 mb-4">Đang chuyển hướng đến trang xác nhận đơn hàng...</p>
                <Loader2 className="w-5 h-5 animate-spin text-[#E8B4A8] mx-auto" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8B4A8]/15 border border-[#E8B4A8]/30 text-[#e88d7b] text-xs font-black tracking-widest uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            THANH TOÁN AN TOÀN
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-2">
            Quét Mã VietQR Để Thanh Toán
          </h1>
          <p className="text-sm text-stone-500">
            Mã đơn hàng: <span className="font-black text-stone-800 font-mono">{orderId}</span>
          </p>
        </div>

        {isExpired ? (
          // Expired state
          <div className="bg-white rounded-3xl p-8 border border-stone-200/60 shadow-xl text-center space-y-5">
            <div className="text-5xl">⏰</div>
            <h2 className="text-xl font-black text-stone-900">Phiên thanh toán đã hết hạn</h2>
            <p className="text-sm text-stone-500">
              Bạn chưa hoàn tất chuyển khoản trong 15 phút. Đơn hàng vẫn được giữ, bạn có thể liên hệ WEMO để xác nhận thủ công hoặc đặt lại.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setCountdown(COUNTDOWN_SECONDS);
                  setPolling(true);
                  pollRef.current = setInterval(checkPayment, POLL_INTERVAL_MS);
                  countdownRef.current = setInterval(() => {
                    setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
                  }, 1000);
                }}
                className="px-5 py-3 rounded-xl bg-stone-900 text-white text-xs font-black flex items-center gap-2 justify-center cursor-pointer hover:opacity-90 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Gia hạn thêm 15 phút
              </button>
              <Link
                to="/order"
                className="px-5 py-3 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold flex items-center gap-2 justify-center hover:bg-stone-50 transition-colors"
              >
                Đặt đơn mới
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Countdown Banner */}
            <motion.div
              className={`flex items-center justify-between p-4 rounded-2xl border ${countdown < 120
                ? "bg-rose-50 border-rose-200"
                : countdown < 300
                  ? "bg-amber-50 border-amber-200"
                  : "bg-emerald-50 border-emerald-200"
                }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${countdown < 120 ? "text-rose-500" : countdown < 300 ? "text-amber-500" : "text-emerald-500"}`} />
                <span className={`text-xs font-bold ${countdown < 120 ? "text-rose-700" : countdown < 300 ? "text-amber-700" : "text-emerald-700"}`}>
                  Vui lòng chuyển khoản trong
                </span>
              </div>
              <span className={`text-lg font-black font-mono ${countdown < 120 ? "text-rose-600 animate-pulse" : countdown < 300 ? "text-amber-600" : "text-emerald-600"}`}>
                {formatCountdown(countdown)}
              </span>
            </motion.div>

            {/* Main QR Card */}
            <div className="bg-white rounded-3xl border border-stone-200/60 shadow-xl overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78]" />

              <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

                  {/* QR Code */}
                  <div className="flex flex-col items-center gap-3 shrink-0 w-full md:w-auto">
                    <div className="relative">
                      {!qrError ? (
                        <img
                          src={buildVietQRUrl(orderId || "", paymentAmount)}
                          alt="VietQR Payment Code"
                          className="w-56 h-56 rounded-2xl border-2 border-stone-200 object-contain bg-white p-2 shadow-xs"
                          onError={() => setQrError(true)}
                        />
                      ) : (
                        <div className="w-56 h-56 rounded-2xl border-2 border-stone-200 bg-white flex flex-col items-center justify-center p-2 shadow-xs">
                          <img
                            src="/assets/momo-qr.png"
                            alt="QR MoMo WEMO"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      {/* Polling indicator */}
                      {polling && (
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow" title="Đang kiểm tra thanh toán...">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-white" />
                          </motion.div>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 font-medium text-center">
                      Quét bằng MoMo hoặc app ngân hàng
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200/80">
                      <img
                        src="https://api.vietqr.io/img/momo.png"
                        alt="MoMo"
                        className="h-4.5 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <span className="text-xs font-bold text-[#A50064]">Ví / Quỹ MoMo</span>
                    </div>
                  </div>

                  {/* Transfer Info */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest">
                        Thông Tin Chuyển Khoản
                      </h3>
                      <span className="text-[10px] text-stone-400 font-medium">Chạm nút để sao chép</span>
                    </div>

                    {/* Ngân hàng & Tên chủ tài khoản */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                          Ngân hàng
                        </div>
                        <div className="text-sm font-black text-stone-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#A50064] shrink-0" />
                          MoMo
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                          Tên tài khoản
                        </div>
                        <div className="text-sm font-black text-stone-800 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                          {ACCOUNT_NAME}
                        </div>
                      </div>
                    </div>

                    {/* Số tài khoản */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
                          Số tài khoản
                        </div>
                        <div className="text-sm sm:text-base font-black text-stone-900 font-mono tracking-wide select-all whitespace-nowrap overflow-x-auto">
                          {ACCOUNT_NO}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyInfo("account", ACCOUNT_NO)}
                        className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 ${
                          copiedField === "account"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                            : "bg-white border-stone-200 hover:border-stone-300 text-stone-700 hover:bg-stone-100"
                        }`}
                        title="Sao chép số tài khoản"
                      >
                        {copiedField === "account" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-stone-400" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Số tiền thanh toán */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-[#E8B4A8]/10 border border-[#E8B4A8]/30 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-bold text-[#a65345] uppercase tracking-wider mb-0.5">
                          Số tiền thanh toán (100%)
                        </div>
                        <div className="text-lg sm:text-xl font-black text-[#5C352E]">
                          {paymentAmount > 0 ? formatPrice(paymentAmount) : "Đang tải..."}
                        </div>
                      </div>
                    </div>

                    {/* Nội dung chuyển khoản */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-amber-800/80 uppercase tracking-wider mb-0.5">
                          Nội dung chuyển khoản
                        </div>
                        <div className="text-xs sm:text-sm font-black text-amber-950 font-mono tracking-tight select-all whitespace-nowrap overflow-x-auto">
                          {`Thanh toan WEMO ${orderId}`}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyInfo("content", `Thanh toan WEMO ${orderId}`)}
                        className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 ${
                          copiedField === "content"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                            : "bg-white border-amber-200 hover:border-amber-300 text-amber-900 hover:bg-amber-100/50"
                        }`}
                        title="Sao chép nội dung chuyển khoản"
                      >
                        {copiedField === "content" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-amber-600" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Auto-detection notice */}
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <Smartphone className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed font-medium">
                        Hệ thống tự động nhận diện thanh toán. Sau khi chuyển khoản, trang sẽ <strong>tự động chuyển hướng</strong> sang màn hình hoàn tất đơn hàng.
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* Polling status bar */}
              <div className="px-6 sm:px-8 pb-5">
                <div className="flex items-center gap-2 justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 rounded-full bg-emerald-400"
                  />
                  <span className="text-[11px] text-stone-400 font-medium">
                    Đang kiểm tra trạng thái thanh toán... (tự động làm mới mỗi 5 giây)
                  </span>
                </div>
              </div>
            </div>

            {/* Important notes */}
            <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-black text-amber-800 uppercase tracking-wider">⚠️ Lưu ý quan trọng</p>
              <ul className="text-xs text-amber-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Nhập <strong>đúng nội dung chuyển khoản</strong> để hệ thống tự động xác nhận.</li>
                <li>Chuyển khoản <strong>đúng số tiền {paymentAmount > 0 ? formatPrice(paymentAmount) : ""} (100%)</strong> như hiển thị.</li>
                <li>Giữ lại màn hình này cho đến khi nhận được xác nhận.</li>
                <li>Nếu có vấn đề, liên hệ WEMO qua Zalo hoặc hotline để được hỗ trợ.</li>
              </ul>
            </div>

            {/* Mã đơn hàng */}
            <div className="text-center">
              <p className="text-xs text-stone-400 font-medium">
                Mã đơn hàng của bạn:{" "}
                <span className="font-black text-stone-700 font-mono">{orderId}</span>
                {" "}— Lưu lại để tra cứu đơn hàng.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
