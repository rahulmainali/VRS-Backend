import { NextFunction, Request, Response } from "express";
const vehicleModel = require("../../../models/vehicle.model");
const userModel = require("../../../models/user.model");
const bookingModel = require("../../../models/booking.model");

const getDashboardData = async (req: any, res: any, next: NextFunction) => {
  const pipeline = [
    {
      $group: {
        _id: null,
        bookingsCount: { $sum: 1 },
        vehicleCount: { $sum: 1 },
        userCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        bookingsCount: 1,
        vehicleCount: 1,
        userCount: 1,
      },
    },
  ];

  Promise.all([
    vehicleModel.countDocuments(),
    userModel.countDocuments(),
    bookingModel.countDocuments(),
  ])
    .then((counts) => {
      const [vehicleCount, userCount, bookingsCount] = counts;
      return res.status(200).send({bookingCount : bookingsCount, vehicleCount:vehicleCount, userCount: userCount})
      console.log({ bookingsCount, vehicleCount, userCount });
    })
    .catch((error) => console.error(error));
};

module.exports = getDashboardData
