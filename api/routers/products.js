const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const multer = require("multer");

const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth");

//IMAGE UPLOADER
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, "productImg_" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

//GET: ALL PRODUCTS
router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then(products => {
      const response = {
        count: products.length,
        products: products.map(product => {
          return {
            id: product._id,
            name: product.name,
            price: product.price,
            inventory: product.inventory,
            img: "http://localhost:3000/" + product.img
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

//GET: GET PRODUCT BY ID
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .exec()
    .then(product => {
      const response = {
        id: product._id,
        name: product.name,
        price: product.price,
        inventory: product.inventory,
        img: "http://localhost:3000/" + product.img
      };
      res.status(200).json({ product: response });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

//POST: CREATE NEW PRODUCT
router.post("/", checkAuth, upload.single("img"), (req, res, next) => {
  Product.find({ name: req.body.name })
    .exec()
    .then(products => {
      if (products.length >= 1) {
        res.status(409).json({ message: "Product already exist" });
      } else {
        const product = new Product({
          _id: mongoose.Types.ObjectId(),
          name: req.body.name,
          price: req.body.price,
          inventory: req.body.inventory,
          img: req.file.path
        });
        product
          .save()
          .then(product => {
            const response = {
              _id: product._id,
              name: product.name,
              price: product.price,
              inventory: product.inventory,
              img: "http://localhost:3000/" + product.img
            };
            res
              .status(201)
              .json({ message: "Product Created", product: response });
          })
          .catch(err => res.status(500).json(err));
      }
    })
    .catch(err => res.status(500).json(err));
});

//PATCH: UPDATE PRODUCT BY ID
router.patch("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  const condition = { _id: id };
  const update = {
    name: req.body.name,
    price: req.body.price,
    inventory: req.body.inventory
  };
  Product.update(condition, update)
    .exec()
    .then(result => {
      res.status(202).json({ message: "Product updated" });
    })
    .catch(err => res.status(500).json({ err }));
});

//DELETE: DELETE PRODUCT BY ID
router.delete("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  Product.find({ _id: id })
    .exec()
    .then(product => {
      if (product.length >= 1) {
        Product.remove({ _id: id })
          .exec()
          .then(result => {
            res.status(200).json({ message: "product deleted" });
          })
          .catch(err => {
            res.status(500).json({ err });
          });
      } else {
        res.status(200).json({ message: "product not found" });
      }
    })
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
