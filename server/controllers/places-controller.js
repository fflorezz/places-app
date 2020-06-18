const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

///////////////////////////////////////////////

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for the provided id", 404);
  }

  res.json({ place });
};

///////////////////////////////////////////////

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => {
    return place.creator === userId;
  });

  if (places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }

  res.json({ places });
};

///////////////////////////////////////////////

const createPlace = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

///////////////////////////////////////////////

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for the provided id", 404);
  }

  const { title, description } = req.body;

  const updatedPlace = {
    ...place,
    title: title,
    description: description,
  };

  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ message: "updated place", updatedPlace });
};

///////////////////////////////////////////////

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for the provided id", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((place) => {
    return place.id !== placeId;
  });

  res.status(200).json({ message: "deleted place", place });
};

///////////////////////////////////////////////

exports.getPLaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
