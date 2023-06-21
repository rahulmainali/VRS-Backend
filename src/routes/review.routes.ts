const reviewRouter = require("express").Router();

const {
    postReview,
    getReview,
    updateReview,
    deleteReview
} = require("../controller/index.controllers").reviewControllers;

reviewRouter.get("/getReview", getReview);
reviewRouter.get("/getReview/:userId", getReview);
reviewRouter.get("/getReview/vehicle/:vehicleId", getReview);
reviewRouter.post("/postReview", postReview);
reviewRouter.put("/updateReview/:id", updateReview);
reviewRouter.delete("/deleteReview/:id", deleteReview);

module.exports = reviewRouter;
