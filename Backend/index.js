import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/database.js';
import { cloudinaryConnect } from './config/cloudinary.js';
import allRoutes from './routes/routes.js';
import fileUpload from 'express-fileupload';

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Body parser middleware to parse JSON body
app.use(express.urlencoded({ extended: true })); // Body parser middleware to parse URL-encoded bodies
app.use(cors()); // Enable CORS for all routes

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
}));

// Database connection
dbConnect();
cloudinaryConnect();

// Routes
app.use('/api', allRoutes);

app.get("/" , (req,res) => {
    return res.json({
        success: true,
        message: "Boooooooooom, your server is started"
    })
})

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



