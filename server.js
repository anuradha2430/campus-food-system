const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// 🔐 Session
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true
}));

let orders = [];
let tokenCounter = 100;

// 🔐 Admin credentials
const ADMIN = {
  username: "admin",
  password: "1234"
};

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// 🔐 LOGIN
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN.username && password === ADMIN.password) {
    req.session.isAdmin = true;
    return res.json({ message: "Login successful" });
  }

  res.status(401).json({ message: "Invalid credentials" });
});


// 🔐 Middleware
function isAdmin(req, res, next) {
  if (req.session.isAdmin) next();
  else res.status(403).json({ message: "Unauthorized" });
}


// ✅ Place Order
app.post('/api/order', (req, res) => {
  const { name, items } = req.body;

  if (!name || !items || items.length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  tokenCounter++;

  const order = {
    id: "ORD-" + tokenCounter,
    name,
    items,
    token: tokenCounter,
    status: "Booked"
  };

  orders.push(order);

  res.json(order);
});


// 🔐 Get Orders (Protected)
app.get('/api/orders', isAdmin, (req, res) => {
  res.json(orders);
});


// 🔐 Update Status
app.put('/api/order/:token', isAdmin, (req, res) => {
  const token = parseInt(req.params.token);
  const { status } = req.body;

  const order = orders.find(o => o.token === token);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;

  res.json(order);
});


// 🔐 Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = app;