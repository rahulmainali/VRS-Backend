
const khaltiRouter = require('express').Router();

const {verifyKhalti, postPaymentInfo} = require('../controller/khalti/index.controller');

khaltiRouter.get('/khalti/verify/:token/:amount',verifyKhalti)
khaltiRouter.post('/postPaymentInfo',postPaymentInfo)

module.exports = khaltiRouter;
