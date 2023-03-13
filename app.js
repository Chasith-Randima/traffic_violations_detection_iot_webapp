const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const app = express();

const userRouter = require("./routes/userRoute");

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/users", userRouter);

module.exports = app;
