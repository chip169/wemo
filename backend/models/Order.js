const mongoose = require("mongoose");

const ProductConfigSchema = new mongoose.Schema({
  size: { type: String, enum: ["9cm", "12cm"], default: "9cm" },
  quantity: { type: Number, default: 1, min: 1 },
  base: { type: String, enum: ["none", "mica", "wood"], default: "none" },
  led: { type: Boolean, default: false },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  product: { type: String, default: "Figure Chibi 3D" },
  amount: { type: Number, required: true },

  // Customer contact info
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  address: { type: String, default: "" },
  note: { type: String, default: "" },

  // Chibi image & product config
  chibiUrl: { type: String, default: "" },
  originalUrl: { type: String, default: "" },
  productConfig: { type: ProductConfigSchema, default: () => ({}) },
  depositAmount: { type: Number, default: 200000 },

  // Order status
  status: {
    type: String,
    enum: ["pending_payment", "deposited", "pending", "processing", "shipping", "completed", "cancelled"],
    default: "pending_payment"
  },
  paymentStatus: { type: String, enum: ["paid", "unpaid", "refunded"], default: "unpaid" },
  paidAt: { type: String, default: "" },

  // Linked gift card
  giftId: { type: String, default: "" },

  createdDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
});

module.exports = mongoose.model("Order", OrderSchema);
