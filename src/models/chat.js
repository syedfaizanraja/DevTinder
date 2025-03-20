const { chat } = require("googleapis/build/src/apis/chat");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    text : {
        type : String,
        required : true
    },
},{timestamps : true});


const chatSchema = new mongoose.Schema({
    participants : [
        {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User"
        }
    ],
    messages : [messageSchema]
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;