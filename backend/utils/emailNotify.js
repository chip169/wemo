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
  // Always re-create if not yet initialized (handles env vars loaded after module init)
  if (_transporter) return _transporter;

  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();

  if (!user || !pass) {
    console.warn("⚠️ Email: Chưa cấu hình GMAIL_USER hoặc GMAIL_APP_PASSWORD trong .env.");
    return null;
  }

  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  // Verify connection on first create
  _transporter.verify((err) => {
    if (err) {
      console.error("❌ Gmail SMTP xác thực thất bại:", err.message);
      _transporter = null; // Reset so next call retries
    } else {
      console.log("✅ Gmail SMTP kết nối thành công:", user);
    }
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
<body style="margin:0;padding:0;background-color:#FAF8F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5;padding:40px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.03);border:1px solid #f0ede8;">
      
      <!-- Top Brand Header -->
      <tr>
        <td style="padding:40px 40px 20px;text-align:center;border-bottom:1px solid #FAF8F5;">
          <div style="font-size:24px;font-weight:800;letter-spacing:6px;color:#5C4839;text-transform:uppercase;margin:0;">W E M O</div>
          <div style="font-size:10px;font-weight:700;letter-spacing:3px;color:#C4A482;text-transform:uppercase;margin-top:6px;margin-bottom:0;">Chibi Studio</div>
        </td>
      </tr>

      <!-- Notification Title -->
      <tr>
        <td style="padding:32px 40px 0;text-align:center;">
          <h1 style="margin:0;color:#2D2722;font-size:20px;font-weight:800;letter-spacing:-0.3px;line-height:1.4;">XÁC NHẬN ĐẶT CỌC THÀNH CÔNG</h1>
          <p style="margin:8px 0 0;color:#8E847B;font-size:13px;line-height:1.5;">Chúng tôi đã nhận được khoản cọc cho đơn hàng của bạn.</p>
        </td>
      </tr>

      <!-- Greeting -->
      <tr>
        <td style="padding:24px 40px 0;">
          <p style="margin:0;font-size:14px;color:#5C4839;line-height:1.6;">
            Xin chào <strong>${customerName}</strong>,
          </p>
          <p style="margin:10px 0 0;font-size:14px;color:#786E65;line-height:1.6;">
            Cảm ơn bạn đã lựa chọn WEMO. Yêu cầu đặt cọc cho đơn hàng của bạn đã hoàn tất thành công. Đội ngũ sản xuất nghệ thuật của WEMO sẽ tiến hành xử lý mô hình Chibi trong thời gian sớm nhất.
          </p>
        </td>
      </tr>

      <!-- Order Details -->
      <tr>
        <td style="padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5;border-radius:16px;border:1px solid #F0EDE8;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 16px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#A89E95;">Thông tin chi tiết</p>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;font-size:13px;color:#8E847B;width:140px;">Mã đơn hàng</td>
                    <td style="padding:8px 0;font-size:13px;color:#2D2722;font-weight:700;font-family:monospace;letter-spacing:0.5px;">${orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:13px;color:#8E847B;">Sản phẩm</td>
                    <td style="padding:8px 0;font-size:13px;color:#2D2722;font-weight:600;">${product || "Figure Chibi 3D"}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:13px;color:#8E847B;">Số tiền cọc</td>
                    <td style="padding:8px 0;font-size:13px;color:#E8B4A8;font-weight:800;">${formattedDeposit}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:13px;color:#8E847B;">Ngày thanh toán</td>
                    <td style="padding:8px 0;font-size:13px;color:#2D2722;">${formattedDate}</td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:8px 40px 32px;text-align:center;">
          <p style="margin:0 0 20px;font-size:14px;color:#5C4839;line-height:1.6;font-weight:600;">
            Bước tiếp theo: Thiết kế thiệp 3D & Chip NFC của riêng bạn
          </p>
          <a href="${giftLink}"
             style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#E8B4A8 0%,#D4AF78 100%);color:#ffffff;text-decoration:none;border-radius:14px;font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:2px;box-shadow:0 6px 20px rgba(232,180,168,0.25);">
            Tạo Thiệp 3D Ngay
          </a>
          <p style="margin:14px 0 0;font-size:11px;color:#A89E95;">Đường dẫn tạo thiệp có giá trị trong vòng 30 ngày.</p>
        </td>
      </tr>

      <!-- Timeline Steps (Professional Number Circles) -->
      <tr>
        <td style="padding:16px 40px 40px;border-top:1px solid #FAF8F5;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#A89E95;">Quy trình tiếp theo</p>
          
          ${[
            ["1", "Đã nhận đặt cọc", "Thanh toán hoàn tất", true],
            ["2", "Tạo thiệp 3D & NFC", "Bạn thực hiện thiết kế", false],
            ["3", "Sản xuất mô hình 3D", "Từ 3 – 7 ngày làm việc", false],
            ["4", "Giao nhận sản phẩm", "Giao hàng theo địa chỉ cung cấp", false]
          ].map(([stepNum, title, desc, done]) => `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            <tr>
              <td width="36" style="vertical-align:top;">
                <div style="width:24px;height:24px;border-radius:50%;background-color:${done ? "#E8B4A8" : "#FAF8F5"};border:1px solid ${done ? "#E8B4A8" : "#E8B4A8"};color:${done ? "#ffffff" : "#E8B4A8"};font-size:11px;font-weight:800;text-align:center;line-height:24px;font-family:sans-serif;">${stepNum}</div>
              </td>
              <td style="vertical-align:top;padding-top:2px;">
                <div style="font-size:13px;font-weight:700;color:${done ? "#E8B4A8" : "#2D2722"};">${title}</div>
                <div style="font-size:11px;color:#8E847B;margin-top:2px;">${desc}</div>
              </td>
            </tr>
          </table>`).join("")}
        </td>
      </tr>

      <!-- Footer Brand Info -->
      <tr>
        <td style="background-color:#FAF8F5;padding:32px 40px;text-align:center;border-top:1px solid #F0EDE8;">
          <p style="margin:0;font-size:12px;color:#8E847B;line-height:1.8;">
            Thư này được gửi tự động từ hệ thống quản lý đơn hàng WEMO Studio.<br/>
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ qua Zalo hoặc phản hồi email này.<br/><br/>
            <span style="font-weight:700;color:#5C4839;letter-spacing:1px;text-transform:uppercase;">WEMO STUDIO</span><br/>
            <span style="font-size:11px;color:#A89E95;">Món Quà Độc Bản · Kỷ Niệm Vĩnh Cửu</span>
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
<html>
<head>
<meta charset="UTF-8"/>
<title>WEMO — Đơn Hàng Mới</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF8F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:20px;border:1px solid #f0ede8;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.02);">
      
      <!-- Admin Header -->
      <tr>
        <td style="background-color:#2D2722;padding:24px 32px;text-align:center;">
          <h2 style="margin:0;color:#ffffff;font-size:14px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">ĐƠN HÀNG MỚI ĐÃ ĐẶT CỌC</h2>
        </td>
      </tr>

      <!-- Table Details -->
      <tr>
        <td style="padding:32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["Mã đơn hàng", orderId],
              ["Ngày đặt cọc", formattedDate],
              ["Khách hàng", customerName],
              ["Số điện thoại", phone],
              ["Địa chỉ giao hàng", address || "Chưa cung cấp"],
              ["Sản phẩm", product],
              ["Tổng giá trị đơn", formattedTotal],
              ["Đã đặt cọc", formattedDeposit],
              ["Cần thanh toán thêm", `${(Number(amount) - Number(depositAmount)).toLocaleString("vi-VN")}đ`],
            ].map(([k, v]) => `
            <tr style="border-bottom:1px solid #FAF8F5;">
              <td style="padding:10px 0;color:#8E847B;font-size:13px;width:150px;border-bottom:1px solid #FAF8F5;">${k}</td>
              <td style="padding:10px 0;color:#2D2722;font-size:13px;font-weight:700;border-bottom:1px solid #FAF8F5;">${v}</td>
            </tr>`).join("")}
          </table>

          <div style="margin-top:28px;padding:16px;background-color:#FAF8F5;border-radius:12px;border-left:3px solid #D4AF78;text-align:left;">
            <p style="margin:0;color:#5C4839;font-size:12px;line-height:1.5;">
              Đơn hàng này đã được tự động kích hoạt tiến trình làm quà tặng. Vui lòng truy cập trang quản trị để xem và xử lý tiếp.
            </p>
          </div>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
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
