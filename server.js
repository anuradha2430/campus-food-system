const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname)));

// ✅ In-memory storage
let token = 100;
let orders = [];

// ✅ HEALTH ROUTE
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// ✅ PLACE ORDER
app.post('/api/order', (req, res) => {
  const { name, items } = req.body;

  token++;

  const order = {
    name,
    items,
    token,
    status: "Booked"
  };

  orders.push(order);

  res.json(order);
});

// ✅ GET ALL ORDERS (for admin)
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// ✅ EXPORT APP
module.exports = app;

// ✅ START SERVER
if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}