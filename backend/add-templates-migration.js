require("dotenv").config();
const mongoose = require("mongoose");
const Template = require("./models/Template");

const newTemplates = [
  {
    id: "birthday-3d",
    name: "Mẫu Sinh Nhật Rực Rỡ 3D",
    category: "birthday",
    categoryLabel: "Sinh nhật & Kỷ niệm",
    usageCount: 24,
    status: "active",
    preview: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
    videoUrl: "",
    sampleMessage: "Chúc mừng sinh nhật! Chúc tuổi mới thật nhiều niềm vui, sức khoẻ và đạt được mọi ước mơ của mình nhé! 🎉🎂",
    photos: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400"
    ],
    features: [
      "Bánh sinh nhật 3D lung linh",
      "Pháo hoa rơi rực rỡ",
      "Nhạc mừng sinh nhật",
      "Hộp quà tương tác sinh nhật"
    ]
  },
  {
    id: "galaxy-3d",
    name: "Mẫu Kỷ Niệm Ngân Hà 3D",
    category: "anniversary",
    categoryLabel: "Sinh nhật & Kỷ niệm",
    usageCount: 45,
    status: "active",
    preview: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400",
    videoUrl: "",
    sampleMessage: "Kỷ niệm chặng đường bên nhau, cảm ơn anh/em đã đồng hành trong mọi khoảnh khắc ngọt ngào lẫn gian khó. Hãy tiếp tục viết tiếp những chương thật đẹp nhé! ✨",
    photos: [
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400",
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400"
    ],
    features: [
      "Không gian dải ngân hà 3D",
      "Sao băng lấp lánh tương tác",
      "Nhạc piano nhẹ nhàng",
      "Vòng xoay ảnh kỷ niệm"
    ]
  }
];

async function migrate() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not defined in .env! Cannot run migration.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas...");
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB Atlas successfully.");

    for (const tpl of newTemplates) {
      console.log(`Processing template: ${tpl.id} - "${tpl.name}"...`);
      // Upsert the template (insert if not exists, update if exists)
      const result = await Template.findOneAndUpdate(
        { id: tpl.id },
        tpl,
        { new: true, upsert: true }
      );
      console.log(`✨ Upserted template: ${result.id} successfully.`);
    }

    console.log("🎉 Migration completed! All new templates have been successfully added/updated in MongoDB Atlas.");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Migration failed with error:", err);
  }
}

migrate();
