import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Wifi,
  CheckCircle,
  Clock,
  Trash2,
  Sparkles,
  Plus,
  X,
  Loader2,
  Pencil,
  RefreshCw,
  Gift,
  Check,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { adminFetch } from "../../utils/api";

interface NFCTag {
  id: string;
  uid: string;
  status: "unassigned" | "assigned" | "inactive";
  giftId: string;
  lastTapped: string;
}

interface GiftItem {
  id: string;
  recipientName?: string;
  senderName?: string;
  title?: string;
  templateId?: string;
  createdAt?: string;
  orderId?: string;
}

const statusConfig = {
  unassigned: {
    bg: "#DCFCE7",
    text: "#16A34A",
    label: "Có sẵn",
    icon: CheckCircle,
  },
  assigned: {
    bg: "#DBEAFE",
    text: "#2563EB",
    label: "Đã gán",
    icon: Clock,
  },
  inactive: {
    bg: "#F3F4F6",
    text: "#6B7280",
    label: "Vô hiệu hóa",
    icon: Wifi,
  },
};

// Chuẩn sinh UID 7-byte hexa cho NFC (dòng chip NTAG213/215/216 bắt đầu với 04)
function generateRandomUID(): string {
  const hex = "0123456789ABCDEF";
  const bytes = ["04"];
  for (let i = 0; i < 6; i++) {
    const byte =
      hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
    bytes.push(byte);
  }
  return bytes.join(":");
}

