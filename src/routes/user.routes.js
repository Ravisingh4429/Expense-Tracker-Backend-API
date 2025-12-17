const express = require("express");
const routes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRegisterJoi = require("../middleware/userRegisterJoi.middleware");
const userModel = require("../model/user.model");
const auth = require("../middleware/auth.middleware");
routes.post("/signup", async (req, res) => {
  try {
    const { value, error } = userRegisterJoi.validate(req.body);
    if (error) {
      return res.status(404).json(error.message);
    }
    const findUserName = await userModel.findOne({
      userName: value.userName,
    });
    if (findUserName) {
      return res.status(401).json({ message: "this username is taken" });
    }
    const findEmail = await userModel.findOne({ email: value.email });
    if (findEmail) {
      return res.status(401).json({ message: "this email is already there" });
    }
    const hashPassword = await bcrypt.hash(value.password, 10);
    const insertUser = await userModel.insertOne({
      userName: value.userName,
      email: value.email,
      password: hashPassword,
    });
    res.json(insertUser);
  } catch (error) {
    res.json(error);
  }
});

// login
routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "all fields are required" });
    }
    const checkEmail = await userModel.findOne({ email });
    if (!checkEmail) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const checkPassword = await bcrypt.compare(password, checkEmail.password);
    if (!checkPassword) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const token = tokenGenerate({
      _id: checkEmail._id,
      userName: checkEmail.userName,
      email: checkEmail.email,
    });
    res.json(token);
  } catch (error) {
    res.json(error);
  }
});

// profile details
routes.get("/profile", auth, async (req, res) => {
  const allDetails = await userModel.findById(req.user._id).select("-password");
  res.json(allDetails);
});
function tokenGenerate(data) {
  return jwt.sign(data, process.env.JWT, { expiresIn: "30d" });
}
module.exports = routes;
