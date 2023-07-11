import { NextFunction, Request, Response } from "express";
const Review = require("../../../models/review.model");
const Booking = require("../../../models/booking.model");
import mongoose from 'mongoose'

const getUserDashboardData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.id;
  try {
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
    if (userId) {
      let bookingCount = await Booking.countDocuments({ userId: userId });
      let reviewCount = await Review.countDocuments({ userId: userId });
      let totalMoneySpent = await Booking.aggregate(pipeline);
      console.log(totalMoneySpent)
      let totalMoney = 0;
      if(totalMoneySpent.length) totalMoney = totalMoneySpent[0].totalAmount ? totalMoneySpent[0].totalAmount : 0
      console.log(totalMoneySpent);
      return res.status(200).send({
        bookingCount: bookingCount,
        reviewCount: reviewCount,
        totalAmount: totalMoney,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = getUserDashboardData;
