const router = require('express').Router();
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');

router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = {
  router,
};
