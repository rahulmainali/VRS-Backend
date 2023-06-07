const Booking = require('../../../models/booking.model');
const Vehicle = require('../../../models/vehicle.model');
import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose'
import moment from 'moment'

const GET_BOOKING = async(req: Request, res: Response) => {


        const vehicleId = req?.query?.vehicleId;
        const userId = req?.query?.userId;
    try {

        if(vehicleId && userId) {

            let bookings = await Booking.find({userId: userId, vehicleId: vehicleId})
            let canReview = false;
            if(bookings.length) canReview=true
            return res.status(200).send({bookings: bookings, canReview: canReview})

        }
        if(vehicleId != null || vehicleId != undefined){
            let bookings = await Booking.find({vehicleId: vehicleId})
            return res.status(200).send({bookings: bookings})
        }

        if(userId != null || userId != undefined){
            let bookings = await Booking.find({userId: userId})
            return res.status(200).send({bookings: bookings})
        }
        const bookings = await Booking.find({});
        return res.status(200).send({bookings: bookings})
        
    } catch (error: any) {

        return res.status(500).send(error.message)
        
    }

}

module.exports = GET_BOOKING
