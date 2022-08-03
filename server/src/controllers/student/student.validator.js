const Joi = require("joi");

export const getAllStudents = {
  query: {
    page: Joi.number().required(),
    limit: Joi.number().required(),
  },
};
