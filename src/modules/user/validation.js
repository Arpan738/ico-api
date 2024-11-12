const Joi = require('joi');
const { password, emailCustom } = require('../../validations/custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`,
    }),
    password: Joi.string().required().custom(password).messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    name: Joi.string().required().messages({
      "string.empty": `First name must contain value`,
      "any.required": `First name is a required field`
    }),
    profilePic: Joi.string(),
    roleId: Joi.string().allow(''),
    role: Joi.string().allow('')
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().custom(emailCustom).messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`
    }),
  }),
};

const update = {
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      "string.empty": `First name must contain value`,
      "any.required": `First name is a required field`
    }),
    profilePic: Joi.string().allow(''),
    roleId: Joi.string().allow('')
  }),
};

const updateWithPass = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password).messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
  }),
};

module.exports = {
  register,
  login,
  update,
  updateWithPass
}