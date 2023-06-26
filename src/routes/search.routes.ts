
const searchRoute = require('express').Router();
 
const { searchVehicle} = require('../controller/index.controllers').searchControllers

searchRoute.get('/search', searchVehicle)

module.exports = searchRoute
