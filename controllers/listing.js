const Listing = require("../models/listing");
const mapToken = process.env.MAP_TOKEN;
const axios = require("axios");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log("Line 19 show", listing);
  if (!listing) {
    req.flash("error", "Sorry, the listing you're looking for doesn't exist.");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const { listing } = req.body;
  const { location } = listing;

  // Get lat/lng from LocationIQ
  const locationIQToken = process.env.MAP_TOKEN;
  const response = await axios.get("https://us1.locationiq.com/v1/search", {
    params: {
      key: locationIQToken,
      q: location,
      format: "json",
    },
  });

  const geoData = response.data[0];
  const latitude = parseFloat(geoData.lat);
  const longitude = parseFloat(geoData.lon);

  // Image file
  const url = req.file?.path || "";
  const filename = req.file?.filename || "";

  // Create and assign
  const newListing = new Listing({
    ...listing,
    coordinates: [longitude, latitude],
    image: { url, filename },
    owner: req.user._id,
  });

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash(
      "error",
      "Cannot edit. The listing you’re trying to access does not exist."
    );
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated Succeessfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};
