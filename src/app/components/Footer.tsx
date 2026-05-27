import { motion } from "motion/react";
import { Heart, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export function Footer() {
  const footerLinks = {
    "Sản Phẩm": [
      { name: "Tính Năng", href: "#" },
      { name: "Mẫu Thiết Kế", href: "#" },
      { name: "Bảng Giá", href: "#" },
      { name: "Cách Hoạt Động", href: "#" },
      { name: "Ví Dụ", href: "#" },
    ],
    "Công Ty": [
      { name: "Về Chúng Tôi", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Tuyển Dụng", href: "#" },
      { name: "Bộ Truyền Thông", href: "#" },
      { name: "Liên Hệ", href: "#" },
    ],
    "Hỗ Trợ": [
      { name: "Trung Tâm Hỗ Trợ", href: "#" },
      { name: "Video Hướng Dẫn", href: "#" },
      { name: "Câu Hỏi Thường Gặp", href: "#" },
      { name: "Tài Liệu API", href: "#" },
      { name: "Trạng Thái", href: "#" },
    ],
    "Pháp Lý": [
      { name: "Chính Sách Bảo Mật", href: "#" },
      { name: "Điều Khoản Dịch Vụ", href: "#" },
      { name: "Chính Sách Cookie", href: "#" },
      { name: "GDPR", href: "#" },
      { name: "Chính Sách Hoàn Tiền", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer className="relative pt-20 pb-10" style={{ background: "#1A1818" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
                  }}
                >
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <span
                  className="font-bold"
                  style={{
                    fontSize: "1.5rem",
                    color: "white",
                  }}
                >
                  WEMO
                </span>
              </div>

              <p
                className="mb-6 max-w-sm"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 1.6,
                }}
              >
                Biến mỗi món quà thành ký ức số không thể quên. Tạo ra những
                trải nghiệm cảm xúc tồn tại mãi mãi.
              </p>

              {/* Social links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.7)",
                      transition: "all 0.3s",
                    }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links], colIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: colIndex * 0.1 }}
            >
              <h4 className="font-semibold mb-4" style={{ color: "white" }}>
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:translate-x-1 inline-block transition-transform"
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <p
            style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.875rem" }}
          >
            © 2026 WEMO. Bảo lưu mọi quyền. Được tạo với{" "}
            <Heart
              className="w-3 h-3 inline fill-current"
              style={{ color: "#E8B4A8" }}
            />{" "}
            cho những kết nối ý nghĩa.
          </p>
          <div className="flex gap-6">
            {["Bảo Mật", "Điều Khoản", "Cookie"].map((item, i) => (
              <a
                key={i}
                href="#"
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "0.875rem",
                }}
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
