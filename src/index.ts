import express from "express";
import subjectsRouter from "./routes/subject";
import cors from 'cors';


const app = express();
const port = 8000;


if(!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env file');
}

if(!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL is not set in .env file');
}
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
