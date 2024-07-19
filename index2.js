// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Body parser middleware to parse JSON body
app.use(express.urlencoded({ extended: true })); // Body parser middleware to parse URL-encoded bodies
app.use(cors()); // Enable CORS for all routes

// Routes
const eventRoutes = require('./Backend/routes/routes');

// Use routes
app.use('/api', eventRoutes); // Assuming you prefix your routes with /api

// Database connection
const MONGODB_URI = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Database connected'))
.catch(err => console.log(err));

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
