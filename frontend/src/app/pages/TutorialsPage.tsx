import { motion } from "motion/react";
import { Video, HelpCircle, Smartphone, Award, Play } from "lucide-react";
import { useEffect } from "react";

export function TutorialsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const steps = [
    {
      step: "Bước 1",
      title: "Quét Chip NFC Hoặc QR Code",
      desc: "Chạm mặt lưng điện thoại của bạn vào vùng cảm biến NFC trên hộp quà WEMO. Đối với các dòng máy cũ, bạn có thể mở camera và quét mã QR Code đi kèm.",
      icon: Smartphone,
    },
    {
      step: "Bước 2",
      title: "Thiết Kế Quà Tặng Số",
      desc: "Trang web WEMO sẽ tự động mở ra. Bạn tiến hành tải ảnh kỷ niệm, video nhắn gửi, ghi âm lời chúc và chọn mẫu thiệp 3D (như Tinh Cầu Hồng, Trái Tim Lấp Lánh) tùy ý.",
      icon: Video,
    },
    {
      step: "Bước 3",
      title: "Hoàn Tất Và Lưu Giữ Mãi Mãi",
      desc: "Sau khi lưu, hộp quà NFC của bạn đã sẵn sàng! Bất cứ khi nào người nhận chạm điện thoại vào hộp quà, trang web kỷ niệm đầy cảm xúc sẽ hiển thị ngay lập tức.",
      icon: Award,
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
            <Video className="w-3.5 h-3.5" /> Hướng Dẫn Sử Dụng
          </span>
          <h1
            className="mb-4 text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "#1A1818" }}
          >
            Video Hướng Dẫn & Hướng Dẫn Nhanh
          </h1>
          <p
            className="max-w-xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "#6B6B6B" }}
          >
            Chỉ với 3 bước đơn giản, bạn có thể dễ dàng cá nhân hóa món quà kỹ thuật số của mình thông qua công nghệ chạm NFC.
          </p>
        </motion.div>
      </section>

      {/* Steps Visual Layout */}
      <section className="max-w-5xl mx-auto px-4 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-md rounded-3xl p-8 relative flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <span className="absolute -top-4 left-6 px-3 py-1 bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
                  {step.step}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#E8B4A8]/10 flex items-center justify-center text-[#E8B4A8] mt-4 mb-6">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1818] mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Youtube / Video Simulation Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl p-6 md:p-8 max-w-3xl mx-auto overflow-hidden"
        >
          <div className="relative aspect-video rounded-2xl bg-zinc-900 flex items-center justify-center overflow-hidden group cursor-pointer border border-[#E8B4A8]/20">
            <img
              src="https://alltop.vn/backend/media/images/posts/1395/Loi_chuc_ky_niem_1_nam_yeu_nhau-229426.jpg?w=800&auto=format,compress&q=85"
              alt="Tutorial Video Thumbnail"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
            <div className="relative z-10 w-20 h-20 rounded-full bg-white/20 border-2 border-white flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:bg-[#E8B4A8] group-hover:border-[#E8B4A8] transition-all duration-300 shadow-xl">
              <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
            </div>
            <div className="absolute bottom-4 left-6 right-6 text-left">
              <h4 className="text-white font-bold text-lg mb-1 drop-shadow-md">
                Video Hướng Dẫn Tạo Quà NFC WEMO Từ A-Z
              </h4>
              <p className="text-white/80 text-xs drop-shadow-sm font-medium">
                Thời lượng: 2 phút 15 giây • Xem cách thiệp 3D hiển thị thực tế
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
