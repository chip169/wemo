import { useState } from "react";
import { motion } from "motion/react";
import { Lock, User, Heart } from "lucide-react";

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Đăng nhập thất bại.");
      }
      localStorage.setItem("wemo_admin_token", data.token);
      sessionStorage.setItem("admin_logged_in", "true");
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #FCEBE7 0%, #E6DFD5 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-white/70 border border-white/40 shadow-2xl backdrop-blur-md"
      >
        <div className="text-center mb-8">
          <img
            src="/favicon.png"
            alt="WEMO Logo"
            className="w-12 h-12 object-contain mx-auto mb-3"
          />
          <h2 className="text-2xl font-black text-stone-900">Quản Trị WEMO</h2>
          <p className="text-xs text-stone-500 mt-1">Đăng nhập để vào hệ thống quản lý SaaS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider pl-1">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 outline-none focus:border-[#E8B4A8] text-sm text-stone-800"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider pl-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 outline-none focus:border-[#E8B4A8] text-sm text-stone-800"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-medium pl-1">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-stone-800 to-stone-950 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 mt-2"
          >
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
