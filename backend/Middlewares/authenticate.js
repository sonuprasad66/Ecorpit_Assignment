const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    res.send({ message: "Login Again" });
  } else {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { user_id } = decoded;
    if (decoded) {
      req.body.user_id = user_id;
      next();
    } else {
      res.send({ message: "Please Login Again" });
    }
  }
};

module.exports = {
  authentication,
};
