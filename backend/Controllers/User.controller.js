const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { userModel } = require("../Models/User.model");

const checkUser = async (req, res) => {
  const { username, email, phone_number } = req.body;
  const user = await userModel.findOne({ email: email });

  if (user) {
    res.send({
      message: "User already exists! Please Try to Login",
      status: "info",
    });
  } else {
    res.send({
      message: "You can go to signup",
      status: "success",
    });
  }
};

const userSignup = async (req, res) => {
  const {
    username,
    email,
    phone_number,
    password,
    currency,
    amount,
    order_id,
    payment_id,
  } = req.body;

  try {
    const user = await userModel.findOne({ email: email });

    if (user) {
      res.send({
        message: "User already exists! Please Try to Login",
        status: "info",
      });
    } else {
      bcrypt.hash(password, 5, async (err, hash_password) => {
        if (err) {
          res.send({ message: "Something went wrong", status: "failed" });
        } else {
          const new_user = new userModel({
            username: username,
            email: email,
            phone_number: phone_number,
            password: hash_password,
            currency: currency,
            amount: amount,
            order_id: order_id,
            payment_id: payment_id,
          });
          await new_user.save();
          res.send({ message: "Signup Successfull", status: "success" });
        }
      });
    }
  } catch (err) {
    res.send({ message: "Something went wrong", status: "error" });
    console.log(err);
  }
};

const userLogin = async (req, res) => {
  const { phone_number, password } = req.body;
  const user = await userModel.findOne({ phone_number });

  if (user) {
    const hashed_password = user.password;
    const user_id = user._id;

    bcrypt.compare(password, hashed_password, async (err, result) => {
      if (err) {
        res.send({ message: "Something went wrong", status: "error" });
      } else {
        if (result) {
          let token = jwt.sign({ user_id }, process.env.SECRET_KEY);
          res.send({
            message: "Login successful!",
            status: "success",
            token: token,
          });
        } else {
          res.send({ message: "Login failed!", status: "failed" });
        }
      }
    });
  } else {
    res.send({ message: "User Not Found ", status: "failed" });
  }
};

const userProfile = async (req, res) => {
  const { user_id } = req.body;
  const currentUser = await userModel.findOne({ _id: user_id });
  res.send(currentUser);
};

module.exports = {
  checkUser,
  userSignup,
  userLogin,
  userProfile,
};
