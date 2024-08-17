const User = require('../models/user');

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt: ${username}, ${password}`); // Log login attempt
  
    try {
      const user = await User.findOne({ username, password });
      if (user) {
        res.json({ success: true, userId: user._id });
      } else {
        res.json({ success: false });
      }
    } catch (err) {
      console.error('Error finding user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Route to get all admins
exports.getAllAdmins = async (req, res) => {
    try {
      const admins = await User.find();
      res.status(200).json(admins);
    } catch (err) {
      console.error('Error fetching admins:', err);
      res.status(500).json({ error: 'Failed to fetch admins' });
    }
};

// Route to add new admin
exports.addAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
      const newAdmin = await User.create({ username, password });
      res.status(201).json(newAdmin);
    } catch (err) {
      console.error('Error adding admin:', err);
      res.status(500).json({ error: 'Failed to add admin' });
    }
};

// Route to delete admin by ID
exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;

     // Check the number of admins in the collection
     const countAdmins = await User.countDocuments();
  
     if (countAdmins === 1) {
       return res.status(400).json({ error: 'Cannot delete the last admin.' });
     }
     
    try {
      const deletedAdmin = await User.findByIdAndDelete(id);
      if (!deletedAdmin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (err) {
      console.error('Error deleting admin:', err);
      res.status(500).json({ error: 'Failed to delete admin' });
    }
};
