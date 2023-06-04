import mongoose from 'mongoose'
const Vehicle = require('./vehicle.model')
const User = require('./user.model')

const bookingSchema = new mongoose.Schema({
    vehicleId : {type: mongoose.Schema.Types.ObjectId, ref: Vehicle},
    ownerId : {type: mongoose.Schema.Types.ObjectId, ref: Vehicle},
    ownerName: String,
    vehicleName: String, 
    vehicleNumber: String, 
    vehicleModel: String, 
    vehiclePrice: String, 
    userId : {type: mongoose.Schema.Types.ObjectId, ref: User},
    userName :String, 
    status: {type: String, required: true},
    amount: {type: Number, required: true},
    startDate : {type: Date, required: true},
    endDate : {type: Date, required: true},
    createdOn : {type: Date, required: true},
})

module.exports = mongoose.model('booking', bookingSchema)
