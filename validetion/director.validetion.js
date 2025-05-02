const Joi = require('joi');

const directorSchema = Joi.object({
  fullName: Joi.string().required(),
  birthYear: Joi.number().min(1888).max(2025).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required() 

});

module.exports = { directorSchema };
