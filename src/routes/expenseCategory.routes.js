const express = require("express");
const auth = require("../middleware/auth.middleware");
const expenseCategoryModel = require("../model/expenseCategory.model");
const routes = express.Router();
// post
routes.post("/add", auth, async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!req.body) {
      return res.json({ message: "categoryName is required" });
    }
    const insertCatName = await expenseCategoryModel.insertOne({
      user: req.user._id,
      categoryName,
    });
    res.status(200).json(insertCatName);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" }, error);
  }
});

// get all

routes.get("/all", auth, async (req, res) => {
  try {
    const categories = await expenseCategoryModel.find({
      user: req.user._id,
    });
    if (categories.length === 0) {
      return res.status(404).json({ message: "No Category found" });
    }

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete

routes.delete("/delete/:id", auth, async (req, res) => {
  try {
    const categoryThere = await expenseCategoryModel.findById(req.params.id);
    if (!categoryThere) {
      return res.status(404).json({ message: "No Category found" });
    }
    if (categoryThere.user.toString() !== req.user._id) {
      return res.status(401).json({ message: "Access denid!" });
    }
    await expenseCategoryModel.deleteOne(categoryThere._id);
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
// update
routes.put("/update/:id", auth, async (req, res) => {
  try {
    const categoryThere = await expenseCategoryModel.findById(req.params.id);
    if (!categoryThere) {
      return res.status(404).json({ message: "No Category found" });
    }
    if (!req.body.categoryName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (categoryThere.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Access denied!" });
    }
    categoryThere.name = req.body.categoryName;
    await categoryThere.save();
    res.status(200).json({ message: "Category updates" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = routes;
