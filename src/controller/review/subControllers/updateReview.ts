import { Request, Response, NextFunction } from "express";

const reviewModel = require("../../../models/review.model");

const updateReview = async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateInfo = req.body;
  try {
    if (id == undefined)
      return res
        .status(400)
        .send({ success: false, message: "Please provide valid review id!" });

    const response = await reviewModel.findByIdAndUpdate(id, updateInfo);
    await response.save();

    return res.status(200).send({ message: "review updated successfully!" });
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
};

module.exports = updateReview;
