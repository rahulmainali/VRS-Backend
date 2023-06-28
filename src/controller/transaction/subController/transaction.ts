import mongoose from "mongoose";
const Transaction = require("../../../models/transaction.model");
import { Request, Response, NextFunction } from "express";

const EXECUTE_TRANSACTION = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { vehicleId, userId, bookingId, amount } = req.body;

  try {
    const transaction = new Transaction({
      vehicleId: new mongoose.Types.ObjectId(vehicleId),
      userId: new mongoose.Types.ObjectId(userId),
      bookingId: new mongoose.Types.ObjectId(bookingId),
      amount,
      createdOn: new Date().toString(),
    });

    const savedTransaction = await transaction.save();
    res.status(201).json({
      message: "Transaction saved successfully",
      transaction: savedTransaction,
    });
  } catch (error: any) {

      return res.status(400).send({message: error.message})
  }
};

module.exports = EXECUTE_TRANSACTION;
