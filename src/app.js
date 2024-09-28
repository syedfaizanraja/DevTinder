
const express = require("express");

const app = express(); // start the server

app.use("/user", [(req,res,next) => {
    console.log("Route Handler 1");
    next(); // This is go to next route handler, We need to send a response back to client or else we will get a infinte loop.
    // res.send("route handler 1");
    // we cannot mention two send response in the route handler as the connection will be closed once the client gets the reponse this will cause to get a error in other response that is trying to send.

}, (req, res, next) => {
    console.log("Route Handler 2");
    next();
}], (req, res, next) => {
    console.log("Route Handler 3");
    res.send("Route handler 3");
});

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


app.listen(7777, () => {
    console.log("Server is started");
});