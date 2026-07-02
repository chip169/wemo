require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { initStorage, writeJsonFile } = require("./utils/storage");

const MONGO_URI = process.env.MONGO_URI;

const orderId1 = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
const orderId2 = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
const orderId3 = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
const orderId4 = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
const orderId5 = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

const mockOrders = [
  {
    id: orderId1,
    customerName: "Nguyễn Văn A",
    product: "Sinh Nhật Rực Rỡ",
    amount: 199000,
    status: "completed",
    paymentStatus: "paid",
    createdDate: "2026-06-01",
  },
  {
    id: orderId2,
    customerName: "Trần Thị B",
    product: "Ký Ức Lãng Mạn",
    amount: 250000,
    status: "processing",
    paymentStatus: "paid",
    createdDate: "2026-06-05",
  },
  {
    id: orderId3,
    customerName: "Lê Văn C",
    product: "Dòng Thời Gian Kỷ Niệm",
    amount: 350000,
    status: "pending",
    paymentStatus: "unpaid",
    createdDate: "2026-06-12",
  },
  {
    id: orderId4,
    customerName: "Phạm Hồng D",
    product: "Giáng Sinh Diệu Kỳ",
    amount: 299000,
    status: "completed",
    paymentStatus: "paid",
    createdDate: "2026-06-14",
  },
  {
    id: orderId5,
    customerName: "Đỗ Gia Bảo",
    product: "Chào Đón Em Bé",
    amount: 199000,
    status: "cancelled",
    paymentStatus: "refunded",
    createdDate: "2026-06-15",
  },
  {
    id: "1",
    customerName: "Khách Hàng Test",
    product: "Sản phẩm Test cố định",
    amount: 99000,
    status: "completed",
    paymentStatus: "paid",
    createdDate: "2026-07-02",
  },
];

const mockGifts = [
  {
    id: "g1b2c3",
    templateId: "sinh-nhat-party",
    photos: ["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"],
    hasVideo: false,
    hasVoice: false,
    recipientName: "Nguyễn Văn A",
    title: "Tiệc Đêm Sôi Động",
    message: "Chúc mừng sinh nhật tuổi 20 rực rỡ nhất nhé bạn tôi!",
    music: "birthday",
    orderId: orderId1,
    views: 12,
    createdAt: "2026-06-02T10:00:00.000Z",
  },
  {
    id: "l5v6r7",
    templateId: "love-romantic",
    photos: ["https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80"],
    hasVideo: true,
    hasVoice: false,
    recipientName: "Trần Thị B",
    title: "Mãi Yêu Thương",
    message: "Cảm ơn em vì đã đến bên anh, chúc mừng kỷ niệm 2 năm yêu nhau của chúng mình.",
    music: "romantic",
    orderId: orderId2,
    views: 45,
    createdAt: "2026-06-06T15:30:00.000Z",
  },
];

const mockNFC = [
  {
    id: "NFC-7001",
    uid: "04:A1:B2:C3:D4:E5:F6",
    status: "assigned",
    giftId: "g1b2c3",
    lastTapped: "2026-06-14 18:22",
  },
  {
    id: "NFC-7002",
    uid: "04:B2:C3:D4:E5:F6:A1",
    status: "assigned",
    giftId: "l5v6r7",
    lastTapped: "2026-06-15 09:11",
  },
  {
    id: "NFC-7003",
    uid: "04:C3:D4:E5:F6:A1:B2",
    status: "unassigned",
    giftId: "",
    lastTapped: "",
  },
];

const mockMessages = [
  {
    sessionId: "Session-112233",
    sender: "user",
    text: "Xin chào, tôi muốn hỏi cách liên kết chip NFC với thiệp?",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    sessionId: "Session-112233",
    sender: "admin",
    text: "Chào bạn! Sau khi thiết kế xong thiệp ở Bước 4, bạn bấm 'Gắn Chip NFC' và chạm mặt sau điện thoại vào thẻ WEMO để lưu liên kết nhé.",
    timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString(),
  },
  {
    sessionId: "Session-112233",
    sender: "user",
    text: "Vâng mình cảm ơn, mình làm được rồi ạ!",
    timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
  },
];

