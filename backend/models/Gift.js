const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  templateId: { type: String, required: true },
  theme: { type: String, default: "tinh-yeu" },
  photos: [{ type: String }],
  hasVideo: { type: Boolean, default: false },
  videoUrl: { type: String, default: "" },
  hasVoice: { type: Boolean, default: false },
  voiceUrl: { type: String, default: "" },
  recipientName: { type: String, required: true },
  title: { type: String },
  message: { type: String },
  music: { type: String, default: "none" },
  orderId: { type: String, required: true, index: true },
  views: { type: Number, default: 0 },
  status: { type: String, default: "active" },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

module.exports = mongoose.model("Gift", GiftSchema);