export function NFCPage() {
  const [nfcTags, setNfcTags] = useState<NFCTag[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formUid, setFormUid] = useState("");
  const [formStatus, setFormStatus] = useState<"unassigned" | "assigned" | "inactive">("unassigned");
  const [formGiftId, setFormGiftId] = useState("");
  const [creating, setCreating] = useState(false);
  const [giftSearchCreate, setGiftSearchCreate] = useState("");
  const [showGiftDropdownCreate, setShowGiftDropdownCreate] = useState(false);

  // Edit Modal state
  const [editingTag, setEditingTag] = useState<NFCTag | null>(null);
  const [editUid, setEditUid] = useState("");
  const [editStatus, setEditStatus] = useState<"unassigned" | "assigned" | "inactive">("unassigned");
  const [editGiftId, setEditGiftId] = useState("");
  const [saving, setSaving] = useState(false);
  const [giftSearchEdit, setGiftSearchEdit] = useState("");
  const [showGiftDropdownEdit, setShowGiftDropdownEdit] = useState(false);

  const fetchNFCTags = () => {
    setLoading(true);
    adminFetch("/api/nfc")
      .then((res) => res.json())
      .then((data) => {
        setNfcTags(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchGifts = () => {
    adminFetch("/api/gifts")
      .then((res) => res.json())
      .then((data) => {
        setGifts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách quà tặng:", err);
      });
  };

  useEffect(() => {
    fetchNFCTags();
    fetchGifts();
  }, []);

  // Mở modal tạo mới với UID sinh ngẫu nhiên sẵn
  const openCreateModal = () => {
    setFormUid(generateRandomUID());
    setFormStatus("unassigned");
    setFormGiftId("");
    setGiftSearchCreate("");
    setShowGiftDropdownCreate(false);
    setIsCreateOpen(true);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (tag: NFCTag) => {
    setEditingTag(tag);
    setEditUid(tag.uid);
    setEditStatus(tag.status);
    setEditGiftId(tag.giftId || "");
    setGiftSearchEdit("");
    setShowGiftDropdownEdit(false);
  };

  // Xử lý tạo mới
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUid.trim()) return;

    setCreating(true);
    const body = {
      uid: formUid.trim(),
      status: formGiftId.trim() ? "assigned" : formStatus,
      giftId: formGiftId.trim(),
    };

    adminFetch("/api/nfc", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        setCreating(false);
        if (data.error) {
          alert(data.error);
        } else {
          setIsCreateOpen(false);
          fetchNFCTags();
        }
      })
      .catch((err) => {
        console.error(err);
        setCreating(false);
        alert("Lỗi hệ thống khi thêm thẻ NFC.");
      });
  };

  // Xử lý lưu chỉnh sửa
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag || !editUid.trim()) return;

    setSaving(true);
    const body = {
      uid: editUid.trim(),
      status: editGiftId.trim() ? "assigned" : editStatus,
      giftId: editGiftId.trim(),
    };

    adminFetch(`/api/nfc/${editingTag.id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        setSaving(false);
        if (data.error) {
          alert(data.error);
        } else {
          setEditingTag(null);
          fetchNFCTags();
        }
      })
      .catch((err) => {
        console.error(err);
        setSaving(false);
        alert("Lỗi hệ thống khi cập nhật thẻ NFC.");
      });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chip NFC ${id}?`)) {
      adminFetch(`/api/nfc/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "Xóa thành công.");
          fetchNFCTags();
        })
        .catch(console.error);
    }
  };

  const filteredTags = nfcTags.filter((tag) => {
    const matchesSearch =
      tag.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.giftId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tag.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: nfcTags.length,
    available: nfcTags.filter((t) => t.status === "unassigned").length,
    assigned: nfcTags.filter((t) => t.status === "assigned").length,
    inactive: nfcTags.filter((t) => t.status === "inactive").length,
  };

  // Helper tìm thông tin món quà đã gán
  const getGiftInfo = (giftId: string) => {
    return gifts.find((g) => g.id === giftId);
  };

  // Lọc danh sách quà tặng gợi ý cho Create Modal
  const suggestedGiftsCreate = useMemo(() => {
    const q = giftSearchCreate.toLowerCase().trim();
    if (!q) return gifts.slice(0, 8);
    return gifts
      .filter(
        (g) =>
          g.id.toLowerCase().includes(q) ||
          (g.recipientName && g.recipientName.toLowerCase().includes(q)) ||
          (g.title && g.title.toLowerCase().includes(q)) ||
          (g.senderName && g.senderName.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [gifts, giftSearchCreate]);

  // Lọc danh sách quà tặng gợi ý cho Edit Modal
  const suggestedGiftsEdit = useMemo(() => {
    const q = giftSearchEdit.toLowerCase().trim();
    if (!q) return gifts.slice(0, 8);
    return gifts
      .filter(
        (g) =>
          g.id.toLowerCase().includes(q) ||
          (g.recipientName && g.recipientName.toLowerCase().includes(q)) ||
          (g.title && g.title.toLowerCase().includes(q)) ||
          (g.senderName && g.senderName.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [gifts, giftSearchEdit]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
            Quản lý Thẻ NFC
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}>
            Quản lý, chỉnh sửa và gán quà tặng cho thẻ chip NFC
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer shadow border-0 text-white"
          style={{
            background: "#E8B4A8",
            fontWeight: 600,
          }}
        >
          <Plus className="w-4 h-4" />
          Thêm thẻ NFC
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Tổng số thẻ", value: stats.total, color: "#E8B4A8" },
          { label: "Có sẵn", value: stats.available, color: "#16A34A" },
          { label: "Đã gán", value: stats.assigned, color: "#2563EB" },
          { label: "Vô hiệu hóa", value: stats.inactive, color: "#6B7280" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl p-6 shadow-sm"
            style={{
              background: "white",
              border: "1px solid #E5E7EB",
            }}
          >
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "8px" }}>
              {stat.label}
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#9CA3AF" }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID hoặc UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg outline-none text-sm bg-stone-50"
              style={{
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg outline-none text-xs bg-stone-50 text-stone-700 font-semibold cursor-pointer"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="unassigned">Có sẵn</option>
            <option value="assigned">Đã gán</option>
            <option value="inactive">Vô hiệu hóa</option>
          </select>
        </div>
      </div>

      {/* NFC Table */}
      <div
        className="rounded-xl overflow-hidden shadow-sm"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        {loading ? (
          <div className="p-12 text-center text-stone-400 text-xs font-bold flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 animate-pulse text-[#E8B4A8]" />
            Đang tải dữ liệu thẻ NFC...
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs font-bold">
            Không tìm thấy thẻ NFC nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                style={{
                  background: "#F9FAFB",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Mã thẻ NFC
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    UID Thẻ NFC
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Mã Quà Liên Kết
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Lần Chạm Cuối
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTags.map((tag, index) => {
                  const statusInfo = statusConfig[tag.status] || statusConfig.unassigned;
                  const StatusIcon = statusInfo.icon;
                  const linkedGift = tag.giftId ? getGiftInfo(tag.giftId) : null;

                  return (
                    <motion.tr
                      key={tag.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                      style={{
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Wifi className="w-4 h-4" style={{ color: "#E8B4A8" }} />
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#111827" }}>
                            {tag.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-stone-600 font-semibold tracking-wide">
                          {tag.uid}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tag.giftId ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs font-mono font-bold text-[#E8B4A8] hover:underline cursor-pointer"
                              onClick={() => window.open(`/gift/${tag.giftId}`, "_blank")}
                              title="Mở xem quà tặng"
                            >
                              {tag.giftId}
                            </span>
                            {linkedGift && (
                              <span className="text-[11px] text-stone-500 font-normal truncate max-w-[150px]">
                                ({linkedGift.recipientName || linkedGift.title})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400">Chưa liên kết</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold"
                          style={{
                            background: statusInfo.bg,
                            color: statusInfo.text,
                          }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-stone-500">
                          {tag.lastTapped || "Chưa chạm"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(tag)}
                            className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                            title="Chỉnh sửa thẻ NFC"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tag.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                            title="Xóa thẻ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit NFC Modal */}
      <AnimatePresence>
        {editingTag && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingTag(null)}
                className="absolute top-5 right-5 p-1.5 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-600 transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/50">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 leading-tight">
                    Chỉnh sửa thẻ NFC
                  </h3>
                  <p className="text-xs text-stone-500">Mã thẻ: <span className="font-mono font-bold text-stone-800">{editingTag.id}</span></p>
                </div>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* UID Field with Auto-Generate Button */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Mã UID phần cứng thẻ *
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditUid(generateRandomUID())}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A85848] hover:text-[#8D4435] bg-[#E8B4A8]/15 hover:bg-[#E8B4A8]/25 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border-0"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Tự sinh mã UID
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editUid}
                    onChange={(e) => setEditUid(e.target.value)}
                    required
                    placeholder="Ví dụ: 04:A1:B2:C3:D4:E5:F6"
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider border border-stone-200 rounded-xl focus:outline-none focus:border-[#E8B4A8] bg-stone-50 text-stone-800"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Chuẩn 7-byte hexa (NTAG213/215/216) định dạng: 04:XX:XX:XX:XX:XX:XX
                  </p>
                </div>

                {/* Status Field */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Trạng thái thẻ *
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#E8B4A8] bg-stone-50 font-semibold text-stone-800 cursor-pointer"
                  >
                    <option value="unassigned">Có sẵn (unassigned)</option>
                    <option value="assigned">Đã gán quà (assigned)</option>
                    <option value="inactive">Vô hiệu hóa (inactive)</option>
                  </select>
                </div>

                {/* Gift Link Field with Suggestions */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#E8B4A8]" />
                      Mã quà tặng liên kết
                    </label>
                    {editGiftId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditGiftId("");
                          setEditStatus("unassigned");
                        }}
                        className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 cursor-pointer border-0 bg-transparent"
                      >
                        ✕ Bỏ liên kết quà
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={editGiftId}
                      onChange={(e) => {
                        setEditGiftId(e.target.value);
                        if (e.target.value.trim()) {
                          setEditStatus("assigned");
                        }
                      }}
                      onFocus={() => setShowGiftDropdownEdit(true)}
                      placeholder="Nhập mã giftId hoặc chọn từ gợi ý bên dưới..."
                      className="w-full px-3.5 py-2.5 text-xs font-mono border border-stone-200 rounded-xl focus:outline-none focus:border-[#E8B4A8] bg-stone-50 text-stone-800"
                    />
                  </div>

                  {/* Gift Suggestion Box */}
                  <div className="mt-2 p-3 bg-stone-50 border border-stone-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Gợi ý quà tặng sẵn có ({gifts.length})
                      </span>
                      <input
                        type="text"
                        value={giftSearchEdit}
                        onChange={(e) => setGiftSearchEdit(e.target.value)}
                        placeholder="Tìm quà theo tên/mã..."
                        className="px-2.5 py-1 text-[11px] bg-white border border-stone-200 rounded-lg outline-none focus:border-[#E8B4A8] w-40"
                      />
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {suggestedGiftsEdit.length === 0 ? (
                        <div className="text-[11px] text-stone-400 text-center py-3">
                          Không tìm thấy quà tặng phù hợp.
                        </div>
                      ) : (
                        suggestedGiftsEdit.map((g) => {
                          const isSelected = editGiftId === g.id;
                          return (
                            <div
                              key={g.id}
                              onClick={() => {
                                setEditGiftId(g.id);
                                setEditStatus("assigned");
                              }}
                              className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all border ${
                                isSelected
                                  ? "bg-[#E8B4A8]/20 border-[#E8B4A8] font-bold"
                                  : "bg-white hover:bg-stone-100/80 border-stone-200/60"
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-stone-900">{g.id}</span>
                                  <span className="text-[11px] text-stone-600 truncate font-semibold">
                                    {g.recipientName || g.title || "Quà tặng cảm xúc"}
                                  </span>
                                </div>
                                <div className="text-[10px] text-stone-400">
                                  Mẫu: {g.templateId || "default"} {g.orderId ? `• Đơn: ${g.orderId}` : ""}
                                </div>
                              </div>
                              {isSelected ? (
                                <span className="w-5 h-5 rounded-full bg-[#E8B4A8] text-white flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3" />
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#A85848] font-bold flex-shrink-0 hover:underline">
                                  Chọn
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingTag(null)}
                    className="flex-1 py-2.5 text-xs font-bold border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 text-xs font-bold bg-[#E8B4A8] hover:opacity-90 text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <span>Lưu thay đổi</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create NFC Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-5 right-5 p-1.5 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-600 transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
                <div className="w-9 h-9 rounded-xl bg-[#E8B4A8]/20 text-[#A85848] flex items-center justify-center border border-[#E8B4A8]/30">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 leading-tight">
                    Thêm thẻ NFC mới
                  </h3>
                  <p className="text-xs text-stone-500">Mã thẻ tự động sinh (VD: NFC-7xxx)</p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* UID Field with Auto-Generate Button */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Mã UID phần cứng thẻ *
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormUid(generateRandomUID())}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A85848] hover:text-[#8D4435] bg-[#E8B4A8]/15 hover:bg-[#E8B4A8]/25 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border-0"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Tự sinh mã UID
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formUid}
                    onChange={(e) => setFormUid(e.target.value)}
                    required
                    placeholder="Ví dụ: 04:A1:B2:C3:D4:E5:F6"
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider border border-stone-200 rounded-xl focus:outline-none focus:border-[#E8B4A8] bg-stone-50 text-stone-800"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Chuẩn 7-byte hexa (NTAG213/215/216) định dạng: 04:XX:XX:XX:XX:XX:XX
                  </p>
                </div>

                {/* Status Field */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Trạng thái ban đầu *
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#E8B4A8] bg-stone-50 font-semibold text-stone-800 cursor-pointer"
                  >
                    <option value="unassigned">Có sẵn (unassigned)</option>
                    <option value="assigned">Đã gán quà (assigned)</option>
                    <option value="inactive">Vô hiệu hóa (inactive)</option>
                  </select>
                </div>

                {/* Gift Link Field with Suggestions */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#E8B4A8]" />
                      Mã quà tặng liên kết (Tùy chọn)
                    </label>
                    {formGiftId && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormGiftId("");
                          setFormStatus("unassigned");
                        }}
                        className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 cursor-pointer border-0 bg-transparent"
                      >
                        ✕ Bỏ liên kết quà
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={formGiftId}
                    onChange={(e) => {
                      setFormGiftId(e.target.value);
                      if (e.target.value.trim()) {
                        setFormStatus("assigned");
                      }
                    }}
                    placeholder="Nhập mã giftId hoặc chọn từ gợi ý bên dưới..."
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-stone-200 rounded-xl focus:outline-none focus:border-[#E8B4A8] bg-stone-50 text-stone-800"
                  />

                  {/* Gift Suggestion Box */}
                  <div className="mt-2 p-3 bg-stone-50 border border-stone-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Gợi ý quà tặng sẵn có ({gifts.length})
                      </span>
                      <input
                        type="text"
                        value={giftSearchCreate}
                        onChange={(e) => setGiftSearchCreate(e.target.value)}
                        placeholder="Tìm quà theo tên/mã..."
                        className="px-2.5 py-1 text-[11px] bg-white border border-stone-200 rounded-lg outline-none focus:border-[#E8B4A8] w-40"
                      />
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {suggestedGiftsCreate.length === 0 ? (
                        <div className="text-[11px] text-stone-400 text-center py-3">
                          Không tìm thấy quà tặng phù hợp.
                        </div>
                      ) : (
                        suggestedGiftsCreate.map((g) => {
                          const isSelected = formGiftId === g.id;
                          return (
                            <div
                              key={g.id}
                              onClick={() => {
                                setFormGiftId(g.id);
                                setFormStatus("assigned");
                              }}
                              className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all border ${
                                isSelected
                                  ? "bg-[#E8B4A8]/20 border-[#E8B4A8] font-bold"
                                  : "bg-white hover:bg-stone-100/80 border-stone-200/60"
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-stone-900">{g.id}</span>
                                  <span className="text-[11px] text-stone-600 truncate font-semibold">
                                    {g.recipientName || g.title || "Quà tặng cảm xúc"}
                                  </span>
                                </div>
                                <div className="text-[10px] text-stone-400">
                                  Mẫu: {g.templateId || "default"} {g.orderId ? `• Đơn: ${g.orderId}` : ""}
                                </div>
                              </div>
                              {isSelected ? (
                                <span className="w-5 h-5 rounded-full bg-[#E8B4A8] text-white flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3" />
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#A85848] font-bold flex-shrink-0 hover:underline">
                                  Chọn
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 py-2.5 text-xs font-bold border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-2.5 text-xs font-bold bg-[#E8B4A8] hover:opacity-90 text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang thêm...</span>
                      </>
                    ) : (
                      <span>Thêm thẻ NFC</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
