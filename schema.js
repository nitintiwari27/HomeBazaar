const Joi = require("joi");
const joi = require("joi");
module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
      country: joi.string().required(),
      price: joi.number().required().min(0),
      // image: joi.string().allow("", null),
      image: joi
        .object({
          url: joi.string().allow("", null),
          // Add other image properties here if needed
        })
        .allow("", null),
    })
    .required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
