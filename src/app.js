
const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");


const app = express(); // start the server

app.use(express.json());

app.post("/signup" , async (req, res) => {  
    // const userobj = {
    //     firstName : "Faizan" ,
    //     lastName  : "Raza"
    // }
    const user = new User(req.body);
    try {
        await user.save();
        res.send("Data Stored Successfully");
    }catch(err) {
        res.status(400).send("Error Saving User");
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

