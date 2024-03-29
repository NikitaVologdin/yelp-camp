const BaseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        // escape symbols only (e.g. &, <)
        const filtered = sanitizeHTML(value, {
          allowedTags: false,
          allowedAttributes: false,
        });
        // remove html
        const clean = sanitizeHTML(filtered, {
          allowedTags: [],
          allowedAttributes: {},
        });
        // show error if html was present/removed
        if (clean !== filtered) return helpers.error("string.escapeHTML");
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    address: Joi.string().required().escapeHTML(),
    price: Joi.number().min(0).required(),
    telephone: Joi.number().required(),
    email: Joi.string().email().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(10),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
