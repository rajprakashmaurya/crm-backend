const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const serverConfig = require("./configs/server.config");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", () => {
  console.log("Error while connected to db");
});
db.once("open", () => {
  console.log("connected to mongodb");
});

//server is listining at the port
app.listen(serverConfig.PORT, () => {
  console.log("server is listening on port 5050");
});
