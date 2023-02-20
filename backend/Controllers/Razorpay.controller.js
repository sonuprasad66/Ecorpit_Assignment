const Razorpay = require("razorpay");
const shortid = require("shortid");

const razorpay = new Razorpay({
  // key_id: "rzp_test_sQ3azqtorW8osX",
  // key_secret: "UJRrFuI8gK4gAsTAT7fNxTpI",

  key_id: "rzp_test_jBBhchWsQ7daLQ",
  key_secret: "gGMguqm9lR9ISCsKak8HrevA",
});

const razorPay = async (req, res) => {
  const options = {
    amount: 100,
    currency: "INR",
    payment_capture: 1,
    receipt: shortid.generate(),
  };

  try {
    const response = await razorpay.orders.create(options);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  razorPay,
};
