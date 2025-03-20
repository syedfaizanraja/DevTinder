const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const { timeStamp } = require("console");
const ConnectionRequestModel = require("../models/connectionRequest");


const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId.targetUserId].sort().join("_")).digest("hex");
};


const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
          origin : "http://localhost:5173",
        },
      });
      
    io.on("connection", (socket) => {
        // Handle the connection event
        // Handle the event when a client emits the "joinChat" event
        
        socket.on("joinChat", ({firstName, userId, targetUserId}) =>{
           
           
            const roomId = getSecretRoomId(userId, targetUserId);
           console.log(firstName + " joined the chat: ", roomId);
            socket.join(roomId);
        });
        // Handle the event when a client emits the "message" event 
        
        socket.on("sendMessage", async ({ firstName , userId, targetUserId, text}) => {
            
            // authenticate the user
            // check if the user is authorized to send the message

            //Save the message to the database
            try{

                const roomId = getSecretRoomId(userId, targetUserId);
                console.log(firstName + ": ", roomId);

                // check fromUserID and targetUserID are friends first before sending the message
                // if they are not friends, don't send the message

                const isFriends = await ConnectionRequestModel.findOne({
                    $or: [
                        {fromUser: userId, toUser: targetUserId.targetUserId},
                        {fromUser: targetUserId.targetUserId, toUser: userId}
                    ],
                    status: "accepted"
                });

                if(!isFriends){
                    return res.status(400).json({message: "You are not friends with this user"});
                }

            let chat = await Chat.findOne({participants : {$all : [userId, targetUserId.targetUserId]},});

            if(!chat){
                chat = new Chat({
                    participants : [userId, targetUserId.targetUserId],
                    messages : [],
                });
            }

            chat.messages.push({
                senderId: userId,
                text,
            });

            await chat.save();
            const timeStamp = new Date().toISOString();
            //send the message to the room emit the messageReceived event
            console.log("timestamp: ", timeStamp);
            io.to(roomId).emit("messageReceived", {firstName, text, timeStamp });

            }
            catch(err){
                console.log(err);
            }
            
        });

        // Handle the event when a client emits the "disconnect" event
        socket.on("disconnect", () => {

        });

    });
      
};

module.exports = initializeSocket;
