const bookingRoute = require("express").Router();

//const {createBooking} = require('../controller/khalti/index.controller');
const { createBooking, getRentals, getBooking } =
  require("../controller/index.controllers").bookingControllers;

bookingRoute.post("/bookVehicle", createBooking);
bookingRoute.get("/booking", getBooking);
bookingRoute.get("/getRentals/:ownerId", getRentals);



module.exports = bookingRoute;
