import Achievements from '../models/achivements.js'; 
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
const apiKey = process.env.API_KEY;

dotenv.config();


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// POST: Create a new achievement with image upload
export const uploadAchievement = async (req, res) => {
    try {
        const { achievementName, achievementDescription } = req.body;

        // Handle file upload using express-fileupload
        const file = req.files.achievementImage;

        // Upload file to Cloudinary
        const options = {
            folder: "Achievements",
            quality: 10,
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
};

// POST: Update an achievement by ID with image upload
export const updateAchievement = async (req, res) => {
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
                folder: "Achievements",
                quality: 20,
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
};

// DELETE: Delete an achievement by ID
export const deleteAchievement = async (req, res) => {
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
};

// GET: Fetch all achievements
export const getAchievements = async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const achievements = await Achievements.find();

        res.json(achievements);
    } catch (error) {
        console.error("Error fetching all achievements:", error);
        res.status(500).json({ error: "Error fetching all achievements" });
    }
};
