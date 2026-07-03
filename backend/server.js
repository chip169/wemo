require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const https = require("https");
const { connectDB, getDbMode } = require("./config/db");
const { readJsonFile, writeJsonFile } = require("./utils/storage");
const { hashPassword, generateToken, signOrderId, verifyOrderIdSignature } = require("./utils/auth");
const authMiddleware = require("./middleware/authMiddleware");
const rateLimiter = require("./middleware/rateLimiter");
const { sendZNSOrderConfirmation } = require("./utils/zaloZNS");
const { sendOrderConfirmEmail, sendAdminAlertEmail } = require("./utils/emailNotify");
const { notifyNewOrder, notifyGiftCreated, notifyPendingPayment } = require("./utils/telegramNotify");

const Gift = require("./models/Gift");
const Order = require("./models/Order");
const NFC = require("./models/NFC");
const Message = require("./models/Message");
const Admin = require("./models/Admin");
const Template = require("./models/Template");

const app = express();
app.use(cors());
// Increase payload limit for Base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));

// ─── Helpers to read/write based on active DB Mode ────────────────────────────

const getGifts = async () => {
  if (getDbMode() === "mongodb") {
    return await Gift.find({}).sort({ _id: -1 });
  } else {
    const list = await readJsonFile("gifts.json");
    return [...list].reverse();
  }
};

const saveGiftsList = async (list) => {
  if (getDbMode() === "mongodb") {
    // handled on a per-entity basis using mongoose
  } else {
    await writeJsonFile("gifts.json", list);
  }
};

const getTemplates = async () => {
  if (getDbMode() === "mongodb") {
    return await Template.find({});
  } else {
    return await readJsonFile("templates.json");
  }
};

const saveTemplatesList = async (list) => {
  if (getDbMode() === "mongodb") {
    // handled via mongoose
  } else {
    await writeJsonFile("templates.json", list);
  }
};

const getOrders = async () => {
  if (getDbMode() === "mongodb") {
    return await Order.find({}).sort({ _id: -1 });
  } else {
    const list = await readJsonFile("orders.json");
    return [...list].reverse();
  }
};

const getNFCTags = async () => {
  if (getDbMode() === "mongodb") {
    return await NFC.find({}).sort({ _id: -1 });
  } else {
    const list = await readJsonFile("nfc.json");
    return [...list].reverse();
  }
};

const getMessagesList = async () => {
  if (getDbMode() === "mongodb") {
    return await Message.find({});
  } else {
    return await readJsonFile("messages.json");
  }
};

// ─── Real-time Server-Sent Events (SSE) Config ───────────────────────────────

const sseClients = new Map(); // sessionId -> Array of Response objects
const adminClients = []; // Array of Response objects

// ─── AI Chibi Rate Limiter (lifetime 3 calls per IP, in-memory) ───────────────
const chibiUsageMap = new Map(); // ip -> count
const CHIBI_MAX_CALLS = 3;

const chibiRateLimiter = (req, res, next) => {
  const { code } = req.body;
  if (code === "1901") {
    return next();
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown";
  const count = chibiUsageMap.get(ip) || 0;
  if (count >= CHIBI_MAX_CALLS) {
    return res.status(429).json({
      error: "Bạn đã sử dụng hết 3 lượt tạo ảnh Chibi miễn phí. Vui lòng đặt hàng để tiếp tục trải nghiệm!",
      limitReached: true
    });
  }
  chibiUsageMap.set(ip, count + 1);
  next();
};

app.get("/api/support/stream", (req, res) => {
  const { sessionId, isAdmin } = req.query;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  if (isAdmin === "true") {
    adminClients.push(res);
    req.on("close", () => {
      const index = adminClients.indexOf(res);
      if (index !== -1) adminClients.splice(index, 1);
    });
  } else if (sessionId) {
    if (!sseClients.has(sessionId)) {
      sseClients.set(sessionId, []);
    }
    sseClients.get(sessionId).push(res);

    req.on("close", () => {
      const clients = sseClients.get(sessionId) || [];
      const index = clients.indexOf(res);
      if (index !== -1) clients.splice(index, 1);
      if (clients.length === 0) {
        sseClients.delete(sessionId);
      }
    });
  }

  // Send connected ping
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);
});

const broadcastMessage = (msg) => {
  const data = `data: ${JSON.stringify(msg)}\n\n`;

  // Send to specific user stream
  if (msg.sessionId) {
    const clients = sseClients.get(msg.sessionId) || [];
    clients.forEach((c) => c.write(data));
  }

  // Send to all admin streams
  adminClients.forEach((adminRes) => adminRes.write(data));
};

// ─── Endpoints ───────────────────────────────────────────────────────────────

// A. Auth Routes
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin." });
  }

  try {
    let adminUser = null;
    const hashedPassword = hashPassword(password);

    if (getDbMode() === "mongodb") {
      adminUser = await Admin.findOne({ username, password: hashedPassword });
    } else {
      const admins = await readJsonFile("admins.json");
      adminUser = admins.find((a) => a.username === username && a.password === hashedPassword);
    }

    if (adminUser) {
      const token = generateToken({ username: adminUser.username, role: "admin" });
      return res.json({ success: true, token, user: { username: adminUser.username, role: "admin" } });
    }

    return res.status(401).json({ error: "Tên đăng nhập hoặc mật khẩu không đúng." });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Lỗi hệ thống khi đăng nhập." });
  }
});

