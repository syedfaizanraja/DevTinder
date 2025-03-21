const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowerCase : true,
      unquie : true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email Id is not valid - " + value);
        }
      },
    },
    password: {
      type: String,
    },
    photoUrl : {
      type: String,
      default: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",

    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      
    },
    description: {
      type: String,
      default: "This is a Default value",
    },
    skills: {
      type: [String],
    },
    isPremium : {
      type: Boolean,
      default: false,
    },
    membershipType : {
      type: String,
      enum : ["free", "silver", "gold"],
      default: "free",
    }
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordFromUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordFromUser, passwordHash);

  return isPasswordValid;
};



const User = mongoose.model("User", userSchema);

module.exports = User;
