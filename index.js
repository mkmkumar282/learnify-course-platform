require('dotenv').config()

const express = require("express");
const cors = require("cors");
const app=express();
const mongoose = require("mongoose");
app.use(express.json());
app.use(cors());
const { courseRouter } = require("./routes/course");
const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { resourceRouter } = require("./routes/resource");

app.use("/user", userRouter);
app.use("/course",courseRouter);
app.use("/admin",adminRouter);
app.use("/resource", resourceRouter);
async function main(){
    console.log("started")
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("connected");
    app.listen(3000);
    console.log("listening")
}
main();


