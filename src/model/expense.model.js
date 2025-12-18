const mongoose = require("mongoose");
const expenseSchma = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      min: 1,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "expenseCategory",
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Online", "Cash"],
      default: "Cash",
    },
    notes: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
const expenseModel = mongoose.model("expenses", expenseSchma);
module.exports = expenseModel;
