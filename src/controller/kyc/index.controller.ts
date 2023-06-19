const VERIFY_PHONE_NUMBER = require("./subController/verifyPhoneNumber");
const VERIFY_EMAIL = require("./subController/verifyEmail").verifyEmail;
const SEND_EMAIL_OTP = require("./subController/verifyEmail").sendEmailOTP;
const POST_KYC = require("./subController/verifyKYC").postKYC;
const APPROVE_KYC = require("./subController/verifyKYC").approveKyc;
const VIEW_KYC_REQUEST = require("./subController/verifyKYC").viewKycRequest;
const VIEW_ALL_KYC = require("./subController/verifyKYC").viewAllKyc;
const REJECT_KYC = require("./subController/verifyKYC").rejectKyc;
module.exports = {
  verifyPhoneNumber: VERIFY_PHONE_NUMBER,
  verifyEmail: VERIFY_EMAIL,
  sendEmailOTP: SEND_EMAIL_OTP,
  postKYC: POST_KYC,
  approveKyc: APPROVE_KYC,
  viewKycRequest: VIEW_KYC_REQUEST,
  viewAllKyc: VIEW_ALL_KYC,
  rejectKyc: REJECT_KYC,
};
