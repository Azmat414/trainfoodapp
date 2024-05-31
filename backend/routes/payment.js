const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('payment');
});

router.post('/', (req, res) => {
    const { paymentMethod } = req.body;
    req.session.paymentDetails = { paymentMethod };
    res.redirect('/review');
});

module.exports = router;
