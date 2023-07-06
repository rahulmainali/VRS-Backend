const POST_REVIEW = require('./subControllers/postReview')
const GET_REVIEW = require('./subControllers/getReview')
const UPDATE_REVIEW = require('./subControllers/updateReview')
const DELETE_REVIEW = require('./subControllers/deleteReview')

module.exports = {postReview: POST_REVIEW, getReview: GET_REVIEW, updateReview: UPDATE_REVIEW , deleteReview: DELETE_REVIEW}
