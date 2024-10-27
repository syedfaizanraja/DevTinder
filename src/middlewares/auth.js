const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login");
    }

    const decodedObj = await jwt.verify(token, "DevTinder@123");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User is not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Something Went Wrong : " + err.message);
  }
};

module.exports = { userAuth };
