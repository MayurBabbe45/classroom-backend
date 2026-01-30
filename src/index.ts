import express from "express";
import subjectsRouter from "./routes/subject";
import cors from 'cors';


const app = express();
const port = 8000;

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
));

// Middleware
app.use(express.json());

app.use('/api/subjects', subjectsRouter);

// Root GET route
app.get("/", (req, res) => {
    res.send("Welcome to the Classroom Backend API!");
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
