const vehicleModel = require("../../../models/vehicle.model");
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const searchVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, location, category } = req.query;

  const query = req.query;
  // when no query is sent
  if (Object.keys(query).length === 0) {
    const response = await vehicleModel.find({status: "verified"});
    return res.status(200).send({ data: response });
  }

  if (!name && (location || category)) {
    const filter: any = {status: "verified"};

    if (category) {
      filter["categoryName"] = category;
    }

    if (location) {
      filter.location = { $regex: `.*${location}.*`, $options: "i" };
    }
    try {
      const response = await vehicleModel.find(filter);
      return res.status(200).send({ data: response });
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  }
  // if name is given

  try {
    const agg = [
      {
        $search: {
          autocomplete: {
            query: name,
            path: "name",
            fuzzy: {
              maxEdits: 1,
            },
          },
        },
      },
       { $match: { status: "verified" } },
      { $limit: 8 },
    ];

    const response = await vehicleModel.aggregate(agg);
    return res.status(200).send({ data: response });
  } catch (error: any) {
    return res.status(400).send({ error: error.message });
  }
};

module.exports = searchVehicle;
