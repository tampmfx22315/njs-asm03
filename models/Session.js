const { Schema, model } = require("mongoose");

const sessionSchema = new Schema({
  messages: [
    {
      sender: { type: String, required: true },
      content: { type: String, required: true },
      time: { type: Date, required: true },
    },
  ],
});

module.exports = model("Session", sessionSchema);
