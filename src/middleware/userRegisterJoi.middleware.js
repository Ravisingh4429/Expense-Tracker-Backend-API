const joi = require("joi");
const userRegisterJoi = joi.object({
  userName: joi.string().trim().required(),
  email: joi.string().email().trim().required(),
  password: joi.string().trim().required(),
});
module.exports = userRegisterJoi;
