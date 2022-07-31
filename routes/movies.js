const express = require('express');
const yup = require('yup');

const router = express.Router();

let Movie = require('../models/Movie');
let Director = require('../models/Director');
let Producer = require('../models/Producer');
let Actor = require('../models/Actor');
let auth = require('../middleware/auth');
let validate = require('../middleware/validate');

// Movie validation schema
const movieSchema = yup.object().shape({
  body: yup.object({
    movie: yup.object({
      name: yup.string().required('Name is required'),
      releaseDate: yup.string().required('Date is required'),
      plot: yup.string().required('Plot is required'),
      poster: yup.string().required('poster is required'),
      directors: yup
        .array()
        .of(yup.string())
        .min(1, 'At least one director is required'),
      producer: yup.string().required('Producer is required'),
      actors: yup
        .array()
        .of(yup.string().length(24, 'Actor is invalid'))
        .min(1, 'At least one actor is required'),
    }),
  }),
});

//  Get Movie List
router.get('/', async (req, res, next) => {
  try {
    let movies = await Movie.find({})
      .populate('producer')
      .populate('actors')
      .populate('directors');

    let movieResponse = movies.map((movie) => {
      return movie.response();
    });

    return res.status(200).json({ movies: movieResponse });
  } catch (err) {
    return next(err);
  }
});

// User authorization
router.use(auth.verifyUser);

// All directors, Producer, Actors
router.get('/addMovie', async (req, res, next) => {
  try {
    let directors = await Director.find({});
    let producers = await Producer.find({});
    let actors = await Actor.find({});

    return res.status(200).json({
      all: {
        actors,
        producers,
        directors,
      },
    });
  } catch (err) {
    return next(err);
  }
});

// Get Single movie
router.get('/:id', async (req, res, next) => {
  let id = req.params.id;
  try {
    let movie = await Movie.findById(id)
      .populate('actors')
      .populate('directors')
      .populate('producer');

    let newMovie = movie.updateMovieResponse();

    return res.status(200).json({ movie: newMovie });
  } catch (err) {
    return next(err);
  }
});

// Update movie
router.put('/:id', validate(movieSchema), async (req, res) => {
  let id = req.params.id;
  try {
    let movie = await Movie.findByIdAndUpdate(id, req.body.movie, {
      new: true,
    });
    return res.status(200).json({ movie });
  } catch (err) {
    return next(err);
  }
});

// Add movie
router.post('/', validate(movieSchema), async (req, res, next) => {
  try {
    let findMovie = await Movie.findOne({ name: req.body.movie.name });
    if (findMovie) {
      return res.status(403).json({ errors: 'Movie name is already taken' });
    }

    let movie = await Movie.create(req.body.movie);
    if (!movie) {
      return res.status(422).json({ errors: 'Movie could not created' });
    }
    return res.status(200).json({ movie });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
