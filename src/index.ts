import express from "express";

const app = express();
const port = 8000;

// Middleware
app.use(express.json());

// Root GET route
app.get("/", (req, res) => {
    res.send("Welcome to the Classroom Backend API!");
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
