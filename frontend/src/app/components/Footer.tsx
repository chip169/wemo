import { motion } from "framer-motion";
import { Heart, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

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
      href: "https://www.facebook.com/hieu.kimxuan.7",
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
    <footer className="relative w-full pt-24 pb-12 bg-gradient-to-b from-transparent via-[#D2B495]/40 to-[#C4A482] border-t border-[#B59471]/40">
      <div className="absolute -top-[110px] right-[12%] z-20 w-48 md:w-56 select-none pointer-events-none transition-all duration-300">
        <img
          src={bearImg}
          alt="Cute Teddy Bear 3D"
          className="w-full h-auto object-contain transform translate-y-[19px] drop-shadow-[0_15px_15px_rgba(74,59,43,0.35)] hover:scale-105 hover:translate-y-[8px] transition-all duration-500 ease-out"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main content grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">
          {/* Cột Thương hiệu WEMO */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-5 group cursor-pointer w-fit">
                <img
                  src="/favicon.png"
                  alt="WEMO Logo"
                  className="w-11 h-11 object-contain"
                />
                <span className="font-bold text-3xl tracking-wider text-[#E8B4A8]">
                  WEMO
                </span>
              </div>

              <p className="text-[#5C4839] text-[0.95rem] leading-relaxed mb-7 max-w-sm font-medium">
                Biến mỗi món quà thành ký ức số không thể quên. Tạo ra những
                trải nghiệm cảm xúc tồn tại mãi mãi.
              </p>

              {/* Mạng xã hội */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{
                      scale: 1.1,
                      y: -3,
                      color: social.color,
                      backgroundColor: "#ffffff",
                      boxShadow: "0 8px 16px rgba(74,55,40,0.15)",
                    }}
                    className="w-10 h-10 rounded-xl bg-white/70 text-[#7A6453] flex items-center justify-center border border-[#B59471]/40 transition-all duration-300 shadow-sm"
                    aria-label={social.label}
                  >
                    <social.icon className="w-[18px] h-[18px]" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Các cột danh mục Links */}
          {Object.entries(footerLinks).map(([category, links], colIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: colIndex * 0.05 }}
              className="col-span-1"
            >
              <h4 className="text-[#4A3728] font-bold text-[0.88rem] uppercase tracking-wider mb-5 pb-1 border-b border-[#4A3728]/10">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-[#5C4839] font-medium text-[0.92rem] hover:text-[#ffffff] flex items-center gap-1 group/item transition-colors duration-200"
                    >
                      <span className="bg-[#ffffff] w-0 h-[1.5px] group-hover/item:w-2 transition-all duration-300 inline-block rounded-full"></span>
                      <span className="group-hover/item:translate-x-0.5 transition-transform duration-200">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#4A3728]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#5C4839]/80 text-sm text-center sm:text-left font-medium">
            <a href="/adminWemo" className="cursor-default select-none hover:text-inherit">©</a> 2026 WEMO. Bảo lưu mọi quyền. Được tạo với{" "}
            <Heart className="w-3.5 h-3.5 inline text-white fill-white mx-0.5 animate-pulse" />{" "}
            cho những kết nối ý nghĩa.
          </p>

          <div className="flex gap-6">
            {["Bảo Mật", "Điều Khoản", "Cookie"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="text-[#5C4839]/80 text-sm hover:text-white transition-colors duration-200 relative group font-medium"
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
