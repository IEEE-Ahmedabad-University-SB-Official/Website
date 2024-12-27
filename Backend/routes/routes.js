import express from 'express';
const router = express.Router();

import { uploadAchievement, updateAchievement, deleteAchievement, getAchievements } from '../controllers/achievmentController.js';
import { uploadEvent, updateEvent, deleteEvent, getEvents } from '../controllers/eventController.js';
import { contactUsEnroll, getContactUs } from '../controllers/contactUsController.js';
import { getUpdatesEnroll, getUpdates } from '../controllers/getUpdatesController.js';
import { uploadMember, updateMember, memberFront, deleteMember, getMembers } from '../controllers/memberController.js';
import { adminLogin, getAllAdmins, addAdmin, deleteAdmin } from '../controllers/adminController.js';


// Achievements
router.post('/achievements/upload', uploadAchievement);
router.post('/achievements/update/:id', updateAchievement);
router.delete('/achievement/:id', deleteAchievement);
router.get('/achievements', getAchievements);

// events
router.post('/events/upload', uploadEvent);
router.post('/events/update/:id', updateEvent);
router.delete('/event/:id', deleteEvent);
router.get('/events', getEvents);

// Contact us
router.post('/contact-us/enroll', contactUsEnroll);
router.get('/contact-us', getContactUs);

// Get updates
router.post('/updates/enroll', getUpdatesEnroll);
router.get('/updates', getUpdates);

// Members
router.post('/members/upload', uploadMember);
router.post('/members/update/:id', updateMember);
router.get('/members-front', memberFront);
router.delete('/member/:id', deleteMember);
router.get('/members', getMembers);

// Admins
router.post('/login', adminLogin);
router.get('/getAllAdmins', getAllAdmins);
router.post('/addAdmin', addAdmin);
router.delete('/deleteAdmin/:id', deleteAdmin);

export default router;

