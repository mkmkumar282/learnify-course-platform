const express = require("express");
const Router = express.Router
const adminRouter = Router();
const {adminModel,courseModel} = require("../db");
const jwt= require("jsonwebtoken");
const { JWT_admin } = require("../config");
const bcrypt = require("bcrypt");
const { signupSchema, signinSchema } = require("../zod");
const { adminMiddleware } = require("../middlewares/admin");

adminRouter.post("/signup", async function (req, res) {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.errors,
    });
  }

  try {
    const hashedpassword = await bcrypt.hash(result.data.password,10);
    const admin = await adminModel.create({
        ...result.data,
        password: hashedpassword
    });

    res.json({
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating admin",
      error: err.message,
    });
  }
});

adminRouter.post("/signin", async function (req, res) {
  const result = signinSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.errors,
    });
  }

  try {
    const { email, password } = result.data;

    // 🔍 find user by email
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        message: "admin not found",
      });
    }

    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // 🎟️ generate token
    const token = jwt.sign(
      { id: admin._id },
      JWT_admin
    );

    res.json({
      message: "Login successful",
      token,
    });

  }catch (err) {
  console.log("LOGIN ERROR:", err); // 🔥 IMPORTANT

  res.status(500).json({
    message: "Error logging in",
    error: err.message, // 👈 show actual error
  });
}
});


adminRouter.post("/course", adminMiddleware, async function (req, res) {
  try {
    const adminId = req.adminId;

    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
      title,
      description,
      imageUrl,
      price,
      creatorId: adminId,
    });

    res.json({
      message: "course created",
      courseId: course._id,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error creating course",
    });
  }
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  try {
    const adminId = req.adminId;

    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    },{
      title,
      description,
      imageUrl,
      price,
    });

    res.json({
      message: "course updated",
      courseId: course._id,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating course",
    });
  }
});

adminRouter.post("/course/bulk",adminMiddleware,async function(req,res){
    try {
    const adminId = req.adminId;
    const courses = await courseModel.find({
        creatorId: adminId
    }).populate('creatorId', 'firstName lastName');

    res.json({
      message: "courses found",
      courses,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error creating course",
    });
  }
})

module.exports = {
    adminRouter: adminRouter
}

