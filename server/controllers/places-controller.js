const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    console.log("could not findPlace", { error });
    return next(
      new HttpError("Could not find a place for the provided id", 500)
    );
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id", 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

///////////////////////////////////////////////

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    console.log("could not find Places", { error });
    return next(
      new HttpError("Could not find a place for the provided id", 500)
    );
  }

  if (places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

///////////////////////////////////////////////

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 500));
  }

  const { title, description, address, image, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch ({ error }) {
    console.log("getCoords", { error });
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Metro_de_Medell%C3%ADn%2C_Colombia.jpg/800px-Metro_de_Medell%C3%ADn%2C_Colombia.jpg",
    creator,
  });

  let result;
  try {
    result = await createdPlace.save();
  } catch (error) {
    console.log("save place", { error });
    return next(HttpError("Creating place failed, please try again", 500));
  }

  res.status(201).json({ place: result });
};

///////////////////////////////////////////////

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 500));
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let updatedPlace;
  try {
    updatedPlace = await Place.findByIdAndUpdate(placeId, {
      title,
      description,
    });
    console.log(updatedPlace);
  } catch (error) {
    console.log("could not update place", { error });
    return next(
      new HttpError("Could not update place for the provided id", 500)
    );
  }

  if (!updatedPlace) {
    return next(
      new HttpError("Could not find a place for the provided id ", 404)
    );
  }

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
