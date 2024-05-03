const { Schema, model } = require("mongoose");

const productSchema = Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  img1: { type: String, required: true },
  img2: { type: String, required: true },
  img3: { type: String, required: true },
  img4: { type: String, required: true },
  long_desc: { type: String, required: true },
  short_desc: { type: String, required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true },
});

module.exports = model("Product", productSchema);
