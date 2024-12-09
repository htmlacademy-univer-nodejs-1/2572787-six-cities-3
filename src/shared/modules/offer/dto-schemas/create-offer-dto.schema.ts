import Joi from 'joi';
import { HousingType, ConvenienceType, City } from '../../../models/index.js';
import { Types } from 'mongoose';

export const createOfferDtoSchema = Joi.object({
  name: Joi.string().min(10).max(100).required(),
  description: Joi.string().min(20).max(1024).required(),
  city: Joi.string().valid(...Object.values(City)).required(),
  previewUrl: Joi.string().uri().required(),
  imagesUrls: Joi.array().items(Joi.string().uri()).required(),
  isPremium: Joi.boolean().required(),
  housingType: Joi.string().valid(...Object.values(HousingType)).required(),
  roomsNumber: Joi.number().min(1).max(8).required(),
  guestsNumber: Joi.number().min(1).max(10).required(),
  cost: Joi.number().min(100).max(100000).required(),
  conveniences: Joi.array().items(Joi.string().valid(...Object.values(ConvenienceType))).required(),
  authorId: Joi.string().required().custom((value, helpers) => {
    const filtered = Types.ObjectId.isValid(value);
    return !filtered ? helpers.error('any.invalid') : value;
  }, 'invalid objectId'),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});