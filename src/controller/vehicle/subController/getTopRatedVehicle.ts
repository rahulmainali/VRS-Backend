const vehicleModel = require("../../../models/vehicle.model");
const reviewModel = require("../../../models/review.model");
import { NextFunction, Request, Response } from "express";
const getTopRatedVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "vehicleId",
          as: "reviews",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          name: 1,
          price: 1,
          model: 1,
          milage: 1,
          seat: 1,
          vehicleNumber: 1,
          location: 1,
          description: 1,
          status: 1,
          categoryId: 1,
          categoryName: 1,
          carImages: 1,
          bluebookImage: 1,
          insuranceImage: 1,
          reviewCount: { $size: "$reviews" },
          avgRating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $avg: "$reviews.rating" },
              0,
            ],
          },
        },
      },
      {
        $match: { status: "verified" },
      },
      {
        $sort: { avgRating: -1 },
      },
      {
        $limit: 9,
      },
    ];
    const response = await vehicleModel.aggregate(pipeline);
    return res.status(200).send({ success: true, vehicles: response });
  } catch (error) {
    next(error);
  }
};

module.exports = getTopRatedVehicle;
