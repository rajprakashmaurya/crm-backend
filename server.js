const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const serverConfig = require("./configs/server.config");
const bodyParser = require("body-parser");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connectin to mongodb
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", () => {
  console.log("Error while connected to db");
});
db.once("open", () => {
  console.log("connected to mongodb");

  //create an admin doesnot exist
  init();
});

async function init() {
  var user = await User.findOne({ userId: "admin" });

  if (user) {
    console.log("admin is already present");
    return;
  }
  try {
    user = await User.create({
      name: "Raj Prakash Maurya",
      userId: "admin",
      email: "rajprakashmaurya@gmail.com",
      userType: "admin",
      userStatus: "APPROVED",
      password: bcrypt.hashSync("raj@9695", 8),
    });
    console.log(user);
  } catch (e) {
    console.log("Error while creating  admin user" + e);
  }
}

//server is listining at the port
app.listen(serverConfig.PORT, () => {
  console.log("server is listening on port 5050");
});
