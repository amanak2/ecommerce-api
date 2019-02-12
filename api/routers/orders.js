const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const checkAuth = require("../middleware/check-auth");

//GET: ALL ORDERS
router.get("/", checkAuth, (req, res, next) => {
  Order.find()
    .exec()
    .then(orders => {
      const count = orders.length;
      const response = orders.map(order => {
        return {
          id: order._id,
          user: order.user,
          totalCost: order.totalCost,
          activity: order.activity,
          products: order.products.map(product => {
            return {
              productid: product.productid,
              unit: product.unit,
              cost: product.cost,
              amount: product.amount
            };
          })
        };
      });
      res.status(200).json({ count: count, orders: response });
    })
    .catch(err => res.status(500).json({ err }));
});

//GET: ALL ORDERS FOR USER
router.get("/:userid", checkAuth, (req, res, next) => {
  Order.find({ user: req.params.userid })
    .exec()
    .then(orders => {
      if (orders.length >= 1) {
        const count = orders.length;
        const response = orders.map(order => {
          return {
            id: order._id,
            user: order.user,
            totalCost: order.totalCost,
            activity: order.activity,
            products: order.products.map(product => {
              return {
                productid: product.productid,
                unit: product.unit,
                cost: product.cost,
                amount: product.amount
              };
            })
          };
        });
        res.status(200).json({ count: count, orders: response });
      }
    })
    .catch(err => res.status(500).json({ err }));
});

//POST: CREATE NEW ORDER
router.post("/", checkAuth, (req, res, next) => {
  const products = req.body.products;
  //later -> Check if product avalable
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    user: req.body.user,
    totalCost: req.body.totalCost,
    products: products
  });
  order
    .save()
    .then(order => {
      const response = {
        id: order._id,
        user: order.user,
        totalCost: order.totalCost,
        activity: order.activity,
        products: products
      };
      res.status(201).json({ message: "order created", order: response });
    })
    .catch(err => res.status(500).json({ err }));
});

//DELETE: ORDER BY ID
router.delete("/:id", checkAuth, (req, res, next) => {
  Order.findById({ _id: req.params.id })
    .exec()
    .then(order => {
      Order.remove({ _id: req.params.id })
        .exec()
        .then(result => {
          res.status(200).json({ message: "order deleted" });
        })
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
});

//PATCH: UPDATE ORDER ACTIVITY
router.patch("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  const condition = { _id: id };
  const update = { activity: req.body.activity };
  Order.findById(id)
    .exec()
    .then(order => {
      if (order) {
        Order.update(condition, update)
          .exec()
          .then(result => {
            res.status(202).json({ message: "Order Updated" });
          })
          .catch(err => res.status(500).json({ err }));
      }
    })
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
