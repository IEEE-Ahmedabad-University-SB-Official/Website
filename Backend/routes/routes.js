const express = require('express');
const router = express.Router();

const {uploadAchievement, updateAchievement, deleteAchievement, getAchievements} = require('../controllers/achievmentController');

const {uploadEvent, updateEvent, deleteEvent, getEvents} = require('../controllers/eventController');

const {contactUsEnroll, getContactUs} = require('../controllers/contactUsController');

const {getUpdatesEnroll, getUpdates} = require('../controllers/getUpdatesController');

const {uploadMember, updateMember, memberFront, deleteMember, getMembers} = require('../controllers/memberController');

const {adminLogin, getAllAdmins, addAdmin, deleteAdmin} = require('../controllers/adminController');


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

module.exports = router;

