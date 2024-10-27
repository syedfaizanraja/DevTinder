const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth.js");
const { validateEditProfileData, validateProfilePassword } = require("../utils/validate.js");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      res.status(400).send("Something Went Wrong : " + err.message);
    }
  });

profileRouter.patch("/profile/edit" , userAuth , async(req, res) => {
    try{
        validateEditProfileData(req);
        if(!validateEditProfileData){
            throw new Error("Invalid Edit Request");
        }
        const loggedUser = req.user;
        Object.keys(req.body).forEach((key) => {loggedUser[key] = req.body[key]});
        await loggedUser.save();

        res.json({message: `${loggedUser.firstName} ,your update is successful`,
            data:loggedUser
        });
    }
    catch (err) {
        res.status(400).send("Something Went Wrong : " + err.message);
      }
});

profileRouter.patch("/profile/password" , userAuth, async(req, res) =>{
    try{

        validateProfilePassword(req);

        if(!validateProfilePassword){
            throw new Error("Password Not updated successfuly");
        }

       const  loggedInUser = req.user;

       const encryptedPassword = await bcrypt.hash(req.body.password, 10);
       loggedInUser.password = encryptedPassword;
    

       await loggedInUser.save();

       res.json({
        message: "Password changed successfuly",
        data:loggedInUser
       });



    }
    catch (err) {
        res.status(400).send("Something Went Wrong : " + err.message);
      }
});

  module.exports = profileRouter;