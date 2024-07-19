const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const cors = require('cors');

const Event = require('../models/events'); // Adjust path as necessary
const Members = require('../models/members'); // Adjust path as necessary
const GetUpdates = require('../models/get-updates'); // Adjust path as necessary
const ContactUsDetail = require('../models/contact-us'); // Adjust path as necessary4
const User = require('../models/user');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware for file uploads with express-fileupload
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const fileUpload = require('express-fileupload');
router.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// POST: Create a new event with image upload
router.post('/events/upload', async (req, res) => {
    try {
        const { eventName, eventDescription, eventDate, eventTime, registrationLink, venue,  speaker, instaPostLink } = req.body;

        // Handle file upload using express-fileupload
        const file = req.files.eventPoster;

        // Upload file to Cloudinary
        const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath);


        // Create event in database
        const newEvent = new Event({
            eventName,
            eventDescription,
            eventDate,
            eventTime,
            eventPoster: uploadedFile.secure_url, // Store image URL in database
            speaker,
            registrationLink,
            venue,
            instaPostLink
        });

        await newEvent.save();

        res.json({ message: 'Event added successfully', event: newEvent });
    } catch (error) {
        console.error("Error uploading event:", error);
        res.status(500).json({ error: "Error uploading event" });
    }
});

// POST: Update an event by ID with image upload
router.post('/events/update/:id', async (req, res) => {
    const { id } = req.params;
    const { eventName, eventDescription, eventDate, eventTime, speaker, registrationLink, venue, instaPostLink } = req.body;

    try {
        let updatedEvent;

        if (req.files && req.files.eventPoster) {
            // Handle file upload using express-fileupload
            const file = req.files.eventPoster;

            // Upload file to Cloudinary
            const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath);

            // Update event in database with new image URL
            updatedEvent = await Event.findByIdAndUpdate(id, {
                eventName,
                eventDescription,
                eventDate,
                eventTime,
                eventPoster: uploadedFile.secure_url, // Update image URL in database
                speaker,
                registrationLink,
                venue,
                instaPostLink
            }, { new: true });
        } else {
            // Update event in database without changing the image URL
            updatedEvent = await Event.findByIdAndUpdate(id, {
                eventName,
                eventDescription,
                eventDate,
                eventTime,
                speaker,
                registrationLink,
                venue,
                instaPostLink
            }, { new: true });
        }

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Error updating event" });
    }
});

// GET: Get an event by ID
router.get('/events/event/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        res.status(500).json({ error: "Error fetching event by ID" });
    }
});

// DELETE: Delete an event by ID
router.delete('/events/event/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the event by ID in MongoDB
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Delete image from Cloudinary
        if (deletedEvent.eventPoster) {
            const publicId = deletedEvent.eventPoster.split('/')[7].split('.')[0]; // Extract public_id from URL or adjust based on your naming convention

            await cloudinary.uploader.destroy(publicId);

            // Alternatively, if your eventPoster field directly contains public_id:
            // await cloudinary.uploader.destroy(deletedEvent.eventPoster);

            console.log(`Deleted image from Cloudinary: ${publicId}`);
        }

        res.json({ message: 'Event deleted successfully', event: deletedEvent });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Error deleting event" });
    }
});

// GET: Fetch all events
router.get('/events/events', async (req, res) => {
    try {
        const events = await Event.find();

        res.json(events);
    } catch (error) {
        console.error("Error fetching all events:", error);
        res.status(500).json({ error: "Error fetching all events" });
    }
});



// --------------------------------MEMBERS-----------------------------------//

// POST: Create a new member with image upload
router.post('/members/upload', async (req, res) => {
    try {
        const { name, email, contact_number, join_year, programme, department, position, enrollment_number, instagramProfile, linkedinProfile, leave_date } = req.body;

        // Handle file upload using express-fileupload
        const file = req.files.profile_image;

        // Upload file to Cloudinary
        const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath);

        // Create member in database
        const newMember = new Members({
            profile_image: uploadedFile.secure_url, // Store image URL in database
            name,
            email,
            enrollment_number,
            contact_number,
            join_year,
            programme,
            department,
            position,
            instagramProfile,
            linkedinProfile,
            leave_date
        });

        await newMember.save();

        res.json({ message: 'Member added successfully', member: newMember });
    } catch (error) {
        console.error("Error uploading member:", error);
        res.status(500).json({ error: "Error uploading member" });
    }
});

// POST: Update a member by ID with image upload
router.post('/members/update/:id', async (req, res) => {
    const { id } = req.params;

    // console.log(req);

    const { name, email, enrollment_number, contact_number, join_year, programme, department, position, instagramProfile, linkedinProfile, leave_date } = req.body;

    try {
        let updatedMember;

        if (req.files && req.files.profile_image) {
            // Handle file upload using express-fileupload
            const file = req.files.profile_image;

            // Upload file to Cloudinary
            const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath);

            // Update member in database with new image URL
            updatedMember = await Members.findByIdAndUpdate(id, {
                profile_image: uploadedFile.secure_url, // Update image URL in database
                name,
                email,
                enrollment_number,
                contact_number,
                join_year,
                programme,
                department,
                position,
                instagramProfile,
                linkedinProfile,
                leave_date
            }, { new: true });
        } else {
            // Update member in database without changing the image URL
            updatedMember = await Members.findByIdAndUpdate(id, {
                name,
                email,
                enrollment_number,
                contact_number,
                join_year,
                programme,
                department,
                position,
                instagramProfile,
                linkedinProfile,
                leave_date
            }, { new: true });
        }

        if (!updatedMember) {
            return res.status(404).json({ error: "Member not found" });
        }

        res.json({ message: 'Member updated successfully', member: updatedMember });
    } catch (error) {
        console.error("Error updating member:", error);
        res.status(500).json({ error: "Error updating member" });
    }
});

