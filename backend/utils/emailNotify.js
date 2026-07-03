/**
 * Email Notification Service — WEMO
 * Sử dụng Nodemailer + Gmail SMTP (hoàn toàn miễn phí)
 *
 * Cấu hình trong .env:
 *   GMAIL_USER=your_gmail@gmail.com
 *   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx   (App Password — KHÔNG phải mật khẩu Gmail)
 *   ADMIN_EMAIL=admin@wemo.vn                 (email nhận thông báo nội bộ)
 *
 * Hướng dẫn tạo Gmail App Password:
 *   1. Vào myaccount.google.com > Bảo mật > Xác minh 2 bước (bật lên nếu chưa có)
 *   2. Vào myaccount.google.com > Bảo mật > Mật khẩu ứng dụng
 *   3. Chọn "Thư" + "Khác (tên tùy chỉnh)" > đặt tên "WEMO"
 *   4. Google sẽ tạo mật khẩu 16 ký tự — copy vào GMAIL_APP_PASSWORD
 */

const nodemailer = require("nodemailer");

// ─── Create reusable transporter ─────────────────────────────────────────────
let _transporter = null;

const getTransporter = () => {
  if (_transporter) return _transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return _transporter;
};

// ─── HTML Email Template: Order Deposit Confirmed ─────────────────────────────
const buildOrderConfirmHTML = ({ customerName, orderId, product, depositAmount, paidAt, giftLink }) => {
  const formattedDeposit = Number(depositAmount).toLocaleString("vi-VN") + "đ";
  const formattedDate = new Date(paidAt).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>WEMO — Xác nhận đặt cọc</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;padding:32px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header gradient -->
      <tr>
        <td style="background:linear-gradient(135deg,#E8B4A8,#D4AF78);padding:36px 40px;text-align:center;">
          <div style="font-size:36px;margin-bottom:8px;">🎉</div>
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">Đặt Cọc Thành Công!</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">WEMO đã nhận được khoản cọc của bạn</p>
        </td>
      </tr>

      <!-- Greeting -->
      <tr>
        <td style="padding:32px 40px 0;">
          <p style="margin:0;font-size:15px;color:#333;">Xin chào <strong>${customerName}</strong>,</p>
          <p style="margin:12px 0 0;font-size:14px;color:#555;line-height:1.6;">
            Đơn hàng của bạn đã được xác nhận đặt cọc thành công. Đội sản xuất WEMO sẽ bắt đầu xử lý ngay trong 24 giờ làm việc.
          </p>
        </td>
      </tr>

      <!-- Order Details Box -->
      <tr>
        <td style="padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;border-radius:14px;border:1px solid #eee;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;">Chi Tiết Đơn Hàng</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${[
                    ["🔖 Mã đơn hàng", `<strong style="font-family:monospace;color:#111;">${orderId}</strong>`],
                    ["📦 Sản phẩm", product || "Figure Chibi 3D"],
                    ["💰 Số tiền cọc", `<strong style="color:#E8B4A8;">${formattedDeposit}</strong>`],
                    ["📅 Thời gian", formattedDate],
                  ].map(([label, value]) => `
                  <tr>
                    <td style="padding:7px 0;font-size:13px;color:#777;width:140px;">${label}</td>
                    <td style="padding:7px 0;font-size:13px;color:#333;">${value}</td>
                  </tr>`).join("")}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:0 40px 32px;text-align:center;">
          <p style="margin:0 0 16px;font-size:14px;color:#555;">
            Bước tiếp theo: Thiết kế <strong>Thiệp 3D & Chip NFC</strong> tặng kèm — hoàn toàn miễn phí!
          </p>
          <a href="${giftLink}"
             style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#E8B4A8,#D4AF78);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:14px;letter-spacing:0.3px;">
            🎁 Tạo Thiệp 3D Ngay →
          </a>
          <p style="margin:12px 0 0;font-size:11px;color:#aaa;">Link có hiệu lực 30 ngày kể từ ngày đặt hàng</p>
        </td>
      </tr>

      <!-- Steps timeline -->
      <tr>
        <td style="padding:0 40px 32px;">
          <p style="margin:0 0 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;">Quy Trình Tiếp Theo</p>
          ${[
            ["✅", "Đã nhận đặt cọc", "Hoàn tất", true],
            ["🎨", "Tạo thiệp 3D & NFC", "Bạn thực hiện", false],
            ["🖨️", "Sản xuất mô hình 3D", "3–7 ngày làm việc", false],
            ["🚚", "Giao hàng tận nơi", "Theo địa chỉ bạn cung cấp", false],
          ].map(([icon, title, sub, done]) => `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
            <tr>
              <td width="36" style="vertical-align:top;">
                <div style="width:28px;height:28px;border-radius:50%;background:${done ? "linear-gradient(135deg,#E8B4A8,#D4AF78)" : "#f0f0f0"};display:flex;align-items:center;justify-content:center;font-size:13px;text-align:center;line-height:28px;">${icon}</div>
              </td>
              <td style="vertical-align:middle;padding-left:10px;">
                <span style="font-size:13px;font-weight:700;color:${done ? "#D4AF78" : "#333"};">${title}</span>
                <span style="font-size:11px;color:#999;margin-left:8px;">${sub}</span>
              </td>
            </tr>
          </table>`).join("")}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9f9f9;border-top:1px solid #eee;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
            Email này được gửi tự động từ hệ thống WEMO Studio.<br/>
            Nếu cần hỗ trợ, hãy liên hệ qua Zalo hoặc reply email này.<br/>
            <strong style="color:#E8B4A8;">WEMO</strong> — Món Quà Độc Bản, Kỷ Niệm Vĩnh Cửu
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
};

