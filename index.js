require("dotenv").config();
const express = require("express");
const app = express();
const userRoutes = require("./src/routes/user.routes");
const expenseCategoryRoutes = require("./src/routes/expenseCategory.routes");
const dbConnect = require("./src/config/dbConnect");
app.use(express.json());
dbConnect();
app.use("/user", userRoutes);
app.use("/expenseCategory", expenseCategoryRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is runnning on ${PORT}`);
});
