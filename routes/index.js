const router = require('express').Router();
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { loginValidate, createUserValidate } = require('../middlewares/validation');

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.post('/signin', loginValidate, login);
router.post('/signup', createUserValidate, createUser);

module.exports = {
  router,
};
