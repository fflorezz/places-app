const axios = require("axios");

const HttpError = require("../models/http-error");

require("dotenv").config();

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  const data = response.data;
  console.log("map", data);

  if (!data || data.state === "ZERO_RESULTS") {
    const error = new HttpError(
      "could not find location for the specified address",
      404
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
