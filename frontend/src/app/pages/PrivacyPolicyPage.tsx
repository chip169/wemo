import { motion } from "motion/react";
import { Shield, Eye, Lock, FileText, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const sections = [
    {
      icon: Eye,
      title: "1. Thu Thập Thông Tin",
      content:
        "WEMO thu thập thông tin để cung cấp dịch vụ tốt hơn cho người dùng. Các thông tin này bao gồm: thông tin tài khoản (tên, email, số điện thoại), thông tin quà tặng (ảnh kỷ niệm, video nhắn gửi, ghi âm lời chúc), và thông tin kỹ thuật (địa chỉ IP, loại thiết bị quét NFC).",
    },
    {
      icon: Lock,
      title: "2. Bảo Mật & Lưu Trữ Dữ Liệu",
      content:
        "Chúng tôi sử dụng các công nghệ mã hóa tiên tiến (như mã hóa SSL/TLS) để đảm bảo dữ liệu quà tặng của bạn luôn được bảo mật tuyệt đối khi truyền tải và lưu trữ trên hệ thống máy chủ đám mây. Chỉ người nhận sở hữu hộp quà NFC vật lý hoặc mã QR tương ứng mới có quyền truy cập xem nội dung.",
    },
    {
      icon: Shield,
      title: "3. Cam Kết Không Chia Sẻ",
      content:
        "WEMO cam kết tuyệt đối không bán, trao đổi, chia sẻ thông tin cá nhân hay nội dung truyền tải trong hộp quà của bạn cho bên thứ ba vì bất kỳ mục đích thương mại nào mà không được sự đồng ý rõ ràng từ phía bạn.",
    },
    {
      icon: FileText,
      title: "4. Quyền Của Người Dùng",
      content:
        "Bạn có toàn quyền kiểm soát nội dung quà tặng của mình. Bạn có thể chỉnh sửa, cập nhật hoặc xóa vĩnh viễn hình ảnh, video, âm thanh trong bảng điều khiển WEMO bất cứ lúc nào. Khi bạn yêu cầu xóa, dữ liệu sẽ được hủy bỏ hoàn toàn trên hệ thống máy chủ của chúng tôi.",
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
            <Shield className="w-3.5 h-3.5" /> Pháp Lý WEMO
          </span>
          <h1
            className="mb-4 text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "#1A1818" }}
          >
            Chính Sách Bảo Mật
          </h1>
          <p
            className="max-w-xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "#6B6B6B" }}
          >
            Sự riêng tư và những kỷ niệm của bạn là tài sản quý giá nhất. WEMO cam kết bảo vệ chúng an toàn tuyệt đối.
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
            {sections.map((section, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#E8B4A8]/10 flex items-center justify-center flex-shrink-0 text-[#E8B4A8]">
                  <section.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-[#1A1818]">
                    {section.title}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#E8B4A8]/20 flex items-center gap-3 bg-[#E8B4A8]/5 rounded-2xl p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-xs text-zinc-600 font-medium">
              Chính sách này có hiệu lực từ ngày 1/1/2026 và được cập nhật định kỳ để đáp ứng tốt nhất các quy chuẩn bảo mật quốc tế.
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
