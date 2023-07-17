const vehicleModel = require("../../../models/vehicle.model");
import { NextFunction, Request, Response } from "express";
const cloudinary = require("../../../utils/cloudinary");
const sendEmail = require('../../../utils/sendEmail')
interface imageType {
  public_id: string;
  url: string;
}

const approveVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const response = await vehicleModel.findByIdAndUpdate(id, {
      status: "verified",
    });
    const email = response.ownerEmail;
    const message = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        p {
          font-size: 16px;
          color: '#00ff00'
        }
      </style>
    </head>
    <body>
      <h1>Vehicle Approved Message</h1>
      <p>Congratulations! Your Vehicle Request has been approved.</p>
    </body>
  </html>
`;
    await sendEmail({
      email: email,
      subject: "Vehicle Approved Message ",
      message,
      messageType: "html",
    });

    return res
      .status(200)
      .send({ success: true, message: "Vehicle verified successfully! " });
  } catch (error: any) {
    return res.status(400).send({ message: error.message });
  }
};

const rejectVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const response = await vehicleModel.findByIdAndUpdate(id, {
      status: "rejected",
    });
    const email = response.ownerEmail;
    const message = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        p {
          font-size: 16px;
          color: '#ff0000'
        }
      </style>
    </head>
    <body>
      <h1>Vehicle Request Rejected </h1>
      <p>Opps! Your Vehicle Request is rejected or no longer verified vehicle in our system.</p>
      <h3>Possible reasons to get rejected are: </h3>
      <ul>
      <li>Your Vehicle request form details didn't matched with your documents</li>
      <li>Fake documents</li>
      <li>Voilation of rules and regulations</li>
      </ul>
    </body>
  </html>
`;
    await sendEmail({
      email: email,
      subject: "Vehicle Rejection Message ",
      message,
      messageType: "html",
    });

    return res.status(200).send({
      success: true,
      message: "Vehicle is rejected by admin successfully! ",
    });
  } catch (error: any) {
    return res.status(400).send({ message: error.message });
  }
};

const vehicleRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

    // get all vehicle with status pending i.e their kyc needs to be checked
    const response = await vehicleModel.find({ status: { $eq: "pending" } });
    return res.status(200).send({ data: response });
  } catch (error: any) {
    return res.status(400).send({ message: error.message });
  }
};

const viewAllVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get all vehicle which are in rejected or verified state
    const response = await vehicleModel.find({
      $or: [{ status: "rejected" }, { status: "verified" }],
    });
    return res.status(200).send({ data: response });
  } catch (error: any) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = {
  approveVehicle,
  rejectVehicle,
  vehicleRequest,
  viewAllVehicle,
};
