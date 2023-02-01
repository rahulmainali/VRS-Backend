import { Request, Response, NextFunction } from "express";
const cloudinary = require("../../../utils/cloudinary");

const vehicleModel = require("../../../models/vehicle.model");
const deleteVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    if (id == undefined) return res.status(400).send({ success: false, message: 'please provide vehicle id ' });
    try {

        const vehicle = await vehicleModel.findOne({ _id: id });
        // destructuring images to delte from cloudinary

        const { bluebookImage, insuranceImage, carImages } = vehicle
        const test = await cloudinary.uploader.destroy(bluebookImage.public_id, function(err: any, success: any) { if (err) console.log(err) })
        const test2 =await cloudinary.uploader.destroy(insuranceImage.public_id, function(err: any, success: any) { if (err) console.log(err) })

        // deleting multiple images of car

        const result = carImages.map(async (image: any) => {

            const response = await cloudinary.uploader.destroy(image.public_id, function(err: any, success: any) { if (err) console.log(err) })
            return response
        })

        console.log(vehicle)
        const deleteResponse = await vehicleModel.deleteOne({_id: id});
        return res
            .status(200)
            .send({ success: true, message: "Vehicle deleted successfully !" });
    } catch (error) {
        next(error);
    }
};

module.exports = deleteVehicle;
