const kycRouter = require('express').Router();

const { verifyPhoneNumber, verifyEmail, sendEmailOTP, postKYC ,viewKycRequest,approveKyc, viewAllKyc, rejectKyc} = require('../controller/kyc/index.controller')

kycRouter.post('/verifyPhoneNumber', verifyPhoneNumber)
kycRouter.post('/verifyEmail', verifyEmail)
kycRouter.post('/sendEmailOTP', sendEmailOTP)
kycRouter.put('/postKYC', postKYC)
kycRouter.post('/verifyKyc', approveKyc)
kycRouter.post('/rejectKyc', rejectKyc)
kycRouter.get('/getKycRequest', viewKycRequest)
kycRouter.get('/getAllKyc', viewAllKyc)

module.exports = kycRouter
