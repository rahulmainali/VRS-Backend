
import { NextFunction, Request, Response } from "express";
const userModel = require("../../../models/user.model");

const deleteUser = async(req: Request, res: Response, next: NextFunction) =>{
    
    const {id} = req.params;
    try {
        
        const response = await userModel.deleteOne({_id: id});
        return res.status(200).send({success: true, message: ' User deleted successfully ! '})
    } catch (error) {
        
        next(error)
    }
}

module.exports = deleteUser
