const express = require('express');
const router = express.Router();
const { getOrdersByUserId } = require('../databaseFunctions');

router.get('/', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const orders = await getOrdersByUserId(userId);
        const { deliveryDetails } = req.session;
        const { paymentDetails } = req.session;
        res.render('review', { 
            orders, // Pass all orders
            deliveryDetails, 
            paymentDetails, 
            userId 
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;