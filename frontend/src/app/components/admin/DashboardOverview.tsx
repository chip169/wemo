import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ShoppingCart,
  DollarSign,
  Gift,
  Wifi,
  Eye,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { adminFetch } from "../../utils/api";

export function DashboardOverview() {
  const [stats, setStats] = useState({
    ordersCount: 0,
    revenue: 0,
    giftsCount: 0,
    nfcCount: 0,
    viewsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, giftsRes, nfcRes] = await Promise.all([
          adminFetch("/api/orders").then((res) => res.json()),
          adminFetch("/api/gifts").then((res) => res.json()),
          adminFetch("/api/nfc").then((res) => res.json()),
        ]);

        const validOrders = Array.isArray(ordersRes)
          ? ordersRes.filter((o: any) => o.status !== "cancelled" && o.paymentStatus !== "refunded")
          : [];
        const totalRevenue = validOrders.reduce((sum: number, o: any) => sum + (Number(o.amount) || 0), 0);
        const totalViews = giftsRes.reduce((sum: number, g: any) => sum + (g.views || 0), 0);
        const assignedNFC = nfcRes.filter((t: any) => t.status === "assigned").length;

        setStats({
          ordersCount: ordersRes.length,
          revenue: totalRevenue,
          giftsCount: giftsRes.length,
          nfcCount: assignedNFC,
          viewsCount: totalViews,
        });
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const kpiData = [
    {
      title: "Tổng Đơn Hàng",
      value: stats.ordersCount.toString(),
      icon: ShoppingCart,
      color: "#E8B4A8",
    },
    {
      title: "Tổng Doanh Thu",
      value: `${stats.revenue.toLocaleString()}đ`,
      icon: DollarSign,
      color: "#10B981",
    },
    {
      title: "Tổng Thiệp Đã Tạo",
      value: stats.giftsCount.toString(),
      icon: Gift,
      color: "#3B82F6",
    },
    {
      title: "Chip NFC Đã Gắn",
      value: stats.nfcCount.toString(),
      icon: Wifi,
      color: "#8B5CF6",
    },
    {
      title: "Lượt Xem Thiệp",
      value: stats.viewsCount.toString(),
      icon: Eye,
      color: "#F59E0B",
    },
  ];

  // Static chart data translated to VN months
  const revenueData = [
    { month: "Th1", revenue: 4200 },
    { month: "Th2", revenue: 5800 },
    { month: "Th3", revenue: 7200 },
    { month: "Th4", revenue: 6500 },
    { month: "Th5", revenue: 8900 },
    { month: "Th6", revenue: stats.revenue > 0 ? Math.round(stats.revenue / 1000) : 10 },
  ];

  const giftCreationData = [
    { month: "Th1", gifts: 5 },
    { month: "Th2", gifts: 12 },
    { month: "Th3", gifts: 25 },
    { month: "Th4", gifts: 18 },
    { month: "Th5", gifts: 35 },
    { month: "Th6", gifts: stats.giftsCount },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
          Tổng quan Dashboard
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "4px" }}>
          Hệ thống quản lý hiệu suất bán hàng & kích hoạt thẻ WEMO.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-400 text-xs font-bold flex flex-col items-center gap-2 bg-white rounded-xl border border-stone-100 shadow-sm">
          <Sparkles className="w-6 h-6 animate-pulse text-[#E8B4A8]" />
          Đang nạp dữ liệu thống kê...
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {kpiData.map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl p-6 hover:shadow-md transition-shadow duration-300 shadow-sm"
                style={{
                  background: "white",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${kpi.color}15`,
                    }}
                  >
                    <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {kpi.value}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    marginTop: "4px",
                    fontWeight: 500,
                  }}
                >
                  {kpi.title}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl p-6 shadow-sm"
              style={{
                background: "white",
                border: "1px solid #E5E7EB",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "16px",
                }}
              >
                Xu hướng doanh thu (nghìn VNĐ)
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    style={{ fontSize: "0.75rem" }}
                  />
                  <YAxis stroke="#6B7280" style={{ fontSize: "0.75rem" }} />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E8B4A8"
                    strokeWidth={3}
                    dot={{ fill: "#E8B4A8", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Gift Creation Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl p-6 shadow-sm"
              style={{
                background: "white",
                border: "1px solid #E5E7EB",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "16px",
                }}
              >
                Xu hướng tạo thiệp quà tặng
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={giftCreationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    style={{ fontSize: "0.75rem" }}
                  />
                  <YAxis stroke="#6B7280" style={{ fontSize: "0.75rem" }} />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                    }}
                  />
                  <Bar dataKey="gifts" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
