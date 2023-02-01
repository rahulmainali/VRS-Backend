const userModel = require("../../../models/user.model");
const adminModel = require("../../../models/admin.model");
import { Request, Response } from "express";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const forgotPassword = async (req: Request, res: Response) => {
    const { newPassword, confirmPassword } = req.body;
    const { id, token } = req.params;

    const password = await bcrypt.hash(newPassword, 10);

    try {
        if (newPassword && confirmPassword && id && token) {
            if (newPassword === confirmPassword) {
                //
                //check if token is valid or already expired
                const verifyToken = await jwt.verify(
                    token,
                    process.env.ACCESS_TOKEN_KEY
                );

                console.log(verifyToken);
                if (verifyToken) {
                    const response = await userModel.findByIdAndUpdate(id, {
                        password: password
                    })
                    return res.status(200).send({ message: "Password changed successfully" })
                }
            } else
                return res.status(400).send({ message: "Both password are not same!" });
        } else
            return res.status(400).send({ message: "Please provide all fields!" });
    } catch (error: any) {
        return res.status(400).send(error.message);
    }
};

module.exports = forgotPassword;
