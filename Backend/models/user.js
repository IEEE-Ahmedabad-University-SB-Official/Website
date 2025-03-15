import mongoose from 'mongoose';

// Define user schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });
  
export default mongoose.model('User', userSchema);
