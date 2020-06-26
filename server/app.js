const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const fs = require("fs");
const path = require("path");

const HttpError = require("./models/http-error");
const placesRoutes = require("./routes/places-route");
const usersRoutes = require("./routes/users-route");
const url =
  "mongodb+srv://mongouser:W8KdGanIKy1PDZeG@cluster0-ufpqh.mongodb.net/mern?retryWrites=true&w=majority";

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, () => {
      console.log(error);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error ocurred" });
});

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(5000);
    console.log("Connected to data base");
    console.log("Listen at port 5000");
  })
  .catch((error) => {
    console.log(error);
  });
