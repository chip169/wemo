import { motion } from "motion/react";
import { HelpCircle, Smartphone, Sliders, Image, MessageSquare, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export function SupportCenterPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const supportCards = [
    {
      icon: Smartphone,
      title: "Quét NFC iPhone",
      desc: "Hướng dẫn cách quét chip NFC trên các dòng máy iPhone (từ iPhone 7 trở lên). Đảm bảo bật tính năng NFC Reader từ Control Center nếu máy yêu cầu.",
      link: "/tutorials",
    },
    {
      icon: Sliders,
      title: "Quét NFC Android",
      desc: "Hướng dẫn bật kết nối NFC trong Cài đặt của điện thoại Samsung, Oppo, Xiaomi,... và vị trí đặt chip NFC ở mặt lưng thiết bị.",
      link: "/tutorials",
    },
    {
      icon: Image,
      title: "Lỗi tải Ảnh/Video",
      desc: "Cách giải quyết vấn đề khi hình ảnh kỷ niệm hoặc video lời chúc tải lên bị chậm hoặc lỗi định dạng. Định dạng hỗ trợ tốt nhất là MP4 và JPG.",
      link: "/faq",
    },
    {
      icon: MessageSquare,
      title: "Yêu cầu Hỗ trợ trực tiếp",
      desc: "Gửi thông tin thắc mắc kỹ thuật của bạn cho ban quản trị WEMO để được đội ngũ chuyên viên tư vấn hỗ trợ khắc phục nhanh chóng.",
      link: "/contact",
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
            <HelpCircle className="w-3.5 h-3.5" /> Hỗ Trợ Khách Hàng
          </span>
          <h1
            className="mb-4 text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "#1A1818" }}
          >
            Trung Tâm Hỗ Trợ WEMO
          </h1>
          <p
            className="max-w-xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "#6B6B6B" }}
          >
            Bạn cần trợ giúp trong quá trình thiết lập quà tặng hoặc quét NFC? Chúng tôi luôn sẵn sàng đồng hành cùng bạn.
          </p>
        </motion.div>
      </section>

      {/* Main Grid */}
      <section className="max-w-5xl mx-auto px-4 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E8B4A8]/10 flex items-center justify-center text-[#E8B4A8] mb-6">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1818] mb-3">
                  {card.title}
                </h3>
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-6">
                  {card.desc}
                </p>
              </div>
              <a
                href={card.link}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8B4A8] hover:text-[#D4AF78] transition-colors"
              >
                Xem chi tiết <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
