const express = require("express");
const app = express();

//DEPENDANCIES
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//ROUTER PATHS
const users = require("./api/routers/users");
const products = require("./api/routers/products");
const orders = require("./api/routers/orders");

//MONGOOSE SETUP
mongoose.connect("mongodb://mongo:27017/e-commerce-api", {
  useNewUrlParser: true
});

//MIDDLEWARE
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

//SECUIRITY (HEADERS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Autherization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, GET, PATCH, DELETE, POST");
    return res.status(200).json({});
  }
  next();
});

//ROUTERS
app.use("/users", users);
app.use("/products", products);
app.use("/orders", orders);

module.exports = app;
