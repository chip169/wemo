import { motion } from "motion/react";
import { Heart, Sparkles, Target, Compass, Gift } from "lucide-react";
import { useEffect } from "react";

export function AboutUsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const coreValues = [
    {
      icon: Target,
      title: "Sứ Mệnh",
      desc: "WEMO sinh ra để giúp mọi người lưu giữ và chia sẻ những câu chuyện, những cảm xúc chân thật nhất thông qua sự giao thoa giữa nghệ thuật thủ công tinh xảo và công nghệ chạm NFC hiện đại.",
    },
    {
      icon: Compass,
      title: "Tầm Nhìn",
      desc: "Trở thành nền tảng quà tặng trải nghiệm số hàng đầu Việt Nam, thay đổi thói quen tặng quà truyền thống thành một hành trình trải nghiệm số độc bản, lưu truyền ký ức vĩnh cửu.",
    },
    {
      icon: Heart,
      title: "Giá Trị Cốt Lõi",
      desc: "Đặt cảm xúc của khách hàng làm trung tâm. Sự tỉ mỉ trong từng hộp gỗ khắc tay và tính mượt mà của công nghệ là cam kết hàng đầu của WEMO đối với khách hàng.",
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-[#FCEBE7] overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 text-center px-4 max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wider uppercase"
            style={{ background: "rgba(232,180,168,0.2)", color: "#E8B4A8" }}
          >
            <Gift className="w-3.5 h-3.5" /> Về Chúng Tôi
          </span>
          <h1
            className="mb-6 text-4xl md:text-6xl font-bold tracking-tight leading-tight"
            style={{ color: "#1A1818" }}
          >
            Biến Mọi Món Quà Thành <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78]">
              Ký Ức Số Không Thể Quên
            </span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-zinc-600"
          >
            WEMO được xây dựng dựa trên niềm tin rằng mỗi món quà trao đi không chỉ chứa đựng vật chất, mà quan trọng hơn cả chính là những tâm tư, hình ảnh kỷ niệm và lời chúc chân thành từ người gửi.
          </p>
        </motion.div>
      </section>

      {/* Story section */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl p-8 md:p-12 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-[#E8B4A8]/10 flex items-center justify-center text-[#E8B4A8] mx-auto mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#1A1818]">
            Câu Chuyện Sáng Lập
          </h2>
          <p className="text-zinc-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-6">
            Ý tưởng về WEMO bắt nguồn khi chúng tôi nhận ra rằng những tấm thiệp giấy hay những món quà lưu niệm thông thường thường dễ bị cất sâu trong tủ kính và phủ bụi theo thời gian. Chúng tôi muốn tạo ra một điều gì đó khác biệt - một món quà có khả năng "sống dậy" khi chạm vào.
          </p>
          <p className="text-zinc-600 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            Hộp quà gỗ WEMO là sự kết hợp hoàn hảo giữa vân gỗ mộc mạc thủ công và chip NFC ẩn giấu bên trong. Khi người nhận đặt điện thoại lên, ngay lập tức một không gian 3D lãng mạn tràn ngập hình ảnh, nhạc nền và video của họ hiện ra. Đó là cách WEMO giúp bạn lưu giữ thanh xuân và tình yêu.
          </p>
        </motion.div>
      </section>

      {/* Core Values Grid */}
      <section className="max-w-5xl mx-auto px-4 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 + 0.3, duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-md rounded-3xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E8B4A8]/10 flex items-center justify-center text-[#E8B4A8] mx-auto mb-6">
                <val.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1818] mb-3">
                {val.title}
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
