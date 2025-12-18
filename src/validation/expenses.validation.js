const joi = require("joi");
const expenseJoi = joi.object({
  amount: joi.number().min(1).required(),
  category: joi.string().required(),
  paymentMode: joi.string().valid("Online", "Cash").default("Cash"),
  notes: joi.string().allow("").trim().max(500),
  tags: joi.array().items(joi.string()).default([]),
});
module.exports = expenseJoi;
