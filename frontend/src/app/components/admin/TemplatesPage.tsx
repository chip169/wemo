import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Loader2,
  Eye,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Layers,
  Heart,
  TrendingUp,
  X,
} from "lucide-react";
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
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit Modal States
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editName, setEditName] = useState("");
  const [editPreview, setEditPreview] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editSampleMessage, setEditSampleMessage] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCategoryLabel, setEditCategoryLabel] = useState("");
  const [editStatus, setEditStatus] = useState("active");

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
        setTemplates(Array.isArray(data) ? data : []);
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

  const handleSyncTemplates = async () => {
    setSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await adminFetch("/api/templates/sync", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Lỗi khi đồng bộ kho thiệp.");
      }
      if (Array.isArray(data.templates)) {
        setTemplates(data.templates);
      } else {
        fetchTemplates();
      }
      setSyncFeedback({
        type: "success",
        message:
          data.message ||
          `Đã đồng bộ thành công ${data.count || 8} mẫu thiệp vào hệ thống!`,
      });
      setTimeout(() => setSyncFeedback(null), 5000);
    } catch (err: any) {
      console.error(err);
      setSyncFeedback({
        type: "error",
        message: err.message || "Không thể đồng bộ kho thiệp. Vui lòng thử lại.",
      });
      setTimeout(() => setSyncFeedback(null), 6000);
    } finally {
      setSyncing(false);
    }
  };

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEdit = (template: Template) => {
    setEditingTemplate(template);
    setEditName(template.name || "");
    setEditPreview(template.preview || "");
    setEditVideoUrl(template.videoUrl || "");
    setEditSampleMessage(template.sampleMessage || "");
    setEditCategory(template.category || "romance");
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

      setEditPreview(base64);
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

  const handleSamplePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
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

      const updated = [...editPhotos];
      updated[idx] = base64;
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

  // Filter templates flexibly
  const filteredTemplates = templates.filter((template) => {
    // 1. Status filter
    if (statusFilter !== "all" && template.status !== statusFilter) {
      return false;
    }

    // 2. Category filter
    if (categoryFilter !== "all") {
      const cat = (template.category || "").toLowerCase();
      if (categoryFilter === "love" || categoryFilter === "romance") {
        if (cat !== "love" && cat !== "romance") return false;
      } else if (categoryFilter === "birthday" || categoryFilter === "celebration") {
        if (cat !== "birthday" && cat !== "celebration") return false;
      } else if (categoryFilter === "anniversary" || categoryFilter === "milestone") {
        if (cat !== "anniversary" && cat !== "milestone") return false;
      } else if (categoryFilter === "holiday") {
        if (cat !== "holiday") return false;
      } else if (cat !== categoryFilter) {
        return false;
      }
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = template.name?.toLowerCase().includes(q);
      const matchId = template.id?.toLowerCase().includes(q);
      const matchLabel = template.categoryLabel?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchLabel) return false;
    }

    return true;
  });

  const totalUsage = templates.reduce(
    (sum, t) => sum + (Number(t.usageCount) || 0),
    0
  );
  const activeCount = templates.filter((t) => t.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
              Kho Mẫu Thiệp 3D
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8B4A8]/20 text-[#A85848] border border-[#E8B4A8]/40">
              {templates.length} mẫu
            </span>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}>
            Quản lý và đồng bộ toàn bộ kho thiệp 3D kỹ thuật số của hệ thống Wemo
          </p>
        </div>

        {/* Sync Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncTemplates}
            disabled={syncing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-60 transition-all shadow-md hover:shadow-lg cursor-pointer border-0 active:scale-95"
            title="Đồng bộ danh sách thiệp từ file master data sang cơ sở dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin text-[#E8B4A8]" : ""}`} />
            {syncing ? "Đang đồng bộ kho thiệp..." : "Đồng bộ kho thiệp"}
          </button>
        </div>
      </div>

      {/* Sync Feedback Alert */}
      {syncFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold ${
            syncFeedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {syncFeedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{syncFeedback.message}</span>
          </div>
          <button
            onClick={() => setSyncFeedback(null)}
            className="text-stone-400 hover:text-stone-600 font-bold border-0 bg-transparent cursor-pointer"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Tổng số mẫu thiệp
            </p>
            <p className="text-2xl font-black text-stone-800 mt-1">
              {templates.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Đang hoạt động
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {activeCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Lượt tạo thiệp
            </p>
            <p className="text-2xl font-black text-[#A85848] mt-1">
              {totalUsage}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#A85848] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="rounded-2xl p-4 bg-white border border-stone-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên mẫu, mã ID (vd: solid-heart, hoa hồng)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 placeholder:text-stone-400 outline-none focus:border-[#E8B4A8] bg-stone-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 border-0 bg-transparent text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl outline-none text-xs bg-stone-50 text-stone-700 font-semibold cursor-pointer border border-stone-200 hover:border-stone-300 transition-colors"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="love">Tình yêu & Lãng mạn</option>
            <option value="birthday">Sinh nhật & Lời chúc</option>
            <option value="anniversary">Kỷ niệm & Dạ khúc Vũ trụ</option>
            <option value="holiday">Ngày lễ & Dịp đặc biệt</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl outline-none text-xs bg-stone-50 text-stone-700 font-semibold cursor-pointer border border-stone-200 hover:border-stone-300 transition-colors"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm ẩn</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="p-16 text-center text-stone-400 text-xs font-bold flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#E8B4A8]" />
          Đang tải kho mẫu thiệp Wemo...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-800">
              Không tìm thấy mẫu thiệp nào
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm">
              Không có mẫu thiệp nào khớp với bộ lọc hiện tại. Bạn có thể nhấn nút "Đồng bộ kho thiệp" để nạp lại đầy đủ các mẫu.
            </p>
          </div>
          <button
            onClick={handleSyncTemplates}
            disabled={syncing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-stone-900 text-white hover:bg-stone-800 transition-all cursor-pointer border-0"
          >
            <RefreshCw className="w-4 h-4" />
            Đồng bộ kho thiệp ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col bg-white border border-stone-200 group"
            >
              {/* Preview Image with Badges */}
              <div className="relative h-48 overflow-hidden bg-stone-100 flex-shrink-0">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border shadow-sm">
                  {template.status === "active" ? (
                    <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Hoạt động
                    </span>
                  ) : (
                    <span className="bg-stone-600 text-white px-2 py-0.5 rounded-full">
                      Tạm ẩn
                    </span>
                  )}
                </div>

                {/* Category Label */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/90 text-stone-800 backdrop-blur-md shadow-sm border border-white/50">
                  {template.categoryLabel || template.category}
                </div>

                {/* Usage Count pill */}
                <div className="absolute bottom-3 left-3 text-white flex items-center gap-1.5 text-xs font-bold drop-shadow">
                  <Heart className="w-3.5 h-3.5 fill-[#FF758F] text-[#FF758F]" />
                  <span>{template.usageCount || 0} lượt tạo</span>
                </div>
              </div>

              {/* Template Details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Title & ID with copy */}
                  <div>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-[#A85848] transition-colors leading-snug">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[11px] font-mono font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                        {template.id}
                      </span>
                      <button
                        onClick={(e) => handleCopyId(template.id, e)}
                        className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-100 border-0 bg-transparent cursor-pointer transition-colors"
                        title="Sao chép ID mẫu"
                      >
                        {copiedId === template.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sample message excerpt */}
                  {template.sampleMessage && (
                    <p className="text-xs text-stone-500 line-clamp-2 italic bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
                      "{template.sampleMessage}"
                    </p>
                  )}

                  {/* Features Chips */}
                  {template.features && template.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {template.features.slice(0, 3).map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-stone-100 text-stone-600 font-medium"
                        >
                          • {feat}
                        </span>
                      ))}
                      {template.features.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-stone-50 text-stone-400 font-semibold">
                          +{template.features.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 grid grid-cols-2 gap-2.5 border-t border-stone-100">
                  <a
                    href={"/adminWemo/preview/" + template.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold bg-[#E8B4A8]/15 text-[#A85848] rounded-xl hover:bg-[#E8B4A8]/25 transition-all cursor-pointer no-underline border border-[#E8B4A8]/30"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem thử 3D
                  </a>
                  <button
                    onClick={() => startEdit(template)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-all cursor-pointer border-0 shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex justify-between items-center mb-2 border-b pb-3 flex-shrink-0">
              <div>
                <h3 className="text-lg font-black text-stone-900">
                  Chỉnh sửa Mẫu: {editingTemplate.name}
                </h3>
                <p className="text-[11px] font-mono text-stone-400">
                  ID: {editingTemplate.id}
                </p>
              </div>
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
                      placeholder="Nhập đường dẫn URL ảnh bìa..."
                      className="w-full px-4 py-2 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-[11px] transition-colors"
                    />
                    <label className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E8B4A8]/10 text-[#A85848] hover:bg-[#E8B4A8]/20 cursor-pointer transition-all w-fit">
                      Chọn tệp ảnh từ máy
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
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
                  placeholder="Nhập link video demo nếu có..."
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
                    className="px-2.5 py-1 bg-[#E8B4A8]/10 text-[#A85848] rounded-lg text-[10px] font-bold border-0 cursor-pointer hover:bg-[#E8B4A8]/20 transition-colors"
                  >
                    + Thêm ảnh mẫu
                  </button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto p-2 border border-stone-200/60 rounded-xl no-scrollbar bg-stone-50">
                  {editPhotos.length === 0 ? (
                    <div className="text-center py-4 text-[10px] text-stone-400 font-medium">
                      Chưa có ảnh mẫu nào.
                    </div>
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
                          <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] text-stone-400 font-medium flex-shrink-0">
                            Ảnh
                          </div>
                        )}
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => handlePhotoUrlChange(idx, e.target.value)}
                            placeholder="Đường dẫn URL ảnh mẫu..."
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 outline-none focus:border-[#E8B4A8] text-[10px] transition-colors"
                          />
                          <label className="inline-block px-2 py-1 rounded-full text-[9px] font-semibold bg-[#E8B4A8]/10 text-[#A85848] hover:bg-[#E8B4A8]/20 cursor-pointer transition-all w-fit">
                            Chọn tệp ảnh
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSamplePhotoUpload(e, idx)}
                              className="hidden"
                            />
                          </label>
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
                    Điểm nổi bật / Tính năng ({editFeatures.length} mục)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFeatureField}
                    className="px-2.5 py-1 bg-[#E8B4A8]/10 text-[#A85848] rounded-lg text-[10px] font-bold border-0 cursor-pointer hover:bg-[#E8B4A8]/20 transition-colors"
                  >
                    + Thêm dòng
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-stone-200/60 rounded-xl no-scrollbar bg-stone-50">
                  {editFeatures.length === 0 ? (
                    <div className="text-center py-4 text-[10px] text-stone-400 font-medium">
                      Chưa có tính năng nào.
                    </div>
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
                    Danh mục mã *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs transition-colors bg-white cursor-pointer"
                  >
                    <option value="romance">romance (Tình yêu & Lãng mạn)</option>
                    <option value="love">love (Tình yêu & Đếm ngày)</option>
                    <option value="birthday">birthday (Sinh nhật & Lời chúc)</option>
                    <option value="anniversary">anniversary (Kỷ niệm & Dạ khúc)</option>
                    <option value="holiday">holiday (Ngày lễ & Dịp đặc biệt)</option>
                    <option value="celebration">celebration (Lễ hội)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Nhãn danh mục hiển thị *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCategoryLabel}
                    onChange={(e) => setEditCategoryLabel(e.target.value)}
                    placeholder="VD: Tình yêu & Lãng mạn"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Trạng thái hiển thị *
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs transition-colors bg-white cursor-pointer"
                >
                  <option value="active">Đang hoạt động (active)</option>
                  <option value="inactive">Tạm ẩn (inactive)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 disabled:opacity-50 cursor-pointer border-0 shadow-md"
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
