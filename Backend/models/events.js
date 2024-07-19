const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255
        },
        eventDescription: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255
        },
        eventDate: {
            type: Date,
            required: true
        },
        eventTime: {
            type: String,
            required: true,
            trim: true
        },
        speaker: {
            type: String,
            required: true,
            trim: true
        },
        venue:{
            type: String,
            required: true,
            trim: true
        },
        registrationLink:{
            type: String,
            required: true,
            trim: true
        },
        instaPostLink: {
            type: String,
            required: true,
            trim: true
        },
        eventPoster: {
            type: String,
            required: true,
            trim: true
        }
    }
)

module.exports = mongoose.model("Events", eventSchema);