import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export function ContactPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      // Hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const contactInfos = [
    {
      icon: Phone,
      title: "Hotline Hỗ Trợ",
      value: "0968.123.456",
      desc: "Hỗ trợ kỹ thuật & đặt mua (8:00 - 22:00 hàng ngày)",
    },
    {
      icon: Mail,
      title: "Email Liên Hệ",
      value: "support@wemo.vn",
      desc: "Phản hồi thông tin & đề xuất hợp tác doanh nghiệp",
    },
    {
      icon: MapPin,
      title: "Văn Phòng Đại Diện",
      value: "Tòa nhà WEMO, Cầu Giấy, Hà Nội",
      desc: "Trụ sở nghiên cứu & phát triển sản phẩm",
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
            <MessageSquare className="w-3.5 h-3.5" /> Liên Hệ
          </span>
          <h1
            className="mb-4 text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "#1A1818" }}
          >
            Kết Nối Với WEMO
          </h1>
          <p
            className="max-w-xl mx-auto text-base md:text-lg leading-relaxed text-zinc-600"
          >
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng gửi tin nhắn hoặc gọi điện trực tiếp cho chúng tôi. Đội ngũ WEMO luôn túc trực hỗ trợ bạn.
          </p>
        </motion.div>
      </section>

      {/* Main Grid: 2 Columns */}
      <section className="max-w-6xl mx-auto px-4 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Info Card */}
          <div className="lg:col-span-5 space-y-6">
            {contactInfos.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-3xl p-6 md:p-8 flex gap-4 items-start"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E8B4A8]/10 flex items-center justify-center text-[#E8B4A8] flex-shrink-0">
                  <info.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[#1A1818] text-xs font-bold uppercase tracking-widest mb-1">
                    {info.title}
                  </h4>
                  <p className="text-zinc-800 text-lg font-bold mb-1">
                    {info.value}
                  </p>
                  <p className="text-zinc-500 text-xs">
                    {info.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-7 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl p-8 md:p-10 relative overflow-hidden"
          >
            <h3 className="text-2xl font-bold mb-6 text-[#1A1818]">
              Gửi Tin Nhắn Cho WEMO
            </h3>

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>
                  Gửi lời nhắn thành công! Chúng tôi sẽ phản hồi lại cho bạn trong vòng 24 giờ tới.
                </span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-2">
                    Họ và Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-[#E8B4A8] bg-zinc-50/50 text-zinc-800 transition-colors text-sm"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-2">
                    Địa chỉ Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-[#E8B4A8] bg-zinc-50/50 text-zinc-800 transition-colors text-sm"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-2">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-[#E8B4A8] bg-zinc-50/50 text-zinc-800 transition-colors text-sm"
                    placeholder="09xx xxx xxx"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-2">
                    Chủ Đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-[#E8B4A8] bg-zinc-50/50 text-zinc-800 transition-colors text-sm"
                    placeholder="Yêu cầu hỗ trợ kỹ thuật..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-2">
                  Lời Nhắn Chi Tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:outline-none focus:border-[#E8B4A8] bg-zinc-50/50 text-zinc-800 transition-colors text-sm resize-none"
                  placeholder="Nhập nội dung thắc mắc của bạn..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E8B4A8] to-[#D4AF78] hover:shadow-lg text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Đang gửi..."
                ) : (
                  <>
                    Gửi Liên Hệ <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
