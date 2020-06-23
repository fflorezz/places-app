const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Max Schwarz",
    email: "test@mail.com",
    password: "test",
    image:
      "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    places: 3,
  },
];

/////////////////////////////////////////////

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("Something went wrong", 500));
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

/////////////////////////////////////////////

const signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Signin up failed, please try again", 500));
  }

  if (existingUser) {
    return next(new HttpError("User exists already ", 422));
  }

  const createdUser = new User({
    name,
    email,
    password,
    places: [],
    image:
      "https://images.pexels.com/photos/4611970/pexels-photo-4611970.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  });

  try {
    await createdUser.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Signin up failed, please try again*", 422));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

/////////////////////////////////////////////

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Login in  failed, please try again", 500));
  }

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError("Invalid credentials, could not  log you in ", 401)
    );
  }

  res.json({
    message: "Logged in",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
