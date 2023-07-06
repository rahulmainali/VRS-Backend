const reviewModel = require("../../../models/review.model");
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const cloudinary = require("../../../utils/cloudinary");
import slugify from "slugify";

interface imageType {
  public_id: string;
  url: string;
}
const postReview = async (req: any, res: Response, next: NextFunction) => {

   const {userId, vehicleId} =req.body 
  const categoryObj: any = {
    userId: req.body.userId,
    vehicleId: req.body.vehicleId,
    userName: req.body.userName,
    review: req.body.review,
    rating: req.body.rating,
    image: req.body.image,
    createdOn: new Date().toString(),
  };
  try {
    // Check if there is already a review for this user and vehicle
    reviewModel.findOne({ userId, vehicleId }, async (err: any, existingReview: any) => {
      if (existingReview) {
        // If a review already exists, return an error message
        res.status(400).send("You have already reviewed this vehicle.");
      } else {
        const response = await new reviewModel(categoryObj);

        await response.save();
        return res.status(201).send({
          success: true,
          message: "Review posted successfully!",
          response,
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = postReview;
