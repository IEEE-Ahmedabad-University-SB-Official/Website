const express = require('express');
const app = express();

const cors = require('cors');
require('dotenv').config();

const dbConnect = require('./config/database');
const {cloudinaryConnect} = require('./config/cloudinary');
const allRoutes = require('./routes/routes');

// Middleware
app.use(express.json()); // Body parser middleware to parse JSON body
app.use(express.urlencoded({ extended: true })); // Body parser middleware to parse URL-encoded bodies
app.use(cors()); // Enable CORS for all routes

const fileUpload = require('express-fileupload');
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



