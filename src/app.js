
const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const {validateSignUpData} = require("./utils/validate.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth.js");


const app = express(); // start the server

app.use(express.json());
app.use(cookieParser());

app.post("/signup" , async (req, res) => {  

    //Validate the data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password} = req.body;
    //Encrypt the password 
    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        firstName , lastName, emailId, password: encryptedPassword
    });
    try {
        await user.save();
        res.send("Data Stored Successfully");
    }catch(err) {
        res.status(400).send("Error Saving User" +err.message);
    }
    
});

app.post("/login", async (req,res) => {

    try{

        const { emailId , password} = req.body;

        const user = await User.findOne({emailId : emailId});

        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){

            const token = await user.getJwt();
            res.cookie("token", token);
            res.send('Login Successfull');
            
        }
        else{
            throw new Error("Invalid Credentials");
        }

    }
    catch(err) {
        res.status(400).send("Error : " +err.message);
    }

});

app.get("/profile", userAuth, async ( req, res) => {
    try{
        const user = req.user;
       
        res.send(user);
    }
    catch(err) {
        res.status(400).send("Something Went Wrong : " +err.message);
    }
});

app.get("/user", async (req, res) => {
    const userName = req.body.firstName;

    try{
       const users =  await User.find({ firstName : userName});
        if(users.length === 0){
            res.status(404).send(" User not Found");
        }
        else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Something Went Wrong");
    }
});



connectDB().then( () => {
    console.log("Connected to DB");
    app.listen(7777, () => {
        console.log("Server is started");
    });
}    
).catch((err) => {
    console.log(" Error in Db connection");
});








/// Notes 
//Here we are writing the route handlers seperately hence express will go one by one the second route will get called because of next() function.
// app.get("/user" , (req, res, next) => {
//     console.log("Route Handler 1");
//      next();
// });
// app.get("/user" , (req, res, next) =>{
//     console.log("Route Handler 1");
//     res.send(" 2nd Route handler");
// });



// app.use("/user", [(req,res,next) => {
//     console.log("Route Handler 1");
//     next(); // This is go to next route handler, We need to send a response back to client or else we will get a infinte loop.
//     // res.send("route handler 1");
//     // we cannot mention two send response in the route handler as the connection will be closed once the client gets the reponse this will cause to get a error in other response that is trying to send.

// }, (req, res, next) => {
//     console.log("Route Handler 2");
//     next();
// }], (req, res, next) => {
//     console.log("Route Handler 3");
//     res.send("Route handler 3");
// });



// //This will only handles GET calls to /user
// app.get("/user", (req,res) =>{
//     console.log(req.query);
//     res.send("User Data - Faizan");
// });

// app.post("/user", (req,res) => {
//     //Logic to store the data in DB.
//     res.send("Data stored successfully.");
// });

// // This will match the all the HTTP methods API calls to /test
// app.get("/test/:testId", (req,res) => {
//     console.log(req.params);
//     res.send("Hello From Test");
// });

// // Sequence is very important.
// app.use("/", (req,res) => {
//     res.send("Hello om Test");
// });



// //Middleware 
//const {adminAuth, userAuth} = require("./middlewares/auth");
// app.use("/admin" , adminAuth );

// app.get("/admin/getAllData" , (req, res) => {
//     res.send("Got all Data");
// });
// app.get("/user/data" , userAuth, (req, res, next) => {
//          res.send(" User Data");
//      });

// // This is to handle the error in all the routes. Always write it towards the end
// app.use("/", (err, req, res, next) =>{
//     if(err){
//         // log the error
//         res.status(500).send("Something Went Wrong");
//     }
// });



// app.delete("/delete", async (req, res) =>{
//     const userId = req.body.userId;
//     try{
//         const user = await User.findByIdAndDelete(userId);
//         res.send("User Deleted Successfully");
//     }catch(err) {
//         res.status(400).send("Something Went Wrong : " +err.message);
//     }
// });

// app.patch("/user/:userId" , async (req,res) =>{
//     const userId = req.params?.userId;
//     const data = req.body;
//     try{
//         const ALLOWED_UPDATES = ["description", "skills","gender"];

//         const isAllowed_Updates = Object.keys(data).every((k) => 
//             ALLOWED_UPDATES.includes(k)
//          );
//         if(!isAllowed_Updates) {
//             throw new Error("Update now allowed");
//         }
//         const user = await User.findByIdAndUpdate(userId, data, {runValidators : true});
//         res.send("User updated Successfully");
//     }catch(err) {
//         res.status(400).send("Update Failed :"+err.message);
//     }
    
// });

