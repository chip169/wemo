import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { adminFetch } from "../../utils/api";

interface Gift {
  id: string;
  recipientName: string;
  templateId: string;
  orderId: string;
  views: number;
  status: string;
  createdAt: string;
  isPlaceholder?: boolean;
}

const statusColors = {
  published: { bg: "#DCFCE7", text: "#16A34A", label: "Đã tạo thiệp" },
  uncreated: { bg: "#FEF3C7", text: "#D97706", label: "Chưa tạo thiệp" },
  deleted: { bg: "#FEE2E2", text: "#DC2626", label: "Đã xóa mềm" },
};

export function GiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchGifts = () => {
    setLoading(true);
    Promise.all([
      adminFetch("/api/gifts").then((res) => (res.ok ? res.json() : [])).catch(() => []),
      adminFetch("/api/orders").then((res) => (res.ok ? res.json() : [])).catch(() => []),
    ])
      .then(([giftsData, ordersData]) => {
        const giftsList = Array.isArray(giftsData) ? giftsData : [];
        const ordersList = Array.isArray(ordersData) ? ordersData : [];

        // Build map of orderIds that have created active gifts
        const createdOrderIds = new Set(
          giftsList
            .filter((g: any) => g.status !== "deleted")
            .map((g: any) => g.orderId)
            .filter(Boolean)
        );

        // Filter orders that don't have created gifts yet
        const uncreatedGifts = ordersList
          .filter((o: any) => o && o.id && !createdOrderIds.has(o.id))
          .map((o: any) => ({
            id: "-", 
            recipientName: `Chưa có (Đơn hàng: ${o.customerName || "Chưa rõ"})`,
            templateId: "-",
            orderId: o.id,
            views: 0,
            status: "uncreated",
            createdAt: o.createdDate || "",
            isPlaceholder: true,
          }));

        const combined = [...giftsList, ...uncreatedGifts];
        setGifts(combined);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mềm món quà ${id}?`)) {
      adminFetch(`/api/gifts/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "Đã xóa mềm thành công.");
          fetchGifts();
        })
        .catch(console.error);
    }
  };

  const handleRestore = (id: string) => {
    if (window.confirm(`Khôi phục lại quà tặng ${id}?`)) {
      adminFetch(`/api/gifts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert("Đã khôi phục quà tặng thành công.");
            fetchGifts();
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Lỗi hệ thống khi khôi phục quà tặng.");
        });
    }
  };

  const handleReset = (id: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn RESET món quà ${id} về trạng thái chưa tạo? Điều này sẽ xóa toàn bộ nội dung thiệp và cho phép thiết kế lại.`)) {
      adminFetch(`/api/gifts/${id}/reset`, { method: "POST" })
        .then(async (res) => {
          if (!res.ok) {
            try {
              const errData = await res.json();
              throw new Error(errData.error || `Mã lỗi: ${res.status}`);
            } catch {
              throw new Error(`Mã lỗi: ${res.status} (${res.statusText})`);
            }
          }
          return res.json();
        })
        .then((data) => {
          alert(data.message || "Đã reset quà tặng về trạng thái chưa tạo thành công.");
          fetchGifts();
        })
        .catch((err) => {
          console.error(err);
          alert(`Lỗi khi reset quà tặng: ${err.message}`);
        });
    }
  };

  const filteredGifts = gifts.filter((gift) => {
    const recipient = gift.recipientName || "";
    const orderId = gift.orderId || "";
    const giftId = gift.id || "";
    return (
      recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      giftId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredGifts.length / itemsPerPage);
  const currentGifts = filteredGifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
            Quản lý Quà tặng
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}>
            Quản lý, xóa mềm và theo dõi toàn bộ quà tặng điện tử
          </p>
        </div>
      </div>

      {/* Filters and search */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#9CA3AF" }}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã quà, mã đơn hàng hoặc tên người nhận..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none text-sm bg-stone-50"
            style={{
              border: "1px solid #E5E7EB",
              color: "#111827",
            }}
          />
        </div>
      </div>

      {/* Gifts table */}
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
            Đang nạp danh sách quà tặng...
          </div>
        ) : filteredGifts.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs font-bold">
            Không tìm thấy quà tặng nào.
          </div>
        ) : (
          <>
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
                      Mã quà tặng
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                      Người Nhận
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                      Mã Đơn Hàng
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                      Mẫu Thiệp
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                      Trạng Thái
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                      Ngày Tạo
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                      Lượt Xem
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentGifts.map((gift, index) => (
                    <motion.tr
                      key={gift.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                      style={{
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-[#111827]">
                          {gift.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-[#374151]">
                          {gift.recipientName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-stone-500">
                          {gift.orderId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-stone-700">
                          {gift.templateId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            background: gift.status === "deleted"
                              ? statusColors.deleted.bg
                              : gift.isPlaceholder
                                ? statusColors.uncreated.bg
                                : statusColors.published.bg,
                            color: gift.status === "deleted"
                              ? statusColors.deleted.text
                              : gift.isPlaceholder
                                ? statusColors.uncreated.text
                                : statusColors.published.text,
                          }}
                        >
                          {gift.status === "deleted"
                            ? statusColors.deleted.label
                            : gift.isPlaceholder
                              ? statusColors.uncreated.label
                              : statusColors.published.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-stone-500">
                          {gift.createdAt ? new Date(gift.createdAt).toLocaleDateString() : "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-[#111827]">
                          {gift.views}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!gift.isPlaceholder ? (
                          <div className="flex items-center gap-2">
                            {gift.status !== "deleted" && (
                              <a
                                href={`/gift/${gift.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-stone-100 rounded text-stone-600 transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleReset(gift.id)}
                              className="p-1.5 hover:bg-amber-50 text-amber-600 rounded transition-colors cursor-pointer border-0 bg-transparent"
                              title="Reset quà tặng"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            {gift.status !== "deleted" ? (
                              <button
                                onClick={() => handleDelete(gift.id)}
                                className="p-1.5 hover:bg-rose-50 text-rose-500 rounded transition-colors cursor-pointer border-0 bg-transparent"
                                title="Xóa mềm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRestore(gift.id)}
                                className="p-1.5 hover:bg-green-50 text-green-600 rounded transition-colors cursor-pointer border-0 bg-transparent"
                                title="Khôi phục"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400 font-semibold italic">Chờ khách thiết kế</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{
                  borderTop: "1px solid #E5E7EB",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
                  {Math.min(currentPage * itemsPerPage, filteredGifts.length)}{" "}
                  trong số {filteredGifts.length} phần tử
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-8 h-8 rounded-lg text-xs transition-colors"
                      style={{
                        background:
                          currentPage === i + 1 ? "#E8B4A8" : "transparent",
                        color: currentPage === i + 1 ? "white" : "#6B7280",
                        fontWeight: currentPage === i + 1 ? 600 : 400,
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
