import mongoose from 'mongoose';

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

export default mongoose.model("achievements", achievementSchema);
