const express = require('express');
let router = express.Router();
const yup = require('yup');

let User = require('../models/User');
let jwt = require('jsonwebtoken');

let validate = require('../middleware/validate');

// User register validation schema
const userRegisterSchema = yup.object().shape({
  body: yup.object({
    user: yup.object({
      name: yup
        .string()
        .required('Name is required')
        .min(3, 'Atleast 3 char required'),
      email: yup
        .string()
        .email('Enter valid email')
        .required('Email is required'),
      password: yup.string().required('Password is required'),
    }),
  }),
});

// User login validation Schema
const userLoginSchema = yup.object().shape({
  body: yup.object({
    user: yup.object({
      email: yup
        .string()
        .min(2, 'Enter atleast 3 char')
        .email('Enter valid Email')
        .required('Email is required'),
      password: yup.string().required('Password is required'),
    }),
  }),
});

// VerifyUser
router.get('/', async (req, res, next) => {
  let token = req.headers.authorization;

  try {
    let payload = await jwt.verify(token, process.env.SECRET_KEY);
    if (payload) {
      let user = await User.findById(payload.id);
      if (user) {
        let token = await user.signToken();
        let userResponse = user.response(token);
        return res.status(200).json({ user: userResponse });
      } else {
        return res.status(401).json({ user: 'user not found' });
      }
    } else {
      return res.status(401).json({ error: 'token required' });
    }
  } catch (err) {
    return res.status(401).json({ error: [err.message] });
  }
});

// Login User
router.post('/', validate(userLoginSchema), async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.user.email });
    if (!user) {
      return res.status(422).json({ errors: ['User is not registerd'] });
    }

    let validatePassword = await user.verifyPassword(req.body.user.password);
    if (!validatePassword) {
      return res.status(422).json({ errors: ['Paaword is incorrect'] });
    }

    let token = await user.signToken();
    let userResponse = user.response(token);
    return res.status(200).json({ user: userResponse });
  } catch (err) {
    return next(err);
  }
});

// Register User
router.post(
  '/register',
  validate(userRegisterSchema),
  async (req, res, next) => {
    try {
      let findUser = await User.findOne({ name: req.body.user.name });

      if (findUser) {
        res.status(422).json({ errors: 'User is alredy taken' });
      }

      let user = await User.create(req.body.user);
      if (!user) {
        return res.status(422).json({ errors: 'User could not created' });
      }
      let token = await user.signToken();
      let userResponse = user.response(token);
      res.status(200).json({ user: userResponse });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
