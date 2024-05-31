const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('delivery');
});

router.post('/', (req, res) => {
    const { userName, seatNumber, carriageNumber } = req.body;
    req.session.deliveryDetails = { userName, seatNumber, carriageNumber };
    res.redirect('/payment');
});

module.exports = router;
