const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let movieSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      minLength: 3,
      unique: true,
    },
    actors: [{ type: Schema.Types.ObjectId, require: true, ref: 'Actor' }],
    directors: [
      { type: Schema.Types.ObjectId, require: true, ref: 'Director' },
    ],
    producer: { type: Schema.Types.ObjectId, require: true, ref: 'Producer' },
    poster: [{ type: String, require: true }],
    releaseDate: { type: Date, require: true },
    plot: { type: String, require: true },
  },
  { timestamps: true }
);

movieSchema.methods.response = function () {
  return {
    id: this._id,
    name: this.name,
    releaseDate: this.releaseDate,
    plot: this.plot,
    poster: this.poster,
    actors: handleActors(this.actors),
    directors: handleActors(this.directors),
    producer: { id: this.producer._id, name: this.producer.name },
    // producer: { id: this.producer.id, name: this.producer.name },
  };
};

movieSchema.methods.updateMovieResponse = function () {
  return {
    name: this.name,
    releaseDate: handleDate(this.releaseDate),
    plot: this.plot,
    poster: String(this.poster),
    actors: handleActorsResponse(this.actors),
    directors: handleActorsResponse(this.directors),
    producer: String(this.producer._id),
    actorsInfo: handleActorsInfoResponse(this.actors),
    directorsInfo: handleActorsInfoResponse(this.directors),
    producerInfo: { id: String(this.producer._id), name: this.producer.name },
  };
};

const handleActors = (arr) => {
  return (newActors = arr.map((elm) => {
    return {
      id: elm._id,
      name: elm.name,
    };
  }));
};

const handleActorsResponse = (arr) => {
  return (newActors = arr.map((elm) => {
    return String(elm._id);
  }));
};

const handleActorsInfoResponse = (arr) => {
  return (newActors = arr.map((elm) => {
    return { name: elm.name, id: elm._id };
  }));
};

const handleDate = (date) => {
  let newDate = new Date(date);
  let year = newDate.getFullYear();
  let month =
    newDate.getMonth() + 1 < 10
      ? `0${newDate.getMonth() + 1}`
      : newDate.getMonth() + 1;
  let day =
    newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();

  return `${year}-${month}-${day}`;
};

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
