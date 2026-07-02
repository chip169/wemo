const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryLabel: { type: String, required: true },
  usageCount: { type: Number, default: 0 },
  status: { type: String, default: "active" },
  preview: { type: String, required: true },
});

module.exports = mongoose.model("Template", TemplateSchema);
