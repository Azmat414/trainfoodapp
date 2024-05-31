const express = require('express');
const router = express.Router();
const dynamodb = require('../databaseFunctions');

// Example route to get data from DynamoDB
router.get('/items', async (req, res) => {
  const params = {
    TableName: 'your-table-name'
  };

  try {
    const data = await dynamodb.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    res.status(500).json({ error: 'Could not load items: ' + error });
  }
});

module.exports = router;