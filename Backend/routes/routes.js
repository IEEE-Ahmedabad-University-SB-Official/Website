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
const Achievements = require('../models/achivements');
require('dotenv').config();

// import email templates

const contactUsUser = require('../email-templates/contactUsUser');
const getUpdatesUser = require('../email-templates/getUpdatesUser');

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
        const { eventName, eventDescription, eventDate, startTime, endTime , registrationLink, venue,  speaker, instaPostLink } = req.body;

        // Handle file upload using express-fileupload
        const file = req.files.eventPoster;

        // Upload file to Cloudinary

        const options = {
            folder:"Events", 
            quality: 90,
            resource_type: "auto"
        };
        const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, options);


        // Create event in database
        const newEvent = new Event({
            eventName,
            eventDescription,
            eventDate,
            startTime,
            endTime,
            eventPoster: uploadedFile.secure_url, // Store image URL in database
            public_id: uploadedFile.public_id, // Store image URL in database
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
    const { eventName, eventDescription, eventDate, startTime, endTime, speaker, registrationLink, venue, instaPostLink } = req.body;

    try {
        let updatedEvent = await Event.findById(id);

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (req.files && req.files.eventPoster) {
            // Handle file upload using express-fileupload
            const file = req.files.eventPoster;

            const options = {
                folder: "Events",
                quality: 90,
                resource_type: "auto"
            };
            const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, options);

            // Optionally, delete the old image from Cloudinary if exists
            if (updatedEvent.public_id) {
                await cloudinary.uploader.destroy(updatedEvent.public_id);
            }

            // Update event in database with new image URL
            updatedEvent = await Event.findByIdAndUpdate(id, {
                eventName,
                eventDescription,
                eventDate,
                startTime,
                endTime,
                eventPoster: uploadedFile.secure_url, // Update image URL in database
                public_id: uploadedFile.public_id, // Update public_id for easier deletion
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
                startTime,
                endTime,
                speaker,
                registrationLink,
                venue,
                instaPostLink
            }, { new: true });
        }

        res.json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Error updating event" });
    }
});

// DELETE: Delete an event by ID
router.delete('/event/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the event by ID in MongoDB
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Delete image from Cloudinary
        if (deletedEvent.public_id) {
            await cloudinary.uploader.destroy(deletedEvent.public_id);
            console.log(`Deleted image from Cloudinary: ${deletedEvent.public_id}`);
        }

        res.json({ message: 'Event deleted successfully', event: deletedEvent });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Error deleting event" });
    }
});