router.get('/members-front', async (req, res) => {
    const { department, position } = req.query;
    try {
      const results = await Members.find({
        department: department,
        position: position,
        leave_date: null  // Assuming 'leave_date' is null for active members, adjust as per your schema
      }).exec();
      res.json(results);
    } catch (err) {
      console.error('Error fetching members:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// GET: Get a member by ID
router.get('/members/member/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const member = await Members.findById(id);

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        res.json(member);
    } catch (error) {
        console.error("Error fetching member by ID:", error);
        res.status(500).json({ error: "Error fetching member by ID" });
    }
});

// DELETE: Delete a member by ID
router.delete('/members/member/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the member by ID in MongoDB
        const deletedMember = await Members.findByIdAndDelete(id);

        if (!deletedMember) {
            return res.status(404).json({ error: "Member not found" });
        }

        // Delete image from Cloudinary
        if (deletedMember.profile_image) {
            const publicId = deletedMember.profile_image.split('/')[7].split('.')[0]; // Extract public_id from URL or adjust based on your naming convention

            await cloudinary.uploader.destroy(publicId);

            // Alternatively, if your profile_image field directly contains public_id:
            // await cloudinary.uploader.destroy(deletedMember.profile_image);

            console.log(`Deleted image from Cloudinary: ${publicId}`);
        }

        res.json({ message: 'Member deleted successfully', member: deletedMember });
    } catch (error) {
        console.error("Error deleting member:", error);
        res.status(500).json({ error: "Error deleting member" });
    }
});

// GET: Fetch all members
router.get('/members/allMembers', async (req, res) => {
    try {
        const members = await Members.find();

        res.json(members);
    } catch (error) {
        console.error("Error fetching all members:", error);
        res.status(500).json({ error: "Error fetching all members" });
    }
});

// --------------------------------CONTACT US-----------------------------------//

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/contact-us/enroll', async (req, res) => {
    const { name, email, message } = req.body;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'vishv0407@gmail.com',
        subject: 'New Contact Us Submission',
        text: `You have a new contact form submission from website:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\nDate: ${formattedDate}\nTime: ${formattedTime}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            res.status(500).json({ message: 'Error occurred' });
            return;
        }
        console.log('Email sent:', info.response);
        res.json({ message: 'Success' });
    });

    try {

        // Calculate the row count
        const rowCount = await ContactUsDetail.countDocuments() + 1;

        const newContact = new ContactUsDetail({ name, email, message, sentDate: formattedDate, sentTime: formattedTime, rowCount });
        await newContact.save();
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Error occurred' });
        }
    }
});

router.get('/contact-us', async (req, res) => {
    try {
        const contacts = await ContactUsDetail.find().select('name email message sentDate sentTime rowCount');
        res.json(contacts);
    } catch (err) {
        res.status(500).send('Error fetching updates data');
    }
});


// --------------------------------GET UPDATES-----------------------------------//

// router.post('/updates/enroll', async (req, res) => {
router.post('/updates/enroll', async (req, res) => {
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

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'vishvboda0407@gmail.com',
            subject: 'New Get Updates submission',
            text: `I want updates of your events:\n\nName: ${name}\nEmail: ${email} \nDate: ${formattedDate}\nTime: ${formattedTime}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error occurred', error: error.message });
            }
            console.log('Email sent:', info.response);
            res.json({ message: 'Success' });
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Error occurred, please try after some time' });
    }
});
    
router.get('/updates', async (req, res) => {
    try {
        const updates = await GetUpdates.find().select('name email date time rowCount');
        res.json(updates);
    } catch (err) {
        res.status(500).send('Error fetching updates data');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt: ${username}, ${password}`); // Log login attempt
  
    try {
      const user = await User.findOne({ username, password });
      if (user) {
        res.json({ success: true, userId: user._id });
      } else {
        res.json({ success: false });
      }
    } catch (err) {
      console.error('Error finding user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all admins
router.get('/getAllAdmins', async (req, res) => {
    try {
      const admins = await User.find();
      res.status(200).json(admins);
    } catch (err) {
      console.error('Error fetching admins:', err);
      res.status(500).json({ error: 'Failed to fetch admins' });
    }
  });

// Route to add new admin
router.post('/addAdmin', async (req, res) => {
    const { username, password } = req.body;
    try {
      const newAdmin = await User.create({ username, password });
      res.status(201).json(newAdmin);
    } catch (err) {
      console.error('Error adding admin:', err);
      res.status(500).json({ error: 'Failed to add admin' });
    }
});

// Route to delete admin by ID
router.delete('/deleteAdmin/:id', async (req, res) => {
    const { id } = req.params;

     // Check the number of admins in the collection
     const countAdmins = await User.countDocuments();
  
     if (countAdmins === 1) {
       return res.status(400).json({ error: 'Cannot delete the last admin.' });
     }
     
    try {
      const deletedAdmin = await User.findByIdAndDelete(id);
      if (!deletedAdmin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (err) {
      console.error('Error deleting admin:', err);
      res.status(500).json({ error: 'Failed to delete admin' });
    }
  });


  
module.exports = router;
