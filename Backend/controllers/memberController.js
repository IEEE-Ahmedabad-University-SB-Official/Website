const cloudinary = require('cloudinary').v2;
const Members = require('../models/members');
const {uploadImageToCloudinary} = require('../utils/imageUploader');


// POST: Create a new member with image upload
exports.uploadMember = async (req, res) => {
    try {
        const { name, email, contact_number, join_year, programme, department, position, enrollment_number, instagramProfile, linkedinProfile, leave_date } = req.body;

        // if (!req.files || !req.files.profile_image) {
        //     return res.status(400).json({ error: 'No file uploaded' });
        // }

        // console.log(req);
        
        // Handle file upload using express-fileupload
        const file = req.files.profile_image;

        const uploadedFile = await uploadImageToCloudinary(file, "Members" , 80 );

        // const options = {
        //     folder:"Members", 
        //     quality: 90,
        //     resource_type: "auto"
        // };
        // const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, options);

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
};

// POST: Update a member by ID with image upload
exports.updateMember = async (req, res) => {
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

            const uploadedFile = await uploadImageToCloudinary(file, "Members", 80 );
            
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
};

exports.memberFront = async (req, res) => {
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
};

// DELETE: Delete a member by ID
exports.deleteMember = async (req, res) => {
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
};

// GET: Fetch all members
exports.getMembers = async (req, res) => {
    try {
        const members = await Members.find();

        res.json(members);
    } catch (error) {
        console.error("Error fetching all members:", error);
        res.status(500).json({ error: "Error fetching all members" });
    }
};
