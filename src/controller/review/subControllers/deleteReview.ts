import { Request, Response, NextFunction } from "express";

const reviewModel = require("../../../models/review.model");
const deleteReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    if (id == undefined) return res.status(400).send({ success: false, message: 'please provide review id ' });
    try {

        const deleteResponse = await reviewModel.deleteOne({_id: id});
        return res
            .status(200)
            .send({ success: true, message: "Review deleted successfully !" });
    } catch (error) {
        next(error);
    }
};

module.exports = deleteReview;
