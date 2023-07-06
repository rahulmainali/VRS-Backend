const reviewModel = require("../../../models/review.model");
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const cloudinary = require("../../../utils/cloudinary");
const slugify = require("slugify");

interface imageType {
  public_id: string;
  url: string;
}
const getReview = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const vehicleId = req.params.vehicleId;
    if (!userId && !vehicleId) {
      // get all reivews
      const response = await reviewModel.find({});
      return res.status(200).send({
        success: true,
        response,
      });
    }
    // if userId is given
    if (userId) {
      const response = await reviewModel.find({userId:userId});
      const test = [];
      await test.push(response);
      return res.status(200).send({ response: test });
    } 
    // if vehicleId is given
    else {
      const response = await reviewModel.find({vehicleId:vehicleId});
      const test = [];
      await test.push(response);
      return res.status(200).send({ response: test });
    }

    // ------------
  } catch (error) {
    next(error);
  }
};

module.exports = getReview;
