// const express= require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = require("./app");

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("DB error: ", err));

app.listen(process.env.PORT, () => {
  console.log("Server running on : ", process.env.PORT);
});
