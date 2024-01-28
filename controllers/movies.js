const Movie = require('../models/movie');
const { BadRequestError } = require('../errors/bad-request');
const { NotFoundError } = require('../errors/not-found');
const { ForbiddenError } = require('../errors/forbidden');

// возвращает все сохранённые текущим пользователем фильмы
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch((err) => next(err));
};

// создаёт фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner = req.user._id,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => next(err));
};

// удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  const { id } = req.params;
  return Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Карточка не найдена'));
      }
      if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Вы не можете удалять чужую карточку'));
      }
      movie.deleteOne().then(() => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