const seedJSON = () => {
  console.log("Seeding Local JSON Database...");
  const { hashPassword } = require("./utils/auth");
  initStorage();
  writeJsonFile("orders.json", mockOrders);
  writeJsonFile("gifts.json", mockGifts);
  writeJsonFile("nfc.json", mockNFC);
  writeJsonFile("messages.json", mockMessages);
  
  // Seed templates.json as well
  const mockTemplates = [
    {
      id: "love-romantic",
      name: "Mãi Yêu Thương (Mạng Lưới 3D)",
      category: "romance",
      categoryLabel: "Tình yêu & Lãng mạn",
      usageCount: 378,
      status: "active",
      preview: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
      videoUrl: "",
      sampleMessage: "Anh/Em yêu, mỗi khoảnh khắc bên em/anh đều là một trang ký ức đẹp nhất trong cuốn sách cuộc đời. Cảm ơn em/anh đã là ánh nắng của ngày tôi, là bến bờ của những giông tố. Tôi yêu em/anh mãi mãi.",
      photos: [
        "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=300&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=300&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1551850985-5e6cd6e2dd8c?w=400&h=300&fit=crop&auto=format"
      ],
      features: [
        "Tối đa 6 ảnh kỷ niệm",
        "Mạng lưới trái tim rơi",
        "Nhạc nền tình yêu",
        "Dòng thời gian hẹn hò",
        "Hộp thư bí mật"
      ]
    },
    {
      id: "solid-heart",
      name: "Mẫu Tinh Cầu 3D Vũ Trụ",
      category: "romance",
      categoryLabel: "Tình yêu & Lãng mạn",
      usageCount: 12,
      status: "active",
      preview: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400",
      videoUrl: "",
      sampleMessage: "Em ơi, một năm bên nhau là một năm anh cảm thấy mình là người hạnh phúc nhất thế giới. Cảm ơn em đã bước vào cuộc sống của anh và vẽ nên bức tranh tình yêu lấp lánh như ngàn tinh tú. Anh yêu em mãi mãi! 💖",
      photos: [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
        "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=400&q=80",
        "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80",
        "https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=400&q=80",
        "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=400&q=80",
        "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=400&q=80",
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=80",
        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80",
        "https://images.unsplash.com/photo-1501901604252-bb626cc1d545?w=400&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
        "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=400&q=80",
        "https://images.unsplash.com/photo-1507504038482-7621c3c786d7?w=400&q=80"
      ],
      features: [
        "Tối đa 16 ảnh kỷ niệm",
        "Hành tinh tinh cầu 3D tương tác",
        "Sao băng rơi đa góc luân phiên",
        "Vành đai Saturn hạt sao",
        "Nhạc nền lãng mạn"
      ]
    }
  ];
  writeJsonFile("templates.json", mockTemplates);

  writeJsonFile("admins.json", [
    {
      username: "admin",
      password: hashPassword("admin123")
    }
  ]);
  console.log("Seeding completed successfully for JSON files!");
};

const seedMongo = async () => {
  console.log("Seeding MongoDB Atlas Database...");
  try {
    await mongoose.connect(MONGO_URI);
    
    // Dynamically load models
    const Gift = require("./models/Gift");
    const Order = require("./models/Order");
    const NFC = require("./models/NFC");
    const Message = require("./models/Message");
    const Admin = require("./models/Admin");
    const { hashPassword } = require("./utils/auth");

    const Template = require("./models/Template");
    // Clean existing tables
    await Gift.deleteMany({});
    await Order.deleteMany({});
    await NFC.deleteMany({});
    await Message.deleteMany({});
    await Admin.deleteMany({});
    await Template.deleteMany({});

    // Insert seeds
    await Order.insertMany(mockOrders);
    await Gift.insertMany(mockGifts);
    await NFC.insertMany(mockNFC);
    await Message.insertMany(mockMessages);
    await Template.insertMany([
      {
        id: "love-romantic",
        name: "Mãi Yêu Thương (Mạng Lưới 3D)",
        category: "romance",
        categoryLabel: "Tình yêu & Lãng mạn",
        usageCount: 378,
        status: "active",
        preview: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
        videoUrl: "",
        sampleMessage: "Anh/Em yêu, mỗi khoảnh khắc bên em/anh đều là một trang ký ức đẹp nhất trong cuốn sách cuộc đời. Cảm ơn em/anh đã là ánh nắng của ngày tôi, là bến bờ của những giông tố. Tôi yêu em/anh mãi mãi.",
        photos: [
          "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=300&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=300&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1551850985-5e6cd6e2dd8c?w=400&h=300&fit=crop&auto=format"
        ],
        features: [
          "Tối đa 6 ảnh kỷ niệm",
          "Mạng lưới trái tim rơi",
          "Nhạc nền tình yêu",
          "Dòng thời gian hẹn hò",
          "Hộp thư bí mật"
        ]
      },
      {
        id: "solid-heart",
        name: "Mẫu Tinh Cầu 3D Vũ Trụ",
        category: "romance",
        categoryLabel: "Tình yêu & Lãng mạn",
        usageCount: 12,
        status: "active",
        preview: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400",
        videoUrl: "",
        sampleMessage: "Em ơi, một năm bên nhau là một năm anh cảm thấy mình là người hạnh phúc nhất thế giới. Cảm ơn em đã bước vào cuộc sống của anh và vẽ nên bức tranh tình yêu lấp lánh như ngàn tinh tú. Anh yêu em mãi mãi! 💖",
        photos: [
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
          "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80",
          "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
          "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
          "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=400&q=80",
          "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80",
          "https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=400&q=80",
          "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=400&q=80",
          "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=400&q=80",
          "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=80",
          "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80",
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80",
          "https://images.unsplash.com/photo-1501901604252-bb626cc1d545?w=400&q=80",
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
          "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=400&q=80",
          "https://images.unsplash.com/photo-1507504038482-7621c3c786d7?w=400&q=80"
        ],
        features: [
          "Tối đa 16 ảnh kỷ niệm",
          "Hành tinh tinh cầu 3D tương tác",
          "Sao băng rơi đa góc luân phiên",
          "Vành đai Saturn hạt sao",
          "Nhạc nền lãng mạn"
        ]
      }
    ]);
    
    await Admin.create({
      username: "admin",
      password: hashPassword("admin123")
    });

    console.log("Seeding completed successfully for MongoDB!");
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.error("Error seeding MongoDB:", err.message);
    return false;
  }
};

const run = async () => {
  if (MONGO_URI) {
    const success = await seedMongo();
    if (!success) {
      console.log("Falling back to local JSON database seeding...");
      seedJSON();
    }
  } else {
    seedJSON();
  }
};

run();
