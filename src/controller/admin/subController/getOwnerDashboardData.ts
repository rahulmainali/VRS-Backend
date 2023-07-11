import { NextFunction, Request, Response } from "express";
const Vehicle = require("../../../models/vehicle.model");
const Booking = require("../../../models/booking.model");
import mongoose from 'mongoose'

const getOwnerDashboardData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.id  
  try {

;
  const pipeline = [
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ];

const earningPipeline = [
    {
      $match: { ownerId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ];


    if (userId) {


      let bookingCount = await Booking.countDocuments({ userId: userId });
      let rentalCount = await Booking.countDocuments({ ownerId: userId });
      let vehicleCount = await Vehicle.countDocuments({ userId: userId });
      let totalMoneySpent = await Booking.aggregate(pipeline);
      let totalMoney = 0;
      if(totalMoneySpent.length) totalMoney = totalMoneySpent[0].totalAmount ? totalMoneySpent[0].totalAmount : 0
      let totalEarning = await Booking.aggregate(earningPipeline)
      let earning = 0
      if(totalEarning.length) earning = totalEarning[0].totalAmount ? totalEarning[0].totalAmount : 0
     
      return res
        .status(200)
        .send({
          bookingCount: bookingCount,
          rentalCount: rentalCount,
          vehicleCount: vehicleCount,
          totalMoneySpent: totalMoney,
          totalEarning: earning,
        });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = getOwnerDashboardData;
