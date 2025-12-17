const mongoose = require("mongoose");

const expenseCategorySchma = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    reduired: true,
  },
  categoryName: {
    type: String,
    required: true,
    trim: true,
  },
});
const expenseCategoryModel = mongoose.model(
  "expenseCategory",
  expenseCategorySchma
);
module.exports = expenseCategoryModel;
