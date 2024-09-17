const GetUpdates = require('../models/get-updates');
const nodemailer = require('nodemailer');
const GetUpdatesUser = require('../email-templates/getUpdatesUser');
const { google } = require('googleapis');
require('dotenv').config();

// OAuth2 credentials
const CLIENT_ID = process.env.CLIENT_ID; // Store your Client ID in the .env file
const CLIENT_SECRET = process.env.CLIENT_SECRET; // Store your Client Secret in the .env file
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN; // Store your Refresh Token in the .env file

// Create an OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Function to get the transporter (inside a function so it's executed each time you send an email)
async function createTransporter() {
    const accessToken = await oAuth2Client.getAccessToken();
    
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SEND_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token, // Access token for sending the email
      },
    });
  }

exports.getUpdatesEnroll = async (req, res) => {
    const { name, email } = req.body;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    try {
        // Calculate the row count
        const rowCount = await GetUpdates.countDocuments() + 1;

        const transporter = await createTransporter();
        
        // Insert data into MongoDB with rowCount
        const newUpdate = new GetUpdates({ name, email, date: formattedDate, time: formattedTime, rowCount });
        await newUpdate.save();

        // Send email notification to User
        const mailOptionsUser = {
            from: process.env.SEND_EMAIL,
            to: email,
            subject: 'Thank you for connecting to IEEE AUSB!',
            html:  GetUpdatesUser(`${name}`) // Use the template function to set the HTML body
        };

        await transporter.sendMail(mailOptionsUser);
        // console.log('Email sent to User');

        // Send email notification to Admin
        const mailOptionsAdmin = {
            from: process.env.SEND_EMAIL,
            to: process.env.SEND_EMAIL,
            subject: 'New Get Updates submission',
            text: `I want updates of your events:\n\nName: ${name}\nEmail: ${email} \nDate: ${formattedDate}\nTime: ${formattedTime}`
        };

        await transporter.sendMail(mailOptionsAdmin);
        // console.log('Email sent to Admin');

        res.json({ message: 'Success' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error('Error occurred:', err);
        res.status(500).json({ message: 'Error occurred, please try after some time', error: err.message });
    }
};

exports.getUpdates = async (req, res) => {
    try {
        const updates = await GetUpdates.find().select('name email date time rowCount');
        res.json(updates);
    } catch (err) {
        res.status(500).send('Error fetching updates data');
    }
};

