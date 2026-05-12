const express = require("express");
const app = express();
const port = 5000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Define a route for GET requests to the root URL
app.get("/api", (req, res) => {
    res.json({ tests: ["one", "two", "three"] })
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
