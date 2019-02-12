const express = require("express");
const router = express.Router();

//GET: ALL ORDERS
router.get("/", (req, res, next) => {
  res.status(200).json({ message: "orders ok" });
});

//GET: ALL ORDERS FOR USER
router.get("/:userid", (req, res, next) => {
  
})

module.exports = router;
