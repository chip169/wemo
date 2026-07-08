import { motion } from "motion/react";
import { FileText, Scale, UserCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export function TermsOfServicePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const sections = [
    {
      icon: Scale,
      title: "1. Thỏa Thuận Sử Dụng",
      content:
        "Khi truy cập và sử dụng dịch vụ của WEMO, bạn đồng ý tuân thủ các điều khoản dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.",
    },
    {
      icon: UserCheck,
      title: "2. Trách Nhiệm Nội Dung",
      content:
        "Bạn chịu hoàn toàn trách nhiệm đối với tất cả nội dung (hình ảnh, video, âm thanh, lời chúc) mà bạn tải lên nền tảng WEMO để tạo hộp quà. Bạn cam kết không tải lên các nội dung vi phạm bản quyền, nội dung phản cảm, thù thị, hoặc vi phạm pháp luật hiện hành.",
    },
    {
      icon: FileText,
      title: "3. Sở Hữu Trí Tuệ",
      content:
        "Mọi thiết kế giao diện, logo, nhãn hiệu, mã nguồn, và các mẫu thiết kế thiệp 3D trên hệ thống WEMO đều thuộc sở hữu độc quyền của WEMO. Bạn được cấp quyền sử dụng phi thương mại để gửi quà tặng cho người thân và bạn bè.",
    },
    {
      icon: AlertTriangle,
      title: "4. Giới Hạn Trách Nhiệm",
      content:
        "WEMO không chịu trách nhiệm đối với bất kỳ thiệt hại gián tiếp, vô ý hay hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng hộp quà NFC vật lý hoặc dịch vụ số đi kèm do lỗi kỹ thuật thiết bị của bên thứ ba.",
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
            style={{ background: "rgba(232,180,168,0.2)", color: "#A85B4C" }}
          >
            <Scale className="w-3.5 h-3.5" /> Pháp Lý WEMO
          </span>
          <h1
            className="mb-4 text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "#1A1818" }}
          >
            Điều Khoản Dịch Vụ
          </h1>
          <p
            className="max-w-xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "#6B6B6B" }}
          >
            Quy định và điều kiện sử dụng dịch vụ của chúng tôi để cùng tạo nên một môi trường kết nối văn minh, an toàn.
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
              Bằng việc đặt mua hoặc tạo hộp quà trên WEMO, bạn đồng ý tuân thủ đầy đủ các điều khoản nêu trên.
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
