const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const addUser = async (user) => {
  const params = {
    TableName: 'TrainFoodUsers',
    Item: user,
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    console.log('User added successfully:', user);
  } catch (err) {
    console.error('Error adding user:', err);
    throw err;
  }
};

const getUserByEmail = async (email) => {
  const params = {
    TableName: 'TrainFoodUsers',
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    return data.Items[0];
  } catch (err) {
    console.error('Error getting user by email:', err);
    throw err;
  }
};

const getUserById = async (id) => {
  const params = {
    TableName: 'TrainFoodUsers',
    Key: {
      id: id,
    },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item;
  } catch (err) {
    console.error('Error getting user by ID:', err);
    throw err;
  }
};
//Place Order buttom
const placeOrder = async (userId) => {
  const orders = await getOrdersByUserId(userId);
  for (const order of orders) {
      await removeOrderById(order.orderId);
  }
  console.log('Order placed successfully for user:', userId);
};

//Remove Button

const removeOrderById = async (orderId) => {
  const params = {
    TableName: 'PizzaOrders',
    Key: { 
      orderId
    }
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
    console.log('Order removed successfully:', orderId);
  } catch (err) {
    console.error('Error removing order:', err);
    throw err;
  }
};

//Add Booking table
const addBooking = async (booking) => {
  const params = {
    TableName: 'Bookings',
    Item: booking,
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    console.log('Booking added successfully:', booking);
  } catch (err) {
    console.error('Error adding booking:', err);
    throw err;
  }
};

//Add oder 
const addOrder = async (order) => {
  const params = {
    TableName: 'PizzaOrders',
    Item: order,
    RemoveUndefinedValues: true
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    console.log('Order added successfully:', order);
  } catch (err) {
    console.error('Error adding order:', err);
    throw err;
  }
};

const getOrdersByUserId = async (userId) => {
  const params = {
    TableName: 'PizzaOrders',
    IndexName: 'userId-index', // Make sure this index exists
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    return data.Items || [];
  } catch (err) {
    console.error('Error getting orders by user ID:', err);
    throw err;
  }
};

//addcompleteorder table
const addCompletedOrder = async (order) => {
  const params = {
    TableName: 'CompletedOrders',
    Item: order,
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    console.log('Completed order added successfully:', order);
  } catch (err) {
    console.error('Error adding completed order:', err);
    throw err;
  }
};

module.exports = { addUser, getUserByEmail, getUserById, addBooking, addOrder, removeOrderById, placeOrder, addCompletedOrder, getOrdersByUserId };
