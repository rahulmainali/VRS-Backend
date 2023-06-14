const userModel = require("../../../models/user.model");
const adminModel = require("../../../models/admin.model");
const otpGenerator = require("otp-generator");
const sendEmail = require("../../../utils/sendEmail");
import { NextFunction, Request, Response } from "express";

const sendEmailOTP = async (req: Request, res: Response) => {
  const { email, id } = req.body;
  if (email) {
    try {
      // try finding the user with the email
      const user = await userModel.findOne({ email: email });
      if (user) {
        // generate otp
        const OTP = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const message = `
  <html>
    <head>
      <style>
        /* add your CSS styles here */
        body {
          font-family: Arial, sans-serif;
        }
        h1 {
          color: #007bff;
        }
        p {
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <h1>Email Verification </h1>
      <p>Please verify your email using this OTP :- \n\n ${OTP} \n\n If you have not requested this email then, please ignore it.</p>
      <br>
      <span>Best Regards,<span>
      <span>Sadhan<span>
    </body>
  </html>
`;

        // save otp in database to verify later
        const otpResponse = await userModel.findByIdAndUpdate(id, { otp: OTP });
        await otpResponse.save();
        await sendEmail({
          email: email,
          subject: "Email Verification with OTP",
          message: message,
          messageType: 'html',
        });
        return res.status(200).send({
          message: "Email sent successfully !!",
          OTP: OTP,
          id: user._id,
        });
      } else return res.status(400).send({ message: "Invalid email" });
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  } else return res.status(400).send({ message: "Please provide an email" });
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body;

  try {
    if (id) {
      const response = await userModel.findByIdAndUpdate(id, {
        emailVerified: "verified",
      });
      response.save();
      return res.status(200).send({ message: "Email verified successfully!" });
    } else return res.status(400).send({ message: "Please provide userID" });
  } catch (error: any) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = { sendEmailOTP, verifyEmail };
