const userModel = require("../../../models/user.model");
import { NextFunction, Request, Response } from "express";
const cloudinary = require("../../../utils/cloudinary");
const sendEmail = require("../../../utils/sendEmail");
interface imageType {
  public_id: string;
  url: string;
}
const postKYC = async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.body;
  const kycForm = req.body;

  try {
    // image -- process

    const citizenshipImageFront = req.files.citizenshipImageFront;
    const citizenshipImageBack = req.files.citizenshipImageBack;
    const drivingLicenseImage = req.files.drivingLicenseImage;
    const citizenshipImageFrontResponse = await cloudinary.uploader.upload(
      citizenshipImageFront.tempFilePath,
      { folder: "citizenship_images" },
      function (err: any, success: any) {
        if (err) {
          console.log(err);
        }
      }
    );

    const citizenshipImageBackResponse = await cloudinary.uploader.upload(
      citizenshipImageBack.tempFilePath,
      { folder: "citizenship_images" },
      function (err: any, success: any) {
        if (err) {
          console.log(err);
        }
      }
    );

    const drivingLicenseImageResponse = await cloudinary.uploader.upload(
      drivingLicenseImage.tempFilePath,
      { folder: "driving_license_images" },
      function (err: any, success: any) {
        if (err) {
          console.log(err);
        }
      }
    );

    // update kyc details in user model

    const response = await userModel.findByIdAndUpdate(id, {
      status: "pending",
      kyc: {
        kycFormData: kycForm,
        citizenshipImageFront: {
          public_id: citizenshipImageFrontResponse.public_id,
          url: citizenshipImageFrontResponse.secure_url,
        },
        citizenshipImageBack: {
          public_id: citizenshipImageBackResponse.public_id,
          url: citizenshipImageBackResponse.secure_url,
        },

        drivingLicenseImage: {
          public_id: drivingLicenseImageResponse.public_id,
          url: drivingLicenseImageResponse.secure_url,
        },
      },
    });

    await response.save();
    return res.status(201).send({
      success: true,
      message: "KYC form posted successfully!",
      response,
    });
  } catch (error) {
    next(error);
  }
};

const approveKyc = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;
    const response = await userModel.findByIdAndUpdate(id, {
      status: "verified",
    });
    const email = response.email;

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
      <h1>KYC Approved Message</h1>
      <p>Congratulations! Your KYC has been approved.</p>
      <span>If you commit any voilation like abusing others then your verified accound can be unverified in future! All your privelages could go if you infringe our regulations.</p>
    </body>
  </html>
`;
    await sendEmail({
      email: email,
      subject: "KYC approved Message ",
      message,
      messageType: "html",
    });

    return res
      .status(200)
      .send({ success: true, message: "User verified successfully! " });
  } catch (error: any) {
    return res.status(400).send({ message: error.message });
  }
};

const rejectKyc = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;
    const response = await userModel.findByIdAndUpdate(id, {
      status: "rejected",
    });

    const email = response.email;

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
      <h1>KYC Rejected Message</h1>
      <p>Opps! Your KYC has been rejected or you are no longer verified user in our system.</p>
      <h3>Possible reasons to get rejected are: </h3>
      <ul>
      <li>Your KYC form details didn't matched with your documents</li>
      <li>Fake documents</li>
      <li>Duplicate Account</li>
      <li>Voilation of rules and regulations</li>
      </ul>
    </body>
  </html>
`;
    await sendEmail({
      email: email,
      subject: "KYC Rejection Message ",
      message,
      messageType: "html",
    });
    return res.status(200).send({
      success: true,
      message: "User is rejected by admin successfully! ",
    });
  } catch (error: any) {
    return res.status(400).send({ message: error.message });
  }
};

const viewKycRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

    // get all user with status pending i.e their kyc needs to be checked
    const response = await userModel.find({ status: { $eq: "pending" } });
    return res.status(200).send({ data: response });
  } catch (error: any) {
    return res.status(400).send({ message: error.message });
  }
};

const viewAllKyc = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get all kyc which are in rejected or verified state
    const response = await userModel.find({
      $or: [{ status: "rejected" }, { status: "verified" }],
    });
    return res.status(200).send({ data: response });
  } catch (error: any) {
    return res.status(400).send({ message: error.message });
  }
};

module.exports = { postKYC, approveKyc, viewKycRequest, viewAllKyc, rejectKyc };
