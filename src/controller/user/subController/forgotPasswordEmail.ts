const userModel = require("../../../models/user.model");
const adminModel = require("../../../models/admin.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../../utils/sendEmail");
import { Request, Response } from "express";
const forgotPasswordEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (email) {
    try {
      // try finding the user with the email
      let user = await userModel.findOne({ email: email });
      console.log(user)
      if(!user) user = await adminModel.findOne({email:email})
      if (user) {
        // generate token
        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_KEY, {
          expiresIn: "5min",
        });
        const resetPasswordUrl = `${req.protocol}://localhost:3000/api/user/forgotPassword/${user._id}/${token}`;

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

        await sendEmail({
          email: email,
          subject: "Forgot Password Recovery",
          message,
        });
        return res.status(200).send({ message: "Email sent successfully !!" });
      } else return res.status(400).send({ message: "Invalid email" });
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  } else return res.status(400).send({ message: "Please provide an email" });
};

module.exports = forgotPasswordEmail;
