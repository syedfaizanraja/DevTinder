const express = require("express");
const { findOne } = require("../models/user");
const Chat = require("../models/chat");
const { userAuth } = require("../middlewares/auth");
const { chat } = require("googleapis/build/src/apis/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth,  async (req, res) => {
    const userId = req.user._id;
    console.log("userId: ", userId.toString());
    const {targetUserId} = req.params;
    console.log("targetUserId: ", targetUserId);

    try{

        let chat = await Chat.findOne({
            participants : { $all : [userId, targetUserId]},
        }).populate({
            path : "messages.senderId",
            select : "firstName lastName",
        });

        console.log("Chat: ", chat);

        if(!chat){
            chat = new Chat({
                participants : [userId, targetUserId],
                messages : [],
            })
            await chat.save();
        }
        res.json(chat);
    }
    catch(err){
        console.log(err);
    }
});

module.exports = chatRouter;