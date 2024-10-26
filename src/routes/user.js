
const express = require("express");
const userRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user.js");


userRouter.get("/user/requests/received" , userAuth, async(req, res) =>{
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age gender skills about");

        res.json({message : "Data fetched successfully", connectionRequest});
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async ( req, res) =>{
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", "firstName lastName age gender skills").populate("toUserId", "firstName lastName age gender skills" );

        const data = connectionRequest.map( (row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
               return row.toUserId;
            }
              return row.fromUserId;
        
        });

        res.json({data});
    }
    catch(err){
        res.status(400).send({message : err.message});
    }
});

userRouter.get("/feed", userAuth, async (req, res) =>{

    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1)* limit;
        limit = limit > 50 ? 50 : limit;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id},
            ]
        }).select("fromUserId toUserId");
 

        const hideUserFeed = new Set();

        connectionRequest.forEach((req) => {
            hideUserFeed.add(req.fromUserId);
            hideUserFeed.add(req.toUserId);
        })

        const users = await User.find({
            $and: [
                {_id : {$nin : Array.from(hideUserFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select("firstName lastName age gender skills").skip(skip).limit(limit);

        res.json({message: "Feed Fetched Succussfully", users});
    
    }
    catch(err){
        res.status(400).send({message: err.message});
    }


});


module.exports = userRouter;