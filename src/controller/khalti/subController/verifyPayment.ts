import { Request, Response, NextFunction } from "express";
import axios from "axios";

const verifyKhalti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, amount } = req.params;
  const data = {"token": token, "amount": 1000}

  // verifying the request

  // call the verify endpoint of khalti
  try {
    const response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      data,
      {
        headers: {
          'Authorization': "Key test_secret_key_acbb10c0c83044bf8d6d32f773421b67"
        },
      }
    );
    return res.status(200).send({message: response.data});
  } catch (error: any) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = verifyKhalti;
