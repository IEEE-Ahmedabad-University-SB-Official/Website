const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 100
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        sentDate: {
            type: Date,
            required: true
        },
        sentTime: {
            type: String,
            required: true,
            trim: true
        },
        rowCount: {
            type: Number,
        }
    }
)

module.exports = mongoose.model("ContactUs", contactUsSchema);