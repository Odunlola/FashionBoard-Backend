// import mongoose
const mongoose = require("../config/connection");

// Models

const brandsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name."]
  },
  image: {
    type: String,
  },
  website: {
    type: String,
    required: [true, "Please enter website."]
  },
  style: {
    type: String,
    required: [true, "Please enter styles."]
  },
  speciality: {
    type: String,
    required: [true, "Please enter a speciality."]
  },
  price: {
    type: Number,
    required: [true, "Please enter a price."]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    
  }
}, {
  timestamps: true
});

const brands = mongoose.model("brands", brandsSchema);
module.exports = brands;