const vehicleModel = require("../../../models/vehicle.model");
const reviewModel = require("../../../models/review.model");
import { NextFunction, Request, Response } from "express";

const getVerifiedVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await vehicleModel.find({ status: "verified" });
    return res.status(200).send({vehicles: response});
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};

module.exports = getVerifiedVehicles;
