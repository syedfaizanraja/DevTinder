
const express = require("express");

const app = express(); // start the server

//This will only handles GET calls to /user
app.get("/user", (req,res) =>{
    res.send("User Data - Faizan");
});

app.post("/user", (req,res) => {
    //Logic to store the data in DB.
    res.send("Data stored successfully.");
});

// This will match the all the HTTP methods API calls to /test
app.use("/test", (req,res) => {
    res.send("Hello From Test");
});

// Sequence is very important.
app.use("/", (req,res) => {
    res.send("Hello om Test");
});


app.listen(7777, () => {
    console.log("Server is started");
});