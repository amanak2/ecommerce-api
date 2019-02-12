const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

//POST: SIGN UP
router.post("/signup", (req, res, next) => {
  User.find({ phoneNumber: req.body.phoneNumber })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(409).json({ message: "Already Exist" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ message: "Hashing error" });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              phoneNumber: req.body.phoneNumber,
              password: hash
            });
            user
              .save()
              .then(result => {
                if (result) {
                  const token = jwt.sign(
                    {
                      lastName: req.body.lastName,
                      phoneNumber: req.body.phoneNumber
                    },
                    "KEY",
                    { expiresIn: "1h" }
                  );
                  return res
                    .status(201)
                    .json({ message: "User Created", token: token });
                }
              })
              .catch(err => res.status(500).json({ err }));
          }
        });
      }
    })
    .catch(err => res.status(500).json({ err }));
});

//POST: LOGIN
router.post("/login", (req, res, next) => {
  User.find({ phoneNumber: req.body.phoneNumber })
    .exec()
    .then(user => {
      if (user.length < 1) {
        res.status(401).json({ message: "user not found" });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({ message: "Something failed" });
          }
          if (result) {
            const token = jwt.sign(
              {
                lastName: user[0].lastName,
                phoneNumber: req.body.phoneNumber
              },
              "KEY",
              { expiresIn: "1h" }
            );
            return res
              .status(201)
              .json({ message: "User loged in", token: token });
          }
        });
      }
    })
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
