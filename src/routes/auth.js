const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { validateSignUpData } = require("../utils/validate.js");

authRouter.post("/signup", async (req, res) => {
  //Validate the data
  validateSignUpData(req);
  const { firstName, lastName, emailId, password } = req.body;
  //Encrypt the password
  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: encryptedPassword,
  });
  try {
    await user.save();
    res.send("Data Stored Successfully");
  } catch (err) {
    res.status(400).send("Error Saving User" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJwt();
      res.cookie("token", token);
      res.json({message: "Login Successful", user});
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, { expiresIn: new Date(Date.now()) })
    .send("Logout Successfully");
});

module.exports = authRouter;
