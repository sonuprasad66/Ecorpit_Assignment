const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true },
    phone_number: { type: Number, require: true },
    password: { type: String, require: true },
    currency: { type: String, require: true },
    amount: { type: Number, require: true },
    order_id: { type: String, require: true },
    payment_id: { type: String, require: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const userModel = new mongoose.model("user", userSchema);

module.exports = {
  userModel,
};
