const cloudinary = require('cloudinary').v2;
const Event = require('../models/events');
const {uploadImageToCloudinary} = require('../utils/imageUploader');

// POST: Create a new event with image upload
exports.uploadEvent = async (req, res) => {
    try {
        const { eventName, eventDescription, eventDate, startTime, endTime , registrationLink, venue,  speaker, instaPostLink } = req.body;

        // console.log(req);

        // Handle file upload using express-fileupload
        const file = req.files.eventPoster;

        // Upload file to Cloudinary

        const uploadedFile =  await uploadImageToCloudinary(file, "Events" , 10 );


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
};

// POST: Update an event by ID with image upload
exports.updateEvent = async (req, res) => {
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
                quality: 10,
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
        res.status(500).json({ error: "Error updating event", error });
    }
};

// DELETE: Delete an event by ID
exports.deleteEvent = async (req, res) => {
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
};

// GET: Fetch all events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();

        res.json(events);
    } catch (error) {
        console.error("Error fetching all events:", error);
        res.status(500).json({ error: "Error fetching all events" });
    }
};
