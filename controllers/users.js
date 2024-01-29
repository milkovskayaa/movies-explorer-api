const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/not-found');
const UnauthorizedError = require('../errors/unauthorized');

const JWT_SECRET = process.env.JWT_SECRET || 'some-secret-key';

// возвращает информацию о пользователе
const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

// обновляет информацию о пользователе (email и имя)
const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

// регистрация
const createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })
        .then((user) => {
          const { password, ...userWithoutPassword } = user.toObject();
          res.status(201).send(userWithoutPassword);
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
            return;
          }
          next(err);
        });
    });
};

// авторизация
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Пользователь не найден'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUserInfo,
  updateProfile,
  createUser,
  login,
};
