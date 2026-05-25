import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Heart, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();
  const navItems = [
    { name: "Tính Năng", href: "/features" },
    { name: "Mẫu", href: "/templates" },
    { name: "Bảng Giá", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? "var(--webo-glass-white)" : "transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.3)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
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
                  color: "#1A1818",
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
                <motion.div key={index} whileHover={{ y: -2 }}>
                  <Link
                    to={item.href}
                    className="font-medium transition-colors relative"
                    style={{ color: isActive ? "#E8B4A8" : "#1A1818" }}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                        style={{ background: "#E8B4A8" }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Desktop Navigation Spacer */}
          <div className="hidden md:block" />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" style={{ color: "#1A1818" }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: "#1A1818" }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-6"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="font-medium py-2"
                  style={{
                    color:
                      location.pathname === item.href ? "#E8B4A8" : "#1A1818",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
