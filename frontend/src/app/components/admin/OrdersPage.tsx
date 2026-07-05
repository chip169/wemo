import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import { adminFetch } from "../../utils/api";

interface Order {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  status: "pending_payment" | "deposited" | "pending" | "processing" | "shipping" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "refunded";
  createdDate: string;
}

const statusColors = {
  pending_payment: { bg: "#FFEDD5", text: "#EA580C", label: "Chờ đặt cọc" },
  deposited: { bg: "#E0F2FE", text: "#0369A1", label: "Đã đặt cọc" },
  pending: { bg: "#FEF3C7", text: "#D97706", label: "Chờ xử lý" },
  processing: { bg: "#DBEAFE", text: "#2563EB", label: "Đang sản xuất" },
  shipping: { bg: "#F3E8FF", text: "#7C3AED", label: "Đang giao hàng" },
  completed: { bg: "#DCFCE7", text: "#16A34A", label: "Đã hoàn thành" },
  cancelled: { bg: "#FEE2E2", text: "#DC2626", label: "Đã hủy" },
};

const paymentStatusColors = {
  paid: { bg: "#DCFCE7", text: "#16A34A", label: "Đã thanh toán" },
  unpaid: { bg: "#FEF3C7", text: "#D97706", label: "Chưa thanh toán" },
  refunded: { bg: "#E0E7FF", text: "#6366F1", label: "Đã hoàn tiền" },
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formProduct, setFormProduct] = useState("Sinh Nhật Rực Rỡ");
  const [formAmount, setFormAmount] = useState("");
  const [formStatus, setFormStatus] = useState<Order["status"]>("pending_payment");
  const [formPayment, setFormPayment] = useState<Order["paymentStatus"]>("unpaid");
  const [submitting, setSubmitting] = useState(false);

  // Edit Form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOrderId, setEditOrderId] = useState("");
  const [editName, setEditName] = useState("");
  const [editProduct, setEditProduct] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editStatus, setEditStatus] = useState<Order["status"]>("pending_payment");
  const [editPayment, setEditPayment] = useState<Order["paymentStatus"]>("unpaid");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const handleOpenEditModal = (order: Order) => {
    setEditOrderId(order.id);
    setEditName(order.customerName);
    setEditProduct(order.product);
    setEditAmount(order.amount.toString());
    setEditStatus(order.status);
    setEditPayment(order.paymentStatus);
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editAmount.trim()) return;

    setEditSubmitting(true);
    const body = {
      customerName: editName.trim(),
      product: editProduct,
      amount: Number(editAmount),
      status: editStatus,
      paymentStatus: editPayment,
    };

    adminFetch(`/api/orders/${editOrderId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Cập nhật đơn hàng thành công!");
        setIsEditModalOpen(false);
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        alert("Có lỗi xảy ra khi cập nhật đơn hàng.");
      })
      .finally(() => {
        setEditSubmitting(false);
      });
  };

  const fetchOrders = () => {
    setLoading(true);
    adminFetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleQuickConfirm = (id: string) => {
    if (window.confirm(`Xác nhận đơn hàng ${id} đã thanh toán đặt cọc?`)) {
      adminFetch(`/api/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "deposited" }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Cập nhật trạng thái thất bại.");
          return res.json();
        })
        .then(() => {
          fetchOrders();
        })
        .catch((err) => {
          alert("Lỗi xác nhận cọc nhanh: " + err.message);
        });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${id}?`)) {
      adminFetch(`/api/orders/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "Xóa đơn hàng thành công.");
          fetchOrders();
        })
        .catch(console.error);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAmount.trim()) return;

    setSubmitting(true);
    const body = {
      customerName: formName.trim(),
      product: formProduct,
      amount: Number(formAmount),
      status: formStatus,
      paymentStatus: formPayment,
    };

    adminFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((newOrder) => {
        alert(`Đơn hàng được tạo thành công! Mã đơn hàng: ${newOrder.id}`);
        setIsModalOpen(false);
        // Reset forms
        setFormName("");
        setFormProduct("Sinh Nhật Rực Rỡ");
        setFormAmount("");
        setFormStatus("pending_payment");
        setFormPayment("unpaid");
        fetchOrders();
      })
      .catch((err) => {
        console.error(err);
        alert("Có lỗi xảy ra khi tạo đơn hàng.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPayment =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}
          >
            Quản lý Đơn hàng
          </h1>
          <p
            style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}
          >
            Quản lý và theo dõi toàn bộ đơn hàng
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow bg-gradient-to-r from-stone-800 to-stone-950"
        >
          <Plus className="w-4 h-4" />
          Tạo Đơn Hàng Mới
        </motion.button>
      </div>

      {/* Filters and search */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#9CA3AF" }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
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
          <div className="w-full md:w-56">
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 rounded-lg outline-none text-xs bg-stone-50 text-stone-700 font-semibold cursor-pointer border border-stone-200"
            >
              <option value="all">Tất cả trạng thái thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders table */}
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
            Đang tải danh sách đơn hàng...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs font-bold">
            Không tìm thấy đơn hàng nào.
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
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Mã đơn hàng
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Tên Khách Hàng
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Sản Phẩm
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Tổng Giá Trị
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Trạng Thái Đơn
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Thanh Toán
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Ngày Đặt
                    </th>
                    <th
                      className="px-6 py-4 text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                    >
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={`border-b border-gray-100 dark:border-zinc-800 transition-colors ${
                        order.status === "pending_payment"
                          ? "bg-amber-50/60 dark:bg-amber-950/10 hover:bg-amber-100/60 dark:hover:bg-amber-900/20"
                          : "hover:bg-gray-50/50 dark:hover:bg-[#202023]/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-[#111827] dark:text-stone-200">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-[#374151] dark:text-stone-300">
                          {order.customerName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-stone-700 dark:text-stone-300">
                          {order.product}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-[#111827] dark:text-stone-200">
                          {order.amount.toLocaleString()}đ
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            background: (statusColors[order.status] || { bg: "#E5E7EB", text: "#374151" }).bg,
                            color: (statusColors[order.status] || { bg: "#E5E7EB", text: "#374151" }).text,
                          }}
                        >
                          {(statusColors[order.status] || { label: order.status }).label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            background: (paymentStatusColors[order.paymentStatus] || { bg: "#E5E7EB", text: "#374151" }).bg,
                            color: (paymentStatusColors[order.paymentStatus] || { bg: "#E5E7EB", text: "#374151" }).text,
                          }}
                        >
                          {(paymentStatusColors[order.paymentStatus] || { label: order.paymentStatus }).label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-[#6B7280] dark:text-stone-400">
                          {new Date(order.createdDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {order.status === "pending_payment" && (
                            <button
                              onClick={() => handleQuickConfirm(order.id)}
                              className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded transition-colors"
                              title="Xác nhận đã cọc nhanh"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEditModal(order)}
                            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-600 dark:text-stone-400 rounded transition-colors"
                            title="Chỉnh sửa đơn hàng"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 rounded transition-colors"
                            title="Xóa đơn hàng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                  {Math.min(currentPage * itemsPerPage, filteredOrders.length)}{" "}
                  trong số {filteredOrders.length} đơn hàng
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

      {/* Create Order Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl border border-stone-100"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-black text-stone-900 mb-6">Tạo Đơn Hàng Mới</h2>

              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider pl-1">
                    Tên khách hàng *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nhập tên khách hàng..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider pl-1">
                    Sản phẩm gói quà *
                  </label>
                  <select
                    value={formProduct}
                    onChange={(e) => setFormProduct(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50 text-stone-700 font-medium"
                  >
                    <option value="Sinh Nhật Rực Rỡ">Sinh Nhật Rực Rỡ (🎂)</option>
                    <option value="Ký Ức Lãng Mạn">Ký Ức Lãng Mạn (💖)</option>
                    <option value="Dòng Thời Gian Kỷ Niệm">Dòng Thời Gian Kỷ Niệm (📸)</option>
                    <option value="Giáng Sinh Diệu Kỳ">Giáng Sinh Diệu Kỳ (🎄)</option>
                    <option value="Ngày Tốt Nghiệp">Ngày Tốt Nghiệp (🎓)</option>
                    <option value="Chào Đón Em Bé">Chào Đón Em Bé (👶)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider pl-1">
                    Giá trị đơn hàng (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="Ví dụ: 199000..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider pl-1">
                      Trạng thái đơn
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50 text-stone-700 font-medium"
                    >
                      <option value="pending_payment">Chờ đặt cọc</option>
                      <option value="deposited">Đã đặt cọc</option>
                      <option value="processing">Đang sản xuất</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="completed">Đã hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider pl-1">
                      Thanh toán
                    </label>
                    <select
                      value={formPayment}
                      onChange={(e) => setFormPayment(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50 text-stone-700 font-medium"
                    >
                      <option value="unpaid">Chưa thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="refunded">Đã hoàn tiền</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-stone-800 to-stone-950 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 mt-4"
                >
                  {submitting ? "Đang tạo..." : "Tạo Đơn Hàng"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Order Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl border border-stone-100"
            >
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-black text-stone-900 mb-6">Chỉnh Sửa Đơn Hàng ({editOrderId})</h2>

              <form onSubmit={handleUpdateOrder} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider pl-1">
                    Tên khách hàng *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nhập tên khách hàng..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider pl-1">
                    Sản phẩm gói quà *
                  </label>
                  <select
                    value={editProduct}
                    onChange={(e) => setEditProduct(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50 text-stone-700 font-medium"
                  >
                    <option value="Sinh Nhật Rực Rỡ">Sinh Nhật Rực Rỡ (🎂)</option>
                    <option value="Ký Ức Lãng Mạn">Ký Ức Lãng Mạn (💖)</option>
                    <option value="Dòng Thời Gian Kỷ Niệm">Dòng Thời Gian Kỷ Niệm (📸)</option>
                    <option value="Giáng Sinh Diệu Kỳ">Giáng Sinh Diệu Kỳ (🎄)</option>
                    <option value="Ngày Tốt Nghiệp">Ngày Tốt Nghiệp (🎓)</option>
                    <option value="Chào Đón Em Bé">Chào Đón Em Bé (👶)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider pl-1">
                    Giá trị đơn hàng (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="Ví dụ: 199000..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider pl-1">
                      Trạng thái đơn
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50 text-stone-700 font-medium"
                    >
                      <option value="pending_payment">Chờ đặt cọc</option>
                      <option value="deposited">Đã đặt cọc</option>
                      <option value="processing">Đang sản xuất</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="completed">Đã hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider pl-1">
                      Thanh toán
                    </label>
                    <select
                      value={editPayment}
                      onChange={(e) => setEditPayment(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-[#E8B4A8] text-xs bg-stone-50 text-stone-700 font-medium"
                    >
                      <option value="unpaid">Chưa thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="refunded">Đã hoàn tiền</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-stone-800 to-stone-950 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 mt-4"
                >
                  {editSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
