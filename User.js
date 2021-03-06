const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4, // probably want to make this actually 10+ in prod - montana
  },
});

userSchema.pre("save", function (next) {
  return bcrypt
    .hash(this.password, 10)
    .then((hash) => {
      this.password = hash;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

userSchema.methods.validatePassword = function (passwordGuess) {
  return bcrypt.compare(passwordGuess, this.password);
};

module.exports = mongoose.model("User", userSchema, "users");
