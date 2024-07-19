const mongoose = require('mongoose');

const getUpdatesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        date: {
            type: Date,
        },
        time: {
            type: String,
        },
        rowCount:{
            type: Number,
        }
    }
)

module.exports = mongoose.model("GetUpdates", getUpdatesSchema);