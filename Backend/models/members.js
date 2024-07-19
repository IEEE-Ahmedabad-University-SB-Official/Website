const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
            trim: true,
        },
        email:{
            type: String,
            required:true,
            trim: true,
            unique: true,
        },
        profile_image:{
            type: String,
            required:true,
            trim: true,
        },
        contact_number:{
            type: String,
            required:true,
            trim: true,
        },
        enrollment_number:{
            type: String,
            required:true,
            trim: true,
        },
        join_year:{
            type: Number,
            required:true,
            min: 1900,
            max: 2100,
        },
        programme:{
            type: String,
            required: true,
            trim: true,
        },
        department:{
            type: String,
            required: true,
            trim: true,
        },
        position:{
            type: String,
            required: true,
            trim: true,
        },
        leave_date:{
            type: Date,
        },
        instagramProfile:{
            type: String,
            required: true,
            trim: true,
        },
        linkedinProfile:{
            type: String,
            required: true,
            trim: true,
        }
    }
)

module.exports = mongoose.model("Members", memberSchema);