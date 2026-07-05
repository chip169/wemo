/**
 * Telegram Bot Notification — WEMO Admin Alerts
 * Hoàn toàn miễn phí, không cần đăng ký doanh nghiệp.
 *
 * Cấu hình trong .env:
 *   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHI...   (từ @BotFather)
 *   TELEGRAM_CHAT_ID=-100xxxxxxxxxx              (Group/Channel ID)
 *
 * Hướng dẫn tạo Bot (5 phút):
 *   1. Mở Telegram > Tìm @BotFather > /newbot
 *   2. Đặt tên bot: "WEMO Notification Bot"
 *   3. BotFather trả về BOT_TOKEN — copy vào .env
 *   4. Tạo group Telegram cho team WEMO
 *   5. Thêm bot vừa tạo vào group
 *   6. Gửi 1 tin nhắn trong group, rồi truy cập:
 *      https://api.telegram.org/bot<TOKEN>/getUpdates
 *   7. Lấy "chat.id" (số âm bắt đầu -100...) → TELEGRAM_CHAT_ID
 */

const https = require("https");

/**
 * Gửi message đến Telegram chat (hỗ trợ Markdown)
 */
const sendTelegramMessage = (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("⚠️ Telegram: Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID. Bỏ qua.");
    return Promise.resolve({ skipped: true });
  }

  const payload = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: "api.telegram.org",
      path: `/bot${token}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
      timeout: 8000,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => { data += c; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) {
            resolve({ success: true, messageId: parsed.result?.message_id });
          } else {
            console.error(`❌ Telegram error: ${parsed.description}`);
            resolve({ success: false, error: parsed.description });
          }
        } catch {
          resolve({ success: false, error: "parse_error" });
        }
      });
    });

    req.on("error", (err) => {
      console.error(`❌ Telegram request error: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
    req.on("timeout", () => {
      req.destroy();
      resolve({ success: false, error: "timeout" });
    });

    req.write(payload);
    req.end();
  });
};

/**
 * Thông báo đơn hàng mới đặt cọc thành công
 */
const notifyNewOrder = async (order) => {
  const {
    orderId,
    customerName,
    phone,
    address,
    product,
    amount,
    depositAmount,
    paidAt,
  } = order;

  const formattedDeposit = Number(depositAmount).toLocaleString("vi-VN");
  const formattedTotal = Number(amount).toLocaleString("vi-VN");
  const remaining = (Number(amount) - Number(depositAmount)).toLocaleString("vi-VN");
  const formattedDate = new Date(paidAt).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const message = `🎉 <b>[ĐÃ CỌC THÀNH CÔNG] ĐƠN HÀNG MỚI</b>

🟢 <b>Mã đơn:</b> <code>${orderId}</code>
🟢 <b>Khách hàng:</b> <b>${customerName}</b>
🟢 <b>Số điện thoại:</b> <code>${phone}</code>
🟢 <b>Nơi giao hàng:</b> ${address || "Chưa điền"}

📦 <b>Sản phẩm:</b> ${product || "Figure Chibi 3D"}
💰 <b>Tổng tiền:</b> ${formattedTotal}đ
✅ <b>Số tiền cọc:</b> <b>${formattedDeposit}đ</b> (ĐÃ THANH TOÁN)
⏳ <b>Còn lại:</b> ${remaining}đ

🕐 <b>Thời gian cọc:</b> ${formattedDate}

🚀 Đơn hàng đã chuyển sang trạng thái chờ sản xuất.`;

  const result = await sendTelegramMessage(message);

  if (result.skipped) {
    console.warn("⚠️ Telegram: bỏ qua (chưa cấu hình).");
  } else if (result.success) {
    console.log(`📱 Telegram: Đã gửi alert đơn ${orderId}`);
  }

  return result;
};

/**
 * Thông báo khi khách tạo xong thiệp
 */
const notifyGiftCreated = async ({ orderId, customerName, giftId, giftLink }) => {
  const message = `🎁 <b>THIỆP MỚI ĐƯỢC TẠO</b>

🧾 <b>Đơn hàng:</b> <code>${orderId}</code>
👤 <b>Khách:</b> ${customerName}
🔗 <b>Thiệp ID:</b> <code>${giftId}</code>
🌐 <b>Link:</b> <a href="${giftLink}">${giftLink}</a>

Thiệp đã sẵn sàng, đính kèm vào đơn sản xuất.`;

  return sendTelegramMessage(message);
};

/**
 * Thông báo đơn hàng mới đang chờ đặt cọc
 */
const notifyPendingPayment = async (order) => {
  const {
    orderId,
    customerName,
    phone,
    address,
    product,
    amount,
    depositAmount,
  } = order;

  const formattedDeposit = Number(depositAmount).toLocaleString("vi-VN");
  const formattedTotal = Number(amount).toLocaleString("vi-VN");
  const remaining = (Number(amount) - Number(depositAmount)).toLocaleString("vi-VN");
  const formattedDate = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const message = `⏳ <b>[CHỜ ĐẶT CỌC] ĐƠN HÀNG MỚI</b>

🟡 <b>Mã đơn:</b> <code>${orderId}</code>
🟡 <b>Khách hàng:</b> <b>${customerName}</b>
🟡 <b>Số điện thoại:</b> <code>${phone}</code>
🟡 <b>Nơi giao hàng:</b> ${address || "Chưa điền"}

📦 <b>Sản phẩm:</b> ${product || "Figure Chibi 3D"}
💰 <b>Tổng tiền:</b> ${formattedTotal}đ
⏳ <b>Yêu cầu cọc:</b> <b>${formattedDeposit}đ</b> (CHƯA THANH TOÁN)
⏳ <b>Còn lại:</b> ${remaining}đ

🕐 <b>Thời gian tạo:</b> ${formattedDate}

👉 Khách hàng đang ở trang thanh toán quét mã VietQR.`;

  const result = await sendTelegramMessage(message);

  if (result.skipped) {
    console.warn("⚠️ Telegram: bỏ qua (chưa cấu hình).");
  } else if (result.success) {
    console.log(`📱 Telegram: Đã gửi alert chờ cọc cho đơn ${orderId}`);
  }

  return result;
};

/**
 * Gửi thông báo tùy chỉnh (dùng cho debug/alerts khác)
 */
const notifyCustom = (text) => sendTelegramMessage(text);

module.exports = {
  notifyNewOrder,
  notifyGiftCreated,
  notifyPendingPayment,
  notifyCustom,
};

