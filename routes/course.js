const express = require("express");
const Router = express.Router;
const courseRouter = Router();
const { userMiddleware } = require("../middlewares/user");
const { purchaseModel, courseModel } = require("../db");

courseRouter.get("/preview",async function(req,res){
    const courses = await courseModel.find({}).populate('creatorId', 'firstName lastName');

    res.json({
        courses
    })
})

courseRouter.post("/purchase", userMiddleware, async function(req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;
    
    const existingPurchase = await purchaseModel.findOne({
        userId,
        courseId
    });

    if (existingPurchase) {
        return res.status(400).json({
            message: "You have already purchased this course"
        });
    }

    await purchaseModel.create({
        userId,
        courseId
    });

    res.json({
        message: "purchase successful"
    })
})

module.exports = {
    courseRouter: courseRouter
}