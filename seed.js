require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { adminModel, courseModel, purchaseModel } = require('./db');

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected. Clearing old courses and purchases...");
    
    await courseModel.deleteMany({});
    await purchaseModel.deleteMany({});
    
    const pass = await bcrypt.hash('password123', 10);
    
    console.log("Seeding Instructors...");
    const admin1 = await adminModel.findOneAndUpdate(
      { email: "john@learnify.com" }, 
      { firstName: "Johannes", lastName: "Kepler", password: pass },
      { upsert: true, new: true }
    );
    const admin2 = await adminModel.findOneAndUpdate(
      { email: "sarah@learnify.com" }, 
      { firstName: "Sarah", lastName: "Smith", password: pass },
      { upsert: true, new: true }
    );

    console.log("Seeding Realistic Tech Courses...");
    const courses = [
      {
        title: "Full Stack Web Developer Bootcamp",
        description: "Master React, Node.js, Express & MongoDB from scratch to build fully scalable, enterprise platforms.",
        price: 4999,
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
        creatorId: admin1._id
      },
      {
        title: "Docker & Kubernetes for DevOps",
        description: "Master containerization and cluster orchestration to land competitive roles in modern infrastructure engineering.",
        price: 3499,
        imageUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1000",
        creatorId: admin2._id
      },
      {
        title: "Advanced System Design Iterations",
        description: "Crack the system design interview by learning how top tier companies build distributed, fault-tolerant scalable systems at scale.",
        price: 8999,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000",
        creatorId: admin1._id
      },
      {
        title: "Modern UI/UX Design in Figma",
        description: "Bridge the gap between engineering and design. Learn wireframing, rapid prototyping, and pixel-perfect design systems.",
        price: 2499,
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000",
        creatorId: admin2._id
      }
    ];

    await courseModel.insertMany(courses);
    console.log("✅ Seeding Complete! Inserted " + courses.length + " beautiful tech courses.");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
}

seed();
