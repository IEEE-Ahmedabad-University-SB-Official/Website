const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true,
            trim: true,
        },
        eventDescription: {
            type: String,
            required: true,
            trim: true,
        },
        eventDate: {
            type: Date,
            required: true
        },
        startTime: {
            type: String,
            required: true,
            trim: true
        },
        endTime: {
            type: String,
            required: true,
            trim: true
        },
        speaker: {
            type: String,
            // required: true,
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
            // required: true,
            trim: true
        },
        eventPoster: {
            type: String,
            required: true,
            trim: true
        },
        public_id: {
            type: String,
        },
    }
)

module.exports = mongoose.model("Events", eventSchema);