import mongoose from "mongoose";
const Vehicle = require("./vehicle.model");
const User = require("./user.model");

const reviewSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: Vehicle },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: User },
  userName: { type: String},
  image: {
    public_id: String,
    url: String,
  },
  rating: { type: Number, required: [true, "A rating is required"] },
  review: String,
  createdOn: { type: Date, required: true },
});


module.exports = mongoose.model("review", reviewSchema);
