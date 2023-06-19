import { Request, Response, NextFunction } from "express";
import axios from "axios";
const userModel = require("../../../models/user.model");

const postPaymentInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id , email, phoneNumber, userName} = req.body
  try {
    const response = await userModel.findByIdAndUpdate(id, {
      role: "owner",
      status: "pending",
      paymentInfo: {
        email,
        phoneNumber,
        userName
      },
    });

    await response.save();
    return res.status(201).send({
      success: true,
      message: "Payment Information Added successfully!",
      response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = postPaymentInfo;
