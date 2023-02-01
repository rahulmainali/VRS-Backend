import { NextFunction, Request, Response } from "express";
const userModel = require("../../../models/user.model");

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (id == undefined) {
      // get all user
      const response = await userModel.find({});
      return res.status(200).send({ success: true, data: response });
    }

    // if id is given
    const response = await userModel.findById(id);
    return res.status(200).send({data: response})

  } catch (error) {
    next(error);
  }
};

module.exports = getUser;
