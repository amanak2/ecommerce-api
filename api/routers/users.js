const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");

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
                    { expiresIn: "7d" }
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
              { expiresIn: "7d" }
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

//GET: ALL USER
router.get("/", checkAuth, (req, res, next) => {
  User.find()
    .exec()
    .then(users => {
      const response = {
        count: users.length,
        products: users.map(user => {
          return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            img: "http://localhost:3000/" + user.img
          };
        })
      };
      res.status(200).json({ users: response });
    })
    .catch(err => res.status(500).json({ err }));
});

//GET: USER BY ID
router.get("/:id", checkAuth, (req, res, next) => {
  User.findById(req.params.id)
    .exec()
    .then(user => {
      if (user) {
        const response = {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          address: user.address,
          img: "http://localhost:3000/" + user.img
        };
        res.status(200).json({ user: response });
      }
    })
    .catch(err => res.status(500).json({ err }));
});

//PATCH: UPDATE USER BY ID
router.patch("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  const condition = { _id: id };
  const update = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    email: req.body.email
  };
  User.update(condition, update)
    .exec()
    .then(result => {
      res.status(202).json({ message: "User was updated" });
    })
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
