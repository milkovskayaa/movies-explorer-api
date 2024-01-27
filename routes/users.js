const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const patternURL = require('../utils/patternURL');

const { getUserInfo, updateProfile } = require('../controllers/users');

userRouter.get('/me', getUserInfo);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().pattern(patternURL),
  }),
}), updateProfile);

module.exports = {
  userRouter,
};
