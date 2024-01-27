const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const patternURL = require('../utils/patternURL');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

movieRouter.get('/', getMovies);

movieRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

movieRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required().pattern(patternURL),
    trailerLink: Joi.string().required().pattern(patternURL),
    thumbnail: Joi.string().required().pattern(patternURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
}), createMovie);

module.exports = {
  movieRouter,
};
