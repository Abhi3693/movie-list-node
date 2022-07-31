const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let actorSchema = new Schema({
  name: {
    type: String,
    require: [true, 'Actor name is required'],
    minLength: 3,
    unique: true,
  },
  gender: {
    type: String,
    default: 'male',
  },
  dob: { type: Date, require: [true, 'DOB is required'] },
  bio: { type: String, require: [true, 'bio is required'] },
});

actorSchema.methods.response = function () {
  return {
    id: this._id,
    name: this.name,
    dob: this.dob,
    gender: this.gender,
    movies: this.movies,
  };
};

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
