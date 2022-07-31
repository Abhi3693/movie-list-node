const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

let userRoute = require('./routes/user');
let movieRoute = require('./routes/movies');
let actorRoute = require('./routes/actor');
let directorRoute = require('./routes/director');
let producerRoute = require('./routes/producer');
let errorController = require('./controller/errorController');

// Local Database connectivity
// mongoose.connect('mongodb://localhost/movie-list', (err) => {
//   console.log(err ? err : 'Connected to Database');
// });

// Database connectivity to mongoDB Atlas
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DB_CONNECTION)
  .then((res) => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log(err));

// App Intanciation
const app = express();

// Application middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/user', userRoute);
app.use('/api/movie', movieRoute);
app.use('/api/actor', actorRoute);
app.use('/api/director', directorRoute);
app.use('/api/producer', producerRoute);
app.use(errorController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 404).json({ error: err || 'Request not found' });
});

// Server listen
app.listen(3003, () => {
  console.log('Server is listening on 3003');
});
