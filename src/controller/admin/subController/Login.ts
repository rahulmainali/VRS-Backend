import { NextFunction, Request, Response } from "express";
const bcrypt = require("bcryptjs");
const adminModel = require("../../../models/admin.model");
const { StatusCodes } = require("http-status-codes");
const auth = require("../../../middleware/auth");
const dayjs = require("dayjs");

const LOGIN = async (req: any, res: any, next: NextFunction) => {
  let { email, password } = req.body;

  //uid validation
  if (typeof email !== "string" || typeof password !== "string") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(
        "Client side validation issues. Please carefully send the right format of email and password !!"
      );
  }

  //database mapping

  try {
    const data = await adminModel.find({ email: email });

    if (data.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        success: false,
        message: "Email or Password didn't matched",
      });
    }

    if (data !== undefined && data.length !== 0) {
      //compare encrypt password

      const isMatched = await data[0].matchPassword(password);
      if (!isMatched) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
          success: false,
          message: "Email or Password didn't matched",
        });
      }

      const payload = data[0];
      const jwtPayload = {
        id: payload._id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: email,
        role: "admin",
      };
      const { ACCESS_TOKEN, REFRESH_TOKEN } = await auth.GENERATE_JWT(
        jwtPayload
      );

      // add refreshToken in the user document

      res.cookie("token", ACCESS_TOKEN, {
        httpOnly: true,
        expires: dayjs().add(30, "days").toDate(),
      });

      res.cookie("refreshToken", REFRESH_TOKEN, {
        httpOnly: true,
        expires: dayjs().add(30, "days").toDate(),
      });
      const update = await adminModel.findByIdAndUpdate(data[0]._id, {
        token: REFRESH_TOKEN,
      });

      try {
        update.save().then((response: any) => {
          return res.status(StatusCodes.OK).send({
            message: "Login successfull! ",
            id: data[0]._id,
            email: email,
            firstName: data[0].firstName,
            lastName: data[0].lastName,
          });
        });
      } catch (err) {
        return res.send(err);
      }
    }
  } catch (err: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: err.message,
    });
  }
};

module.exports = LOGIN;
