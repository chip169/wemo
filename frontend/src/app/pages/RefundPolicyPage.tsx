import { motion } from "motion/react";
import { Receipt, RefreshCcw, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export function RefundPolicyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const policies = [
    {
      icon: RefreshCcw,
      title: "1. Đổi Trả Sản Phẩm Lỗi",
      content:
        "WEMO hỗ trợ đổi mới 1-đổi-1 hoàn toàn miễn phí trong vòng 7 ngày kể từ ngày nhận hàng đối với các sản phẩm hộp quà vật lý NFC bị lỗi do nhà sản xuất (như: chip NFC không phản hồi, lỗi in khắc mặt ngoài, hoặc hộp gỗ bị nứt vỡ trong quá trình vận chuyển).",
    },
    {
      icon: AlertCircle,
      title: "2. Trường Hợp Không Áp Dụng",
      content:
        "Chúng tôi không hỗ trợ hoàn tiền hoặc đổi trả đối với các lỗi phát sinh do người dùng sử dụng sai cách (làm ướt hộp gỗ, va đập mạnh làm hỏng chip NFC bên trong), hoặc sau khi quà tặng số đã được kích hoạt thành công trên hệ thống mà không có lỗi kỹ thuật.",
    },
    {
      icon: Sparkles,
      title: "3. Quy Trình Yêu Cầu Đổi Trả",
      content:
        "Khi phát hiện sản phẩm bị lỗi, vui lòng liên hệ ngay với đội ngũ CSKH của WEMO qua Zalo, Fanpage hoặc Email kèm theo video mở hộp sản phẩm và mô tả lỗi kỹ thuật. Chúng tôi sẽ xử lý và gửi sản phẩm thay thế trong vòng 2 - 3 ngày làm việc.",
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-[#FCEBE7]">
      {/* Hero Header */}
      <section className="py-16 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wider uppercase"
            style={{ background: "rgba(232,180,168,0.2)", color: "#E8B4A8" }}
          >
            <Receipt className="w-3.5 h-3.5" /> Pháp Lý WEMO
          </span>
          <h1
            className="mb-4 text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "#1A1818" }}
          >
            Chính Sách Hoàn Tiền & Đổi Trả
          </h1>
          <p
            className="max-w-xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "#6B6B6B" }}
          >
            WEMO luôn nỗ lực mang lại trải nghiệm quà tặng trọn vẹn nhất. Chúng tôi cam kết bảo vệ quyền lợi mua sắm của bạn.
          </p>
        </motion.div>
      </section>

      {/* Main Content Card */}
      <section className="max-w-3xl mx-auto px-4 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl p-8 md:p-12"
        >
          <div className="space-y-10">
            {policies.map((policy, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#E8B4A8]/10 flex items-center justify-center flex-shrink-0 text-[#E8B4A8]">
                  <policy.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-[#1A1818]">
                    {policy.title}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
                    {policy.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#E8B4A8]/20 flex items-center gap-3 bg-[#E8B4A8]/5 rounded-2xl p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-xs text-zinc-600 font-medium">
              Mọi thắc mắc về đơn hàng, vui lòng gửi phản hồi về địa chỉ email support@wemo.vn để được hỗ trợ tốt nhất.
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
