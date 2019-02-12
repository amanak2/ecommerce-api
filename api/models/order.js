const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalCost: { type: Number, required: true },
  activity: { type: String, default: "processing" },
  products: [
    {
      productid: mongoose.Schema.Types.ObjectId,
      cost: Number,
      amount: Number,
      unit: String
    }
  ]
});

module.exports = mongoose.model("Order", orderSchema);
