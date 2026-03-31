const express = require("express");
const Router = express.Router;
const userRouter = Router();
const { signupSchema, signinSchema } = require("../zod");
const { userModel, purchaseModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_USER } = require("../config");
const { userMiddleware } = require("../middlewares/user");

userRouter.post("/signup", async function (req, res) {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.errors,
    });
  }

  try {
    const hashedpassword = await bcrypt.hash(result.data.password,10);
    const user = await userModel.create({
        ...result.data,
        password: hashedpassword
    });

    res.json({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating user",
      error: err.message,
    });
  }
});

userRouter.post("/signin", async function (req, res) {
  const result = signinSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.format(),
    });
  }

  try {
    const { email, password } = result.data;

    // 🔍 find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // 🎟️ generate token
    const token = jwt.sign(
      { id: user._id },
      JWT_USER
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error logging in",
    });
  }
});

userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId; 
    const purchases = await purchaseModel.find({
        userId
    });

    const coursesData = await courseModel.find({
        _id: {$in: purchases.map(c => c.courseId)}
    });

    res.json({
        purchases
    })
})

module.exports = {
    userRouter: userRouter
}