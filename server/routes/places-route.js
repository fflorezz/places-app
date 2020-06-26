const express = require("express");
const { check } = require("express-validator");

const {
  getPLaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
} = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/:pid", getPLaceById);

router.get("/user/:uid", getPlacesByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty().withMessage("need a title"),
    check("description")
      .isLength({ min: 5 })
      .withMessage("need minimum 5 characters"),
    check("address")
      .not()
      .isEmpty()
      .withMessage("description need at least minimum 5 characters"),
  ],
  createPlace
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty().withMessage("need a title"),
    check("description")
      .isLength({ min: 5 })
      .withMessage("description need at least minimum 5 characters"),
    check("address")
      .not()
      .isEmpty()
      .withMessage("description need at least minimum 5 characters"),
  ],
  updatePlaceById
);

router.delete("/:pid", deletePlaceById);

module.exports = router;
