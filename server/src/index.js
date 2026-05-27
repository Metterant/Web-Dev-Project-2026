const express = require('express');
const app = express();
const port = 5000;
const cookieParser = require('cookie-parser');

const studentRoutes = require('#routes/studentRoutes');
const InstructorRoutes = require('#routes/instructorRoutes');
const courseRoutes = require('#routes/courseRoutes');
const departmentRoutes = require('#routes/departmentRoutes');
const authRoutes = require('#routes/authRoutes');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Define a route for GET requests to the root URL
app.get("/api", (req, res) => {
    res.send('Request to /api/students/ to get students or /api/instructors to get instructors')
});

// Define a route for requests to /students
app.use("/api/students", studentRoutes);

// Define a route for requests to /students
app.use("/api/instructors", InstructorRoutes);

// Define a route for requests to /courses
app.use("/api/courses", courseRoutes);

// Define a route for requests to /departments
app.use("/api/departments", departmentRoutes);

app.use("/api/auth", authRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});