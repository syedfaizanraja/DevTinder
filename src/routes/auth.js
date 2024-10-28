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
    const savedUser = await user.save();
    const token = await savedUser.getJwt();
    res.cookie("token", token, { 
      expires : new Date(Date.now() + 8 * 3600000)
    }).json({message : "Data Stored Successfully" , data: savedUser});
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
      res.cookie("token", token, {
        expires : new Date(Date.now() + 8 * 3600000)
      });
      res.json(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout Successfully");
});

module.exports = authRouter;
