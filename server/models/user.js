const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the model
const userSchema = new Schema({
  email: { type: String, lowercase: true, unique: true },
  password: String
});

// create the model class and export it
const UserModelClass = mongoose.model("user", userSchema);
module.exports = UserModelClass;
