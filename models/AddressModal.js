const mongoose = require("mongoose");
 
const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  image: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
});
 
module.exports = mongoose.model("Address", AddressSchema);
 
 