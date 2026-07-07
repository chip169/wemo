import { motion } from "motion/react";
import { Image, Video, Mic, Sparkles, Music, Clock, QrCode, Smartphone, Check } from "lucide-react";

const features = [
  {
    icon: Image,
    title: "Tải Ảnh Lên",
    description: "Thêm ảnh không giới hạn để tạo bộ sưu tập và trình chiếu ấn tượng. Hỗ trợ mọi định dạng ảnh phổ biến.",
    color: "#FFD4D4",
    details: ["Không giới hạn số lượng ảnh", "Bộ lọc và hiệu ứng tự động", "Trình chiếu slideshow đẹp mắt", "Tối ưu tốc độ tải"],
  },
  {
    icon: Video,
    title: "Tải Video Lên",
    description: "Chia sẻ video nhắn tin và những khoảnh khắc quý giá được ghi lại để người nhận xúc động.",
    color: "#E8B4A8",
    details: ["Hỗ trợ video HD", "Phát tự động mượt mà", "Chú thích video tùy chỉnh", "Tương thích mọi thiết bị"],
  },
  {
    icon: Mic,
    title: "Tin Nhắn Giọng Nói",
    description: "Ghi âm lời nhắn cá nhân phát ra đúng thời điểm hoàn hảo — tiếng nói thật sự chạm đến trái tim.",
    color: "#D4AF78",
    details: ["Ghi âm trực tiếp hoặc tải lên", "Phát tự động khi mở quà", "Hiệu ứng sóng âm đẹp mắt", "Lưu trữ vĩnh viễn"],
  },
  {
    icon: Sparkles,
    title: "Hoạt Ảnh Động",
    description: "Hiệu ứng chuyển cảnh đẹp mắt, pháo hoa confetti và các yếu tố tương tác tạo trải nghiệm wow.",
    color: "#FFD4D4",
    details: ["Confetti và pháo hoa", "Hiệu ứng chuyển trang mượt", "Hoạt ảnh nhập cảnh", "Tùy chỉnh màu sắc"],
  },
  {
    icon: Music,
    title: "Tích Hợp Âm Nhạc",
    description: "Thêm nhạc nền hoặc bài hát đặc biệt để tạo không khí cảm xúc hoàn hảo cho món quà.",
    color: "#E8B4A8",
    details: ["Tải nhạc từ thiết bị", "Nhạc nền tự động phát", "Điều chỉnh âm lượng", "Playlist nhiều bài"],
  },
  {
    icon: Clock,
    title: "Hộp Thời Gian",
    description: "Lên lịch tin nhắn được tiết lộ vào ngày và dịp quan trọng trong tương lai — bất ngờ hoàn hảo.",
    color: "#D4AF78",
    details: ["Đặt ngày mở khóa tương lai", "Thông báo nhắc nhở", "Nhiều lớp nội dung", "Bí mật cho đến ngày đó"],
  },
  {
    icon: QrCode,
    title: "Hỗ Trợ QR + NFC",
    description: "Hoạt động với cả thẻ NFC và mã QR truyền thống — không ai bị bỏ lại phía sau.",
    color: "#FFD4D4",
    details: ["Thẻ NFC tích hợp sẵn", "Mã QR dự phòng", "Quét bằng camera bình thường", "Hoạt động offline"],
  },
  {
    icon: Smartphone,
    title: "Thân Thiện Với Di Động",
    description: "Trải nghiệm hoàn hảo trên mọi thiết bị — không cần cài ứng dụng, chỉ cần chạm và tận hưởng.",
    color: "#E8B4A8",
    details: ["Không cần cài ứng dụng", "Giao diện responsive", "Tải nhanh trên 3G/4G", "Hỗ trợ iOS & Android"],
  },
];

export function FeaturesPage() {
  return (
    <div className="pt-20" style={{ background: "#FCEBE7" }}>
      {/* Hero */}
      <section className="py-20 text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
            style={{ background: "rgba(232,180,168,0.2)", color: "#E8B4A8" }}
          >
            Tính Năng
          </span>
          <h1
            className="mb-4"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, color: "#1A1818", lineHeight: 1.2 }}
          >
            Mọi Công Cụ Bạn Cần
          </h1>
          <p className="max-w-2xl mx-auto" style={{ fontSize: "1.125rem", color: "#6B6B6B", lineHeight: 1.6 }} whitespace-nowrap>
            Tạo những món quà kỹ thuật số ấn tượng với bộ tính năng mạnh mẽ — từ ảnh, video đến hộp thời gian bí ẩn.
          </p>
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="rounded-3xl p-8 flex gap-6"
              style={{
                background: "white",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: feature.color, boxShadow: `0 8px 20px ${feature.color}50` }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2" style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1A1818" }}>
                  {feature.title}
                </h3>
                <p className="mb-4" style={{ color: "#6B6B6B", lineHeight: 1.6, fontSize: "0.9375rem" }}>
                  {feature.description}
                </p>
                <ul className="space-y-1.5">
                  {feature.details.map((d, i) => (
                    <li key={i} className="flex items-center gap-2" style={{ fontSize: "0.875rem", color: "#1A1818" }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: feature.color }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl p-10 text-center text-white"
          style={{ background: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)" }}
        >
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h2 className="mb-3" style={{ fontSize: "2rem", fontWeight: 700 }}>
            Sẵn Sàng Tạo Ký Ức?
          </h2>
          <p className="mb-6 opacity-90" style={{ fontSize: "1.125rem" }}>
            Bắt đầu với gói Cơ Bản và nâng cấp bất cứ lúc nào.
          </p>
          <a
            href="/pricing"
            className="inline-block px-8 py-3 rounded-full font-semibold text-sm"
            style={{ background: "white", color: "#E8B4A8" }}
          >
            Xem Bảng Giá
          </a>
        </motion.div>
      </section>
    </div>
  );
}
