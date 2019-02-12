const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: Number, required: true },
  address: String,
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
