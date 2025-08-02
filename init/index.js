const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js"); // Add this
const axios = require("axios");

const MONGO_URL = "mongodb://127.0.0.1:27017/Findhouse";

main()
  .then(() => {
    console.log("Connected to DB");
    initDB();
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await User.deleteMany({}); // Optional: Reset users
  const defaultUser = new User({
    username: "admin",
    email: "admin@example.com",
  });
  await defaultUser.save(); // Save to get _id

  const locationIQToken = process.env.MAP_TOKEN;

  const listingsWithDetails = await Promise.all(
    initData.data.map(async (obj) => {
      let longitude = 0,
        latitude = 0;

      // Geocode to get coordinates
      try {
        const res = await axios.get("https://us1.locationiq.com/v1/search", {
          params: {
            key: locationIQToken,
            q: obj.location,
            format: "json",
          },
        });
        latitude = parseFloat(res.data[0].lat);
        longitude = parseFloat(res.data[0].lon);
      } catch (err) {
        console.error(
          "Failed to fetch coordinates for:",
          obj.location,
          err.message
        );
      }

      return {
        ...obj,
        coordinates: [longitude, latitude],
        owner: defaultUser._id,
      };
    })
  );

  await Listing.insertMany(listingsWithDetails);
  console.log("Data initialized");
};
