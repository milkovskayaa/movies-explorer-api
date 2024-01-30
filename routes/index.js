const router = require('express').Router();
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { loginValidate, createUserValidate } = require('../middlewares/validation');

router.post('/signin', loginValidate, login);
router.post('/signup', createUserValidate, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = {
  router,
};
