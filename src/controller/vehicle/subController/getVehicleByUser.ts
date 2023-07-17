const vehicleModel = require("../../../models/vehicle.model");
import mongoose from 'mongoose'
import { NextFunction, Request, Response } from "express";

const getVehicleByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    if (userId == undefined) {
      return res
        .status(400)
        .send({ success: false, message: "User Id is not provided" });
    }

    // if userId is given

    const response = await vehicleModel.find({ userId: new mongoose.Types.ObjectId(userId)});
    return res.status(200).send({ success: true, vehicle: response });
  } catch (error) {
    next(error);
  }
};

module.exports = getVehicleByUser;