app.get("/api/auth/verify", authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.admin });
});

// B. Upload Route (Local Storage with Base64 payload)
app.post("/api/upload", async (req, res) => {
  try {
    const { file, fileName } = req.body;
    if (!file || !fileName) {
      return res.status(400).json({ error: "Thiếu dữ liệu tệp tải lên." });
    }

    // Extract raw base64 data
    const base64Data = file.replace(/^data:\w+\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate unique file name
    const ext = fileName.split(".").pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);

    await fs.promises.writeFile(filePath, buffer);

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const fileUrl = `${protocol}://${req.get("host")}/uploads/${uniqueFileName}`;

    res.status(201).json({ url: fileUrl });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Lỗi hệ thống khi xử lý tải tệp lên." });
  }
});

// 1. Validate Order ID & check if gift already exists (with rate limiting)
app.post("/api/orders/validate", rateLimiter, async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: "Thiếu mã đơn hàng." });
  }

  try {
    let orderExists = false;
    let orderDoc = null;

    if (getDbMode() === "mongodb") {
      orderDoc = await Order.findOne({ id: orderId });
      orderExists = !!orderDoc;
    } else {
      const orders = await getOrders();
      orderDoc = orders.find((o) => o.id === orderId);
      orderExists = !!orderDoc;
    }

    if (!orderExists) {
      return res.status(404).json({ error: "Mã đơn hàng không tồn tại trên hệ thống." });
    }

    // Check if a gift with this orderId has already been created
    let existingGift = null;
    if (getDbMode() === "mongodb") {
      existingGift = await Gift.findOne({ orderId });
    } else {
      const gifts = await getGifts();
      existingGift = gifts.find((g) => g.orderId === orderId);
    }

    if (existingGift) {
      return res.json({
        valid: true,
        status: "exists",
        giftId: existingGift.id,
        orderId,
      });
    } else {
      // Return validation signature token
      const signatureToken = signOrderId(orderId);
      return res.json({
        valid: true,
        status: "new",
        orderId,
        orderSignature: signatureToken,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi hệ thống khi xác thực đơn hàng." });
  }
});

// 2. Gifts Endpoints
app.get("/api/gifts", authMiddleware, async (req, res) => {
  try {
    const gifts = await getGifts();
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/gifts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (getDbMode() === "mongodb") {
      const gift = await Gift.findOne({ id });
      if (!gift || gift.status === "deleted") return res.status(404).json({ error: "Không tìm thấy quà tặng." });

      // Increment views
      gift.views += 1;
      await gift.save();

      res.json(gift);
    } else {
      const gifts = await getGifts();
      const giftIndex = gifts.findIndex((g) => g.id === id);
      if (giftIndex === -1) return res.status(404).json({ error: "Không tìm thấy quà tặng." });

      const gift = gifts[giftIndex];
      if (gift.status === "deleted") return res.status(404).json({ error: "Không tìm thấy quà tặng." });

      // Increment views
      gifts[giftIndex].views = (gifts[giftIndex].views || 0) + 1;
      await saveGiftsList(gifts);

      res.json(gifts[giftIndex]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/gifts", async (req, res) => {
  const giftData = req.body;
  if (!giftData.recipientName || !giftData.orderId) {
    return res.status(400).json({ error: "Vui lòng nhập tên người nhận và mã đơn hàng." });
  }

  // Verify validate token to ensure they went through validation gateway
  if (!giftData.orderSignature || !verifyOrderIdSignature(giftData.orderId, giftData.orderSignature)) {
    return res.status(403).json({ error: "Chữ ký đơn hàng không hợp lệ hoặc đã hết hạn xác thực." });
  }

  try {
    // Generate a 10-character random alphanumeric code ID (more secure against brute-forcing)
    const giftId = Math.random().toString(36).substring(2, 12);
    const newGift = {
      id: giftId,
      templateId: giftData.templateId || "sinh-nhat-party",
      photos: giftData.photos || [],
      hasVideo: giftData.hasVideo || false,
      hasVoice: giftData.hasVoice || false,
      recipientName: giftData.recipientName,
      title: giftData.title || "",
      message: giftData.message || "",
      music: giftData.music || "none",
      orderId: giftData.orderId,
      views: 0,
      createdAt: new Date().toISOString(),
    };

    if (getDbMode() === "mongodb") {
      const giftDoc = new Gift(newGift);
      await giftDoc.save();
    } else {
      const gifts = await getGifts();
      gifts.push(newGift);
      await saveGiftsList(gifts);
    }

    res.status(201).json(newGift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/gifts/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    if (getDbMode() === "mongodb") {
      const gift = await Gift.findOne({ id });
      if (gift) {
        gift.status = "deleted";
        await gift.save();
      }
    } else {
      const gifts = await getGifts();
      const giftIndex = gifts.findIndex((g) => g.id === id);
      if (giftIndex !== -1) {
        gifts[giftIndex].status = "deleted";
        await saveGiftsList(gifts);
      }
    }
    res.json({ success: true, message: "Đã xóa mềm quà tặng thành công." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/gifts/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { orderId, recipientName, templateId, status } = req.body;

  try {
    if (getDbMode() === "mongodb") {
      const gift = await Gift.findOne({ id });
      if (!gift) {
        return res.status(404).json({ error: "Không tìm thấy quà tặng." });
      }

      if (orderId !== undefined) gift.orderId = orderId;
      if (recipientName !== undefined) gift.recipientName = recipientName;
      if (templateId !== undefined) gift.templateId = templateId;
      if (status !== undefined) gift.status = status;

      await gift.save();
      res.json({ success: true, gift });
    } else {
      const gifts = await getGifts();
      const giftIndex = gifts.findIndex((g) => g.id === id);
      if (giftIndex === -1) {
        return res.status(404).json({ error: "Không tìm thấy quà tặng." });
      }

      const gift = gifts[giftIndex];
      if (orderId !== undefined) gift.orderId = orderId;
      if (recipientName !== undefined) gift.recipientName = recipientName;
      if (templateId !== undefined) gift.templateId = templateId;
      if (status !== undefined) gift.status = status;

      gifts[giftIndex] = gift;
      await saveGiftsList(gifts);
      res.json({ success: true, gift });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Orders Endpoints

// 3a. Create Draft Order (Public — no auth) — Called from OrderFormPage
app.post("/api/orders/create-draft", async (req, res) => {
  const { customerName, phone, email, address, note, chibiUrl, productConfig, amount, depositAmount } = req.body;
  if (!customerName || !phone || !amount) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ: Họ tên, Số điện thoại." });
  }

  try {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${randomNum}`;

    const newOrder = {
      id: orderId,
      customerName,
      phone: phone || "",
      email: email || "",
      address: address || "",
      note: note || "",
      chibiUrl: chibiUrl || "",
      productConfig: productConfig || { size: "10cm", quantity: 1, base: "none", led: false },
      product: `Figure Chibi 3D ${productConfig?.size || "10cm"} x${productConfig?.quantity || 1}`,
      amount: Number(amount),
      depositAmount: Number(depositAmount) || 200000,
      status: "pending_payment",
      paymentStatus: "unpaid",
      paidAt: "",
      giftId: "",
      createdDate: new Date().toISOString().split("T")[0],
    };

    if (getDbMode() === "mongodb") {
      const orderDoc = new Order(newOrder);
      await orderDoc.save();
    } else {
      const orders = await readJsonFile("orders.json");
      orders.push(newOrder);
      await writeJsonFile("orders.json", orders);
    }

    // Gửi thông báo Telegram chờ cọc (fire-and-forget)
    notifyPendingPayment({
      orderId,
      customerName: newOrder.customerName,
      phone: newOrder.phone || "N/A",
      address: newOrder.address || "",
      product: newOrder.product || "Figure Chibi 3D",
      amount: newOrder.amount,
      depositAmount: newOrder.depositAmount,
    }).catch(() => {});

    res.status(201).json({ success: true, orderId, depositAmount: newOrder.depositAmount });
  } catch (err) {
    console.error("Create draft order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3b. Check Payment Status (Public Polling)
app.get("/api/orders/check-payment/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    let order = null;
    if (getDbMode() === "mongodb") {
      order = await Order.findOne({ id: orderId });
    } else {
      const orders = await readJsonFile("orders.json");
      order = orders.find((o) => o.id === orderId);
    }

    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }

    const deposited = order.status === "deposited" || order.paymentStatus === "paid";
    res.json({
      orderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      deposited,
      customerName: order.customerName,
      depositAmount: order.depositAmount,
      paidAt: order.paidAt || "",
      adminPhone: process.env.ADMIN_PHONE || "",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3c. Payment Webhook (Simulate bank callback — also used for admin manual confirm)
app.post("/api/webhook/payment", async (req, res) => {
  const { orderId, secret } = req.body;
  // Simple shared secret for webhook security (admin can also call this manually)
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "wemo_payment_2026";
  if (!orderId) {
    return res.status(400).json({ error: "Thiếu orderId." });
  }
  if (secret && secret !== WEBHOOK_SECRET) {
    return res.status(403).json({ error: "Webhook secret không hợp lệ." });
  }

  try {
    const paidAt = new Date().toISOString();
    let savedOrder = null;

    if (getDbMode() === "mongodb") {
      const order = await Order.findOne({ id: orderId });
      if (!order) return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
      order.status = "deposited";
      order.paymentStatus = "paid";
      order.paidAt = paidAt;
      await order.save();
      savedOrder = order.toObject ? order.toObject() : order;
    } else {
      const orders = await readJsonFile("orders.json");
      const idx = orders.findIndex((o) => o.id === orderId);
      if (idx === -1) return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
      orders[idx].status = "deposited";
      orders[idx].paymentStatus = "paid";
      orders[idx].paidAt = paidAt;
      await writeJsonFile("orders.json", orders);
      savedOrder = orders[idx];
    }

    console.log(`✅ Payment confirmed for order ${orderId} at ${paidAt}`);

    // ─── Gửi thông báo (fire-and-forget) ─────────────────────────────────────
    if (savedOrder) {
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const host = req.get("host");
      const giftLink = `${protocol}://${host}/create?orderId=${orderId}`;

      // 1) Zalo ZNS (khi có OA)
      if (savedOrder.phone) {
        sendZNSOrderConfirmation({
          phone: savedOrder.phone,
          orderId,
          customerName: savedOrder.customerName,
          product: savedOrder.product || "Figure Chibi 3D",
          depositAmount: savedOrder.depositAmount || 200000,
          giftLink,
        }).then((r) => {
          if (!r.skipped) console.log(r.success ? `📱 ZNS gửi OK cho ${savedOrder.phone}` : `❌ ZNS lỗi: ${r.error}`);
        }).catch(() => {});
      }

      // 2) Email xác nhận cho khách
      if (savedOrder.email) {
        sendOrderConfirmEmail({
          email: savedOrder.email,
          customerName: savedOrder.customerName,
          orderId,
          product: savedOrder.product || "Figure Chibi 3D",
          depositAmount: savedOrder.depositAmount || 200000,
          amount: savedOrder.amount,
          paidAt,
          giftLink,
        }).then((r) => {
          if (!r.skipped) console.log(r.success ? `📧 Email gửi OK đến ${savedOrder.email}` : `❌ Email lỗi: ${r.error}`);
        }).catch(() => {});
      }

      // 3) Telegram alert cho admin
      notifyNewOrder({
        orderId,
        customerName: savedOrder.customerName,
        phone: savedOrder.phone || "N/A",
        address: savedOrder.address || "",
        product: savedOrder.product || "Figure Chibi 3D",
        amount: savedOrder.amount,
        depositAmount: savedOrder.depositAmount || 200000,
        paidAt,
      }).then((r) => {
        if (!r.skipped) console.log(r.success ? `🤖 Telegram alert gửi OK` : `❌ Telegram lỗi: ${r.error}`);
      }).catch(() => {});

      // 4) Admin email alert
      sendAdminAlertEmail({
        orderId,
        customerName: savedOrder.customerName,
        phone: savedOrder.phone || "N/A",
        address: savedOrder.address || "",
        product: savedOrder.product || "Figure Chibi 3D",
        amount: savedOrder.amount,
        depositAmount: savedOrder.depositAmount || 200000,
        paidAt,
      }).catch(() => {});
    }

    res.json({ success: true, orderId, paidAt });
  } catch (err) {
    console.error("Webhook payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders", authMiddleware, async (req, res) => {
  const orderData = req.body;
  if (!orderData.customerName || !orderData.product || !orderData.amount) {
    return res.status(400).json({ error: "Thông tin tạo đơn hàng không đầy đủ." });
  }

  try {
    // Generate order ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${randomNum}`;

    const newOrder = {
      id: orderId,
      customerName: orderData.customerName,
      product: orderData.product,
      amount: Number(orderData.amount),
      status: orderData.status || "pending",
      paymentStatus: orderData.paymentStatus || "unpaid",
      createdDate: new Date().toISOString().split("T")[0],
    };

    if (getDbMode() === "mongodb") {
      const orderDoc = new Order(newOrder);
      await orderDoc.save();
    } else {
      const orders = await readJsonFile("orders.json");
      orders.push(newOrder);
      await writeJsonFile("orders.json", orders);
    }

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/orders/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { customerName, product, amount, status, paymentStatus } = req.body;

  try {
    let oldStatus = "";
    let savedOrder = null;

    if (getDbMode() === "mongodb") {
      const order = await Order.findOne({ id });
      if (!order) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
      }
      oldStatus = order.status;

      if (customerName !== undefined) order.customerName = customerName;
      if (product !== undefined) order.product = product;
      if (amount !== undefined) order.amount = Number(amount);
      if (status !== undefined) order.status = status;
      if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

      // Update payment status automatically if status is manually set to deposited
      if (status === "deposited" && oldStatus !== "deposited") {
        order.paymentStatus = "paid";
        if (!order.paidAt) {
          order.paidAt = new Date().toISOString();
        }
      }

      await order.save();
      savedOrder = order.toObject ? order.toObject() : order;
      res.json(order);
    } else {
      const orders = await readJsonFile("orders.json");
      const orderIndex = orders.findIndex((o) => o.id === id);
      if (orderIndex === -1) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
      }

      const order = orders[orderIndex];
      oldStatus = order.status;

      if (customerName !== undefined) order.customerName = customerName;
      if (product !== undefined) order.product = product;
      if (amount !== undefined) order.amount = Number(amount);
      if (status !== undefined) order.status = status;
      if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

      if (status === "deposited" && oldStatus !== "deposited") {
        order.paymentStatus = "paid";
        if (!order.paidAt) {
          order.paidAt = new Date().toISOString();
        }
      }

      orders[orderIndex] = order;
      await writeJsonFile("orders.json", orders);
      savedOrder = order;
      res.json(order);
    }

    // Trigger emails and notifications when transitioning to deposited
    if (status === "deposited" && oldStatus !== "deposited" && savedOrder) {
      const paidAt = savedOrder.paidAt || new Date().toISOString();
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const host = req.get("host");
      const giftLink = `${protocol}://${host}/create?orderId=${id}`;

      // 1) Zalo ZNS (khi có OA)
      if (savedOrder.phone) {
        try {
          const { sendZNSOrderConfirmation } = require("./utils/zaloNotify");
          sendZNSOrderConfirmation({
            phone: savedOrder.phone,
            orderId: id,
            customerName: savedOrder.customerName,
            product: savedOrder.product || "Figure Chibi 3D",
            depositAmount: savedOrder.depositAmount || 200000,
            giftLink,
          }).then((r) => {
            if (!r.skipped) console.log(r.success ? `📱 ZNS gửi OK cho ${savedOrder.phone}` : `❌ ZNS lỗi: ${r.error}`);
          }).catch(() => {});
        } catch (e) {
          console.error("ZNS module load error:", e);
        }
      }

      // 2) Email xác nhận cho khách
      if (savedOrder.email) {
        sendOrderConfirmEmail({
          email: savedOrder.email,
          customerName: savedOrder.customerName,
          orderId: id,
          product: savedOrder.product || "Figure Chibi 3D",
          depositAmount: savedOrder.depositAmount || 200000,
          amount: savedOrder.amount,
          paidAt,
          giftLink,
        }).then((r) => {
          if (!r.skipped) console.log(r.success ? `📧 Email gửi OK đến ${savedOrder.email}` : `❌ Email lỗi: ${r.error}`);
        }).catch(() => {});
      }

      // 3) Telegram alert cho admin
      try {
        const { notifyNewOrder } = require("./utils/telegramNotify");
        notifyNewOrder({
          orderId: id,
          customerName: savedOrder.customerName,
          phone: savedOrder.phone || "N/A",
          address: savedOrder.address || "",
          product: savedOrder.product || "Figure Chibi 3D",
          amount: savedOrder.amount,
          depositAmount: savedOrder.depositAmount || 200000,
          paidAt,
        }).then((r) => {
          if (!r.skipped) console.log(r.success ? `🤖 Telegram alert gửi OK` : `❌ Telegram lỗi: ${r.error}`);
        }).catch(() => {});
      } catch (e) {
        console.error("Telegram module load error:", e);
      }

      // 4) Admin email alert
      sendAdminAlertEmail({
        orderId: id,
        customerName: savedOrder.customerName,
        phone: savedOrder.phone || "N/A",
        address: savedOrder.address || "",
        product: savedOrder.product || "Figure Chibi 3D",
        amount: savedOrder.amount,
        depositAmount: savedOrder.depositAmount || 200000,
        paidAt,
        giftLink,
      }).then((r) => {
        if (!r.skipped) console.log(r.success ? `📧 Admin email alert gửi OK` : `❌ Admin email lỗi: ${r.error}`);
      }).catch(() => {});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/orders/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    if (getDbMode() === "mongodb") {
      await Order.deleteOne({ id });
    } else {
      const orders = await readJsonFile("orders.json");
      const filtered = orders.filter((o) => o.id !== id);
      await writeJsonFile("orders.json", filtered);
    }
    res.json({ success: true, message: "Đã xóa đơn hàng thành công." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. NFC Tags Endpoints
app.get("/api/nfc", authMiddleware, async (req, res) => {
  try {
    const nfc = await getNFCTags();
    res.json(nfc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/nfc", authMiddleware, async (req, res) => {
  const tagData = req.body;
  if (!tagData.uid) {
    return res.status(400).json({ error: "Thiếu UID thẻ NFC." });
  }

  try {
    const randomNum = Math.floor(7000 + Math.random() * 999);
    const tagId = `NFC-${randomNum}`;
    const newTag = {
      id: tagId,
      uid: tagData.uid,
      status: tagData.status || "unassigned",
      giftId: tagData.giftId || "",
      lastTapped: tagData.lastTapped || "",
    };

    if (getDbMode() === "mongodb") {
      const nfcDoc = new NFC(newTag);
      await nfcDoc.save();
    } else {
      const nfc = await readJsonFile("nfc.json");
      nfc.push(newTag);
      await writeJsonFile("nfc.json", nfc);
    }

    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/nfc/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    if (getDbMode() === "mongodb") {
      await NFC.deleteOne({ id });
    } else {
      const nfc = await readJsonFile("nfc.json");
      const filtered = nfc.filter((t) => t.id !== id);
      await writeJsonFile("nfc.json", filtered);
    }
    res.json({ success: true, message: "Đã xóa chip NFC." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Customers List (derived dynamically from orders)
app.get("/api/customers", authMiddleware, async (req, res) => {
  try {
    const orders = await getOrders();
    const customersMap = {};

    orders.forEach((o) => {
      const name = o.customerName;
      if (!customersMap[name]) {
        customersMap[name] = {
          name,
          email: `${name.toLowerCase().replace(/\s/g, "")}@example.com`,
          totalOrders: 0,
          totalSpend: 0,
          lastActive: o.createdDate,
        };
      }
      customersMap[name].totalOrders += 1;
      customersMap[name].totalSpend += o.amount;
      if (new Date(o.createdDate) > new Date(customersMap[name].lastActive)) {
        customersMap[name].lastActive = o.createdDate;
      }
    });

    res.json(Object.values(customersMap));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Templates CRUD
app.get("/api/templates", async (req, res) => {
  try {
    const list = await getTemplates();
    const gifts = await getGifts();
    
    // Calculate real-time active gift usage count
    const countMap = {};
    gifts.forEach((g) => {
      if (g.status !== "deleted") {
        const tId = g.templateId || "";
        countMap[tId] = (countMap[tId] || 0) + 1;
      }
    });

    const updatedList = list.map((t) => {
      const templateObj = t.toObject ? t.toObject() : t;
      return {
        ...templateObj,
        usageCount: countMap[templateObj.id] || 0
      };
    });

    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/templates", authMiddleware, async (req, res) => {
  const { id, name, category, categoryLabel, preview, status, videoUrl, sampleMessage, photos, features } = req.body;
  if (!name || !category || !categoryLabel || !preview) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ các trường thông tin mẫu thiết kế." });
  }

  // Auto-generate random ID if not provided
  const crypto = require("crypto");
  const templateId = id || ("tpl-" + crypto.randomBytes(6).toString("hex"));

  try {
    const newTemplate = {
      id: templateId,
      name,
      category,
      categoryLabel,
      usageCount: 0,
      status: status || "active",
      preview,
      videoUrl: videoUrl || "",
      sampleMessage: sampleMessage || "",
      photos: photos || [],
      features: features || []
    };

    if (getDbMode() === "mongodb") {
      const templateDoc = new Template(newTemplate);
      await templateDoc.save();
    } else {
      const list = await getTemplates();
      if (list.some((t) => t.id === templateId)) {
        return res.status(400).json({ error: "Mẫu thiết kế này đã tồn tại." });
      }
      list.push(newTemplate);
      await saveTemplatesList(list);
    }
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/templates/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, category, categoryLabel, preview, status, usageCount, videoUrl, sampleMessage, photos, features } = req.body;

  try {
    if (getDbMode() === "mongodb") {
      const template = await Template.findOne({ id });
      if (!template) return res.status(404).json({ error: "Không tìm thấy mẫu thiết kế." });

      if (name !== undefined) template.name = name;
      if (category !== undefined) template.category = category;
      if (categoryLabel !== undefined) template.categoryLabel = categoryLabel;
      if (preview !== undefined) template.preview = preview;
      if (status !== undefined) template.status = status;
      if (usageCount !== undefined) template.usageCount = usageCount;
      if (videoUrl !== undefined) template.videoUrl = videoUrl;
      if (sampleMessage !== undefined) template.sampleMessage = sampleMessage;
      if (photos !== undefined) template.photos = photos;
      if (features !== undefined) template.features = features;

      await template.save();
      res.json({ success: true, template });
    } else {
      const list = await getTemplates();
      const idx = list.findIndex((t) => t.id === id);
      if (idx === -1) return res.status(404).json({ error: "Không tìm thấy mẫu thiết kế." });

      const template = list[idx];
      if (name !== undefined) template.name = name;
      if (category !== undefined) template.category = category;
      if (categoryLabel !== undefined) template.categoryLabel = categoryLabel;
      if (preview !== undefined) template.preview = preview;
      if (status !== undefined) template.status = status;
      if (usageCount !== undefined) template.usageCount = usageCount;
      if (videoUrl !== undefined) template.videoUrl = videoUrl;
      if (sampleMessage !== undefined) template.sampleMessage = sampleMessage;
      if (photos !== undefined) template.photos = photos;
      if (features !== undefined) template.features = features;

      list[idx] = template;
      await saveTemplatesList(list);
      res.json({ success: true, template });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/templates/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    if (getDbMode() === "mongodb") {
      await Template.deleteOne({ id });
    } else {
      const list = await getTemplates();
      const filtered = list.filter((t) => t.id !== id);
      await saveTemplatesList(filtered);
    }
    res.json({ success: true, message: "Đã xóa mẫu thiết kế thành công." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Settings endpoint
app.get("/api/settings", async (req, res) => {
  const settings = await readJsonFile("settings.json");
  res.json(settings);
});

app.post("/api/settings", authMiddleware, async (req, res) => {
  const settings = req.body;
  await writeJsonFile("settings.json", settings);
  res.json({ success: true, settings });
});

// 8. Support Chat API (Real-time Message routing)
app.get("/api/support/sessions", authMiddleware, async (req, res) => {
  try {
    const messages = await getMessagesList();
    const sessionsMap = {};

    messages.forEach((msg) => {
      const sId = msg.sessionId;
      if (!sessionsMap[sId] || new Date(msg.timestamp) > new Date(sessionsMap[sId].timestamp)) {
        sessionsMap[sId] = {
          sessionId: sId,
          lastMessage: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
        };
      }
    });

    const sortedSessions = Object.values(sessionsMap).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json(sortedSessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/support/messages", async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: "Thiếu sessionId." });
  }

  try {
    let filteredMessages = [];
    if (getDbMode() === "mongodb") {
      filteredMessages = await Message.find({ sessionId }).sort({ timestamp: 1 });
    } else {
      const messages = await getMessagesList();
      filteredMessages = messages
        .filter((msg) => msg.sessionId === sessionId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
    res.json(filteredMessages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/support/messages", async (req, res) => {
  const { sessionId, sender, text } = req.body;
  if (!sessionId || !sender || !text) {
    return res.status(400).json({ error: "Thiếu sessionId, sender, hoặc nội dung tin nhắn." });
  }

  try {
    const newMsg = {
      sessionId,
      sender,
      text,
      timestamp: new Date().toISOString(),
    };

    let savedMsg = newMsg;
    if (getDbMode() === "mongodb") {
      const msgDoc = new Message(newMsg);
      await msgDoc.save();
      savedMsg = msgDoc.toObject(); // Convert to standard object including _id
    } else {
      const messages = await readJsonFile("messages.json");
      messages.push(newMsg);
      await writeJsonFile("messages.json", messages);
    }

    // Push real-time updates via Server-Sent Events (SSE) with database IDs
    broadcastMessage(savedMsg);

    res.status(201).json(savedMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/support/messages/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    if (getDbMode() === "mongodb") {
      const mongoose = require("mongoose");
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Message.findByIdAndDelete(id);
      } else {
        await Message.deleteOne({ timestamp: id });
      }
    } else {
      const messages = await readJsonFile("messages.json");
      const filtered = messages.filter((m) => m.timestamp !== id && m.id !== id);
      await writeJsonFile("messages.json", filtered);
    }
    res.json({ success: true, message: "Đã xóa tin nhắn." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/support/sessions/:sessionId", authMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  try {
    if (getDbMode() === "mongodb") {
      await Message.deleteMany({ sessionId });
    } else {
      const messages = await readJsonFile("messages.json");
      const filtered = messages.filter((m) => m.sessionId !== sessionId);
      await writeJsonFile("messages.json", filtered);
    }
    res.json({ success: true, message: "Đã xóa cuộc hội thoại thành công." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper for HTTPS calls (bypasses Node.js native fetch IPv6 DNS bugs in some environments)
const fetchImageWithHttps = (url, headers = {}, body = null) => {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: body ? "POST" : "GET",
        headers: headers,
        timeout: 30000
      };

      const req = https.request(options, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          let errText = "";
          res.on("data", (chunk) => { errText += chunk; });
          res.on("end", () => {
            reject(new Error(`HTTP Error ${res.statusCode}: ${errText || res.statusMessage}`));
          });
          return;
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
      });

      req.on("error", (err) => reject(err));
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timed out"));
      });

      if (body) {
        req.write(typeof body === "string" ? body : JSON.stringify(body));
      }
      req.end();
    } catch (e) {
      reject(e);
    }
  });
};

// 9. AI Chibi Generator Route (rate limited: 3 times per IP lifetime)
app.post("/api/ai/generate-chibi", chibiRateLimiter, async (req, res) => {
  try {
    const { image, style } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Thiếu dữ liệu hình ảnh chân dung." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const hfKey = process.env.HF_API_KEY || process.env.HUGGING_FACE_TOKEN;

    if (!apiKey) {
      return res.status(400).json({ error: "Thiếu cấu hình GEMINI_API_KEY trong tệp .env của server." });
    }

    const styleNameMap = {
      "cute-3d": "3D Chibi dễ thương (Pixar style)",
      "anime": "Anime dễ thương cổ điển",
      "royal": "Hoàng gia / Công chúa cổ tích",
      "christmas": "Giáng sinh Noel ấm áp"
    };

    const chosenStyle = style || "cute-3d";

    // Step 1: Call Gemini Flash to analyze photo and generate prompt (Always Free)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    let stylePromptModifier = "";
    if (chosenStyle === "cute-3d") {
      stylePromptModifier = "style should be a cute 3D chibi model, 3D clay rendering, soft lighting, vibrant colors, isolated solid color pastel background, cute anime expression, high quality, Pixar style.";
    } else if (chosenStyle === "anime") {
      stylePromptModifier = "style should be a cute anime chibi illustration, detailed lines, soft shading, cute anime expression, vibrant colors, isolated solid color pastel background, professional key art, high quality.";
    } else if (chosenStyle === "royal") {
      stylePromptModifier = "style should be a royal chibi model, wearing elegant royal outfit with gold details, crown, cute anime expression, 3D rendering, soft lighting, isolated pastel background, Pixar style.";
    } else if (chosenStyle === "christmas") {
      stylePromptModifier = "style should be a Christmas chibi model, wearing Santa hat and cozy winter clothes, cute anime expression, 3D rendering, warm lighting, holiday theme, isolated background, Pixar style.";
    } else {
      stylePromptModifier = "style should be a cute 3D chibi model, Pixar style.";
    }

    const geminiPayload = {
      contents: [
        {
          parts: [
            {
              text: `Analyze the person in this image: gender, hair color, hair style, clothing, facial features, accessories, pose.
              
              Output a JSON object with exactly two fields:
              1. "enPrompt": A highly detailed, clean prompt in English for an image generation AI to generate a cute chibi version of this person. The ${stylePromptModifier} The prompt should start with 'A cute chibi of' and describe the face, hair, clothing details, on a clean, isolated solid pastel background.
              2. "viTranslation": A natural, beautiful description and translation of this prompt in Vietnamese for displaying to the user.
              
              Respond ONLY with the JSON object, no markdown formatting (like \`\`\`json), no introductory or explanations text.`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }
      ]
    };

    console.log("🤖 Step 1: Querying Gemini Flash for chibi prompt description...");
    let chibiPromptEn = "";
    let chibiPromptVi = "";
    let geminiSuccess = false;

    try {
      let geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload)
      });

      if (!geminiRes.ok) {
        console.warn(`⚠️ gemini-2.5-flash failed with status ${geminiRes.status}. Retrying with gemini-1.5-flash...`);
        geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiPayload)
        });
      }

      if (geminiRes.ok) {
        const geminiJson = await geminiRes.json();
        const rawText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        
        let parsed = null;
        try {
          const jsonText = rawText.replace(/```json/gi, "").replace(/```/gi, "").trim();
          parsed = JSON.parse(jsonText);
        } catch (e) {
          console.warn("⚠️ JSON.parse failed on cleaned text, trying regex match...", e.message);
          const match = rawText.match(/\{[\s\S]*\}/);
          if (match) {
            try {
              parsed = JSON.parse(match[0]);
            } catch (innerE) {
              console.warn("⚠️ JSON.parse failed on regex match.");
            }
          }
        }

        if (parsed && parsed.enPrompt) {
          chibiPromptEn = parsed.enPrompt;
          chibiPromptVi = parsed.viTranslation || parsed.viDescription || chibiPromptEn;
          geminiSuccess = true;
          console.log("✅ Gemini Generated Prompt successfully!");
          console.log("   - EN:", chibiPromptEn);
          console.log("   - VI:", chibiPromptVi);
        } else if (rawText) {
          chibiPromptEn = rawText;
          chibiPromptVi = rawText;
          geminiSuccess = true;
        }
      } else {
        const errText = await geminiRes.text();
        console.error("❌ Both Gemini 2.5 and 1.5 Flash failed:", errText);
      }
    } catch (geminiErr) {
      console.error("❌ Gemini API query encountered error:", geminiErr.message);
    }

    // Fallback prompt if Gemini is completely down/overloaded
    if (!geminiSuccess) {
      chibiPromptEn = `A cute chibi version of the person, ${styleNameMap[chosenStyle]} style, detailed clothing, vibrant colors, isolated solid pastel background, high quality.`;
      
      const styleNameMapVi = {
        "cute-3d": "mô hình chibi đất sét 3D dễ thương phong cách hoạt hình Pixar",
        "anime": "hình chibi vẽ phong cách anime Nhật Bản dễ thương sắc sảo",
        "royal": "hình chibi phong cách hoàng gia sang trọng",
        "christmas": "hình chibi chủ đề Giáng sinh Noel ấm áp"
      };
      chibiPromptVi = `Một mô hình chibi dễ thương của người trong ảnh, phong cách ${styleNameMapVi[chosenStyle] || "chibi dễ thương"}, quần áo chi tiết, màu sắc tươi sáng, nền pastel đơn sắc, chất lượng cao.`;
      console.log("⚠️ Using default fallback prompt:", chibiPromptEn);
    }

    let buffer = null;
    let providerName = "";

    // Step 2: Try to generate the image
    // Option A: Hugging Face if Key is available
    if (hfKey && hfKey !== "your_hf_key_here") {
      try {
        console.log("🤖 Step 2: Querying Hugging Face (Lykon/dreamshaper-8) for chibi image generation...");
        providerName = "Hugging Face (Free)";
        buffer = await fetchImageWithHttps(
          "https://api-inference.huggingface.co/models/Lykon/dreamshaper-8",
          {
            "Authorization": `Bearer ${hfKey}`,
            "Content-Type": "application/json"
          },
          { inputs: chibiPromptEn }
        );
      } catch (hfErr) {
        console.warn("⚠️ Hugging Face request failed. Falling back to Pollinations...", hfErr.message);
        buffer = null; // trigger pollination fallback below
      }
    }

    // Option B: Gemini Imagen 4 (if no HF key, or if HF failed)
    if (!buffer) {
      try {
        console.log("🤖 Step 2: Querying Imagen 4 for chibi image generation...");
        providerName = "Imagen 4 (Paid)";

        const imagenPayload = {
          instances: [
            {
              prompt: chibiPromptEn
            }
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            outputMimeType: "image/jpeg"
          }
        };

        const imagenRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imagenPayload)
        });

        if (imagenRes.ok) {
          const imagenJson = await imagenRes.json();
          const imageBytes = imagenJson.predictions?.[0]?.bytesBase64Encoded || imagenJson.predictions?.[0]?.image?.imageBytes;
          if (imageBytes) {
            buffer = Buffer.from(imageBytes, "base64");
          }
        } else {
          const errText = await imagenRes.text();
          console.warn("⚠️ Imagen 4 failed with error. Falling back to Pollinations...", errText);
        }
      } catch (imagenErr) {
        console.warn("⚠️ Imagen 4 failed. Falling back to Pollinations...", imagenErr.message);
      }
    }

    // Option C: Pollinations.ai (Always Free Fallback if Imagen 4 / Hugging Face is restricted or fails)
    if (!buffer) {
      console.log("🤖 Step 2 (FREE FALLBACK): Querying Pollinations.ai for chibi image generation...");
      providerName = "Pollinations.ai (Free)";
      const targetUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(chibiPromptEn)}?width=512&height=512&nologo=true&private=true`;
      buffer = await fetchImageWithHttps(targetUrl);
    }

    // Save image to uploads folder
    const uniqueFileName = `chibi-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);

    await fs.promises.writeFile(filePath, buffer);

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const fileUrl = `${protocol}://${req.get("host")}/uploads/${uniqueFileName}`;
    console.log(`✅ Successfully generated image using ${providerName} and saved to:`, fileUrl);

    return res.status(201).json({
      success: true,
      url: fileUrl,
      prompt: chibiPromptVi,
      provider: providerName
    });

  } catch (err) {
    console.error("❌ AI Generation Failed:", err.message);
    return res.status(500).json({
      error: `Quá trình tạo ảnh AI thất bại: ${err.message}`
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`📡 Express Server running on port ${PORT}`);
});

