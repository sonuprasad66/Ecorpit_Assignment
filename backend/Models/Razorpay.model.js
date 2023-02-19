const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: String, require: true },
    order_id: { type: String, require: true },
    amount: { type: Number, require: true },
    currency: { type: String, require: true },
    receipt_no: { type: String, require: true },
    created_at: { type: String, require: true },
    status: { type: String, require: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const orderModel = new mongoose.model("order", orderSchema);

module.exports = {
  orderModel,
};
