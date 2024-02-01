const userRouter = require('express').Router();
const { updateUserValidate } = require('../middlewares/validation');
const { getUserInfo, updateProfile } = require('../controllers/users');

userRouter.get('/me', getUserInfo);
userRouter.patch('/me', updateUserValidate, updateProfile);

module.exports = {
  userRouter,
};
