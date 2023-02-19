const Razorpay = require("razorpay");
const shortid = require("shortid");
const { orderModel } = require("../Models/Razorpay.model");

const razorpay = new Razorpay({
  key_id: "rzp_test_sQ3azqtorW8osX",
  key_secret: "UJRrFuI8gK4gAsTAT7fNxTpI",
});

const razorPay = async (req, res) => {
  const { user_id } = req.body;

  const options = {
    amount: 100,
    currency: "INR",
    payment_capture: 1,
    receipt: shortid.generate(),
  };

  try {
    const response = await razorpay.orders.create(options);

    const orderDetails = new orderModel({
      user_id: user_id,
      order_id: response.id,
      amount: response.amount,
      currency: response.currency,
      receipt_no: response.receipt,
      created_at: response.created_at,
      status: response.status,
    });
    await orderDetails.save();

    res.send(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  razorPay,
};
