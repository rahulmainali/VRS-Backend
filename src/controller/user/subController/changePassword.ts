const userModel = require("../../../models/user.model");
import { Request, Response } from "express";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const changePassword = async (req: Request, res: Response) => {
  const { password, newPassword, confirmPassword, id } = req.body;
  try {
    const response = await userModel.findById(id);
    console.log("res" + response);

    const isMatched = await response.matchPassword(password);
    if (!isMatched)
      return res
        .status(400)
        .send({ success: "false", message: "old password didn't matched" });

    if (newPassword !== confirmPassword)
      return res
        .status(400)
        .send({
          success: "false",
          message: "newPassword and confirmPassword didn't matched",
        });

    let genNewPassword = await bcrypt.hash(newPassword, 10);
    const changePasswordResponse = await userModel.findByIdAndUpdate(id, {
      password: genNewPassword,
    });

    return res
      .status(200)
      .send({ success: "true", message: "password changed successfully !" });
  } catch (error) {
    res.status(400).send("error " + error);
  }
};

module.exports = changePassword;
