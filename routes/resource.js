const { Router } = require("express");
const { adminMiddleware } = require("../middlewares/admin");
const { userMiddleware } = require("../middlewares/user");
const { blogModel, userModel, adminModel } = require("../db");

const resourceRouter = Router();

// GET all blogs
resourceRouter.get("/", async function(req, res) {
    try {
        const blogs = await blogModel.find({}).sort({ date: -1 });
        res.json({ blogs });
    } catch(e) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

// POST a blog as an admin
resourceRouter.post("/admin", adminMiddleware, async function(req, res) {
    try {
        const { title, content } = req.body;
        const adminId = req.adminId;
        
        const admin = await adminModel.findById(adminId);
        if (!admin) return res.status(403).json({ message: "Admin not found" });

        const authorName = `${admin.firstName || 'Unknown'} ${admin.lastName || ''}`.trim();

        const newBlog = await blogModel.create({
            title,
            content,
            authorName,
            role: "admin",
            date: new Date()
        });

        res.json({ message: "Blog published successfully", blogId: newBlog._id });
    } catch (e) {
        console.error("Admin blog error", e);
        res.status(500).json({ error: "Failed to create admin blog" });
    }
});

// POST a blog as a user
resourceRouter.post("/user", userMiddleware, async function(req, res) {
    try {
        const { title, content } = req.body;
        const userId = req.userId;
        
        const user = await userModel.findById(userId);
        if (!user) return res.status(403).json({ message: "User not found" });

        const authorName = `${user.firstName || 'Unknown'} ${user.lastName || ''}`.trim();

        const newBlog = await blogModel.create({
            title,
            content,
            authorName,
            role: "user",
            date: new Date()
        });

        res.json({ message: "Blog published successfully", blogId: newBlog._id });
    } catch (e) {
        console.error("User blog error", e);
        res.status(500).json({ error: "Failed to create user blog" });
    }
});

module.exports = {
    resourceRouter
};
