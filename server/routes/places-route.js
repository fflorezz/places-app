const express = require("express");

const {
  getPLaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
} = require("../controllers/places-controller");

const router = express.Router();

router.get("/:pid", getPLaceById);

router.get("/user/:uid", getPlacesByUserId);

router.post("/", createPlace);

router.patch("/:pid", updatePlaceById);

router.delete("/:pid", deletePlaceById);

module.exports = router;
