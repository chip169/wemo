import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Sparkles, Loader2, Eye, X } from "lucide-react";
import { adminFetch } from "../../utils/api";

interface Template {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  usageCount: number;
  status: string;
  preview: string;
  videoUrl?: string;
  sampleMessage?: string;
  photos?: string[];
  features?: string[];
}

export function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Edit Modal States
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editName, setEditName] = useState("");
  const [editPreview, setEditPreview] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editSampleMessage, setEditSampleMessage] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCategoryLabel, setEditCategoryLabel] = useState("");
  const [editStatus, setEditStatus] = useState("");
  
  // Lists states
  const [editPhotos, setEditPhotos] = useState<string[]>([]);
  const [editFeatures, setEditFeatures] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const startEdit = (template: Template) => {
    setEditingTemplate(template);
    setEditName(template.name || "");
    setEditPreview(template.preview || "");
    setEditVideoUrl(template.videoUrl || "");
    setEditSampleMessage(template.sampleMessage || "");
    setEditCategory(template.category || "");
    setEditCategoryLabel(template.categoryLabel || "");
    setEditStatus(template.status || "active");
    setEditPhotos(template.photos || []);
    setEditFeatures(template.features || []);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.8));
            } else {
              resolve(event.target?.result as string);
            }
          };
          img.src = event.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Không thể đọc tệp"));
        reader.readAsDataURL(file);
      });

      const res = await adminFetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({
          file: base64,
          fileName: file.name.replace(/\.[^/.]+$/, "") + ".jpg",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tải ảnh lên thất bại.");
      setEditPreview(data.url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Photos List handlers
  const handleAddPhotoField = () => {
    setEditPhotos([...editPhotos, ""]);
  };

  const handlePhotoUrlChange = (idx: number, val: string) => {
    const updated = [...editPhotos];
    updated[idx] = val;
    setEditPhotos(updated);
  };

  const handleRemovePhoto = (idx: number) => {
    setEditPhotos(editPhotos.filter((_, i) => i !== idx));
  };

  const handleSamplePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.8));
            } else {
              resolve(event.target?.result as string);
            }
          };
          img.src = event.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Không thể đọc tệp"));
        reader.readAsDataURL(file);
      });

      const res = await adminFetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({
          file: base64,
          fileName: `sample-${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.jpg`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tải ảnh mẫu thất bại.");
      
      const updated = [...editPhotos];
      updated[idx] = data.url;
      setEditPhotos(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Features List handlers
  const handleAddFeatureField = () => {
    setEditFeatures([...editFeatures, ""]);
  };

  const handleFeatureChange = (idx: number, val: string) => {
    const updated = [...editFeatures];
    updated[idx] = val;
    setEditFeatures(updated);
  };

  const handleRemoveFeature = (idx: number) => {
    setEditFeatures(editFeatures.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setSaving(true);
    try {
      const res = await adminFetch(`/api/templates/${editingTemplate.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editName,
          preview: editPreview,
          videoUrl: editVideoUrl,
          sampleMessage: editSampleMessage,
          category: editCategory,
          categoryLabel: editCategoryLabel,
          status: editStatus,
          photos: editPhotos.filter((url) => url.trim() !== ""),
          features: editFeatures.filter((feat) => feat.trim() !== ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi khi cập nhật mẫu thiết kế.");
      
      fetchTemplates();
      setEditingTemplate(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto md:mx-0">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              style={{
                background: "white",
                border: "1px solid #E5E7EB",
              }}
            >
              {/* Preview image */}
              <div className="relative h-48 overflow-hidden bg-stone-100 flex-shrink-0">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Template details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: 650, color: "#111827", lineHeight: 1.3 }}>
                        {template.name}
                      </h3>
                      <p style={{ fontSize: "0.75rem", color: "#8B5CF6", fontWeight: 600, marginTop: "2px" }}>
                        Mã: {template.id}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-500 font-semibold border flex-shrink-0">
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
                </div>

                {/* Actions */}
                <div className="pt-4 grid grid-cols-2 gap-3 border-t border-stone-100">
                  <a
                    href={"/admin/preview/" + template.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-bold bg-[#E8B4A8]/10 text-[#E8B4A8] rounded-xl hover:bg-[#E8B4A8]/20 transition-all cursor-pointer no-underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem thử 3D
                  </a>
                  <button
                    onClick={() => startEdit(template)}
                    className="flex items-center justify-center gap-1 px-3 py-2.5 text-xs font-bold bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-all cursor-pointer border-0"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex justify-between items-center mb-2 border-b pb-3 flex-shrink-0">
              <h3 className="text-lg font-black text-stone-800">
                Chỉnh sửa Mẫu thiết kế
              </h3>
              <button
                onClick={() => setEditingTemplate(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 border-0 cursor-pointer text-stone-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Tên mẫu thiết kế *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Ảnh đại diện mẫu *
                </label>
                <div className="flex items-center gap-3">
                  {editPreview && (
                    <img
                      src={editPreview}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover border"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      required
                      value={editPreview}
                      onChange={(e) => setEditPreview(e.target.value)}
                      placeholder="Nhập đường dẫn URL ảnh..."
                      className="w-full px-4 py-2 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-[11px] transition-colors"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs text-stone-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#E8B4A8]/10 file:text-[#E8B4A8] hover:file:bg-[#E8B4A8]/20 cursor-pointer"
                    />
                    {uploadingImage && (
                      <span className="text-[10px] text-stone-400 font-medium block">
                        Đang tải ảnh lên...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Video mẫu thiết kế (URL)
                </label>
                <input
                  type="text"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  placeholder="Nhập link video mô phỏng (Youtube hoặc mp4)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Nội dung / Tin nhắn mặc định *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editSampleMessage}
                  onChange={(e) => setEditSampleMessage(e.target.value)}
                  placeholder="Tin nhắn mẫu cảm xúc hiển thị..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs resize-none transition-colors"
                />
              </div>

              {/* Sample Photos List */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Danh sách ảnh mẫu của thiệp ({editPhotos.length} ảnh)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPhotoField}
                    className="px-2.5 py-1 bg-[#E8B4A8]/10 text-[#E8B4A8] rounded-lg text-[10px] font-bold border-0 cursor-pointer hover:bg-[#E8B4A8]/20 transition-colors"
                  >
                    + Thêm ảnh mẫu
                  </button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto p-2 border border-stone-200/60 rounded-xl no-scrollbar bg-stone-50">
                  {editPhotos.length === 0 ? (
                    <div className="text-center py-4 text-[10px] text-stone-400 font-medium">Chưa có ảnh mẫu nào.</div>
                  ) : (
                    editPhotos.map((url, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border">
                        {url ? (
                          <img
                            src={url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] text-stone-400 font-medium flex-shrink-0">Ảnh</div>
                        )}
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => handlePhotoUrlChange(idx, e.target.value)}
                            placeholder="Đường dẫn URL ảnh mẫu..."
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 outline-none focus:border-[#E8B4A8] text-[10px] transition-colors"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSamplePhotoUpload(e, idx)}
                            className="text-[10px] text-stone-500 file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[9px] file:font-semibold file:bg-[#E8B4A8]/10 file:text-[#E8B4A8] hover:file:bg-[#E8B4A8]/20 cursor-pointer"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center border-0 cursor-pointer transition-colors flex-shrink-0 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Features List */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Tính năng nổi bật ({editFeatures.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFeatureField}
                    className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-[10px] font-bold border-0 cursor-pointer hover:bg-stone-200 transition-colors"
                  >
                    + Thêm dòng
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-stone-200/60 rounded-xl no-scrollbar bg-stone-50">
                  {editFeatures.length === 0 ? (
                    <div className="text-center py-4 text-[10px] text-stone-400 font-medium">Chưa có tính năng nào.</div>
                  ) : (
                    editFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleFeatureChange(idx, e.target.value)}
                          placeholder="Nhập dòng tính năng..."
                          className="flex-1 px-3 py-2 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center border-0 cursor-pointer transition-colors text-stone-600 font-bold flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Danh mục *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs transition-colors bg-white cursor-pointer"
                  >
                    <option value="romance">Tình yêu & Lãng mạn</option>
                    <option value="celebration">Sinh nhật & Lễ hội</option>
                    <option value="holiday">Ngày lễ & Giáng Sinh</option>
                    <option value="milestone">Kỷ niệm</option>
                    <option value="achievement">Thành tựu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Nhãn danh mục *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCategoryLabel}
                    onChange={(e) => setEditCategoryLabel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Trạng thái
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs transition-colors bg-white cursor-pointer"
                >
                  <option value="active">Hoạt động (Active)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
                </select>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition-colors cursor-pointer border-0"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-5 py-2.5 bg-gradient-to-r from-stone-800 to-stone-950 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer border-0"
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
