const express = require("express");
const expenseJoi = require("../validation/expenses.validation");
const expenseUpdateJoi = require("../validation/expensesUpdate.validation ");
const routes = express.Router();
const auth = require("../middleware/auth.middleware");
const expenseCategoryModel = require("../model/expenseCategory.model");
const expenseModel = require("../model/expense.model");
routes.post("/add", auth, async (req, res) => {
  const { value, error } = expenseJoi.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: error.message });
  }
  try {
    const checkCatergory = await expenseCategoryModel.findOne({
      _id: value.category,
      user: req.user._id,
    });
    if (!checkCatergory) {
      return res.status(403).json({
        message:
          "First you have to create category or this enter category not create by you",
      });
    }

    const insert = await expenseModel.create({
      user: req.user._id,
      amount: value.amount,
      category: value.category,
      tags: value.tags,
      paymentMode: value.paymentMode,
      notes: value.notes,
    });
    res.status(201).json(insert);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// get

routes.get("/fetch", auth, async (req, res) => {
  try {
    const fetchExpenses = await expenseModel
      .find({
        user: req.user._id,
      })
      .populate("category", "categoryName")
      .populate("user", "userName")
      .sort({ createdAt: -1 });
    if (fetchExpenses.length === 0) {
      return res.status(200).json({ message: "No Data Found" });
    }
    res.json(fetchExpenses);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});
//delete
routes.delete("/delete/:id", auth, async (req, res) => {
  try {
    const checkExp = await expenseModel.findOne({ _id: req.params.id });
    if (!checkExp) {
      return res.status(404).json({ message: "No expenses found" });
    }
    if (checkExp.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied!" });
    }
    const deleteExp = await expenseModel.findByIdAndDelete(checkExp._id);
    res.status(200).json({ message: "expenses deleted", deleteExp });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// update
routes.put("/update/:id", auth, async (req, res) => {
  try {
    const checkExp = await expenseModel.findOne({ _id: req.params.id });
    if (!checkExp) {
      return res.status(404).json({ message: "No expenses found" });
    }
    if (checkExp.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied!" });
    }
    const { value, error } = expenseUpdateJoi.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    await expenseModel.updateOne({ _id: checkExp._id }, { $set: value });
    res.status(200).json({ message: "Update successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});
module.exports = routes;
