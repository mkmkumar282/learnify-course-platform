# 🌟 Learnify — Premium E-Learning & Course Platform

A full-stack, enterprise-grade e-learning management system designed with modern web architecture and fluid glassmorphic aesthetics. This application serves as a robust dual- sided marketplace allowing Instructors (Admins) to create, manage, and sell premium courses while Students (Users) can purchase, track, and interact with educational content.

---

## 🚀 Key Features

* **Dual-Role Architecture:** Sophisticated split-logic allowing both Instructors and Students to securely log in utilizing JWT role-based access control.
* **Premium UI/UX System:** Custom-built React module system utilizing zero UI frameworks. Features seamless scroll tracking, dynamic gradient tokens, responsive flex layouts, and real-time form validation.
* **Instructor Dashboard:** A secure administrative portal giving educators full CRUD (Create, Read, Update, Delete) powers over course details, dynamic pricing, and rich-text blogs. 
* **Community Blogs:** A heavily integrated "Resources" feature permitting both verified Instructors and active Students to publish rich knowledge articles to a dynamically sorted feed.
* **Full-Stack Implementation:** Front-end built efficiently utilizing React & Vite hooked into a fast, modular Express + Node ecosystem natively communicating with a MongoDB database.

## 🛠 Tech Stack

**Front-End Integration:**
- React 18 (via Vite for Hot Module Replacement)
- React Router DOM v6
- Axios (HTTP client logic)
- Vanilla CSS (Utilizing Custom Variable Tokens & Glassmorphism)

**Back-End Infrastructure:**
- Node.js & Express.js architecture
- Mongoose (MongoDB modeling)
- JWT (JSON Web Tokens Authentication)
- Bcrypt (Password Hashing)
- Zod (Input Schema Validation)

---

## 📦 Local Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/learnify-course-platform.git
   cd learnify-course-platform
   ```

2. **Initialize Settings**
   Ensure you have a `.env` file successfully built into the root providing valid paths for 
   `MONGO_DB_URL`, `JWT_admin`, and `JWT_USER`.

3. **Start the API Backend**
   ```bash
   node index.js
   ```

4. **Launch the React Frontend** (In a secondary terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Visit the Platform:** Open `http://localhost:5173` in any browser!
