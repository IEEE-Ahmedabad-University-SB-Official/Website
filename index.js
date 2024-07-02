const path = require('path');
const multer = require('multer');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const { env } = require('process');
require('dotenv').config();

const app = express();
const PORT = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ieee'
});

const eventStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads/events');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const memberStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads/members');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const uploadEvent = multer({ storage: eventStorage });
const uploadMember = multer({ storage: memberStorage });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'public')));

// Serve the admin.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'admin.html'));
});

app.post('/upload', uploadEvent.single('eventPoster'), (req, res) => {
    const { eventName, eventDescription,speaker, eventDate, eventTime, venue, registrationLink, instaPostLink } = req.body;
    const eventPoster = req.file ? req.file.filename : null;

    const sql = 'INSERT INTO events (eventName, eventDescription, speaker, eventDate, eventTime, venue, registrationLink,instaPostLink, eventPoster) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [eventName, eventDescription, speaker, eventDate, eventTime, venue, registrationLink,instaPostLink, eventPoster], (err, result) => {
        if (err) {
            console.error("Error uploading event:", err);
            return res.status(500).json({ error: "Error uploading event" });
        }
        res.json({ message: 'Event added successfully' });
    });
});



app.post('/update/:id', uploadEvent.single('eventPoster'), (req, res) => {
  const { id } = req.params;
  const { eventName, eventDescription, speaker, eventDate, eventTime, venue, registrationLink, instaPostLink } = req.body;
  let eventPoster = null;

  // If a new file is uploaded, set eventPoster to the new filename
  if (req.file) {
      eventPoster = req.file.filename;
  } else {
      // If no new file is uploaded, retain the old filename
      eventPoster = req.body.oldEventPoster;
  }

  const sql = 'UPDATE events SET eventName = ?, eventDescription = ?, speaker= ?, eventDate = ?, eventTime = ?, venue = ?, registrationLink = ?, instaPostLink = ?, eventPoster = ? WHERE id = ?';
  connection.query(sql, [eventName, eventDescription, speaker,  eventDate, eventTime, venue, registrationLink, instaPostLink, eventPoster, id], (err, result) => {
      if (err) throw err;
      res.redirect('/');
  });
});


app.get('/event/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM events WHERE id = ?', [id], (err, rows) => {
        if (err) throw err;
        res.json(rows[0]);
    });
});

app.delete('/event/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM events WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Event deleted successfully' });
    });
});

// Fetch events from the database
app.get('/events', (req, res) => {
  const sql = "SELECT * FROM events";
  connection.query(sql, (error, results) => {
      if (error) {
          console.error("Error fetching events:", error);
          res.status(500).json({ error: "Error fetching events" });
          return;
      }
      res.json(results);
  });
});

app.get("/members", async (req, res) => {
    const sql = "SELECT * FROM members";
    connection.query(sql, (error, results) => {
        if (error) {
            console.error("Error fetching events:", error);
            res.status(500).json({ error: "Error fetching events" });
            return;
        }
        res.json(results);
    });
});

