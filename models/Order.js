const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, require: true, ref: "User" },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          require: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    isDelivered: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
