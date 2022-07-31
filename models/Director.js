const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let directorSchema = new Schema({
  name: {
    type: String,
    require: [true, 'Director name is required'],
    minLength: 3,
    unique: true,
  },
  gender: { type: String, require: [true, 'Gender is required'] },
  dob: { type: Date, require: [true, 'DOB is required'] },
  bio: { type: String, require: [true, 'bio is required'] },
});

directorSchema.methods.response = function () {
  return {
    id: this._id,
    name: this.name,
    dob: this.dob,
    gender: this.gender,
    movies: this.movies,
  };
};

const Director = mongoose.model('Director', directorSchema);

module.exports = Director;
