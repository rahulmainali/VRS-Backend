const categoryRouter = require("express").Router();

const {
    postCategory,
    getCategory,
    updateCategory,
    deleteCategory
} = require("../controller/index.controllers").categoryControllers;

categoryRouter.get("/getCategory", getCategory);
categoryRouter.get("/getCategory/:id", getCategory);
categoryRouter.post("/createCategory", postCategory);
categoryRouter.put("/updateCategory/:id", updateCategory);
categoryRouter.delete("/deleteCategory/:id", deleteCategory);
//kycRouter.put("/updateCategory/:id", updateCategory);

module.exports = categoryRouter;
