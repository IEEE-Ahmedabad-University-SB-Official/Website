import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/database.js';
import { cloudinaryConnect } from './config/cloudinary.js';
import allRoutes from './routes/routes.js';
import fileUpload from 'express-fileupload';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Body parser middleware to parse JSON body
app.use(express.urlencoded({ extended: true })); // Body parser middleware to parse URL-encoded bodies
app.use(cors({
    origin: ['http://localhost:5173', 'https://ieeeausb.onrender.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
}));

// Database connection
dbConnect();
cloudinaryConnect();

// Routes
app.use('/api', authMiddleware, allRoutes);

app.get("/" , (req,res) => {
    return res.json({
        success: true,
        message: "Boooooooooom, your server is started"
    })
})

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



