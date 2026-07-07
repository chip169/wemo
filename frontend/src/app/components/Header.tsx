import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Menu, X, Gift } from "lucide-react";
import { Link, useLocation } from "react-router";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();
  const navItems = [
    { name: "Tính Năng", href: "/features" },
    { name: "Mẫu Thiệp", href: "/templates" },
    { name: "Vẽ Chibi AI", href: "/ai-chibi" },
    { name: "Bảng Giá", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? "rgba(255, 255, 255, 0.85)" : "transparent",
        backdropFilter: isScrolled ? "blur(24px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(0, 0, 0, 0.05)" : "none",
        boxShadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.02)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src="/favicon.png"
                alt="WEMO Logo"
                className="w-10 h-10 object-contain"
              />
              <span
                className="font-black tracking-wider"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.65rem",
                  color: "#0A0A0A",
                }}
              >
                WEMO
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.div key={index} whileHover={{ y: -1 }}>
                  <Link
                    to={item.href}
                    className="font-medium text-sm transition-colors relative py-1"
                    style={{ color: isActive ? "#0A0A0A" : "#6B6B6B" }}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ background: "#E8B4A8" }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.98] webo-shimmer-shine-hover"
              style={{
                background: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
              }}
            >
              <Gift className="w-3.5 h-3.5" />
              Tạo Quà
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-stone-850" />
            ) : (
              <Menu className="w-6 h-6 text-stone-850" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-6 border-t border-stone-100"
          >
            <nav className="flex flex-col gap-4 pt-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="font-medium text-sm py-2"
                  style={{
                    color: location.pathname === item.href ? "#0A0A0A" : "#6B6B6B",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/create"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white w-full"
                style={{
                  background: "linear-gradient(135deg, #E8B4A8 0%, #D4AF78 100%)",
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Gift className="w-4 h-4" />
                Tạo Quà
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
