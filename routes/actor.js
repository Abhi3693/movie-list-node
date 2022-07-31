const express = require('express');
let router = express.Router();
const yup = require('yup');

let Actor = require('../models/Actor');
let auth = require('../middleware/auth');
let validate = require('../middleware/validate');

// Movie validation schema
const actorSchema = yup.object().shape({
  body: yup.object({
    actor: yup.object({
      name: yup.string().required('Name is required'),
      dob: yup.date().required('Date of birth is required'),
      bio: yup.string().required('bio is required'),
    }),
  }),
});

// User authorization
router.use(auth.verifyUser);

// Add Actor
router.post('/', validate(actorSchema), async (req, res, next) => {
  try {
    let findActor = await Actor.findOne({ name: req.body.actor.name });
    if (findActor) {
      return res.status(403).json({ errors: 'Actor is already taken' });
    }

    let actor = await Actor.create(req.body.actor);

    if (!actor) {
      return res.status(422).json({ errors: 'Actor could not created' });
    }
    return res.status(200).json({ actor: actor });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
