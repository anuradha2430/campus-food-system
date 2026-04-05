const express = require('express');
const app = express();

app.use(express.json());

// ✅ HEALTH ROUTE
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// ✅ ORDER API
let token = 100;

app.post('/api/order', (req, res) => {
  token++;
  res.json({ token });
});

// ✅ EXPORT APP FIRST
module.exports = app;

// ✅ START SERVER ONLY IF NOT TEST
if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}