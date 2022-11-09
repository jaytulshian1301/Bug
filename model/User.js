const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const hashPass = async (pass) => {
  const salt = await bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pass, salt);
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email Cannot be empty"],
    lowercase: true,
    unique: true,

    // Adding regex for email validation
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.pre("save", async function (next) {
  this.password = await hashPass(this.password);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
