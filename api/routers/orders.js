const express = require("express");
const router = express.Router();

//GET
router.get("/", (req, res, next) => {
  res.status(200).json({ message: "orders ok" });
});

module.exports = router;
