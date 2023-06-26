const transactionRoute = require('express').Router()

const {executeTransaction} = require('../controller/index.controllers').transactionControllers;

transactionRoute.post('/transaction', executeTransaction)

module.exports = transactionRoute;
