const express = require("express");
const auth = require("../middleware/auth.middleware");
const expenseCategoryModel = require("../model/expenseCategory.model");
const routes = express.Router();
// post
routes.post("/add", auth, async (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName) {
    return res.json({ message: "categoryName is required" });
  }
  const insertCatName = await expenseCategoryModel.insertOne({
    user: req.user._id,
    categoryName,
  });
  res.status(200).json(insertCatName);
});
module.exports = routes;
