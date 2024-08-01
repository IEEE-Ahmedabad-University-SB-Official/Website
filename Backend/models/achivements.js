const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
    {
        achievementName: {
            type: String,
            required: true,
            trim: true,
        },
        achievementDescription: {
            type: String,
            required: true,
            trim: true,
        },
        achievementImage: {
            type: String,
            required: true,
            trim: true,
        },
        public_id:{
            type:String,
        }
    }
)

module.exports = mongoose.model("achievements", achievementSchema);