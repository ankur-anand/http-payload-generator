const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const logger = require("./logger");
const routes = require("./routes");
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Resource Not Found");
  err.status = 404;
  next(err);
});

// final all error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";
  let path = req.originalUrl;
  logger.error(`${path}: ${message}`);
  // if status code is 500 by defaul't then replace the message
  // that is coming from the stack error message, for it's
  // internal message an developer has handled it properly
  // and should not to be displayed.
  if (statusCode === 500) {
    message = "Internal Server Error";
  }
  res.status(statusCode).json({ message });
});

module.exports = app;