// GET: Fetch all events
router.get('/events', async (req, res) => {
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

        const options = {
            folder:"Members", 
            quality: 90,
            resource_type: "auto"
        };
        const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, options);

        // Create member in database
        const newMember = new Members({
            profile_image: uploadedFile.secure_url, // Store image URL in database
            public_id: uploadedFile.public_id,
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
        let updatedMember = await Members.findById(id);

        if (!updatedMember) {
            return res.status(404).json({ error: "Member not found" });
        }

        if (req.files && req.files.profile_image) {
            // Handle file upload using express-fileupload
            const file = req.files.profile_image;

            const options = {
                folder:"Members", 
                quality: 90,
                resource_type: "auto"
            };
            const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, options);
            
             // Optionally, delete the old image from Cloudinary if exists
             if (updatedMember.public_id) {
                await cloudinary.uploader.destroy(updatedMember.public_id);
            }

            // Update member in database with new image URL
            updatedMember = await Members.findByIdAndUpdate(id, {
                profile_image: uploadedFile.secure_url, // Update image URL in database
                public_id: uploadedFile.public_id,
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

// DELETE: Delete a member by ID
router.delete('/member/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the member by ID in MongoDB
        const deletedMember = await Members.findByIdAndDelete(id);

        if (!deletedMember) {
            return res.status(404).json({ error: "Member not found" });
        }

        // Optionally, delete the old image from Cloudinary if exists
        if (deletedMember.public_id) {
            await cloudinary.uploader.destroy(deletedMember.public_id);
        }

        res.json({ message: 'Member deleted successfully', member: deletedMember });
    } catch (error) {
        console.error("Error deleting member:", error);
        res.status(500).json({ error: "Error deleting member" });
    }
});

// GET: Fetch all members
router.get('/members', async (req, res) => {
    try {
        const members = await Members.find();

        res.json(members);
    } catch (error) {
        console.error("Error fetching all members:", error);
        res.status(500).json({ error: "Error fetching all members" });
    }
});



// -------------------------------achievementS-----------------------------------//


// POST: Create a new achievement with image upload
router.post('/achievements/upload', async (req, res) => {
    try {
        const { achievementName, achievementDescription } = req.body;

        // Handle file upload using express-fileupload
        const file = req.files.achievementImage;

        // Upload file to Cloudinary
        const options = {
            folder: "achievements",
            quality: 90,
            resource_type: "auto"
        };
        const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, options);

        // Create achievement in database
        const newachievement = new Achievements({
            achievementName,
            achievementDescription,
            achievementImage: uploadedFile.secure_url, // Store image URL in database
            public_id: uploadedFile.public_id, // Store public_id for future deletions
        });

        await newachievement.save();

        res.json({ message: 'Achievement added successfully', achievement: newachievement });
    } catch (error) {
        console.error("Error uploading achievement:", error);
        res.status(500).json({ error: "Error uploading achievement" });
    }
});

// POST: Update an achievement by ID with image upload
router.post('/achievements/update/:id', async (req, res) => {
    const { id } = req.params;
    const { achievementName, achievementDescription } = req.body;

    try {
        let updatedachievement = await Achievements.findById(id);

        if (!updatedachievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        if (req.files && req.files.achievementImage) {
            // Handle file upload using express-fileupload
            const file = req.files.achievementImage;

            const options = {
                folder: "achievements",
                quality: 90,
                resource_type: "auto"
            };
            const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, options);
            
            // Optionally, delete the old image from Cloudinary if it exists
            if (updatedachievement.public_id) {
                await cloudinary.uploader.destroy(updatedachievement.public_id);
            }

            // Update achievement in database with new image URL and public_id
            updatedachievement = await Achievements.findByIdAndUpdate(id, {
                achievementName,
                achievementDescription,
                achievementImage: uploadedFile.secure_url, // Update image URL in database
                public_id: uploadedFile.public_id // Update public_id for easier deletion
            }, { new: true });
        } else {
            // Update achievement in database without changing the image URL
            updatedachievement = await Achievements.findByIdAndUpdate(id, {
                achievementName,
                achievementDescription
            }, { new: true });
        }

        res.json({ message: 'Achievement updated successfully', achievement: updatedachievement });
    } catch (error) {
        console.error("Error updating achievement:", error);
        res.status(500).json({ error: "Error updating achievement" });
    }
});

// DELETE: Delete an achievement by ID
router.delete('/achievement/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the achievement by ID in MongoDB
        const deletedachievement = await Achievements.findByIdAndDelete(id);

        if (!deletedachievement) {
            return res.status(404).json({ error: "Achievement not found" });
        }

        // Optionally, delete the old image from Cloudinary if it exists
        if (deletedachievement.public_id) {
            await cloudinary.uploader.destroy(deletedachievement.public_id);
        }

        res.json({ message: 'Achievement deleted successfully', achievement: deletedachievement });
    } catch (error) {
        console.error("Error deleting achievement:", error);
        res.status(500).json({ error: "Error deleting achievement" });
    }
});


// GET: Fetch all achievements
router.get('/achievements', async (req, res) => {
    try {
        const achievements = await Achievements.find();

        res.json(achievements);
    } catch (error) {
        console.error("Error fetching all achievements:", error);
        res.status(500).json({ error: "Error fetching all achievements" });
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

    const mailOptionsAdmin = {
        from: process.env.EMAIL_USER,
        to: 'vishvboda0407@gmail.com',
        subject: 'New Contact Us Submission',
        text: `You have a new contact form submission from website:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\nDate: ${formattedDate}\nTime: ${formattedTime}`
    };

    const mailOptionsUser = {
        from: process.env.EMAIL_USER,
        to: `${email}`,
        subject: 'Welcome to IEEE AUSB!',
        html: contactUsUser(`${name}`) // Use the template function to set the HTML body
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
    
            // Send email notification to Admin
            const mailOptionsAdmin = {
                from: process.env.EMAIL_USER,
                to: 'vishvboda0407@gmail.com',
                subject: 'New Get Updates submission',
                text: `I want updates of your events:\n\nName: ${name}\nEmail: ${email} \nDate: ${formattedDate}\nTime: ${formattedTime}`
            };
    
            await transporter.sendMail(mailOptionsAdmin);
            console.log('Email sent to Admin');
    
            // Log the HTML content for user email
            const userEmailContent = getUpdatesUser(name);
            console.log('User email HTML:', userEmailContent);
    
            // Send email notification to User
            const mailOptionsUser = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Welcome to IEEE AUSB!',
                html: userEmailContent // Use the template function to set the HTML body
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
    });

router.get('/updates', async (req, res) => {
    try {
        const updates = await GetUpdates.find().select('name email date time rowCount');
        res.json(updates);
    } catch (err) {
        res.status(500).send('Error fetching updates data');
    }
});



// ------------------------------------ADMIN---------------------------------------//

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
