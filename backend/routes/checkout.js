const express = require('express');
const { getOrdersByUserId, removeOrderById, addCompletedOrder, placeOrder } = require('../databaseFunctions');
const router = express.Router();

router.get('/', async (req, res) => {
    const userId = req.user ? req.user.id : null; // Ensure userId is retrieved correctly
    if (!userId) {
      return res.redirect('/auth/google'); // Redirect to login if user is not authenticated
    }
  
    try {
      const orders = await getOrdersByUserId(userId);
      console.log('Orders fetched:', orders); // Add this line to debug
      res.render('checkout', { orders, userId });
    } catch (err) {
      console.error('Error fetching orders:', err);
      console.error('Error fetching orders:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/place-order', async (req, res) => {
    const { userId, orders, deliveryDetails, paymentDetails } = req.body;

    if (!userId || !orders || !deliveryDetails || !paymentDetails) {
        return res.status(400).send('Missing required information');
    }

    try {
        const parsedOrders = JSON.parse(orders);
        const parsedDeliveryDetails = JSON.parse(deliveryDetails);
        const parsedPaymentDetails = JSON.parse(paymentDetails);

        for (const order of parsedOrders) {
            await addCompletedOrder(order);
        }

        await placeOrder(userId);

        // Optionally, you can clear the session after placing the order
        req.session.orders = null;
        req.session.deliveryDetails = null;
        req.session.paymentDetails = null;

        res.redirect('/confirmation');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/remove-item/:orderId', async (req, res) => {
    const { orderId } = req.params;
  
    try {
      await removeOrderById(orderId);
      res.redirect('/checkout');
    } catch (err) {
      console.error('Error removing order:', err);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
