const express = require('express');
let router = express.Router();
const yup = require('yup');

let Producer = require('../models/Producer');
let auth = require('../middleware/auth');

let validate = require('../middleware/validate');

// Producer validation schema
const producerSchema = yup.object().shape({
  body: yup.object({
    producer: yup.object({
      name: yup.string().required('Name is required'),
      dob: yup.date().required('Date of birth is required'),
      bio: yup.string().required('bio is required'),
    }),
  }),
});

// User authorization
router.use(auth.verifyUser);

// Add Producer
router.post('/', validate(producerSchema), async (req, res, next) => {
  try {
    let findProducer = await Producer.findOne({ name: req.body.producer.name });
    if (findProducer) {
      return res.status(403).json({ errors: 'Producer is already taken' });
    }
    let producer = await Producer.create(req.body.producer);
    if (!producer) {
      return res.status(422).json({ errors: 'Producer could not created' });
    }
    return res.status(200).json({ producer });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
