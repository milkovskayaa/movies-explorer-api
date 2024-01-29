const movieRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { deleteMovieValidate, createMovieValidate } = require('../middlewares/validation');

movieRouter.get('/', getMovies);
movieRouter.delete('/:id', deleteMovieValidate, deleteMovie);
movieRouter.post('/', createMovieValidate, createMovie);

module.exports = {
  movieRouter,
};
