const Joi = require('joi');

const filmSchema = Joi.object({
  title: Joi.string().pattern(/^[A-Za-z]+$/).required(),
  genre: Joi.string().pattern(/^[A-Za-z]+$/).required(),
  year: Joi.number().min(1888).max(2025).required(),
    desc: Joi.string().allow(''),
});

module.exports = { filmSchema };
