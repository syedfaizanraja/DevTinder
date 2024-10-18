const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteNode:pQj4E0O5l5eMn0sB@namastenode.jewki.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
