const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, default: "client" },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order", default: [] }],
});

module.exports = model("User", userSchema);
