const Joi = require('joi');

const directorSchema = Joi.object({
  fullName: Joi.string().required(),
  birthYear: Joi.number().min(1888).max(2025).required(),
});

module.exports = { directorSchema };
