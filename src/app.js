
const express = require("express");

const app = express(); // start the server

app.use("/test", (req,res) => {
    res.send("Hello From Test");
});

app.listen(7777, () => {
    console.log("Server is started");
});