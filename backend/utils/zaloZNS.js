/**
 * Zalo ZNS (Zalo Notification Service) Integration
 * 
 * Docs: https://developers.zalo.me/docs/zns
 * 
 * Cấu hình cần thiết trong .env:
 *   ZALO_APP_ID=your_app_id
 *   ZALO_SECRET_KEY=your_secret_key
 *   ZALO_OA_ACCESS_TOKEN=your_oa_access_token
 *   ZALO_TEMPLATE_ORDER_CONFIRM=your_template_id   (template "xác nhận đặt cọc")
 * 
 * Template mẫu đề xuất tạo trên Zalo OA:
 * ─────────────────────────────────────
 * Tên: WEMO - Xác nhận đặt cọc
 * Loại: Xác nhận giao dịch
 * Nội dung:
 *   🎉 WEMO đã nhận cọc của bạn!
 * 
 *   Xin chào {{customer_name}},
 *   Đơn hàng {{order_id}} đã được xác nhận đặt cọc thành công.
 * 
 *   📦 Sản phẩm: {{product}}
 *   💰 Số tiền cọc: {{deposit_amount}}đ
 *   📅 Thời gian: {{paid_at}}
 * 
 *   Bước tiếp theo: Tạo thiệp 3D tại link bên dưới.
 * ─────────────────────────────────────
 */

const https = require("https");

/**
 * Lấy Access Token từ App ID + Secret (nếu dùng App-based auth)
 * Hoặc dùng thẳng OA_ACCESS_TOKEN từ env (đơn giản hơn)
 */

/**
 * Gửi ZNS thông báo xác nhận đặt cọc cho khách hàng
 * 
 * @param {object} params
 * @param {string} params.phone - Số điện thoại người nhận (10 chữ số, bắt đầu 0)
 * @param {string} params.orderId - Mã đơn hàng (VD: ORD-123456)
 * @param {string} params.customerName - Tên khách hàng
 * @param {string} params.product - Tên sản phẩm
 * @param {number} params.depositAmount - Số tiền đặt cọc
 * @param {string} params.giftLink - Link tạo thiệp (VD: https://wemo.vn/create?orderId=ORD-123456)
 * @returns {Promise<object>} - Kết quả từ Zalo API
 */
const sendZNSOrderConfirmation = async ({
  phone,
  orderId,
  customerName,
  product,
  depositAmount,
  giftLink,
}) => {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  const templateId = process.env.ZALO_TEMPLATE_ORDER_CONFIRM;

  if (!accessToken || !templateId) {
    console.warn("⚠️ ZNS: Chưa cấu hình ZALO_OA_ACCESS_TOKEN hoặc ZALO_TEMPLATE_ORDER_CONFIRM trong .env. Bỏ qua gửi ZNS.");
    return { skipped: true, reason: "Missing Zalo credentials" };
  }

  // Chuẩn hóa số điện thoại: 0xxx -> 84xxx
  const normalizedPhone = phone.replace(/^0/, "84").replace(/[^0-9]/g, "");

  const now = new Date();
  const paidAtVN = now.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Template data — tên biến phải khớp với template đã tạo trên Zalo OA
  const templateData = {
    customer_name: customerName,
    order_id: orderId,
    product: product || "Figure Chibi 3D",
    deposit_amount: depositAmount.toLocaleString("vi-VN"),
    paid_at: paidAtVN,
  };

  const payload = {
    phone: normalizedPhone,
    template_id: templateId,
    template_data: templateData,
    tracking_id: orderId, // Dùng để đối chiếu sau này
  };

  // Nếu có giftLink, thêm vào button CTA của template
  if (giftLink && process.env.ZALO_TEMPLATE_HAS_BUTTON === "true") {
    payload.template_data.gift_link = giftLink;
  }

  console.log(`📱 ZNS: Đang gửi thông báo đến ${normalizedPhone} cho đơn ${orderId}...`);

  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(payload);

    const options = {
      hostname: "business.openapi.zalo.me",
      path: "/message/template",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": accessToken,
        "Content-Length": Buffer.byteLength(bodyStr),
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error === 0 || parsed.error === "0") {
            console.log(`✅ ZNS: Gửi thành công đến ${normalizedPhone}! Message ID: ${parsed.data?.message_id}`);
            resolve({ success: true, data: parsed.data });
          } else {
            console.error(`❌ ZNS Error ${parsed.error}: ${parsed.message}`);
            resolve({ success: false, error: parsed.error, message: parsed.message });
          }
        } catch (e) {
          console.error("❌ ZNS: Không parse được response:", data);
          resolve({ success: false, error: "parse_error", raw: data });
        }
      });
    });

    req.on("error", (err) => {
      console.error("❌ ZNS: Request error:", err.message);
      resolve({ success: false, error: err.message });
    });

    req.on("timeout", () => {
      req.destroy();
      console.error("❌ ZNS: Request timeout");
      resolve({ success: false, error: "timeout" });
    });

    req.write(bodyStr);
    req.end();
  });
};

/**
 * Gửi ZNS thông báo thiệp sắp hết hạn (nếu cần)
 */
const sendZNSGiftCreated = async ({ phone, customerName, orderId, giftId, giftLink }) => {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  const templateId = process.env.ZALO_TEMPLATE_GIFT_CREATED;

  if (!accessToken || !templateId) {
    console.warn("⚠️ ZNS Gift: Chưa cấu hình ZALO_TEMPLATE_GIFT_CREATED. Bỏ qua.");
    return { skipped: true };
  }

  const normalizedPhone = phone.replace(/^0/, "84").replace(/[^0-9]/g, "");

  const payload = {
    phone: normalizedPhone,
    template_id: templateId,
    template_data: {
      customer_name: customerName,
      order_id: orderId,
      gift_link: giftLink || `https://wemo.vn/gift/${giftId}`,
    },
    tracking_id: `gift_${giftId}`,
  };

  return new Promise((resolve) => {
    const bodyStr = JSON.stringify(payload);
    const options = {
      hostname: "business.openapi.zalo.me",
      path: "/message/template",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": accessToken,
        "Content-Length": Buffer.byteLength(bodyStr),
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ success: parsed.error === 0, data: parsed });
        } catch {
          resolve({ success: false });
        }
      });
    });

    req.on("error", () => resolve({ success: false }));
    req.on("timeout", () => { req.destroy(); resolve({ success: false }); });
    req.write(bodyStr);
    req.end();
  });
};

module.exports = {
  sendZNSOrderConfirmation,
  sendZNSGiftCreated,
};
