const contactUsUser = require('../email-templates/contactUsUser');
const ContactUsDetail = require('../models/contact-us');
const nodemailer = require('nodemailer');
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

exports.contactUsEnroll =  async (req, res) => {
    const { name, email, message } = req.body;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    const transporter = await createTransporter();

    const mailOptionsUser = {
        from: process.env.SEND_EMAIL,
        to: `${email}`,
        subject: 'Thank you for contacting IEEE AUSB!',
        html: contactUsUser(`${name}`) // Use the template function to set the HTML body
    };

    const mailOptionsAdmin = {
        from: process.env.SEND_EMAIL,
        to: process.env.SEND_EMAIL,
        subject: 'New Contact Us Submission',
        text: `You have a new contact form submission from website:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\nDate: ${formattedDate}\nTime: ${formattedTime}`
    };

    try {
        // Calculate the row count
        const rowCount = await ContactUsDetail.countDocuments() + 1;

        const newContact = new ContactUsDetail({ name, email, message, sentDate: formattedDate, sentTime: formattedTime, rowCount });
        await newContact.save();

        // Send email notification to Admin
        await transporter.sendMail(mailOptionsAdmin);
        console.log('Email sent to Admin');

        // Send email notification to User
        await transporter.sendMail(mailOptionsUser);
        console.log('Email sent to User');

        res.json({ message: 'Success' });
    } catch (err) {
        console.error('Error occurred:', err);
        if (err.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Error occurred', error: err.message });
        }
    }
};

exports.getContactUs =  async (req, res) => {
    try {
        const contacts = await ContactUsDetail.find().select('name email message sentDate sentTime rowCount');
        res.json(contacts);
    } catch (err) {
        res.status(500).send('Error fetching updates data');
    }
};
