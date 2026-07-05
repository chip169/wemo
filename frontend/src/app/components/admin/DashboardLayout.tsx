import { useState, ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  ShoppingCart,
  Gift,
  Wifi,
  Layers,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  MessageSquare,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: "Tổng quan", icon: LayoutDashboard, id: "overview" },
  { name: "Đơn hàng", icon: ShoppingCart, id: "orders" },
  { name: "Quà tặng", icon: Gift, id: "gifts" },
  { name: "Thẻ NFC", icon: Wifi, id: "nfc" },
  { name: "Mẫu thiết kế", icon: Layers, id: "templates" },
  { name: "Khách hàng", icon: Users, id: "customers" },
  { name: "Hỗ trợ trực tuyến", icon: MessageSquare, id: "support" },
  { name: "Thống kê", icon: BarChart3, id: "analytics" },
  { name: "Cài đặt", icon: Settings, id: "settings" },
];

export function DashboardLayout({
  children,
  activePage,
  onPageChange,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("wemo_admin_theme");
    return saved === "dark";
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadSessions, setUnreadSessions] = useState<any[]>([]);

  // Synchronize document dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("wemo_admin_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("wemo_admin_theme", "light");
    }
  }, [darkMode]);

  // Connect to support chat to check for unread user messages
  useEffect(() => {
    const fetchUnreadSessions = () => {
      const token = localStorage.getItem("wemo_admin_token");
      fetch("/api/support/sessions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const unread = data.filter((s) => s.sender === "user");
            setUnreadSessions(unread);
          }
        })
        .catch(console.error);
    };

    fetchUnreadSessions();

    const eventSource = new EventSource("/api/support/stream?isAdmin=true");

    eventSource.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg && msg.type !== "connected") {
          if (msg.sender === "user") {
            setUnreadSessions((prev) => {
              if (!prev.some((s) => s.sessionId === msg.sessionId)) {
                return [...prev, { sessionId: msg.sessionId, lastMessage: msg.text }];
              }
              return prev.map((s) => 
                s.sessionId === msg.sessionId ? { ...s, lastMessage: msg.text } : s
              );
            });
          } else if (msg.sender === "admin") {
            setUnreadSessions((prev) => prev.filter((s) => s.sessionId !== msg.sessionId));
          }
        }
      } catch (err) {
        console.error("Layout SSE parsing error:", err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [activePage]);

  // Convert unread sessions into notifications list
  const notifications = unreadSessions.map((s) => ({
    id: s.sessionId,
    title: `Khách hàng [${s.sessionId}] nhắn tin`,
    message: s.lastMessage,
    unread: true,
    action: () => {
      onPageChange("support");
      setNotificationsOpen(false);
    }
  }));

  return (
    <div className="min-h-screen" style={{ background: darkMode ? "#09090b" : "#F9FAFB" }}>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          width: "280px",
          background: "white",
          borderRight: "1px solid #E5E7EB",
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center justify-between px-6"
          style={{ borderBottom: "1px solid #E5E7EB" }}
        >
          <div className="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="WEMO Logo"
              className="w-10 h-10 object-contain"
            />
            <span
              style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}
            >
              WEMO
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: isActive
                    ? "rgba(232, 180, 168, 0.1)"
                    : "transparent",
                  color: isActive ? "#E8B4A8" : "#6B7280",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ borderTop: "1px solid #E5E7EB" }}
        >
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "#E8B4A8" }}
              >
                <span style={{ color: "white", fontWeight: 600 }}>QT</span>
              </div>
              <div className="flex-1 text-left">
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  Quản trị viên
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  admin@wemo.vn
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* User menu dropdown */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-xl overflow-hidden"
                  style={{
                    background: "white",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4 text-gray-500" />
                    <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                      Tài khoản
                    </span>
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("wemo_admin_token");
                      sessionStorage.removeItem("admin_logged_in");
                      window.location.href = "/";
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-gray-500" />
                    <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                      Đăng xuất
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-[280px]">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between px-6"
          style={{
            background: "white",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Scrolling notification text replacing Search */}
          <div 
            className="hidden md:flex items-center overflow-hidden w-[600px] h-9 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl px-4 text-xs font-semibold mx-auto justify-center"
            style={{ maxWidth: "600px" }}
          >
            {unreadSessions.length > 0 ? (
              <div className="relative w-full overflow-hidden flex items-center">
                <div className="animate-marquee text-amber-800 dark:text-amber-200 font-bold flex items-center gap-2">
                  <span className="inline-flex w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>🔔 Có {unreadSessions.length} khách nhắn tin chưa trả lời:</span>
                  {unreadSessions.map((s, idx) => (
                    <span key={s.sessionId} className="ml-3">
                      [{s.sessionId}]: "{s.lastMessage}"{idx < unreadSessions.length - 1 ? " |" : ""}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Hệ thống hoạt động bình thường | Không có tin nhắn chưa đọc
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-600" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.length > 0 && (
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center animate-bounce"
                  >
                    {notifications.length}
                  </div>
                )}
              </button>

              {/* Notifications dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-80 rounded-xl shadow-xl overflow-hidden"
                    style={{
                      background: "white",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div
                      className="p-4"
                      style={{ borderBottom: "1px solid #E5E7EB" }}
                    >
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        Thông báo tin nhắn chưa đọc
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-stone-400 font-bold">
                          Không có tin nhắn chưa đọc nào.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={notif.action}
                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            style={{
                              borderBottom: "1px solid #F3F4F6",
                              background: "rgba(232, 180, 168, 0.05)",
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div
                                  style={{
                                    fontSize: "0.875rem",
                                    color: "#111827",
                                  }}
                                >
                                  {notif.title}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#6B7280",
                                    marginTop: "4px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {notif.message}
                                </div>
                              </div>
                              <div
                                className="w-2 h-2 rounded-full mt-1 bg-[#E8B4A8]"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
