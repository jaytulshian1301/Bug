const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const User = require("./model/User");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/test1", { useNewUrlParser: true })
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

async function checkIfExists(req, res, next) {
  const { email, username } = req.body;
  if (await User.findOne({ $or: [{ username }, { email }] }))
    return res.send("Email or Username exists");
  next();
}

app.post("/", checkIfExists, async (req, res) => {
  const newuser = new User(req.body);
  await newuser.save();
  res.send("Created");
});

app.listen(4000, (req, res) => {
  console.log("listening at 4000");
});
