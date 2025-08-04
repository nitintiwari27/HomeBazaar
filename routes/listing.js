const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//  SEARCH ROUTE (Place BEFORE :id route)
router.get(
  "/search",
  wrapAsync(async (req, res) => {
    const { q } = req.query;
    if (!q) {
      req.flash("error", "Please enter a search query.");
      return res.redirect("/listings");
    }

    const searchQuery = new RegExp(q, "i");

    const allListings = await Listing.find({
      $or: [
        { title: { $regex: searchQuery } },
        { location: { $regex: searchQuery } },
        { country: { $regex: searchQuery } },
      ],
    });

    if (allListings.length === 0) {
      req.flash("error", "No listings found matching your search.");
      return res.redirect("/listings");
    }

    res.render("listings/index", { allListings, searchTerm: q });
  })
);

// LISTINGS INDEX + CREATE
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//  NEW LISTING FORM
router.get("/new", isLoggedIn, listingController.renderNewForm);

//  SHOW / UPDATE / DELETE (DYNAMIC ROUTE – must be after /search)
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//  EDIT FORM
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
