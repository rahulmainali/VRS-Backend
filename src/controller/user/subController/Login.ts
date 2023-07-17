import { NextFunction, Request, Response } from "express";
const bcrypt = require("bcryptjs");
const userModel = require("../../../models/user.model");
const { StatusCodes } = require("http-status-codes");
const auth = require("../../../middleware/auth");
const dayjs = require("dayjs");

const login = async (req: any, res: any, next: NextFunction) => {
  let { email, password } = req.body;

  //uid validation
  if (typeof email !== "string" || typeof password !== "string") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(
        "Server side validation issues. Please carefully send the right format of email and password !!"
      );
  }

  //database mapping

  try {
    const data = await userModel.find({ email: email });

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


      const payload : any = data[0];
      console.log(payload.image)
      let role = payload?.role === 'owner' ? 'owner' : 'user';
      const jwtPayload = {
        id: payload._id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: email,
        role: role,
        status: payload.status,
        method: "custom",
        image: payload.image ? payload.image : null
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
      const update = await userModel.findByIdAndUpdate(data[0]._id, {
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
            role: role,
            method: 'custom',
            image: payload.image ? payload.image : null,
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

module.exports = login;
