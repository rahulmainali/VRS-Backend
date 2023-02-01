import { Request, Response } from "express";
const bcrypt = require("bcryptjs");
const adminModel = require("../../../models/admin.model");
const { StatusCodes } = require("http-status-codes");


const SIGNUP = async (req: Request, res: Response) => {
  let { firstName, lastName,email, password } = req.body;

  // encrypt the password
  password = await bcrypt.hash(password, 10);

  //search if user already exists ?
  adminModel
    .find({ email:email })
    .then((data: any) => {
      if (data.length === 0) {
        //insert new admin data

        const data = new adminModel({
          firstName: firstName,
          lastName: lastName,
          email:email,
          password: password,
          createdOn: new Date().toDateString(),
        });

        //final upload to db
        data
          .save()
          .then(() => {
            return res
              .status(StatusCodes.CREATED)
              .send({message: 'user created successfully'});
          })
          .catch((err: any) => {
            return res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .send("500. SERVER ERROR!!");
          });
      } else {
        return res.status(StatusCodes.CONFLICT).send("User already exists !!");
      }
    })
    .catch((err: any) => {
      console.log("500 SERVER ERROR !!");
    });
};

module.exports = SIGNUP;