// ─── HTML Email Template: Admin New Order Alert ───────────────────────────────
const buildAdminAlertHTML = ({ orderId, customerName, phone, address, product, amount, depositAmount, paidAt }) => {
  const formattedDeposit = Number(depositAmount).toLocaleString("vi-VN") + "đ";
  const formattedTotal = Number(amount).toLocaleString("vi-VN") + "đ";
  const formattedDate = new Date(paidAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#1a1a1a;font-family:monospace;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
  <tr><td align="center">
    <table width="540" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;border:1px solid #333;overflow:hidden;">
      <tr>
        <td style="background:linear-gradient(135deg,#E8B4A8,#D4AF78);padding:20px 32px;">
          <h2 style="margin:0;color:#111;font-size:16px;font-weight:900;">🔔 ĐƠN HÀNG MỚI — ĐÃ ĐẶT CỌC</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px;">
          <table width="100%">
            ${[
              ["Mã đơn", orderId],
              ["Thời gian", formattedDate],
              ["Khách hàng", customerName],
              ["Số điện thoại", phone],
              ["Địa chỉ", address || "Chưa điền"],
              ["Sản phẩm", product],
              ["Tổng tiền", formattedTotal],
              ["Đã đặt cọc", formattedDeposit],
              ["Còn lại", `${(Number(amount) - Number(depositAmount)).toLocaleString("vi-VN")}đ`],
            ].map(([k, v]) => `
            <tr>
              <td style="padding:5px 0;color:#888;font-size:12px;width:130px;">${k}</td>
              <td style="padding:5px 0;color:#E8B4A8;font-size:13px;font-weight:700;">${v}</td>
            </tr>`).join("")}
          </table>
          <div style="margin-top:20px;padding:12px 16px;background:#1e1e1e;border-radius:8px;border-left:3px solid #D4AF78;">
            <p style="margin:0;color:#aaa;font-size:11px;">Truy cập admin panel để xem chi tiết và xác nhận đơn hàng.</p>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`;
};

// ─── Send Order Confirmation to Customer ─────────────────────────────────────
const sendOrderConfirmEmail = async ({ email, customerName, orderId, product, depositAmount, amount, paidAt, giftLink }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("⚠️ Email: Chưa cấu hình GMAIL_USER hoặc GMAIL_APP_PASSWORD trong .env. Bỏ qua.");
    return { skipped: true, reason: "Missing Gmail credentials" };
  }

  if (!email) {
    console.warn("⚠️ Email: Khách hàng không có email. Bỏ qua.");
    return { skipped: true, reason: "No customer email" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"WEMO Studio" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `🎉 WEMO — Xác nhận đặt cọc đơn hàng ${orderId}`,
      html: buildOrderConfirmHTML({ customerName, orderId, product, depositAmount, paidAt, giftLink }),
    });

    console.log(`✅ Email đã gửi đến ${email} — Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Email lỗi: ${err.message}`);
    return { success: false, error: err.message };
  }
};

// ─── Send Admin Alert ─────────────────────────────────────────────────────────
const sendAdminAlertEmail = async (orderData) => {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!transporter || !adminEmail) {
    console.warn("⚠️ Admin Email: Chưa cấu hình ADMIN_EMAIL. Bỏ qua.");
    return { skipped: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"WEMO System" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: `🔔 [WEMO] Đơn mới đặt cọc — ${orderData.orderId}`,
      html: buildAdminAlertHTML(orderData),
    });

    console.log(`✅ Admin alert gửi đến ${adminEmail}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Admin email lỗi: ${err.message}`);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendOrderConfirmEmail,
  sendAdminAlertEmail,
};
