require('dotenv').config();

const express = require('express');
const app = express();
const port = 5000;

const studentRoutes = require('#routes/studentRoutes');
const InstructorRoutes = require('#routes/instructorRoutes');
const courseRoutes = require('#routes/courseRoutes');
const authRoutes = require('#routes/authRoutes');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

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

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
