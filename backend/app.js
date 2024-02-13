const express = require("express");
const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");


const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);

module.exports = app;
