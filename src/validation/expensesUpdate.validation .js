const joi = require("joi");
const expenseUpdateJoi = joi
  .object({
    amount: joi.number().min(1).optional(),
    category: joi.string().optional(),
    paymentMode: joi
      .string()
      .valid("Online", "Cash")
      .default("Cash")
      .optional(),
    notes: joi.string().allow("").trim().max(500).optional(),
    tags: joi.array().items(joi.string()).default([]).optional(),
  })
  .min(1);
module.exports = expenseUpdateJoi;
