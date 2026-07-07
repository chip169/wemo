import { motion } from "motion/react";
import { Heart, Instagram, Facebook } from "lucide-react";
import bearImg from "../assets/gau.png";

export function Footer() {
  const footerLinks = {
    "Sản Phẩm": [
      { name: "Tính Năng", href: "/features" },
      { name: "Mẫu Thiết Kế", href: "/templates" },
      { name: "Bảng Giá", href: "/pricing" },
      { name: "Tạo thiệp", href: "/create" },
    ],
    "Pháp Lý": [
      { name: "Chính Sách Bảo Mật", href: "#" },
      { name: "Điều Khoản Dịch Vụ", href: "#" },
      { name: "Chính Sách Hoàn Tiền", href: "#" },
    ],
    "Hỗ Trợ": [
      { name: "Trung Tâm Hỗ Trợ", href: "#" },
      { name: "Video Hướng Dẫn", href: "#" },
      { name: "Câu Hỏi Thường Gặp", href: "/faq" },
    ],
    "Công Ty": [
      { name: "Về Chúng Tôi", href: "/" },
      { name: "Liên Hệ", href: "/" },
    ],
  };

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com",
      label: "Instagram",
      color: "#E1306C",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/hieu.kimxuan.7",
      label: "Facebook",
      color: "#1877F2",
    },
  ];

  return (
    <footer className="relative w-full pt-28 pb-12 bg-[#0A0A0A] border-t border-stone-850 text-white overflow-hidden">
      
      {/* 3D Teddy Bear mascot peaking from footer */}
      <div className="absolute -top-[105px] right-[12%] z-20 w-44 md:w-52 select-none pointer-events-none transition-all duration-300">
        <img
          src={bearImg}
          alt="Cute Teddy Bear 3D"
          className="w-full h-auto object-contain transform translate-y-[15px] drop-shadow-[0_15px_15px_rgba(232,180,168,0.15)] hover:scale-105 hover:translate-y-[5px] transition-all duration-500 ease-out"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main content grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 mb-20">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2.5 mb-5 cursor-pointer w-fit">
                <img
                  src="/favicon.png"
                  alt="WEMO Logo"
                  className="w-9 h-9 object-contain"
                />
                <span className="font-black text-2xl tracking-wider text-white" style={{ fontFamily: "var(--font-display)" }}>
                  WEMO
                </span>
              </div>

              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm">
                Biến mỗi món quà thành ký ức số không thể quên. Tạo ra những trải nghiệm cảm xúc tồn tại mãi mãi.
              </p>

              {/* Social Channels */}
              <div className="flex gap-2.5">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                      borderColor: social.color,
                    }}
                    className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 flex items-center justify-center transition-all duration-300 shadow-sm"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links], colIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: colIndex * 0.05 }}
              className="col-span-1"
            >
              <h4 className="text-stone-400 font-bold text-xs uppercase tracking-wider mb-5">
                {category}
              </h4>
              <ul className="space-y-3.5">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-stone-500 text-xs sm:text-sm font-medium hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Footer bottom */}
        <div className="pt-8 border-t border-stone-850 flex flex-col sm:flex-row justify-between items-center gap-4 text-stone-500 text-xs">
          <p className="text-center sm:text-left font-medium">
            <a href="/adminWemo" className="cursor-default select-none hover:text-inherit">©</a> 2026 WEMO. Bảo lưu mọi quyền. Được tạo với{" "}
            <Heart className="w-3 h-3 inline text-[#E8B4A8] fill-[#E8B4A8] mx-0.5 animate-pulse" />{" "}
            cho những kết nối ý nghĩa.
          </p>

          <div className="flex gap-6 font-bold uppercase tracking-wider text-[10px]">
            {["Bảo Mật", "Điều Khoản", "Cookie"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
