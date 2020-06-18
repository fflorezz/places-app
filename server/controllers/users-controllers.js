const { v4: uuid } = require("uuid");

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

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signUp = (req, res, next) => {
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((user) => user.email === email);

  if (hasUser) {
    throw new HttpError("emil already exist", 422);
  }

  if (name && email && password) {
    const createdUser = {
      id: uuid(),
      name,
      email,
      password,
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ createdUser });
  } else {
    throw new HttpError("email, name and password are required", 422);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => {
    return user.email === email;
  });

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Invalid user or password", 401);
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
