/**
 * Email Notification Service — WEMO
 * Sử dụng Resend HTTP API (thay thế cho Nodemailer SMTP để tránh lỗi chặn cổng trên Render)
 *
 * Cấu hình trong .env:
 *   RESEND_API_KEY=re_xxxxxxxxx
 *   RESEND_FROM_EMAIL=WEMO Studio <onboarding@resend.dev>  (nếu đã verify domain thì cấu hình ví dụ: WEMO Studio <hello@wemo.vn>)
 *   ADMIN_EMAIL=admin@wemo.vn
 */

// Hàm gửi email qua HTTP API của Resend (sử dụng cổng 443 HTTPS chuẩn, không bao giờ bị chặn)
const sendEmailViaResend = async ({ to, subject, html }) => {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    console.warn("⚠️ [Resend] Bỏ qua — thiếu RESEND_API_KEY trong .env");
    return { skipped: true, reason: "Missing RESEND_API_KEY" };
  }

  const fromEmail = (process.env.RESEND_FROM_EMAIL || "WEMO Studio <onboarding@resend.dev>").trim();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        html
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`✅ [Resend] Gửi thành công đến ${to} — ID: ${data.id}`);
      return { success: true, messageId: data.id };
    } else {
      console.error(`❌ [Resend] Lỗi phản hồi từ API:`, data);
      return { success: false, error: data.message || JSON.stringify(data) };
    }
  } catch (err) {
    console.error(`❌ [Resend] Lỗi kết nối gửi email:`, err);
    return { success: false, error: err.message || String(err) };
  }
};

// ─── HTML Email Template: Order Deposit Confirmed ─────────────────────────────
const buildOrderConfirmHTML = ({ customerName, orderId, product, depositAmount, paidAt, giftLink, trackLink, address }) => {
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
                    <td style="padding:8px 0;font-size:13px;color:#8E847B;">Người đặt hàng</td>
                    <td style="padding:8px 0;font-size:13px;color:#2D2722;font-weight:600;">${customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:13px;color:#8E847B;">Nơi giao hàng</td>
                    <td style="padding:8px 0;font-size:13px;color:#2D2722;font-weight:600;">${address || "Chưa cung cấp"}</td>
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
             style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#E8B4A8 0%,#D4AF78 100%);color:#ffffff;text-decoration:none;border-radius:14px;font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:2px;box-shadow:0 6px 20px rgba(232,180,168,0.25);margin-bottom:12px;">
            Tạo Thiệp 3D Ngay
          </a>
          ${trackLink ? `
          <div style="margin-top:16px;">
            <p style="margin:0 0 8px;font-size:13px;color:#8E847B;line-height:1.5;">
              Bạn cũng có thể theo dõi tiến độ sản xuất mô hình Chibi tại đây:
            </p>
            <a href="${trackLink}"
               style="display:inline-block;padding:10px 24px;border:1px solid #C4A482;color:#C4A482;text-decoration:none;border-radius:10px;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:1px;background-color:#ffffff;">
              Theo Dõi Trạng Thế Đơn Hàng
            </a>
          </div>` : ""}
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
const sendOrderConfirmEmail = async ({ email, customerName, orderId, product, depositAmount, amount, paidAt, giftLink, trackLink, address }) => {
  console.log(`📧 [Email] sendOrderConfirmEmail called — to: ${email}, orderId: ${orderId}`);

  if (!email) {
    console.warn("⚠️ [Email] Bỏ qua — không có email khách hàng.");
    return { skipped: true, reason: "No customer email" };
  }

  return sendEmailViaResend({
    to: email,
    subject: `🎉 WEMO — Xác nhận đặt cọc đơn hàng ${orderId}`,
    html: buildOrderConfirmHTML({ customerName, orderId, product, depositAmount, paidAt, giftLink, trackLink, address }),
  });
};

// ─── Send Admin Alert ─────────────────────────────────────────────────────────
const sendAdminAlertEmail = async (orderData) => {
  console.log(`📧 [Email] sendAdminAlertEmail called — orderId: ${orderData?.orderId}`);
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim();

  if (!adminEmail) {
    console.warn("⚠️ [Email] Admin alert bỏ qua — thiếu ADMIN_EMAIL trong .env.");
    return { skipped: true, reason: "Missing ADMIN_EMAIL" };
  }

  return sendEmailViaResend({
    to: adminEmail,
    subject: `🔔 [WEMO] Đơn mới đặt cọc — ${orderData.orderId}`,
    html: buildAdminAlertHTML(orderData),
  });
};

module.exports = {
  sendOrderConfirmEmail,
  sendAdminAlertEmail,
};
