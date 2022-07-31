const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name: { type: String, require: [true, 'Name is required'], minLength: 3 },
  email: {
    type: String,
    require: [true, 'email is required'],
    unique: [true, 'User is already taken'],
  },
  password: {
    type: String,
    require: [true, 'Password is required'],
    minLength: 3,
  },
});

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  let result = await bcrypt.compare(String(password), this.password);
  return result;
};

userSchema.methods.signToken = async function () {
  let payload = { id: this._id, email: this.email };
  var token = jwt.sign(payload, process.env.SECRET_KEY);
  return token;
};

userSchema.methods.response = function (token) {
  return {
    name: this.name,
    email: this.email,
    token: token,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
