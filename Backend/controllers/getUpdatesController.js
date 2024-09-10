const GetUpdates = require('../models/get-updates');
const nodemailer = require('nodemailer');
const GetUpdatesUser = require('../email-templates/getUpdatesUser');

require('dotenv').config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.getUpdatesEnroll = async (req, res) => {
    const { name, email } = req.body;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    try {
        // Calculate the row count
        const rowCount = await GetUpdates.countDocuments() + 1;

        // Insert data into MongoDB with rowCount
        const newUpdate = new GetUpdates({ name, email, date: formattedDate, time: formattedTime, rowCount });
        await newUpdate.save();

        // Send email notification to Admin
        const mailOptionsAdmin = {
            from: process.env.EMAIL_USER,
            to: 'vishvboda0407@gmail.com',
            subject: 'New Get Updates submission',
            text: `I want updates of your events:\n\nName: ${name}\nEmail: ${email} \nDate: ${formattedDate}\nTime: ${formattedTime}`
        };

        await transporter.sendMail(mailOptionsAdmin);
        console.log('Email sent to Admin');


        // Send email notification to User
        const mailOptionsUser = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for connecting to IEEE AUSB!',
            html:  GetUpdatesUser(`${name}`) // Use the template function to set the HTML body
        };

        await transporter.sendMail(mailOptionsUser);
        console.log('Email sent to User');

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

