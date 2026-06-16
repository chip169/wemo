require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { connectDB, getDbMode } = require("./config/db");
const { readJsonFile, writeJsonFile } = require("./utils/storage");
const { hashPassword, generateToken, signOrderId, verifyOrderIdSignature } = require("./utils/auth");
const authMiddleware = require("./middleware/authMiddleware");

const Gift = require("./models/Gift");
const Order = require("./models/Order");
const NFC = require("./models/NFC");
const Message = require("./models/Message");
const Admin = require("./models/Admin");

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
    return await Gift.find({});
  } else {
    return await readJsonFile("gifts.json");
  }
};

const saveGiftsList = async (list) => {
  if (getDbMode() === "mongodb") {
    // handled on a per-entity basis using mongoose
  } else {
    await writeJsonFile("gifts.json", list);
  }
};

const getOrders = async () => {
  if (getDbMode() === "mongodb") {
    return await Order.find({});
  } else {
    return await readJsonFile("orders.json");
  }
};

const getNFCTags = async () => {
  if (getDbMode() === "mongodb") {
    return await NFC.find({});
  } else {
    return await readJsonFile("nfc.json");
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

// 1. Validate Order ID & check if gift already exists
app.post("/api/orders/validate", async (req, res) => {
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
      if (!gift) return res.status(404).json({ error: "Không tìm thấy quà tặng." });
      
      // Increment views
      gift.views += 1;
      await gift.save();
      
      res.json(gift);
    } else {
      const gifts = await getGifts();
      const giftIndex = gifts.findIndex((g) => g.id === id);
      if (giftIndex === -1) return res.status(404).json({ error: "Không tìm thấy quà tặng." });
      
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
      await Gift.deleteOne({ id });
    } else {
      const gifts = await getGifts();
      const filtered = gifts.filter((g) => g.id !== id);
      await saveGiftsList(filtered);
    }
    res.json({ success: true, message: "Đã xóa quà tặng thành công." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Orders Endpoints
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
    const randomNum = Math.floor(1000 + Math.random() * 9000);
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
    if (getDbMode() === "mongodb") {
      const order = await Order.findOne({ id });
      if (!order) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
      }

      if (customerName !== undefined) order.customerName = customerName;
      if (product !== undefined) order.product = product;
      if (amount !== undefined) order.amount = Number(amount);
      if (status !== undefined) order.status = status;
      if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

      await order.save();
      res.json(order);
    } else {
      const orders = await readJsonFile("orders.json");
      const orderIndex = orders.findIndex((o) => o.id === id);
      if (orderIndex === -1) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng." });
      }

      const order = orders[orderIndex];
      if (customerName !== undefined) order.customerName = customerName;
      if (product !== undefined) order.product = product;
      if (amount !== undefined) order.amount = Number(amount);
      if (status !== undefined) order.status = status;
      if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

      orders[orderIndex] = order;
      await writeJsonFile("orders.json", orders);
      res.json(order);
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

// 6. Templates list
app.get("/api/templates", (req, res) => {
  const templates = [
    { id: "sinh-nhat", name: "Sinh Nhật Rực Rỡ", activeCount: 524 },
    { id: "tinh-yeu", name: "Ký Ức Lãng Mạn", activeCount: 412 },
    { id: "giang-sinh", name: "Giáng Sinh Diệu Kỳ", activeCount: 189 },
    { id: "tot-nghiep", name: "Ngày Tốt Nghiệp", activeCount: 220 },
    { id: "chao-don-be", name: "Chào Đón Em Bé", activeCount: 145 },
    { id: "ky-niem", name: "Dòng Thời Gian Kỷ Niệm", activeCount: 387 },
  ];
  res.json(templates);
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

    if (getDbMode() === "mongodb") {
      const msgDoc = new Message(newMsg);
      await msgDoc.save();
    } else {
      const messages = await readJsonFile("messages.json");
      messages.push(newMsg);
      await writeJsonFile("messages.json", messages);
    }

    // Push real-time updates via Server-Sent Events (SSE)
    broadcastMessage(newMsg);

    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/support/messages/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    if (getDbMode() === "mongodb") {
      await Message.findByIdAndDelete(id);
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

// Start server
app.listen(PORT, () => {
  console.log(`📡 Express Server running on port ${PORT}`);
});