app.post('/upload-member', uploadMember.single('profile_image'), (req, res) => {
  const { name, email, contact_number, join_year, programme, department, position, enrollment_number, instagramProfile, linkedinProfile, leave_date } = req.body; // Added leave_date
  const profileImage = req.file ? req.file.filename : null;

  const checkEmailSql = 'SELECT * FROM members WHERE email = ?';
  connection.query(checkEmailSql, [email], (err, results) => {
      if (err) {
          console.error("Error checking email:", err);
          return res.status(500).json({ error: "Error checking email" });
      }

      if (results.length > 0) {
          return res.status(400).json({ message: 'Email already exists' });
      }

      const sql = 'INSERT INTO members (profile_image, name, email, enrollment_number, contact_number, join_year, programme, department, position, instagramProfile, linkedinProfile, leave_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      // Adjusted the query parameters to handle null leave_date
      connection.query(sql, [profileImage, name, email, enrollment_number, contact_number, join_year, programme, department, position, instagramProfile, linkedinProfile, leave_date || null], (err, result) => {
          if (err) {
              console.error("Error uploading member:", err);
              return res.status(500).json({ error: "Error uploading member" });
          }
          res.json({ message: 'Member added successfully' });
      });
  });
});

  
app.post('/update-member/:id', uploadMember.single('profile_image'), (req, res) => {
  const { id } = req.params;
  const { name, email, enrollment_number, contact_number, join_year, programme, department, position, instagramProfile, linkedinProfile, leave_date, oldProfileImage } = req.body;
  const profileImage = req.file ? req.file.filename : oldProfileImage;

  const checkEmailSql = 'SELECT * FROM members WHERE email = ? AND id != ?';
  connection.query(checkEmailSql, [email, id], (err, results) => {
      if (err) {
          console.error("Error checking email:", err);
          return res.status(500).json({ error: "Error checking email" });
      }

      if (results.length > 0) {
          return res.status(400).json({ message: 'Email already exists' });
      }

      const sql = 'UPDATE members SET profile_image = ?, name = ?, email = ?, enrollment_number = ?, contact_number = ?, join_year = ?, programme = ?, department = ?, position = ?, instagramProfile = ?, linkedinProfile = ?, leave_date = ? WHERE id = ?'; // Removed the extra comma before WHERE
      connection.query(sql, [profileImage, name, email, enrollment_number, contact_number, join_year, programme, department, position, instagramProfile, linkedinProfile, leave_date || null, id], (err, result) => {
          if (err) {
              console.error("Error updating member:", err);
              return res.status(500).json({ error: "Error updating member" });
          }
          res.json({ message: 'Member updated successfully' });
      });
  });
});


  app.get('/member/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM members WHERE id = ?', [id], (err, rows) => {
        if (err) throw err;
        res.json(rows[0]);
    });
});

app.delete('/member/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM members WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Member deleted successfully' });
    });
});

// Get members by department and position
app.get('/members-front', (req, res) => {
    const { department, position } = req.query;
    const sql = 'SELECT * FROM members WHERE department = ? AND position = ? AND leave_date IS NULL';
    connection.query(sql, [department, position], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });

  app.get('/members-boom', (req, res) => {
    connection.query('SELECT * FROM members', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});


app.post('/get-updates', (req, res) => {
    const { name, email } = req.body;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    const query = 'INSERT INTO updates (name, email, date, time) VALUES (?, ?, ?, ?)';
    connection.query(query, [name, email, formattedDate, formattedTime], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Email already exists' });
            }
            return res.status(500).json({ message: 'Error occurred, please try after some time' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'vishvboda0407@gmail.com',
            subject: 'New Get Updates submission',
            text: `I want updates of your events:\n\nName: ${name}\nEmail: ${email} \nDate: ${formattedDate}\nTime: ${formattedTime}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error occurred', error: error.message });
            }
            console.log('Email sent:', info.response);
            res.json({ message: 'Success' });
        });
    });
});


app.get('/updates', (req, res) => {
    const sql = 'SELECT id, name, email, date, time FROM updates';
    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching updates data');
            return;
        }
        res.json(result);
    });
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// for email
// change id and password in env
// 2step verification on
// nodemailer - app mate app passwords mathi password generate karavano
// make change niche in "to"


// Route to handle contact form submission
app.post('/contact-us-details', (req, res) => {
    const { name, email, message } = req.body;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'vishvboda0407@gmail.com',
            subject: 'New Contact Us Submission',
            text: `You have a new contact form submission from website:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\nDate: ${formattedDate}\nTime: ${formattedTime}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                res.status(500).json({ message: 'Error occurred' });
                return;
            }
            console.log('Email sent:', info.response);
            res.json({ message: 'Success' });
        });

        const sql = 'INSERT INTO contactUsDetails (name, email, message, sentDate, sentTime) VALUES (?, ?, ?, ?, ?)';
        connection.query(sql, [name, email, message, formattedDate, formattedTime], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ message: 'Email already exists' });
                } else {
                    res.status(500).json({ message: 'Error occurred' });
                }
                return;
            }
    });
});

app.get('/contact-us', (req, res) => {
    const sql = 'SELECT id, name, email, message, sentDate, sentTime FROM contactUsDetails';
    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching updates data');
            return;
        }
        res.json(result);
    });
});

// Endpoint to fetch events
app.get('/events-check', (req, res) => {
    connection.query('SELECT * FROM events', (err, results) => {
      if (err) {
        console.error('Error fetching events:', err);
        res.status(500).send('Server error');
        return;
      }
      res.json(results);
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



