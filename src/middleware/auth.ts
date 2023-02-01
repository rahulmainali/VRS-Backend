const jwt = require("jsonwebtoken");
require("dotenv").config();
import { Response, Request, NextFunction } from "express";
import { STATUS_CODES } from "http";

// generate refresh token and access token

const GENERATE_JWT = async (payload: any) => {
    console.log("payload " + JSON.stringify(payload));

    const accessToken = await jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: "15min",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: '1y' });
    return {
        ACCESS_TOKEN: accessToken,
        REFRESH_TOKEN: refreshToken,
    };
};

const VERIFY_JWT = async (req: Request, res: Response, next: NextFunction) => {
    let accessToken = req.header("authorization");

    // check if token is provided

    if (accessToken === undefined || accessToken.length <= 9) {
        return res.status(401).send({
            success: false,
            error: "token is empty!",
        });
    }

    // remove bearer from the accessToken to verify

    accessToken = accessToken.substring(7, accessToken.length);
    try {
        const response = await jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_KEY
        );
        next();
    } catch (error) {
        return res.status(401).send({
            error: "Session Timeout!",
        });
    }
};

module.exports = { GENERATE_JWT, VERIFY_JWT };
