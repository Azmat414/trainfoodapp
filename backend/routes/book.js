const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { addBooking } = require('../databaseFunctions'); // Adjust the path as needed

// Route to render the book page
router.get('/book', (req, res) => {
  res.render('book', { user: req.user }); // Pass user data if needed
});

// Route to handle form submission
router.post('/book', async (req, res) => {
  const { name, phone, email, persons, date, time, train, coach, seat, requests } = req.body;

  // Prepare the booking data
  const bookingData = {
    id: uuidv4(), // Unique ID for the booking
    name,
    phone,
    email,
    persons: parseInt(persons, 10),
    date,
    time,
    train,
    coach,
    seat,
    requests,
    createdAt: new Date().toISOString()
  };

  try {
    await addBooking(bookingData);
    res.redirect('/confirmation');
  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
