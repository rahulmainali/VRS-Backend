// transaction.js
const User = require('./user.model')
const Booking = require('./booking.model')
const Vehicle = require('./vehicle.model')
import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

const transaction = mongoose.model('transaction', transactionSchema);

module.exports = transaction;

