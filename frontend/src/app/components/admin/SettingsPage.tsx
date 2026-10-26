import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Save, Globe, DollarSign, Database, Mail, Share2, Loader2 } from "lucide-react";
import { adminFetch } from "../../utils/api";

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States
  const [websiteName, setWebsiteName] = useState("WEMO - Nền tảng Quà tặng Kỹ thuật số");
  const [websiteUrl, setWebsiteUrl] = useState("https://wemo.vn");
  const [metaDescription, setMetaDescription] = useState("Tạo quà tặng kỹ thuật số cảm xúc với công nghệ chip NFC. Biến những kỷ niệm tuyệt đẹp thành trải nghiệm tương tác trực quan.");
  
  const [priceBasic, setPriceBasic] = useState("339.000đ");
  const [pricePremium, setPricePremium] = useState("469.000đ");
  const [priceBusiness, setPriceBusiness] = useState("Chiết khấu đến 30%");

  const [maxFileSize, setMaxFileSize] = useState(50);
  const [storageLimit, setStorageLimit] = useState(5);

  const [notifyOrder, setNotifyOrder] = useState(true);
  const [notifyGifts, setNotifyGifts] = useState(true);
  const [notifyViews, setNotifyViews] = useState(true);
  const [notifyPayment, setNotifyPayment] = useState(true);

  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");

  useEffect(() => {
    adminFetch("/api/settings")
      .then((res) => {
        if (res.ok) return res.json();
        return {};
      })
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          if (data.websiteName !== undefined) setWebsiteName(data.websiteName);
          if (data.websiteUrl !== undefined) setWebsiteUrl(data.websiteUrl);
          if (data.metaDescription !== undefined) setMetaDescription(data.metaDescription);
          if (data.priceBasic !== undefined) setPriceBasic(data.priceBasic);
          if (data.pricePremium !== undefined) setPricePremium(data.pricePremium);
          if (data.priceBusiness !== undefined) setPriceBusiness(data.priceBusiness);
          if (data.maxFileSize !== undefined) setMaxFileSize(Number(data.maxFileSize));
          if (data.storageLimit !== undefined) setStorageLimit(Number(data.storageLimit));
          if (data.notifyOrder !== undefined) setNotifyOrder(Boolean(data.notifyOrder));
          if (data.notifyGifts !== undefined) setNotifyGifts(Boolean(data.notifyGifts));
          if (data.notifyViews !== undefined) setNotifyViews(Boolean(data.notifyViews));
          if (data.notifyPayment !== undefined) setNotifyPayment(Boolean(data.notifyPayment));
          if (data.instagram !== undefined) setInstagram(data.instagram);
          if (data.twitter !== undefined) setTwitter(data.twitter);
          if (data.facebook !== undefined) setFacebook(data.facebook);
          if (data.tiktok !== undefined) setTiktok(data.tiktok);
        }
      })
      .catch((err) => console.error("Error fetching settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminFetch("/api/settings", {
        method: "POST",
        body: JSON.stringify({
          websiteName,
          websiteUrl,
          metaDescription,
          priceBasic,
          pricePremium,
          priceBusiness,
          maxFileSize,
          storageLimit,
          notifyOrder,
          notifyGifts,
          notifyViews,
          notifyPayment,
          instagram,
          twitter,
          facebook,
          tiktok
        })
      });
      if (res.ok) {
        alert("Lưu tất cả cài đặt thành công!");
      } else {
        alert("Có lỗi xảy ra khi lưu cài đặt.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối khi lưu cài đặt.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-stone-400 text-xs font-bold flex flex-col items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-[#E8B4A8]" />
        Đang nạp cài đặt hệ thống...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
          Cài đặt
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}>
          Cấu hình các tùy chọn cho bảng điều khiển WEMO
        </p>
      </div>

      {/* Website Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(232, 180, 168, 0.1)" }}
          >
            <Globe className="w-5 h-5" style={{ color: "#E8B4A8" }} />
          </div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}>
            Cấu hình Website
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Tên Website
            </label>
            <input
              type="text"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Đường dẫn Website URL
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Mô tả Meta Description
            </label>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none resize-none text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Pricing Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(16, 185, 129, 0.1)" }}
          >
            <DollarSign className="w-5 h-5" style={{ color: "#10B981" }} />
          </div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}>
            Gói Dịch Vụ & Bảng Giá
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "4px" }}>
              Standard (MB-LG-STD)
            </div>
            <input
              type="text"
              value={priceBasic}
              onChange={(e) => setPriceBasic(e.target.value)}
              className="w-full px-3 py-2 rounded-lg outline-none text-xs bg-stone-50 font-bold"
              style={{
                border: "1px solid #E5E7EB",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#111827",
              }}
            />
          </div>

          <div className="p-4 rounded-lg" style={{ border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "4px" }}>
              Premium (MB-LG-PRM)
            </div>
            <input
              type="text"
              value={pricePremium}
              onChange={(e) => setPricePremium(e.target.value)}
              className="w-full px-3 py-2 rounded-lg outline-none text-xs bg-stone-50 font-bold"
              style={{
                border: "1px solid #E5E7EB",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#111827",
              }}
            />
          </div>

          <div className="p-4 rounded-lg" style={{ border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "4px" }}>
              Doanh nghiệp / Sự kiện
            </div>
            <input
              type="text"
              value={priceBusiness}
              onChange={(e) => setPriceBusiness(e.target.value)}
              className="w-full px-3 py-2 rounded-lg outline-none text-xs bg-stone-50 font-bold"
              style={{
                border: "1px solid #E5E7EB",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#111827",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Storage Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(59, 130, 246, 0.1)" }}
          >
            <Database className="w-5 h-5" style={{ color: "#3B82F6" }} />
          </div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}>
            Cấu hình Dung lượng Lưu trữ
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>
                Dung lượng tệp tối đa (MB)
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>
                Kích thước tệp tải lên tối đa được cho phép
              </div>
            </div>
            <input
              type="number"
              value={maxFileSize}
              onChange={(e) => setMaxFileSize(Number(e.target.value))}
              className="w-24 px-3 py-2 rounded-lg outline-none text-right text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>
                Giới hạn dung lượng lưu trữ (GB)
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>
                Tổng dung lượng lưu trữ cho mỗi người dùng
              </div>
            </div>
            <input
              type="number"
              value={storageLimit}
              onChange={(e) => setStorageLimit(Number(e.target.value))}
              className="w-24 px-3 py-2 rounded-lg outline-none text-right text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Email Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(245, 158, 11, 0.1)" }}
          >
            <Mail className="w-5 h-5" style={{ color: "#F59E0B" }} />
          </div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}>
            Thông báo qua Email
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>
                Xác nhận đơn hàng
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>
                Gửi email xác nhận ngay khi đơn hàng được tạo
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={notifyOrder}
                onChange={(e) => setNotifyOrder(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-12 h-6 rounded-full peer-checked:bg-[#E8B4A8] transition-colors cursor-pointer"
                style={{ background: "#D1D5DB" }}
              />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>
                Quà tặng đã giao
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>
                Thông báo khi quà tặng kỹ thuật số đã sẵn sàng
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={notifyGifts}
                onChange={(e) => setNotifyGifts(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-12 h-6 rounded-full peer-checked:bg-[#E8B4A8] transition-colors cursor-pointer"
                style={{ background: "#D1D5DB" }}
              />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>
                Quà tặng đã mở
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>
                Thông báo khi người nhận thực hiện mở thiệp
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={notifyViews}
                onChange={(e) => setNotifyViews(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-12 h-6 rounded-full peer-checked:bg-[#E8B4A8] transition-colors cursor-pointer"
                style={{ background: "#D1D5DB" }}
              />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>
                Đã nhận thanh toán
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>
                Xác nhận giao dịch thanh toán thành công
              </div>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={notifyPayment}
                onChange={(e) => setNotifyPayment(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-12 h-6 rounded-full peer-checked:bg-[#E8B4A8] transition-colors cursor-pointer"
                style={{ background: "#D1D5DB" }}
              />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
            </label>
          </div>
        </div>
      </motion.div>

      {/* Social Media Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(139, 92, 246, 0.1)" }}
          >
            <Share2 className="w-5 h-5" style={{ color: "#8B5CF6" }} />
          </div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827" }}>
            Liên kết Mạng xã hội
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>
              Instagram
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/wemo"
              className="w-full px-4 py-2 rounded-lg outline-none text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>
              Twitter / X
            </label>
            <input
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://x.com/wemo"
              className="w-full px-4 py-2 rounded-lg outline-none text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>
              Facebook
            </label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/wemo"
              className="w-full px-4 py-2 rounded-lg outline-none text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>
              TikTok
            </label>
            <input
              type="text"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="https://tiktok.com/@wemo"
              className="w-full px-4 py-2 rounded-lg outline-none text-xs bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Save button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer disabled:opacity-60 transition-opacity"
          style={{
            background: "#E8B4A8",
            color: "white",
            fontWeight: 600,
          }}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang lưu cấu hình...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Lưu tất cả cấu hình
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
