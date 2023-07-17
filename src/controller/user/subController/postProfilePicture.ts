const userModel = require("../../../models/user.model");
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const cloudinary = require("../../../utils/cloudinary");
const auth  = require('../../../middleware/auth')
const dayjs = require("dayjs");



interface imageType {
  public_id: string;
  url: string;
}
const postProfilePicture = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const profileObj: any = {
    image: { public_id: "", url: "" },
  };

  try {
    const image = req.files.image;
    const id = req.body.id;

    console.log(image);

    const imageResponse = await cloudinary.uploader.upload(
      image?.tempFilePath,
      { folder: "profile_image" },
      function (err: any, success: any) {
        if (err) {
          console.log("Error " + err);
        }
      }
    );

    profileObj.image.public_id = imageResponse.public_id;
    profileObj.image.url = imageResponse.secure_url;

    // post profilePicture logic
    const response = await userModel.findByIdAndUpdate(id, profileObj);
    await response.save();

    const data : any = await userModel.findById(id);

    console.log('image')
    console.log(data)
    const jwtPayload = {
      id: data._id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      status: data.status,
      method: data.method,
      image: data.image ? data.image : null,
    };
    const { ACCESS_TOKEN, REFRESH_TOKEN } = await auth.GENERATE_JWT(jwtPayload);

    // add refreshToken in the user document
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    res.cookie("token", ACCESS_TOKEN, {
      httpOnly: true,
      expires: dayjs().add(30, "days").toDate(),
    });

    res.cookie("refreshToken", REFRESH_TOKEN, {
      httpOnly: true,
      expires: dayjs().add(30, "days").toDate(),
    });

    return res.status(201).send({
      success: true,
      message: "Profile picture uploaded successfully!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = postProfilePicture;
