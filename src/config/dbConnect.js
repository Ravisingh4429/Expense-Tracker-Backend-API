const mongoose = require("mongoose");
const dbConnect = async () => {
  await mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log("DB connected");
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = dbConnect;
