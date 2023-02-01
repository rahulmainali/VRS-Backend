const vehicleModel = require("../../../models/vehicle.model");
import { NextFunction, Request, Response } from "express";


const getVehicle = async(req: Request, res: Response, next : NextFunction) =>{
    
    try {
        
        const data = await vehicleModel.find({});
        return res.status(200).send({vehicles: data})
    } catch (error) {
        next(error)
        
    }
}

module.exports = getVehicle
