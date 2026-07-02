import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Loader2, Eye } from "lucide-react";
import { adminFetch } from "../../utils/api";

interface Template {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  usageCount: number;
  status: string;
  preview: string;
}

export function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchTemplates = () => {
    setLoading(true);
    adminFetch("/api/templates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Only display active templates currently available in system
  const filteredTemplates = templates.filter((template) => {
    return (
      template.status === "active" &&
      (categoryFilter === "all" || template.category.toLowerCase() === categoryFilter)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
            Quản lý Mẫu thiết kế
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}>
            Danh sách các mẫu thiệp 3D kỹ thuật số hiện tại trên hệ thống
          </p>
        </div>
      </div>

      {/* Filter */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg outline-none text-xs bg-stone-50 text-stone-700 font-semibold cursor-pointer border border-stone-200"
        >
          <option value="all">Tất cả danh mục</option>
          <option value="celebration">Sinh nhật & Lễ hội</option>
          <option value="romance">Tình yêu & Lãng mạn</option>
          <option value="holiday">Ngày lễ & Giáng Sinh</option>
          <option value="milestone">Kỷ niệm</option>
          <option value="achievement">Thành tựu</option>
        </select>
      </div>

      {/* Templates grid */}
      {loading ? (
        <div className="p-12 text-center text-stone-400 text-xs font-bold flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#E8B4A8]" />
          Đang tải danh sách mẫu...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="p-12 text-center text-stone-400 text-xs font-bold">
          Không tìm thấy mẫu thiết kế nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              style={{
                background: "white",
                border: "1px solid #E5E7EB",
              }}
            >
              {/* Preview image */}
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Template details */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 650, color: "#111827" }}>
                      {template.name}
                    </h3>
                    <p style={{ fontSize: "0.75rem", color: "#8B5CF6", fontWeight: 600, marginTop: "2px" }}>
                      Mã: {template.id}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-500 font-semibold border">
                    {template.categoryLabel}
                  </span>
                </div>

                <div
                  className="flex items-center gap-2 py-2 px-3 rounded-xl bg-stone-50"
                  style={{ border: "1px solid #F3F4F6" }}
                >
                  <div className="flex-1 text-center">
                    <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#E8B4A8" }}>
                      {template.usageCount || 0}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF", fontWeight: 600, marginTop: "1px" }}>
                      Lượt sử dụng hoạt động
                    </div>
                  </div>
                </div>

                {/* Preview Actions */}
                <div className="pt-2">
                  <a
                    href="/demo-thiep"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-[#E8B4A8] text-white rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-md no-underline decoration-transparent"
                  >
                    <Eye className="w-4 h-4" />
                    Xem thử mẫu 3D
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
