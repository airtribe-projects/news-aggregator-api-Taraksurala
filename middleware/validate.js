const Joi = require("joi");

// Registration Schema
const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Enforces password length
});

// Preferences Schema
const preferenceSchema = Joi.object({
  preferences: Joi.array().items(Joi.string()).min(1).required(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      details: error.details[0].message,
    });
  }
  next();
};

module.exports = { validate, registerSchema, preferenceSchema };
