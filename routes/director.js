const express = require('express');
let router = express.Router();

let Director = require('../models/Director');
let auth = require('../middleware/auth');
const yup = require('yup');

let validate = require('../middleware/validate');

// Director validation schema
const directorSchema = yup.object().shape({
  body: yup.object({
    director: yup.object({
      name: yup.string().required('Name is required'),
      dob: yup.date().required('Date of birth is required'),
      bio: yup.string().required('bio is required'),
    }),
  }),
});

// User authorization
router.use(auth.verifyUser);

// Add Director
router.post('/', validate(directorSchema), async (req, res, next) => {
  try {
    let findDirector = await Director.findOne({
      name: req.body.director.name,
    });

    if (findDirector) {
      return res.status(403).json({ errors: 'Director is already taken' });
    }
    let director = await Director.create(req.body.director);

    if (!director) {
      return res.status(422).json({ errors: 'Director could not created' });
    }
    return res.status(200).json({ director });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
