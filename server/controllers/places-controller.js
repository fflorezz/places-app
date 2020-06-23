const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");

const HttpError = require("../models/http-error");

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

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for provider id", 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    session.commitTransaction();
  } catch (error) {
    console.log("save place", { error });
    return next(new HttpError("Creating place failed, please try again", 500));
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
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
    const place = await Place.findById(placeId);
    place.title = title;
    place.description = description;
    updatedPlace = await place.save();
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

  res
    .status(200)
    .json({ updatedPlace: updatedPlace.toObject({ getters: true }) });
};

///////////////////////////////////////////////

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not delete place ", 500)
    );
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id", 404)
    );
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session: session });
    place.creator.places.pull(place);
    await place.creator.save({ session: session });
    await session.commitTransaction();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete place ", 500)
    );
  }

  res.status(200).json({ message: "deleted place" });
};

///////////////////////////////////////////////

exports.getPLaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
