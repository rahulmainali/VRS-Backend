const Booking = require("../../../models/booking.model");
const Vehicle = require("../../../models/vehicle.model");
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import moment from "moment";

const GET_RENTALS = async (req: Request, res: Response) => {
  const ownerId = req.params.ownerId;
  try {
    const rentals = await Booking.find({ ownerId: ownerId });
    return res.status(200).send({ rentals: rentals });
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
};

module.exports = GET_RENTALS;
