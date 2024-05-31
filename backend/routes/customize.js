const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { addOrder } = require('../databaseFunctions');

// Sample pizza data (In a real application, fetch this from the database)
const pizzaData = {
  "1": {
    name: "Original Hawaiian Pizza",
    image: "/images/Original Hawaiian Pizza.png"
  },
  "2": {
    name: "Olive Medley Pizza",
    image: "/images/Olive Medley Pizza.png"
  },
  "3": {
    name: "Vegetarian Supreme Pizza",
    image: "/images/Vegetarian Supreme Pizza.png"
  },
  // Add more pizzas as needed
};

router.get('/:pizzaId', (req, res) => {
  const pizzaId = req.params.pizzaId;
  const pizza = pizzaData[pizzaId];
  const userId = req.user ? req.user.id : null;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  if (pizza) {
    res.render('customize', { 
      itemId: pizzaId,
      pizzaName: pizza.name,
      pizzaImage: pizza.image,
      userId
    });
  } else {
    res.status(404).send('Pizza not found');
  }
});

router.post('/order', async (req, res) => {
  const { itemId, size, base, sauce, toppings, quantity, notes, totalPrice, userId } = req.body;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  const orderData = {
      orderId: uuidv4(), // Unique ID for the order
      itemId,
      userId,
      size,
      base,
      sauce,
      toppings: Array.isArray(toppings) ? toppings : [toppings].filter(t => t !== undefined),
      quantity: parseInt(quantity, 10),
      notes,
      totalPrice: parseFloat(totalPrice),
      createdAt: new Date().toISOString()
  };

  try {
      await addOrder(orderData);
      req.session.order = orderData; // Save order data in session
      //res.redirect('/checkout');
      res.redirect('/checkout?userId=' + userId);
  } catch (err) {
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
